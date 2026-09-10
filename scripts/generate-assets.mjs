/**
 * One-off asset generator. Run with `npm run assets`, then commit the output.
 *
 * Deliberately NOT part of `npm run build`. It depends on sharp, which is only
 * present transitively, and a Cloudflare Pages build that fails because a
 * transitive dependency moved is a bad trade for files that change once a year.
 *
 * It produces two things the site was missing:
 *
 *   Social preview images in JPEG. The og:image was a WebP, and WebP is not
 *   rendered by several of the scrapers that matter - notably LinkedIn and
 *   parts of the Facebook stack - so shared links showed no picture at all.
 *   1200x630 is the size every platform crops from cleanly.
 *
 *   A square favicon set. The old icon was a 530x476 WebP. Google's
 *   search-result favicon needs a square icon in a format it supports, and
 *   WebP is not one of them, so search results showed a generic globe.
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PUBLIC = join(process.cwd(), 'public');
const BRAND_BG = { r: 1, g: 1, b: 1, alpha: 1 };

/** 1200x630 social card. `cover` crops rather than distorting the artwork. */
async function socialCard(source, out) {
  await sharp(join(PUBLIC, source))
    .resize(1200, 630, { fit: 'cover', position: 'centre' })
    // JPEG, not PNG: these are photographs, and a palette PNG of a photo is
    // three times the size for no visible gain. Every scraper accepts JPEG.
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(PUBLIC, out));
}

/**
 * Square icon on the brand background.
 *
 * `contain` rather than `cover`: the logo is 530x476, and cropping it to a
 * square would cut the artwork. Padding with the near-black brand colour keeps
 * it whole and matches the site behind it.
 */
async function squareIcon(size, out) {
  return sharp(join(PUBLIC, 'zeo_logo.webp'))
    .resize(size, size, { fit: 'contain', background: BRAND_BG })
    .flatten({ background: BRAND_BG })
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC, out));
}

/**
 * Minimal .ico wrapping a single 32x32 PNG.
 *
 * sharp cannot write ICO, and the format's header is short enough to build by
 * hand: a 6-byte file header, one 16-byte directory entry, then the PNG. ICO
 * has allowed a PNG payload since Vista, and /favicon.ico is still the path
 * some crawlers request without being told to.
 */
async function faviconIco() {
  const png = await sharp(join(PUBLIC, 'zeo_logo.webp'))
    .resize(32, 32, { fit: 'contain', background: BRAND_BG })
    .flatten({ background: BRAND_BG })
    .png({ compressionLevel: 9 })
    .toBuffer();

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // one image

  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0); // width
  entry.writeUInt8(32, 1); // height
  entry.writeUInt8(0, 2); // palette colours, 0 = truecolour
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // colour planes
  entry.writeUInt16LE(32, 6); // bits per pixel
  entry.writeUInt32LE(png.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12); // offset to payload

  writeFileSync(join(PUBLIC, 'favicon.ico'), Buffer.concat([header, entry, png]));
  return png.length;
}

async function main() {
  mkdirSync(PUBLIC, { recursive: true });

  await socialCard('zeo_landing.webp', 'og-default.jpg');
  await socialCard('PPF-cat.webp', 'og-ppf.jpg');
  await socialCard('contact.webp', 'og-contact.jpg');
  await socialCard('01-titan-ppf-blue.webp', 'og-titan.jpg');
  await socialCard('01-ultra-ppf-red.webp', 'og-ultra.jpg');
  await socialCard('01-prime-ppf-white.webp', 'og-prime.jpg');

  await squareIcon(16, 'favicon-16x16.png');
  await squareIcon(32, 'favicon-32x32.png');
  await squareIcon(180, 'apple-touch-icon.png');
  await squareIcon(192, 'android-chrome-192x192.png');
  await squareIcon(512, 'android-chrome-512x512.png');
  await faviconIco();

  writeFileSync(
    join(PUBLIC, 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'Zeo Shields',
        short_name: 'Zeo Shields',
        icons: [
          { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: '#010101',
        background_color: '#010101',
        display: 'standalone',
        start_url: '/',
      },
      null,
      2,
    ) + '\n',
  );

  console.log('Generated social cards, favicon set and web manifest in public/');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
