import { analyzeKeywords, type MatchingResult } from './atsKeywords';

export interface AnalysisSectionResult {
  score: number; // 0-100
  title: string;
  description: string;
  feedback: string[];
}

export interface Suggestion {
  id: string;
  category: 'content' | 'format' | 'keywords' | 'impact';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
}

export interface ResumeAnalysis {
  overallScore: number;
  wordCount: number;
  charCount: number;
  metricsMatched: number;
  metricsPercentage: number;
  categoryScores: {
    content: AnalysisSectionResult;
    formatting: AnalysisSectionResult;
    keywords: AnalysisSectionResult;
    impact: AnalysisSectionResult;
  };
  suggestions: Suggestion[];
  keywordsAnalysis: MatchingResult;
}

export function analyzeResumeText(text: string, jobCategory: string = 'fullstack'): ResumeAnalysis {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;
  
  // Keyword Analysis
  const kwAnalysis = analyzeKeywords(text, jobCategory);

  // 1. Content Scoring
  const contentFeedback: string[] = [];
  let contentScore = 100;

  if (kwAnalysis.foundSections.includes('experience')) {
    contentFeedback.push('✅ Found Work Experience section.');
  } else {
    contentScore -= 30;
    contentFeedback.push('❌ Missing Work Experience section. This is critical for ATS parsing.');
  }

  if (kwAnalysis.foundSections.includes('education')) {
    contentFeedback.push('✅ Found Education section.');
  } else {
    contentScore -= 20;
    contentFeedback.push('❌ Missing Education section.');
  }

  if (kwAnalysis.foundSections.includes('skills')) {
    contentFeedback.push('✅ Found Technical Skills section.');
  } else {
    contentScore -= 20;
    contentFeedback.push('❌ Missing Skills section. Highlight your tech stack clearly.');
  }

  if (kwAnalysis.foundSections.includes('contact')) {
    contentFeedback.push('✅ Found Contact information.');
  } else {
    contentScore -= 15;
    contentFeedback.push('❌ Missing Contact section or details (email, phone).');
  }

  if (kwAnalysis.foundSections.includes('summary')) {
    contentFeedback.push('✅ Found Professional Summary.');
  } else {
    contentScore -= 10;
    contentFeedback.push('⚠️ Missing professional summary or objective statement.');
  }
  contentScore = Math.max(0, contentScore);

  // 2. Formatting & Readability
  const formattingFeedback: string[] = [];
  let formattingScore = 100;

  // Word count check
  if (wordCount < 300) {
    formattingScore -= 25;
    formattingFeedback.push('⚠️ Your resume is too short (under 300 words). Add more details to your projects and work history.');
  } else if (wordCount > 1000) {
    formattingScore -= 15;
    formattingFeedback.push('⚠️ Your resume is very long (over 1000 words). Keep it concise (1-2 pages maximum).');
  } else {
    formattingFeedback.push('✅ Word count is in the ideal range (300 - 1000 words).');
  }

  // Contact info details check
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com/i.test(text);

  if (hasEmail) formattingFeedback.push('✅ Email address detected.');
  else {
    formattingScore -= 10;
    formattingFeedback.push('❌ No email address found. Recruiters cannot reach you.');
  }

  if (hasPhone) formattingFeedback.push('✅ Phone number detected.');
  else {
    formattingScore -= 10;
    formattingFeedback.push('❌ No phone number found.');
  }

  if (hasLinkedIn) formattingFeedback.push('✅ LinkedIn profile link detected.');
  else {
    formattingScore -= 5;
    formattingFeedback.push('⚠️ LinkedIn profile link not found. Highly recommended.');
  }
  formattingScore = Math.max(0, formattingScore);

  // 3. Keywords Score
  const keywordsFeedback: string[] = [];
  const totalKeywords = kwAnalysis.matchedIndustryKeywords.length + kwAnalysis.missingIndustryKeywords.length;
  const kwMatchRatio = totalKeywords > 0 ? kwAnalysis.matchedIndustryKeywords.length / totalKeywords : 0;
  let keywordsScore = Math.round(kwMatchRatio * 100);

  // Penalize or reward based on soft skills and action verbs
  const actionVerbCount = kwAnalysis.matchedActionVerbs.length;
  if (actionVerbCount < 3) {
    keywordsScore -= 15;
    keywordsFeedback.push('❌ Low usage of strong action verbs (led, optimized, engineered). Add more dynamic verbs.');
  } else {
    keywordsFeedback.push(`✅ Good usage of action verbs (${actionVerbCount} matched).`);
  }

  const softSkillCount = kwAnalysis.matchedSoftSkills.length;
  if (softSkillCount < 2) {
    keywordsScore -= 10;
    keywordsFeedback.push('⚠️ Consider incorporating key interpersonal/soft skills (leadership, collaboration).');
  } else {
    keywordsFeedback.push(`✅ Found soft skills/methodologies (${softSkillCount} matched).`);
  }

  keywordsFeedback.push(`📊 Matched ${kwAnalysis.matchedIndustryKeywords.length} out of ${totalKeywords} industry-specific technical keywords.`);
  keywordsScore = Math.max(0, Math.min(100, keywordsScore));

  // 4. Impact / Quantifiable Metrics Score
  const impactFeedback: string[] = [];
  let impactScore = 0;

  // Search for metrics: digits followed by %, $, or keywords like "revenue", "users", "scale", "performance"
  const metricRegex = /(\d+%\s*|\$\s*\d+|\d+\s*percent|\b(users|revenue|budget|profit|cost|hours|weeks|months|scale|reduced|increased)\b.*\d+)/gi;
  const metricsMatched = (text.match(metricRegex) || []).length;
  
  // Score based on count of metrics
  if (metricsMatched >= 5) {
    impactScore = 100;
    impactFeedback.push(`🚀 Excellent! Found ${metricsMatched} quantifiable achievements and metrics.`);
  } else if (metricsMatched >= 2) {
    impactScore = 70;
    impactFeedback.push(`✅ Found ${metricsMatched} metrics. Try to add more numbers to show real business impact.`);
  } else {
    impactScore = 30;
    impactFeedback.push('❌ Barely any metrics or numbers found. Quantify your achievements (e.g., "Optimized database performance by 40%").');
  }

  // Generate actionable suggestion objects
  const suggestions: Suggestion[] = [];

  // Content Suggestions
  if (!kwAnalysis.foundSections.includes('experience')) {
    suggestions.push({
      id: 'missing-experience',
      category: 'content',
      severity: 'critical',
      title: 'Add a Work Experience Section',
      message: 'Create a clear "Work Experience" or "Professional Experience" heading. ATS systems use this to map your job timeline.'
    });
  }

  if (!kwAnalysis.foundSections.includes('skills')) {
    suggestions.push({
      id: 'missing-skills',
      category: 'content',
      severity: 'critical',
      title: 'Create a Technical Skills Section',
      message: 'List your core skills, languages, and frameworks under a clear "Skills" section to make it easy for ATS crawlers to match your keywords.'
    });
  }

  if (!hasEmail) {
    suggestions.push({
      id: 'missing-email',
      category: 'format',
      severity: 'critical',
      title: 'Email Address is Missing',
      message: 'Include a professional email address at the very top of your resume so recruiters can contact you.'
    });
  }

  // Keyword Suggestions
  if (kwAnalysis.missingIndustryKeywords.length > 5) {
    const suggestedKws = kwAnalysis.missingIndustryKeywords.slice(0, 5).join(', ');
    suggestions.push({
      id: 'missing-keywords',
      category: 'keywords',
      severity: 'warning',
      title: 'Add Missing Technical Keywords',
      message: `Integrate some of these missing industry keywords naturally into your descriptions: ${suggestedKws}.`
    });
  }

  if (actionVerbCount < 3) {
    suggestions.push({
      id: 'low-action-verbs',
      category: 'keywords',
      severity: 'warning',
      title: 'Use Stronger Action Verbs',
      message: 'Start your bullet points with powerful action verbs like "Spearheaded", "Optimized", "Architected", instead of passive phrases like "Responsible for".'
    });
  }

  // Format Suggestions
  if (wordCount < 300) {
    suggestions.push({
      id: 'resume-too-short',
      category: 'format',
      severity: 'warning',
      title: 'Resume Content is Too Short',
      message: 'Your resume is under 300 words. Add more details about your daily accomplishments, technologies used, and outcomes.'
    });
  } else if (wordCount > 1000) {
    suggestions.push({
      id: 'resume-too-long',
      category: 'format',
      severity: 'warning',
      title: 'Resume is Too Verbose',
      message: 'Your resume exceeds 1000 words. Condense descriptions, remove irrelevant details, and aim for a clean 1 or 2-page document.'
    });
  }

  // Impact Suggestions
  if (metricsMatched < 3) {
    suggestions.push({
      id: 'add-metrics',
      category: 'impact',
      severity: 'warning',
      title: 'Quantify Your Achievements',
      message: 'Use specific numbers, percentages, or dollar amounts to show the scale and result of your work (e.g. "led team of 4 engineers", "reduced page load time by 30%").'
    });
  }

  // Calculate Overall Score (weighted average)
  // Weights: Content (35%), Formatting (20%), Keywords (25%), Impact (20%)
  const overallScore = Math.round(
    contentScore * 0.35 +
    formattingScore * 0.20 +
    keywordsScore * 0.25 +
    impactScore * 0.20
  );

  return {
    overallScore,
    wordCount,
    charCount,
    metricsMatched,
    metricsPercentage: Math.min(100, Math.round((metricsMatched / 5) * 100)),
    categoryScores: {
      content: {
        score: contentScore,
        title: 'Section & Content Quality',
        description: 'Verifies the presence and depth of essential resume sections like experience and education.',
        feedback: contentFeedback
      },
      formatting: {
        score: formattingScore,
        title: 'Formatting & Contact Info',
        description: 'Checks resume word count length and essential contact detail formats.',
        feedback: formattingFeedback
      },
      keywords: {
        score: keywordsScore,
        title: 'ATS Keyword Match',
        description: 'Measures keyword density against your target role, plus action verbs and soft skills.',
        feedback: keywordsFeedback
      },
      impact: {
        score: impactScore,
        title: 'Quantifiable Impact & Metrics',
        description: 'Scans for metrics, numbers, and outcome-oriented results to show performance.',
        feedback: impactFeedback
      }
    },
    suggestions,
    keywordsAnalysis: kwAnalysis
  };
}
