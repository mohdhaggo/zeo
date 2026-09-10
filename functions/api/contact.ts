import { sendEmail } from '../lib/email';
import { json, newId } from '../lib/db';
import { verifyRecaptcha } from '../lib/recaptcha';
import { stripControlChars, stripControlCharsKeepNewlines } from '../lib/sanitize';
import { isRateLimited, tooManyRequests } from '../lib/ratelimit';

/**
 * POST /api/contact - Cloudflare Pages Function.
 *
 * The enquiry is stored in D1 first and then emailed, so an email-provider
 * outage never loses one - it still appears in the admin dashboard.
 *
 * Bindings (set as Pages environment secrets, never committed):
 *   RECAPTCHA_SECRET   Google reCAPTCHA v2 secret key
 *   EMAIL_API_KEY      transactional provider API key
 *   EMAIL_PROVIDER     resend | sendgrid | brevo | mailersend  (default resend)
 *   CONTACT_TO_EMAIL   comma-separated recipient list
 *   CONTACT_FROM_EMAIL verified sender address
 */
interface Env {
  DB: D1Database;
  RECAPTCHA_SECRET: string;
  EMAIL_API_KEY: string;
  EMAIL_PROVIDER?: string;
  CONTACT_TO_EMAIL: string;
  CONTACT_FROM_EMAIL: string;
}

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  region?: unknown;
  interest?: unknown;
  message?: unknown;
  recaptchaToken?: unknown;
}

/**
 * reCAPTCHA makes each submission expensive to forge, but not slow to retry.
 * This caps how many any one address can send.
 */
const SUBMIT_LIMIT = { limit: 5, windowSeconds: 600 };

/** Field length caps, so a malicious payload cannot produce a huge email. */
const LIMITS: Record<string, number> = {
  name: 100,
  email: 200,
  phone: 40,
  region: 60,
  interest: 60,
  message: 5000,
};

/**
 * The dropdowns on the contact form, repeated here.
 *
 * The browser can only pick from these lists, but the browser is not what
 * posts to this endpoint - curl is. Without a server-side check these two
 * fields were free text, which is how a "region" ends up carrying a spam URL
 * that then lands in the notification email and the dashboard.
 */
const REGIONS = new Set([
  'Saudi Arabia',
  'UAE',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'Other',
]);

const INTERESTS = new Set([
  'ULTRA PPF',
  'TITAN PPF',
  'TITAN SATIN PPF',
  'Window Tint',
  'Windshield Film',
  'Other',
]);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns the cleaned string if present and within its cap, else null. */
function readField(raw: unknown, field: string, required: boolean): string | null {
  if (typeof raw !== 'string') return required ? null : '';
  // Newlines are meaningful in the message and nowhere else. Everywhere else
  // they are stripped before the length check, so a padded payload cannot slip
  // past the cap and a name cannot carry a line break into the email subject.
  const value =
    field === 'message' ? stripControlCharsKeepNewlines(raw) : stripControlChars(raw);
  if (!value) return required ? null : '';
  if (value.length > LIMITS[field]) return null;
  return value;
}

function buildEmailBody(fields: Record<string, string>): string {
  const row = (label: string, value: string) =>
    '<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">' +
    label +
    '</td><td style="padding:6px 12px">' +
    escapeHtml(value) +
    '</td></tr>';

  return (
    '<div style="font-family:Arial,Helvetica,sans-serif;color:#111">' +
    '<h2 style="color:#E50914;margin-bottom:4px">New enquiry from zeoshields.com</h2>' +
    '<table style="border-collapse:collapse;font-size:14px">' +
    row('Name', fields.name) +
    row('Email', fields.email) +
    row('Phone', fields.phone || '-') +
    row('Region', fields.region) +
    row('Interest', fields.interest) +
    '</table>' +
    '<h3 style="margin-bottom:4px">Message</h3>' +
    '<p style="white-space:pre-wrap;font-size:14px">' +
    escapeHtml(fields.message) +
    '</p></div>'
  );
}

export const onRequestPost = async (context: {
  request: Request;
  env: Env;
}): Promise<Response> => {
  const { request, env } = context;

  if (await isRateLimited(request, 'contact', SUBMIT_LIMIT)) {
    return tooManyRequests(SUBMIT_LIMIT.windowSeconds);
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return json({ success: false, message: 'Invalid request.' }, 400);
  }

  const fields: Record<string, string> = {};
  for (const [field, required] of Object.entries({
    name: true,
    email: true,
    // The form marks this required and refuses to submit without it, so the
    // server agrees rather than silently accepting an enquiry with no number.
    phone: true,
    region: true,
    interest: true,
    message: true,
  })) {
    const value = readField(payload[field as keyof ContactPayload], field, required);
    if (value === null) {
      return json({ success: false, message: 'Please check the ' + field + ' field.' }, 400);
    }
    fields[field] = value;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return json({ success: false, message: 'Please enter a valid email address.' }, 400);
  }

  if (!REGIONS.has(fields.region)) {
    return json({ success: false, message: 'Please choose a region from the list.' }, 400);
  }

  if (!INTERESTS.has(fields.interest)) {
    return json({ success: false, message: 'Please choose a product from the list.' }, 400);
  }

  const token = typeof payload.recaptchaToken === 'string' ? payload.recaptchaToken : '';
  if (!token) {
    return json({ success: false, message: 'Please complete the verification challenge.' }, 400);
  }

  // Validation runs first so a rejected field does not burn the single-use
  // token and force the visitor to solve the challenge again.
  const human = await verifyRecaptcha(
    token,
    env.RECAPTCHA_SECRET,
    request.headers.get('CF-Connecting-IP'),
  );
  if (!human) {
    return json({ success: false, message: 'Verification failed. Please try again.' }, 403);
  }

  // Persist first: a stored enquiry is recoverable, a dropped one is not.
  try {
    await env.DB.prepare(
      `INSERT INTO contact_submissions (id, name, email, phone, region, interest, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?)`,
    )
      .bind(
        newId(),
        fields.name,
        fields.email,
        fields.phone || null,
        fields.region,
        fields.interest,
        fields.message,
        new Date().toISOString(),
      )
      .run();
  } catch (error) {
    console.error('Failed to store contact submission', error);
    return json({ success: false, message: 'Could not save your message. Please try again.' }, 500);
  }

  const recipients = (env.CONTACT_TO_EMAIL || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (!recipients.length) {
    console.warn('CONTACT_TO_EMAIL is not set - enquiry stored but not emailed.');
    return json({ success: true, message: 'Thank you! Your message has been received.' }, 200);
  }

  try {
    await sendEmail(
      {
        to: recipients,
        subject: 'New enquiry from ' + fields.name + ' (' + fields.region + ')',
        html: buildEmailBody(fields),
        replyTo: fields.email,
      },
      {
        provider: (env.EMAIL_PROVIDER ?? 'resend').toLowerCase(),
        apiKey: env.EMAIL_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
      },
    );
  } catch (error) {
    // The enquiry is already stored and visible in the dashboard, so a send
    // failure is logged rather than surfaced as a lost message.
    console.error('Enquiry stored but email notification failed', error);
  }

  return json({ success: true, message: 'Thank you! Your message has been sent.' }, 200);
};
