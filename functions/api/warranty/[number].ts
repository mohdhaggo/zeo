import { json, warrantyToPublicJson, type PublicWarrantyRow } from '../../lib/db';
import { isRateLimited, tooManyRequests } from '../../lib/ratelimit';

interface Env {
  DB: D1Database;
}

/**
 * How many lookups one address may make per minute.
 *
 * Generous for a person checking a warranty card, restrictive for a script
 * walking the number space. Without a limit the found/not-found answer here is
 * a clean oracle: an attacker enumerates every valid number, then registers
 * each unclaimed one to themselves through the registration endpoint.
 */
const LOOKUP_LIMIT = { limit: 20, windowSeconds: 60 };

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
  if (await isRateLimited(context.request, 'warranty-lookup', LOOKUP_LIMIT)) {
    return tooManyRequests(LOOKUP_LIMIT.windowSeconds);
  }

  let warrantyNumber: string;
  try {
    warrantyNumber = decodeURIComponent(context.params.number ?? '').trim();
  } catch {
    // A malformed percent-escape makes decodeURIComponent throw, which would
    // otherwise surface as a 500 rather than a bad request.
    return json({ found: false, message: 'Please enter a valid warranty number.' }, 400);
  }

  if (!warrantyNumber) {
    return json({ found: false, message: 'Please enter a warranty number.' }, 400);
  }

  // Named columns rather than SELECT *. The public projection already strips
  // customer_name, phone and email, but with SELECT * that PII sits in the
  // Worker's memory on every lookup, one careless `json({...row})` away from
  // being returned. Not selecting it makes the leak structurally impossible.
  const row = await context.env.DB.prepare(
    `SELECT warranty_number, product_name, manufacture_date, status, registration_date
       FROM warranties WHERE warranty_number = ? COLLATE NOCASE LIMIT 1`,
  )
    .bind(warrantyNumber)
    .first<PublicWarrantyRow>();

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
