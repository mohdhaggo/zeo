import { json, warrantyToPublicJson, type WarrantyRow } from '../../lib/db';

interface Env {
  DB: D1Database;
}

/**
 * GET /api/warranty/:number - public warranty lookup.
 *
 * Runs server-side so the browser never receives customer PII. The old
 * implementation listed the whole table into the visitor's browser and rendered
 * the owner's name, phone and email to anyone who typed a valid number.
 */
export const onRequestGet = async (context: {
  request: Request;
  env: Env;
  params: { number: string };
}): Promise<Response> => {
  const warrantyNumber = decodeURIComponent(context.params.number ?? '').trim();

  if (!warrantyNumber) {
    return json({ found: false, message: 'Please enter a warranty number.' }, 400);
  }

  const row = await context.env.DB.prepare(
    'SELECT * FROM warranties WHERE warranty_number = ? COLLATE NOCASE LIMIT 1',
  )
    .bind(warrantyNumber)
    .first<WarrantyRow>();

  if (!row) {
    return json({
      found: false,
      message: 'No warranty found with that number. Please check and try again.',
    });
  }

  return json({
    ...warrantyToPublicJson(row),
    message:
      row.status === 'UNREGISTERED'
        ? 'Warranty found and is eligible for registration.'
        : 'This warranty is already registered.',
  });
};
