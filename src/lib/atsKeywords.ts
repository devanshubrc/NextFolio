/**
 * atsKeywords.ts — Curated database of ATS keywords, skills, action verbs, and section headers
 */

export interface KeywordCategory {
  name: string;
  keywords: string[];
}

export const ACTION_VERBS = [
  'spearheaded', 'designed', 'developed', 'implemented', 'engineered',
  'optimized', 'led', 'managed', 'streamlined', 'orchestrated',
  'achieved', 'launched', 'delivered', 'collaborated', 'integrated',
  'refactored', 'architected', 'automated', 'increased', 'reduced',
  'created', 'executed', 'built', 'transformed', 'formulated'
];

export const SOFT_SKILLS = [
  'leadership', 'communication', 'problem solving', 'teamwork', 'collaboration',
  'time management', 'adaptability', 'critical thinking', 'conflict resolution',
  'decision making', 'negotiation', 'agile', 'scrum', 'mentorship'
];

export const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  frontend: [
    'react', 'next.js', 'vue', 'angular', 'typescript', 'javascript',
    'html5', 'css3', 'tailwind css', 'sass', 'redux', 'context api',
    'webpack', 'vite', 'npm', 'jest', 'cypress', 'testing library',
    'rest api', 'graphql', 'responsive design', 'web accessibility',
    'lighthouse', 'seo', 'single page application', 'browser compatibility'
  ],
  backend: [
    'node.js', 'express', 'nest.js', 'python', 'django', 'fastapi',
    'go', 'golang', 'java', 'spring boot', 'c#', '.net', 'ruby on rails',
    'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'prisma',
    'graphql', 'rest api', 'microservices', 'mvc', 'orm', 'caching',
    'authentication', 'jwt', 'oauth', 'docker', 'kubernetes', 'aws'
  ],
  fullstack: [
    'react', 'node.js', 'typescript', 'javascript', 'postgresql', 'mongodb',
    'next.js', 'docker', 'aws', 'rest api', 'graphql', 'git', 'ci/cd',
    'system architecture', 'database design', 'state management', 'testing',
    'performance optimization', 'deployment', 'serverless'
  ],
  devops: [
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ansible',
    'jenkins', 'github actions', 'gitlab ci', 'ci/cd', 'linux', 'bash',
    'python', 'monitoring', 'prometheus', 'grafana', 'elk stack',
    'infrastructure as code', 'serverless', 'networking', 'security', 'ssl'
  ],
  datascience: [
    'python', 'r', 'sql', 'pandas', 'numpy', 'scikit-learn', 'tensorflow',
    'pytorch', 'keras', 'machine learning', 'deep learning', 'nlp',
    'computer vision', 'data visualization', 'matplotlib', 'seaborn',
    'tableau', 'power bi', 'big data', 'spark', 'hadoop', 'statistics'
  ],
  pm: [
    'product strategy', 'roadmap', 'agile', 'scrum', 'user stories',
    'jira', 'confluence', 'market research', 'data analysis', 'kpis',
    'ab testing', 'cross-functional collaboration', 'stakeholder management',
    'wireframing', 'user experience', 'customer feedback', 'product launch'
  ],
  uiux: [
    'figma', 'sketch', 'adobe xd', 'ui design', 'ux design', 'wireframing',
    'prototyping', 'user research', 'information architecture', 'design systems',
    'interaction design', 'usability testing', 'user journeys', 'personas',
    'heuristic evaluation', 'typography', 'color theory', 'css'
  ]
};

export const RESUME_SECTIONS = {
  contact: ['contact', 'email', 'phone', 'linkedin', 'github', 'address', 'location'],
  summary: ['summary', 'profile', 'objective', 'about me', 'professional summary'],
  experience: ['experience', 'work history', 'employment history', 'professional experience'],
  education: ['education', 'academic background', 'university', 'college', 'degree'],
  skills: ['skills', 'technical skills', 'core competencies', 'expertise', 'technologies'],
  projects: ['projects', 'personal projects', 'key projects', 'portfolio'],
  certifications: ['certifications', 'licenses', 'courses', 'awards']
};

export interface MatchingResult {
  matchedActionVerbs: string[];
  missingActionVerbs: string[];
  matchedSoftSkills: string[];
  missingSoftSkills: string[];
  matchedIndustryKeywords: string[];
  missingIndustryKeywords: string[];
  foundSections: string[];
  missingSections: string[];
}

export function analyzeKeywords(text: string, category: string = 'fullstack'): MatchingResult {
  const normalizedText = text.toLowerCase();
  
  // 1. Action Verbs
  const matchedActionVerbs = ACTION_VERBS.filter(verb => normalizedText.includes(verb));
  const missingActionVerbs = ACTION_VERBS.filter(verb => !normalizedText.includes(verb));

  // 2. Soft Skills
  const matchedSoftSkills = SOFT_SKILLS.filter(skill => normalizedText.includes(skill));
  const missingSoftSkills = SOFT_SKILLS.filter(skill => !normalizedText.includes(skill));

  // 3. Industry Keywords
  const industryList = INDUSTRY_KEYWORDS[category.toLowerCase()] || INDUSTRY_KEYWORDS.fullstack;
  const matchedIndustryKeywords = industryList.filter(keyword => normalizedText.includes(keyword));
  const missingIndustryKeywords = industryList.filter(keyword => !normalizedText.includes(keyword));

  // 4. Sections
  const foundSections: string[] = [];
  const missingSections: string[] = [];

  Object.entries(RESUME_SECTIONS).forEach(([sectionName, keywords]) => {
    const hasSection = keywords.some(keyword => {
      // Look for section title on a line or as a distinct heading
      const regex = new RegExp(`(^|\\n|\\r)\\s*${keyword}\\s*(\\n|\\r|:|$)`, 'i');
      return regex.test(normalizedText);
    });
    if (hasSection) {
      foundSections.push(sectionName);
    } else {
      missingSections.push(sectionName);
    }
  });

  return {
    matchedActionVerbs,
    missingActionVerbs,
    matchedSoftSkills,
    missingSoftSkills,
    matchedIndustryKeywords,
    missingIndustryKeywords,
    foundSections,
    missingSections
  };
}
