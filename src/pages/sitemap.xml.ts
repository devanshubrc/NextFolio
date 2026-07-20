import { getCollection } from 'astro:content';

const SITE_URL = 'https://nextfolios.com';

const STATIC_PAGES = [
  '/',
  '/about/',
  '/contact/',
  '/faq/',
  '/privacy-policy/',
  '/terms/',
  '/blog/',
  '/tools/ats-resume-checker/',
  '/tools/resume-builder/',
  '/tools/resume-score/',
  '/tools/portfolio-generator/',
  '/tools/salary-estimator/',
  '/tools/interview-question-generator/',
  '/tools/career-roadmap/',
  '/tools/skill-gap-analyzer/',
];

export async function GET() {
  const posts = await getCollection('blog');
  
  const urls = [
    ...STATIC_PAGES.map(p => {
      if (p === '/') return SITE_URL + '/';
      return `${SITE_URL}${p}`;
    }),
    ...posts.map(post => `${SITE_URL}/blog/${post.id}/`),
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url === SITE_URL + '/' ? '1.0' : url.includes('/tools/') ? '0.9' : '0.7'}</priority>
  </url>`).join('').trim()}
</urlset>`;

  return new Response(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
