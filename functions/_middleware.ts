/**
 * Hostname routing.
 *
 * The public site and the admin console are one Pages deployment, because
 * Cloudflare Pages permits a single project per repository. This middleware
 * decides which document a request gets:
 *
 *   admin.zeoshields.com  -> admin.html
 *   zeoshields.com        -> index.html, and /admin.html is hidden
 *
 * This is presentation only. It is NOT the security boundary: Cloudflare Access
 * gates the admin hostname at the edge, and every /api/admin/* route verifies
 * the Access JWT independently in functions/lib/access.ts.
 */
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const ADMIN_HOST_PREFIX = 'admin.';

export const onRequest: (context: {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}) => Promise<Response> = async (context) => {
  const url = new URL(context.request.url);

  // API routes are shared by both hostnames and handle their own auth.
  if (url.pathname.startsWith('/api/')) {
    return context.next();
  }

  const isAdminHost = url.hostname.startsWith(ADMIN_HOST_PREFIX);

  if (isAdminHost) {
    // Anything without a file extension is a client-side route, so serve the
    // admin shell and let React Router take it from there.
    if (!url.pathname.slice(1).includes('.')) {
      // Fetch '/admin', not '/admin.html': Pages canonicalises away the .html
      // extension with a 308, which would otherwise be passed to the browser.
      const shell = new URL('/admin', url);
      const response = await context.env.ASSETS.fetch(
        new Request(shell.toString(), { method: 'GET', headers: context.request.headers }),
      );
      // Re-wrap so the redirect status of the asset lookup is never surfaced.
      return new Response(response.body, {
        status: response.status === 200 ? 200 : response.status,
        headers: response.headers,
      });
    }
    return context.next();
  }

  // Keep the admin entry document off the public hostname.
  if (url.pathname === '/admin.html') {
    return new Response('Not found', { status: 404 });
  }

  return context.next();
};
