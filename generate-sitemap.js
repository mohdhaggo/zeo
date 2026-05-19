import { writeFileSync } from 'fs';
import { join } from 'path';

const routes = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/about', priority: '0.8', changefreq: 'weekly' },
  { url: '/contact', priority: '0.8', changefreq: 'weekly' },
  { url: '/warranty', priority: '0.9', changefreq: 'weekly' },
  { url: '/products', priority: '0.8', changefreq: 'weekly' },
  { url: '/ppf-cat', priority: '0.7', changefreq: 'weekly' },
  { url: '/titan-ppf', priority: '0.7', changefreq: 'weekly' },
  { url: '/ultra-ppf', priority: '0.7', changefreq: 'weekly' },
  { url: '/titan-satin-ppf', priority: '0.7', changefreq: 'weekly' },
  { url: '/admin-login', priority: '0.5', changefreq: 'monthly' },
  { url: '/dashboard', priority: '0.5', changefreq: 'monthly' },
];

// Update with your custom domain
const BASE_URL = 'https://zeoshields.com';

function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  writeFileSync(join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('✅ Sitemap generated successfully for zeoshields.com');
}

generateSitemap();