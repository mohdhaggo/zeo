import { json } from '../../../lib/db';
import { verifyAccess, type AccessEnv } from '../../../lib/access';

interface Env extends AccessEnv {
  DB: D1Database;
}

const ALLOWED_STATUSES = new Set(['PENDING', 'READ', 'ARCHIVED']);

/** PATCH /api/admin/contacts/:id - currently only the status changes. */
export const onRequestPatch = async (context: {
  request: Request;
  env: Env;
  params: { id: string };
}): Promise<Response> => {
  if (!(await verifyAccess(context.request, context.env))) return json({ error: 'Unauthorized' }, 401);

  let body: { status?: unknown };
  try {
    body = (await context.request.json()) as { status?: unknown };
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const status = typeof body.status === 'string' ? body.status : '';
  if (!ALLOWED_STATUSES.has(status)) {
    return json({ error: 'Unsupported status.' }, 400);
  }

  const result = await context.env.DB.prepare('UPDATE contact_submissions SET status = ? WHERE id = ?')
    .bind(status, context.params.id)
    .run();

  if (result.meta.changes === 0) return json({ error: 'Not found.' }, 404);
  return json({ success: true });
};
