import { json } from '../../../lib/db';
import { verifyAccess, type AccessEnv } from '../../../lib/access';

interface Env extends AccessEnv {
  DB: D1Database;
}

/** Only these may be written by the dashboard; anything else is ignored. */
const EDITABLE: Record<string, string> = {
  warrantyNumber: 'warranty_number',
  productName: 'product_name',
  manufactureDate: 'manufacture_date',
  status: 'status',
  registrationDate: 'registration_date',
  customerName: 'customer_name',
  phone: 'phone',
  email: 'email',
  purchaseDate: 'purchase_date',
  purchaseCountry: 'purchase_country',
};

/** PATCH /api/admin/warranties/:id */
export const onRequestPatch = async (context: {
  request: Request;
  env: Env;
  params: { id: string };
}): Promise<Response> => {
  if (!(await verifyAccess(context.request, context.env))) return json({ error: 'Unauthorized' }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const columns: string[] = [];
  const values: (string | null)[] = [];

  for (const [field, column] of Object.entries(EDITABLE)) {
    if (!(field in body)) continue;
    const raw = body[field];
    const value = typeof raw === 'string' ? raw.trim() : raw == null ? '' : String(raw);
    if (value.length > 5000) return json({ error: `${field} is too long.` }, 400);
    columns.push(`${column} = ?`);
    values.push(value === '' ? null : value);
  }

  if (!columns.length) return json({ error: 'Nothing to update.' }, 400);

  const result = await context.env.DB.prepare(
    `UPDATE warranties SET ${columns.join(', ')} WHERE id = ?`,
  )
    .bind(...values, context.params.id)
    .run();

  if (result.meta.changes === 0) return json({ error: 'Not found.' }, 404);
  return json({ success: true });
};

/** DELETE /api/admin/warranties/:id */
export const onRequestDelete = async (context: {
  request: Request;
  env: Env;
  params: { id: string };
}): Promise<Response> => {
  if (!(await verifyAccess(context.request, context.env))) return json({ error: 'Unauthorized' }, 401);

  const result = await context.env.DB.prepare('DELETE FROM warranties WHERE id = ?')
    .bind(context.params.id)
    .run();

  if (result.meta.changes === 0) return json({ error: 'Not found.' }, 404);
  return json({ success: true });
};
