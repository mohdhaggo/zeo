import { json } from '../../lib/db';

interface Env {
  DB: D1Database;
}

interface RegisterPayload {
  warrantyNumber?: unknown;
  customerName?: unknown;
  email?: unknown;
  phone?: unknown;
  purchaseCountry?: unknown;
  purchaseDate?: unknown;
}

const str = (v: unknown, max: number): string =>
  typeof v === 'string' && v.trim() && v.trim().length <= max ? v.trim() : '';

/** POST /api/warranty/register - public warranty registration. */
export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  let payload: RegisterPayload;
  try {
    payload = (await context.request.json()) as RegisterPayload;
  } catch {
    return json({ success: false, message: 'Invalid request.' }, 400);
  }

  const warrantyNumber = str(payload.warrantyNumber, 80);
  const customerName = str(payload.customerName, 100);
  const email = str(payload.email, 200);
  const phone = str(payload.phone, 40);
  const purchaseCountry = str(payload.purchaseCountry, 60);
  const purchaseDate = str(payload.purchaseDate, 40);

  if (!warrantyNumber || !customerName || !email) {
    return json({ success: false, message: 'Please fill in all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }

  // The status guard lives in the WHERE clause, so two simultaneous
  // registrations cannot both succeed - the second matches zero rows.
  const result = await context.env.DB.prepare(
    `UPDATE warranties
        SET customer_name = ?, email = ?, phone = ?, purchase_country = ?,
            purchase_date = ?, status = 'ACTIVE', registration_date = ?
      WHERE warranty_number = ? COLLATE NOCASE AND status = 'UNREGISTERED'`,
  )
    .bind(
      customerName,
      email,
      phone || null,
      purchaseCountry || null,
      purchaseDate || null,
      new Date().toISOString(),
      warrantyNumber,
    )
    .run();

  if (result.meta.changes === 0) {
    const exists = await context.env.DB.prepare(
      'SELECT status FROM warranties WHERE warranty_number = ? COLLATE NOCASE LIMIT 1',
    )
      .bind(warrantyNumber)
      .first<{ status: string }>();

    return json(
      {
        success: false,
        message: exists
          ? 'This warranty has already been registered.'
          : 'No warranty found with that number.',
      },
      exists ? 409 : 404,
    );
  }

  return json({ success: true, message: 'Warranty registered successfully.', warrantyNumber });
};
