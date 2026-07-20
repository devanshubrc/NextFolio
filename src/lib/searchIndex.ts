export interface SearchItem {
  type: 'tool' | 'page' | 'faq';
  title: string;
  description: string;
  href: string;
  icon: string;
}

export const searchItems: SearchItem[] = [
  // Tools
  { type: 'tool', title: 'ATS Resume Checker', description: 'Check your resume against ATS systems', href: '/tools/ats-resume-checker/', icon: '📄' },
  { type: 'tool', title: 'Resume Builder', description: 'Build professional resumes with templates', href: '/tools/resume-builder/', icon: '🏗️' },
  { type: 'tool', title: 'Resume Score', description: 'Get your resume quality score', href: '/tools/resume-score/', icon: '📊' },
  { type: 'tool', title: 'Portfolio Generator', description: 'Generate stunning portfolio websites', href: '/tools/portfolio-generator/', icon: '🎨' },
  { type: 'tool', title: 'Salary Estimator', description: 'Estimate salaries by role and location', href: '/tools/salary-estimator/', icon: '💰' },
  { type: 'tool', title: 'Interview Questions', description: 'Practice with curated interview questions', href: '/tools/interview-question-generator/', icon: '❓' },
  { type: 'tool', title: 'Career Roadmap', description: 'Plan your career path step by step', href: '/tools/career-roadmap/', icon: '🗺️' },
  { type: 'tool', title: 'Skill Gap Analyzer', description: 'Find and bridge your skill gaps', href: '/tools/skill-gap-analyzer/', icon: '🎯' },
  // Pages
  { type: 'page', title: 'About NextFolios', description: 'Learn about our mission and values', href: '/about/', icon: '💡' },
  { type: 'page', title: 'Contact Us', description: 'Get in touch with the NextFolios team', href: '/contact/', icon: '✉️' },
  { type: 'page', title: 'FAQ', description: 'Frequently asked questions', href: '/faq/', icon: '🙋' },
  { type: 'page', title: 'Blog', description: 'Career tips, guides, and insights', href: '/blog/', icon: '📝' },
  { type: 'page', title: 'Privacy Policy', description: 'How we handle your data', href: '/privacy-policy/', icon: '🔒' },
  { type: 'page', title: 'Terms & Conditions', description: 'Our terms of service', href: '/terms/', icon: '📜' },
];

export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  
  // Simple fuzzy: all query chars appear in order
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}
