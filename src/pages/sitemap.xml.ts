// Plain sitemap: the homepage plus every case study in the collection.
import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL | undefined }) {
  const base = site ?? new URL('https://everythink.pro');
  const studies = await getCollection('case-studies');
  const urls = ['/', ...studies.map((s) => `/case-studies/${s.id}/`)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${new URL(u, base).href}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
