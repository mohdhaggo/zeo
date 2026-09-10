import { json } from '../../lib/db';
import { verifyRecaptcha } from '../../lib/recaptcha';
import { stripControlChars } from '../../lib/sanitize';
import { isRateLimited, tooManyRequests } from '../../lib/ratelimit';

interface Env {
  DB: D1Database;
  RECAPTCHA_SECRET: string;
}

interface RegisterPayload {
  warrantyNumber?: unknown;
  customerName?: unknown;
  email?: unknown;
  phone?: unknown;
  purchaseCountry?: unknown;
  purchaseDate?: unknown;
  recaptchaToken?: unknown;
}

/**
 * Registration permanently binds a warranty to a person, so the limit is
 * tighter than the lookup's. A genuine customer does this once.
 */
const REGISTER_LIMIT = { limit: 5, windowSeconds: 600 };

/** Matches the country dropdown on the warranty page. */
const COUNTRIES = new Set([
  'Saudi Arabia',
  'UAE',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Other',
]);

const str = (v: unknown, max: number): string => {
  if (typeof v !== 'string') return '';
  const value = stripControlChars(v);
  return value && value.length <= max ? value : '';
};

/**
 * Accepts an ISO date that is real and not in the future.
 *
 * The field used to take any string up to 40 characters, so a warranty could
 * be recorded as purchased in the year 9999 or on the 31st of February, and a
 * claim assessed against it would be judged on nonsense.
 */
function readPurchaseDate(raw: unknown): { ok: boolean; value: string | null } {
  const text = str(raw, 40);
  if (!text) return { ok: true, value: null };

  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return { ok: false, value: null };

  const parsed = new Date(text + 'T00:00:00Z');
  if (Number.isNaN(parsed.getTime())) return { ok: false, value: null };
  // Round-tripping catches dates the Date constructor silently rolls over,
  // such as 2026-02-31 becoming the 3rd of March.
  if (parsed.toISOString().slice(0, 10) !== text) return { ok: false, value: null };
  if (parsed.getTime() > Date.now() + 24 * 60 * 60 * 1000) return { ok: false, value: null };

  return { ok: true, value: text };
}

/**
 * POST /api/warranty/register - public warranty registration.
 *
 * Guarded by reCAPTCHA and a rate limit. Without them this endpoint plus the
 * lookup endpoint were a complete attack: walk the number space against the
 * lookup until `eligibleForRegistration` comes back true, then call this for
 * every hit and bind every unclaimed warranty in the database to an attacker's
 * name and email. The genuine owners would then be told their warranty was
 * already registered, and the only record of who owns it would be false.
 */
export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  if (await isRateLimited(context.request, 'warranty-register', REGISTER_LIMIT)) {
    return tooManyRequests(REGISTER_LIMIT.windowSeconds);
  }

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
  const purchaseDate = readPurchaseDate(payload.purchaseDate);

  if (!warrantyNumber || !customerName || !email || !phone) {
    return json({ success: false, message: 'Please fill in all required fields.' }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }
  if (!COUNTRIES.has(purchaseCountry)) {
    return json({ success: false, message: 'Please choose a country from the list.' }, 400);
  }
  if (!purchaseDate.ok) {
    return json(
      { success: false, message: 'Please enter a valid purchase date that is not in the future.' },
      400,
    );
  }

  const token = typeof payload.recaptchaToken === 'string' ? payload.recaptchaToken : '';
  if (!token) {
    return json({ success: false, message: 'Please complete the verification challenge.' }, 400);
  }

  const human = await verifyRecaptcha(
    token,
    context.env.RECAPTCHA_SECRET,
    context.request.headers.get('CF-Connecting-IP'),
  );
  if (!human) {
    return json({ success: false, message: 'Verification failed. Please try again.' }, 403);
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
      phone,
      purchaseCountry,
      purchaseDate.value,
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
