# Zeo Shields website

The public site at [www.zeoshields.com](https://www.zeoshields.com). React 18 + Vite 7 + TypeScript,
deployed to Cloudflare Pages. The admin console lives in a separate private repository and is served
from `super-admin.zeoshields.com`.

## Running it

```bash
npm install
npm run dev          # Vite dev server, frontend only
npm run dev:pages    # full build served through wrangler, so /api/* works too
```

`npm run dev` does not run the Pages Functions, so the contact form and warranty lookup will fail
against it. Use `dev:pages` when you need the API.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Sitemap, typecheck of `src` and `functions`, Vite build, then prerender |
| `npm run typecheck:functions` | Typechecks `functions/` alone against the Workers types |
| `npm run assets` | Regenerates favicons and social cards from `public/zeo_logo.webp`. Run rarely, commit the output |
| `npm run lint` | ESLint |

## How the routing works

This is a client-rendered SPA, but it does **not** rely on a catch-all rewrite. After Vite builds,
`scripts/prerender.mjs` writes one real HTML file per route (`dist/contact.html`, and so on) with
that route's own title, description, canonical URL and social-card tags baked in. Cloudflare Pages
serves the matching file directly, so a crawler or a social scraper that never runs JavaScript still
gets correct metadata, and anything with no matching file falls through to `dist/404.html` with a
genuine 404 status.

The route list lives in **one** place, `src/config/seo-routes.json`. `src/App.tsx`, the sitemap
generator and the prerender step all read it. Adding a page means adding an entry there and a
component in the `ELEMENTS` map in `src/App.tsx`.

## Backend

Cloudflare Pages Functions in `functions/`, running on the Workers runtime — not Node, so there is no
`process.env`, no `fs`, and no `Buffer`.

| Route | Purpose |
| --- | --- |
| `POST /api/contact` | Stores the enquiry in D1, then emails it. Guarded by reCAPTCHA and a rate limit |
| `GET /api/warranty/:number` | Public lookup. Returns product, dates and status only — never customer PII |
| `POST /api/warranty/register` | Binds a warranty to a customer. Guarded by reCAPTCHA and a rate limit |

Data lives in Cloudflare D1 (`db/schema.sql`), shared with the admin console. Migrations are in
`db/migrations/` and are applied by hand — see the header of each file for the command.

## Configuration

Set on the Cloudflare Pages project, never in the repository.

| Variable | Type | Notes |
| --- | --- | --- |
| `RECAPTCHA_SECRET` | Secret | reCAPTCHA v2 secret key |
| `EMAIL_API_KEY` | Secret | Resend API key |
| `EMAIL_PROVIDER` | Text | `resend` |
| `CONTACT_TO_EMAIL` | Text | Where enquiries go |
| `CONTACT_FROM_EMAIL` | Text | Verified sender |
| `VITE_RECAPTCHA_SITE_KEY` | Text | Public site key, inlined into the bundle |
| `VITE_GA_MEASUREMENT_ID` | Text | Optional. Setting it turns on GA4 *and* the cookie consent banner |

**`VITE_` variables are resolved at build time.** Changing one in the dashboard does nothing to the
running site until a redeploy. The others are read per request and take effect immediately.

Local development reads `.env.local` (for `VITE_` variables) and `.dev.vars` (for Function bindings).
Both are gitignored.

## Analytics

Cloudflare Web Analytics is enabled on the Pages project and injected at the edge — there is no
script for it in this repository, and adding one would double-count every page view. It is cookieless,
so it needs no consent.

Google Analytics is optional and off unless `VITE_GA_MEASUREMENT_ID` is set. It sets cookies, so it
loads only after the visitor accepts the banner, and the banner only appears when that variable is set.

## Deployment

Cloudflare Pages builds from the production branch on push. There is no manual deploy step.
