import { json, newId, warrantyToJson, type WarrantyRow } from '../../../lib/db';
import { verifyAccess, type AccessEnv } from '../../../lib/access';

interface Env extends AccessEnv {
  DB: D1Database;
}

const str = (v: unknown, max: number): string =>
  typeof v === 'string' && v.trim().length <= max ? v.trim() : '';

/** GET /api/admin/warranties - list every warranty, newest first. */
export const onRequestGet = async (context: { request: Request; env: Env }): Promise<Response> => {
  if (!(await verifyAccess(context.request, context.env))) return json({ error: 'Unauthorized' }, 401);

  const { results } = await context.env.DB.prepare(
    'SELECT * FROM warranties ORDER BY created_at DESC',
  ).all<WarrantyRow>();

  return json({ data: (results ?? []).map(warrantyToJson) });
};

/** POST /api/admin/warranties - create a warranty record. */
export const onRequestPost = async (context: { request: Request; env: Env }): Promise<Response> => {
  if (!(await verifyAccess(context.request, context.env))) return json({ error: 'Unauthorized' }, 401);

  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const warrantyNumber = str(body.warrantyNumber, 80);
  const productName = str(body.productName, 120);
  if (!warrantyNumber || !productName) {
    return json({ error: 'warrantyNumber and productName are required.' }, 400);
  }

  const id = newId();
  try {
    await context.env.DB.prepare(
      `INSERT INTO warranties
         (id, warranty_number, product_name, manufacture_date, status,
          registration_date, customer_name, phone, email, purchase_date,
          purchase_country, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        warrantyNumber,
        productName,
        str(body.manufactureDate, 40) || null,
        str(body.status, 40) || 'UNREGISTERED',
        str(body.registrationDate, 40) || null,
        str(body.customerName, 100) || null,
        str(body.phone, 40) || null,
        str(body.email, 200) || null,
        str(body.purchaseDate, 40) || null,
        str(body.purchaseCountry, 60) || null,
        new Date().toISOString(),
      )
      .run();
  } catch (error) {
    // warranty_number carries a UNIQUE constraint.
    if (String(error).includes('UNIQUE')) {
      return json({ error: 'A warranty with that number already exists.' }, 409);
    }
    throw error;
  }

  return json({ id }, 201);
};
