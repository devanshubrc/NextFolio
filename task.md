# NextFolios — Task Tracker

## Phase 1: Foundation & Core Infrastructure

### Project Setup
- [x] Initialize Astro project
- [x] Install dependencies (React, Tailwind v4, motion, PDF libs)
- [x] Configure astro.config.mjs
- [x] Configure tsconfig.json

### Design System
- [x] Create src/styles/global.css (Tailwind v4 + @theme tokens)

### Layouts
- [x] Create src/layouts/BaseLayout.astro
- [x] Create src/layouts/ToolLayout.astro

### Core Components
- [x] Create src/components/Header.astro
- [x] Create src/components/Footer.astro
- [x] Create src/components/react/SearchCommand.tsx
- [x] Create src/components/CookieConsent.tsx
- [x] Create src/components/Analytics.astro
- [x] Create src/components/RelatedTools.astro
- [x] Create src/components/RelatedBlogPosts.astro

### SEO Infrastructure
- [x] Create src/components/seo/SEOHead.astro
- [x] Create src/components/seo/FAQ.astro
- [x] Create src/components/seo/Breadcrumb.astro
- [x] Create src/components/seo/ToolSchema.astro
- [x] Create public/robots.txt
- [x] Create public/manifest.webmanifest

### Data & Libraries
- [x] Create src/data/tools.ts
- [x] Create src/lib/searchIndex.ts
- [x] Create src/hooks/useLocalStorage.ts
- [x] Create src/hooks/useTheme.ts

### Static Pages
- [x] Create src/pages/index.astro (Home)
- [x] Create src/pages/about.astro
- [x] Create src/pages/contact.astro
- [x] Create src/pages/privacy-policy.astro
- [x] Create src/pages/terms.astro
- [x] Create src/pages/faq.astro
- [x] Create src/pages/404.astro

## Phase 2: ATS Resume Checker + Resume Score

### Shared Libraries
- [x] Create src/lib/pdfParser.ts
- [x] Create src/lib/atsKeywords.ts
- [x] Create src/lib/resumeAnalyzer.ts

### ATS Resume Checker
- [x] Create src/pages/tools/ats-resume-checker/index.astro
- [x] Create src/components/react/tools/ATSChecker.tsx

### Resume Score
- [x] Create src/pages/tools/resume-score/index.astro
- [x] Create src/components/react/tools/ResumeScore.tsx

## Phase 3: Resume Builder
- [x] Create src/pages/tools/resume-builder/index.astro
- [x] Create src/components/react/tools/ResumeBuilder.tsx
- [x] Create templates (Classic, Modern, Minimal, Creative)

## Phase 4: Portfolio Generator
- [x] Create src/pages/tools/portfolio-generator/index.astro
- [x] Create src/components/react/tools/PortfolioGenerator.tsx

## Phase 5: Salary Estimator
- [x] Create src/pages/tools/salary-estimator/index.astro
- [x] Create src/components/react/tools/SalaryEstimator.tsx
- [x] Create src/data/salaryData.json

## Phase 6: Interview Question Generator
- [x] Create src/pages/tools/interview-question-generator/index.astro
- [x] Create src/components/react/tools/InterviewQuestions.tsx
- [x] Create src/data/interviewQuestions.json

## Phase 7: Career Roadmap
- [x] Create src/pages/tools/career-roadmap/index.astro
- [x] Create src/components/react/tools/CareerRoadmap.tsx
- [x] Create src/data/careerRoadmaps.json

## Phase 8: Skill Gap Analyzer
- [x] Create src/pages/tools/skill-gap-analyzer/index.astro
- [x] Create src/components/react/tools/SkillGapAnalyzer.tsx

## Phase 9: Blog System
- [x] Create src/pages/blog/index.astro
- [x] Create src/pages/blog/[slug].astro
- [x] Create src/content.config.ts
- [x] Create initial markdown blog posts

## Phase 10: Polish & Production
- [x] RSS feed generation
- [x] Build & verification check

## Verification
- [x] Build succeeds (npm run build)
- [ ] Dev server runs (npm run dev)
- [x] All pages render correctly
