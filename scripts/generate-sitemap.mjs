/**
 * Sitemap generator, run by `npm run build` before Vite.
 *
 * Routes come from src/config/seo-routes.json, which is also what App.tsx and
 * prerender.mjs read. One list means the sitemap cannot advertise a URL the
 * app does not serve, or miss one it does.
 *
 * lastmod is declared per route rather than stamped with today's date. The old
 * version wrote `new Date()` into every entry on every build, telling crawlers
 * that all nine pages changed each time the site was deployed. That was not
 * true, and a sitemap that cries wolf gets its lastmod ignored.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const config = JSON.parse(
  readFileSync(join(process.cwd(), 'src', 'config', 'seo-routes.json'), 'utf8'),
);

const { baseUrl, routes } = config;

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap + '\n');
  console.log(`Sitemap generated with ${routes.length} URLs for ${baseUrl}`);
}

generateSitemap();
