/**
 * Cloudflare Access JWT verification for /api/admin/* routes.
 *
 * Access already gates admin.zeoshields.com at the edge, but the same
 * functions/ directory is deployed to the public project too, so those routes
 * would otherwise be reachable unauthenticated on zeoshields.com. Verifying the
 * assertion in code closes that, and means the API is protected independently
 * of the hostname it is served from.
 *
 * Every failure path denies. A missing or misconfigured environment is treated
 * as a denial, never as a bypass.
 */
export interface AccessEnv {
  /** e.g. "yourteam.cloudflareaccess.com" */
  ACCESS_TEAM_DOMAIN?: string;
  /** Application Audience (AUD) tag from the Access application. */
  ACCESS_AUD?: string;
}

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
  alg?: string;
}

let cachedKeys: { url: string; fetchedAt: number; keys: Jwk[] } | null = null;
const KEY_TTL_MS = 60 * 60 * 1000;

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJson(segment: string): Record<string, unknown> {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment)));
}

async function getKeys(teamDomain: string): Promise<Jwk[]> {
  const url = `https://${teamDomain}/cdn-cgi/access/certs`;
  if (cachedKeys && cachedKeys.url === url && Date.now() - cachedKeys.fetchedAt < KEY_TTL_MS) {
    return cachedKeys.keys;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Access certs fetch failed: ${response.status}`);
  const body = (await response.json()) as { keys?: Jwk[] };
  const keys = body.keys ?? [];
  cachedKeys = { url, fetchedAt: Date.now(), keys };
  return keys;
}

export interface AccessIdentity {
  email: string;
}

/**
 * Returns the verified identity, or null if the request is not authorised.
 */
export async function verifyAccess(request: Request, env: AccessEnv): Promise<AccessIdentity | null> {
  const teamDomain = env.ACCESS_TEAM_DOMAIN;
  const audience = env.ACCESS_AUD;

  if (!teamDomain || !audience) {
    console.error('Access is not configured (ACCESS_TEAM_DOMAIN / ACCESS_AUD missing) - denying.');
    return null;
  }

  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') ||
    (request.headers.get('Cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1];

  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const header = decodeJson(parts[0]) as { kid?: string; alg?: string };
    const payload = decodeJson(parts[1]) as {
      aud?: string | string[];
      exp?: number;
      iss?: string;
      email?: string;
    };

    if (header.alg !== 'RS256' || !header.kid) return null;

    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(audience)) return null;

    if (payload.iss !== `https://${teamDomain}`) return null;

    if (typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()) return null;

    const jwk = (await getKeys(teamDomain)).find((k) => k.kid === header.kid);
    if (!jwk) return null;

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );

    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      base64UrlToBytes(parts[2]),
      signed,
    );
    if (!valid) return null;

    return { email: payload.email ?? 'unknown' };
  } catch (error) {
    console.error('Access verification threw', error);
    return null;
  }
}
