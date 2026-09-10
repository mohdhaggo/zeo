/**
 * Per-IP rate limiting for the public endpoints.
 *
 * Built on the Workers Cache API rather than D1 or KV, and that choice is the
 * whole design. A counter row per request would spend D1's free daily write
 * allowance - roughly 100,000 writes - on exactly the flood it is meant to
 * absorb, so the limiter would take the site down before the attacker did. KV's
 * free write allowance is smaller still. The cache costs nothing and has no
 * quota.
 *
 * The trade-off, stated plainly: the read-modify-write is not atomic, and the
 * cache is per-colocation rather than global. Requests arriving in the same
 * instant can share a count, and an attacker spread across many colos gets a
 * separate budget in each. This is a speed bump against the realistic attack -
 * one machine walking the warranty number space in a loop - not a guarantee.
 * The durable control is a Cloudflare WAF rate-limiting rule, which the free
 * plan includes; see docs/cloudflare-setup for the rule to add.
 */

/** A namespace that is never fetched over the network, only used as a key. */
const KEY_PREFIX = 'https://ratelimit.zeoshields.internal/';

export interface RateLimit {
  /** Requests allowed inside one window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
}

/**
 * Returns true when this request should be refused.
 *
 * Fails open. If the Cache API is unavailable the endpoint keeps working
 * rather than refusing everyone, because a limiter that breaks closed turns a
 * minor outage into a total one.
 */
export async function isRateLimited(
  request: Request,
  bucket: string,
  { limit, windowSeconds }: RateLimit,
): Promise<boolean> {
  const ip = request.headers.get('CF-Connecting-IP');
  // No client IP means we cannot attribute the request to anyone, and refusing
  // on that basis would block every request if the header ever went missing.
  if (!ip) return false;

  try {
    const cache = caches.default;
    // Bucketing the window into the key means an expired window simply misses
    // rather than needing to be reset.
    const window = Math.floor(Date.now() / 1000 / windowSeconds);
    const key = new Request(`${KEY_PREFIX}${bucket}/${window}/${encodeURIComponent(ip)}`);

    const hit = await cache.match(key);
    const count = hit ? Number(await hit.text()) || 0 : 0;

    if (count >= limit) return true;

    await cache.put(
      key,
      new Response(String(count + 1), {
        headers: { 'Cache-Control': `max-age=${windowSeconds}` },
      }),
    );
    return false;
  } catch (error) {
    console.error('Rate limiter unavailable, allowing request', error);
    return false;
  }
}

/** The 429 every limited endpoint returns, with the retry hint browsers read. */
export function tooManyRequests(windowSeconds: number): Response {
  return new Response(
    JSON.stringify({
      success: false,
      found: false,
      message: 'Too many requests. Please wait a moment and try again.',
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(windowSeconds),
        'Cache-Control': 'no-store',
      },
    },
  );
}
