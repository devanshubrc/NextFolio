/**
 * tools.ts — Central tools registry.
 *
 * Single source of truth for every tool in the NextFolios platform.
 * Used by navigation, related-tools grids, SEO schemas, sitemaps, etc.
 */

/** Shape of a single tool entry. */
export interface Tool {
  /** URL-safe slug — must match the route path (e.g. "ats-resume-checker") */
  slug: string;
  /** Human-readable title shown in headings and cards */
  title: string;
  /** Short 1-2 sentence description for cards and meta tags */
  description: string;
  /** Emoji icon displayed alongside the tool */
  icon: string;
  /** Broad category for grouping / filtering */
  category: string;
  /** Slugs of 3-4 related tools for cross-linking */
  relatedTools: string[];
  /** Tailwind gradient CSS class for card backgrounds */
  color: string;
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const tools: Tool[] = [
  {
    slug: 'ats-resume-checker',
    title: 'ATS Resume Checker',
    description:
      'Scan your resume against Applicant Tracking Systems and get actionable feedback to increase your interview callback rate.',
    icon: '🔍',
    category: 'Resume',
    relatedTools: ['resume-builder', 'resume-score', 'skill-gap-analyzer'],
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  {
    slug: 'resume-builder',
    title: 'Resume Builder',
    description:
      'Create a professional, ATS-friendly resume in minutes with guided templates and AI-powered suggestions.',
    icon: '📝',
    category: 'Resume',
    relatedTools: ['ats-resume-checker', 'resume-score', 'portfolio-generator'],
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
  {
    slug: 'resume-score',
    title: 'Resume Score',
    description:
      'Get an instant score for your resume based on formatting, keywords, impact language, and ATS compatibility.',
    icon: '📊',
    category: 'Resume',
    relatedTools: ['ats-resume-checker', 'resume-builder', 'skill-gap-analyzer'],
    color: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  },
  {
    slug: 'portfolio-generator',
    title: 'Portfolio Generator',
    description:
      'Generate a stunning developer or designer portfolio site from your resume data — no coding required.',
    icon: '🎨',
    category: 'Portfolio',
    relatedTools: ['resume-builder', 'career-roadmap', 'skill-gap-analyzer'],
    color: 'bg-gradient-to-r from-orange-500 to-amber-500',
  },
  {
    slug: 'salary-estimator',
    title: 'Salary Estimator',
    description:
      'Estimate competitive salary ranges for any role, location, and experience level using real market data.',
    icon: '💰',
    category: 'Career',
    relatedTools: ['career-roadmap', 'interview-question-generator', 'skill-gap-analyzer'],
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
  },
  {
    slug: 'interview-question-generator',
    title: 'Interview Question Generator',
    description:
      'Generate role-specific interview questions with model answers to help you prepare and land the job.',
    icon: '🎯',
    category: 'Interview',
    relatedTools: ['salary-estimator', 'career-roadmap', 'ats-resume-checker'],
    color: 'bg-gradient-to-r from-red-500 to-rose-500',
  },
  {
    slug: 'career-roadmap',
    title: 'Career Roadmap',
    description:
      'Map out a personalised career progression plan with milestones, skills to learn, and timeline estimates.',
    icon: '🗺️',
    category: 'Career',
    relatedTools: ['skill-gap-analyzer', 'salary-estimator', 'interview-question-generator'],
    color: 'bg-gradient-to-r from-indigo-500 to-violet-500',
  },
  {
    slug: 'skill-gap-analyzer',
    title: 'Skill Gap Analyzer',
    description:
      'Compare your current skills against job requirements and get a prioritised learning plan to close the gaps.',
    icon: '🧩',
    category: 'Career',
    relatedTools: ['career-roadmap', 'resume-score', 'ats-resume-checker'],
    color: 'bg-gradient-to-r from-fuchsia-500 to-purple-500',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Look up a single tool by its URL slug.
 *
 * @param slug - The URL-safe slug (e.g. "ats-resume-checker")
 * @returns The matching `Tool` or `undefined`
 */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

/**
 * Get the related tools for a given slug.
 *
 * Returns fully resolved `Tool` objects (skips any slugs that don't
 * match an entry — future-proof if a tool is removed).
 *
 * @param slug - The slug of the current tool
 * @returns Array of related `Tool` objects
 */
export function getRelatedTools(slug: string): Tool[] {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return tool.relatedTools
    .map((rs) => getToolBySlug(rs))
    .filter((t): t is Tool => t !== undefined);
}
