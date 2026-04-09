export type SitemapPost = { slug: string; date?: string | null };

const BASE = 'https://vedicvn.com';

const STATIC_ENTRIES: Array<{
  loc: string;
  changefreq: string;
  priority: string;
}> = [
  { loc: `${BASE}/`, changefreq: 'weekly', priority: '1.0' },
  { loc: `${BASE}/numerology`, changefreq: 'monthly', priority: '0.8' },
  { loc: `${BASE}/luc-nham`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE}/vedic-chart`, changefreq: 'monthly', priority: '0.9' },
  { loc: `${BASE}/panchang`, changefreq: 'weekly', priority: '0.75' },
  { loc: `${BASE}/blog`, changefreq: 'daily', priority: '0.9' },
  { loc: `${BASE}/trading`, changefreq: 'monthly', priority: '0.5' },
];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** XML sitemap cho vedicvn.com (tĩnh + slug bài blog). */
export function generateSitemap(posts: SitemapPost[] | null | undefined): string {
  const defaultLastmod = new Date().toISOString().split('T')[0];
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];

  for (const entry of STATIC_ENTRIES) {
    lines.push(
      '  <url>',
      `    <loc>${entry.loc}</loc>`,
      `    <lastmod>${defaultLastmod}</lastmod>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      `    <priority>${entry.priority}</priority>`,
      '  </url>'
    );
  }

  for (const post of posts || []) {
    if (!post?.slug) continue;
    const lastmod = post.date
      ? String(post.date).split('T')[0].slice(0, 10)
      : defaultLastmod;
    lines.push(
      '  <url>',
      `    <loc>${BASE}/blog/${escapeXml(post.slug)}</loc>`,
      `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
      '    <changefreq>yearly</changefreq>',
      '    <priority>0.7</priority>',
      '  </url>'
    );
  }

  lines.push('</urlset>');
  return lines.join('\n');
}
