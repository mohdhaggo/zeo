/**
 * Writes a real HTML file per route, after Vite has built the shell.
 *
 * Why this exists: the site is a client-rendered SPA, and every meta tag other
 * than the ones baked into index.html was written by a useEffect in
 * src/components/common/Seo.tsx. No social scraper executes JavaScript -
 * Facebook, LinkedIn, WhatsApp and X all read the raw HTML - so every shared
 * link, whatever page it pointed at, showed the homepage title, the homepage
 * description and the homepage image. Search crawlers that skip JavaScript saw
 * the same thing on all twelve URLs.
 *
 * Emitting dist/<route>.html fixes that without adding a framework:
 * Cloudflare Pages serves a matching file directly, so a crawler gets correct
 * tags in the first response, while the React app still takes over for
 * in-app navigation exactly as before.
 *
 * It also fixes the soft 404. The old public/_redirects sent every unmatched
 * path to index.html with HTTP 200, so a mistyped or spam URL returned a
 * success status carrying `robots: index, follow`. Pages serves dist/404.html
 * with a real 404 status for anything it cannot match, which is what this
 * writes instead.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = join(process.cwd(), 'dist');
const config = JSON.parse(
  readFileSync(join(process.cwd(), 'src', 'config', 'seo-routes.json'), 'utf8'),
);

const { baseUrl, siteName, defaultImage, routes } = config;

/** Escapes text for an HTML attribute value. */
function attr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Organization markup, emitted into the HTML rather than written by a script.
 *
 * This is what tells Google that "Zeo Shields" is a thing rather than two words
 * that happen to appear on a page - the entity a knowledge panel is built from,
 * and the record against which Google eventually learns that people typing
 * "zeosheilds" mean this company. It used to be added by a useEffect, so it
 * only existed after JavaScript ran and was absent from the first crawl.
 *
 * alternateName lists real ways the brand is written, not deliberate typos.
 * Google corrects misspelled queries from what searchers do, not from markup,
 * so a list of misspellings here would be decoration at best and look
 * manipulative at worst. The fix for typos is owning the typo domains.
 */
function organizationSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': baseUrl + '/#organization',
    name: siteName,
    alternateName: ['ZeoShields', 'Zeo Shield', 'Zeo Shields PPF'],
    url: baseUrl + '/',
    logo: {
      '@type': 'ImageObject',
      url: baseUrl + '/android-chrome-512x512.png',
      width: 512,
      height: 512,
    },
    image: baseUrl + defaultImage,
    description:
      'Premium automotive protection films. Paint Protection Film (PPF), window tint and windshield film engineered for extreme climates.',
    email: 'info@zeoshields.com',
    areaServed: ['Middle East', 'Asia', 'Worldwide'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: 'info@zeoshields.com',
      areaServed: ['Middle East', 'Asia', 'Worldwide'],
      availableLanguage: ['English'],
    },
  });
}

/** Ties the domain to the brand name, which is what sitelinks are built on. */
function websiteSchema() {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': baseUrl + '/#website',
    name: siteName,
    alternateName: 'ZeoShields',
    url: baseUrl + '/',
    publisher: { '@id': baseUrl + '/#organization' },
  });
}

function seoBlock({ path, title, description, image, noindex }) {
  const url = baseUrl + path;
  // The homepage title is already the full brand string; the others get the
  // site name appended, matching what Seo.tsx does at runtime so the two
  // cannot drift apart and show a crawler one title and a visitor another.
  const fullTitle = path === '/' ? title : title + ' | ' + siteName;
  const imageUrl = baseUrl + (image ?? defaultImage);

  return [
    '<title>' + attr(fullTitle) + '</title>',
    '<meta name="description" content="' + attr(description) + '" />',
    '<meta name="robots" content="' + (noindex ? 'noindex, nofollow' : 'index, follow') + '" />',
    '<link rel="canonical" href="' + attr(url) + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="' + attr(siteName) + '" />',
    '<meta property="og:title" content="' + attr(fullTitle) + '" />',
    '<meta property="og:description" content="' + attr(description) + '" />',
    '<meta property="og:url" content="' + attr(url) + '" />',
    '<meta property="og:image" content="' + attr(imageUrl) + '" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="' + attr(fullTitle) + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + attr(fullTitle) + '" />',
    '<meta name="twitter:description" content="' + attr(description) + '" />',
    '<meta name="twitter:image" content="' + attr(imageUrl) + '" />',
    // Sitewide rather than homepage-only, so a visitor who lands directly on a
    // product page from search still arrives at a page that identifies the
    // brand. @id ties every copy to the same entity rather than declaring
    // twelve different organizations.
    '<script type="application/ld+json">' + organizationSchema() + '</script>',
    '<script type="application/ld+json">' + websiteSchema() + '</script>',
  ]
    .map((line) => '    ' + line)
    .join('\n');
}

function main() {
  const shell = readFileSync(join(DIST, 'index.html'), 'utf8');

  const START = '<!--seo-start-->';
  const END = '<!--seo-end-->';
  const from = shell.indexOf(START);
  const to = shell.indexOf(END);

  if (from === -1 || to === -1) {
    // Failing loudly beats shipping twelve identical pages and not noticing.
    throw new Error(
      'index.html has no ' + START + ' / ' + END + ' block. prerender cannot inject per-route tags.',
    );
  }

  const head = shell.slice(0, from + START.length);
  const tail = shell.slice(to);

  for (const route of routes) {
    const html = head + '\n' + seoBlock(route) + '\n    ' + tail;

    // Flat "<route>.html", not "<route>/index.html". Cloudflare Pages resolves
    // a request for /contact against contact.html directly, but against
    // contact/index.html only after a 308 redirect to /contact/ - which adds a
    // round trip and lands the visitor on a trailing-slash URL that disagrees
    // with both the canonical tag and the sitemap.
    const file = route.path === '/' ? 'index.html' : route.path.replace(/^\//, '') + '.html';
    writeFileSync(join(DIST, file), html);
  }

  // Cloudflare Pages serves this with a real 404 status for any path it has no
  // file for, which is what makes the status code honest.
  const notFound =
    head +
    '\n' +
    seoBlock({
      path: '/404',
      title: 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      noindex: true,
    }) +
    '\n    ' +
    tail;
  writeFileSync(join(DIST, '404.html'), notFound);

  console.log('Prerendered ' + routes.length + ' routes plus 404.html');
}

main();
