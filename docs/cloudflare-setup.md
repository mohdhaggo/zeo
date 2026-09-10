# Cloudflare setup

Things that live in the Cloudflare dashboard rather than in this repository, and are therefore
invisible to anyone reading the code. Keep this file current — an undocumented dashboard setting is
one nobody knows to check when something breaks.

## Rate limiting (WAF)

`functions/lib/ratelimit.ts` caps requests per IP using the Workers Cache API. It is a speed bump,
not a guarantee: the read-modify-write is not atomic and the cache is per-colocation, so an attacker
spread across many locations gets a separate budget in each. The durable control is a WAF rule.

Cloudflare's free plan includes rate-limiting rules with a restricted feature set — IP as the only
counting characteristic, short counting periods, and Block as the action. Confirm the current
entitlement in the dashboard, since plan limits change.

Add under **Security → WAF → Rate limiting rules** on the `zeoshields.com` zone:

| Field | Value |
| --- | --- |
| Rule name | `api-general` |
| If incoming requests match | `(http.request.uri.path contains "/api/")` |
| Rate | 30 requests per 1 minute |
| Counting characteristic | IP |
| Action | Block |
| Duration | 1 minute |

A second, stricter rule on `/api/warranty/` is worth adding if enumeration is ever attempted:
10 requests per minute, same shape.

**Status: not yet created.** Record the date here when it is.

## Environment variables

Set per Pages project under **Settings → Environment variables**. The table in the README lists what
each one is for.

The trap worth repeating: `VITE_`-prefixed variables are inlined into the JavaScript bundle **at
build time**. Changing one in the dashboard has no effect on the running site until a redeploy. The
non-`VITE_` ones are Function bindings, read per request, and take effect immediately.

## Analytics

Cloudflare Web Analytics is enabled on the `zeoshields` Pages project and injected automatically at
the edge. Confirm with:

```bash
curl -sS -H "User-Agent: Mozilla/5.0" https://www.zeoshields.com/ | grep -o 'beacon.min.js'
```

Do **not** add a beacon script to the repository as well — the page would report every view twice.

## Database migrations

D1 migrations in `db/migrations/` are applied by hand. Always export first:

```bash
npx wrangler d1 export zeoshields --remote --output backup-$(date +%F).sql
```

### 001-warranty-number-nocase.sql

Rebuilds the `warranties` table so `warranty_number` uses `COLLATE NOCASE`, which is what makes the
index usable by the queries that actually run.

**Check for case-variant duplicates before running it.** The old `UNIQUE` used binary collation, so
`PPF-00-12345` and `ppf-00-12345` could both exist. The new one cannot hold both, and the migration
will abort partway if they are there:

```bash
npx wrangler d1 execute zeoshields --remote --command "SELECT lower(warranty_number) k, COUNT(*) c, GROUP_CONCAT(warranty_number) FROM warranties GROUP BY k HAVING c > 1"
```

Reconcile anything it returns by hand first. Then run the migration and confirm the plan says SEARCH
rather than SCAN:

```bash
npx wrangler d1 execute zeoshields --remote --file db/migrations/001-warranty-number-nocase.sql
npx wrangler d1 execute zeoshields --remote --command "EXPLAIN QUERY PLAN SELECT 1 FROM warranties WHERE warranty_number = 'X' COLLATE NOCASE"
```

**Status: not yet applied.**

## Backups

There is no automated backup. D1 Time Travel covers a limited window and nobody has confirmed the
retention. Until a scheduled export to R2 exists, take a manual export before any migration and
periodically otherwise, using the command above.

## Domain

DNS is authoritative at Bluehost. `www.zeoshields.com` is a CNAME to the Pages project; the bare apex
is a 301 to `www` served by Bluehost's Apache. The apex redirect does not carry HSTS, because it is
Apache rather than Cloudflare — adding `Header always set Strict-Transport-Security "max-age=31536000"`
to the apex `.htaccess` would close that gap.
