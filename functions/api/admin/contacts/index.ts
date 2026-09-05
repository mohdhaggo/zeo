import { json, contactToJson, type ContactRow } from '../../../lib/db';
import { verifyAccess, type AccessEnv } from '../../../lib/access';

interface Env extends AccessEnv {
  DB: D1Database;
}

/** GET /api/admin/contacts - list enquiries, newest first. */
export const onRequestGet = async (context: { request: Request; env: Env }): Promise<Response> => {
  if (!(await verifyAccess(context.request, context.env))) return json({ error: 'Unauthorized' }, 401);

  const { results } = await context.env.DB.prepare(
    'SELECT * FROM contact_submissions ORDER BY created_at DESC',
  ).all<ContactRow>();

  return json({ data: (results ?? []).map(contactToJson) });
};
