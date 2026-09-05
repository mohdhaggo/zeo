import { sendEmail } from '../lib/email';

/**
 * POST /api/contact - Cloudflare Pages Function.
 *
 * Replaces the AppSync + Lambda path. Enquiries go straight to email in this
 * stage; there is no database yet, so a send failure is reported to the caller
 * rather than hidden behind a success message.
 *
 * Bindings (set as Pages environment secrets, never committed):
 *   TURNSTILE_SECRET   Cloudflare Turnstile secret key
 *   EMAIL_API_KEY      transactional provider API key
 *   EMAIL_PROVIDER     resend | sendgrid | brevo | mailersend  (default resend)
 *   CONTACT_TO_EMAIL   comma-separated recipient list
 *   CONTACT_FROM_EMAIL verified sender address
 */
interface Env {
  TURNSTILE_SECRET: string;
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
  turnstileToken?: unknown;
}

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/** Field length caps, so a malicious payload cannot produce a huge email. */
const LIMITS: Record<string, number> = {
  name: 100,
  email: 200,
  phone: 40,
  region: 60,
  interest: 60,
  message: 5000,
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Returns the trimmed string if present and within its cap, else null. */
function readField(raw: unknown, field: string, required: boolean): string | null {
  if (typeof raw !== 'string') return required ? null : '';
  const value = raw.trim();
  if (!value) return required ? null : '';
  if (value.length > LIMITS[field]) return null;
  return value;
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form });
  if (!response.ok) {
    console.error('Turnstile verify HTTP error', response.status);
    return false;
  }

  const result = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
  if (!result.success) {
    console.warn('Turnstile rejected submission', result['error-codes']);
  }
  return result.success === true;
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
    phone: false,
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

  const token = typeof payload.turnstileToken === 'string' ? payload.turnstileToken : '';
  if (!token) {
    return json({ success: false, message: 'Please complete the verification challenge.' }, 400);
  }

  const human = await verifyTurnstile(token, env.TURNSTILE_SECRET, request.headers.get('CF-Connecting-IP'));
  if (!human) {
    return json({ success: false, message: 'Verification failed. Please try again.' }, 403);
  }

  const recipients = (env.CONTACT_TO_EMAIL || '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (!recipients.length) {
    console.error('CONTACT_TO_EMAIL is not configured.');
    return json({ success: false, message: 'Contact form is not configured. Please email us directly.' }, 500);
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
    // No database in this stage, so a failed send means the enquiry is gone.
    // Say so rather than reporting a success the user would rely on.
    console.error('Contact email failed to send', error);
    return json(
      { success: false, message: 'We could not send your message. Please email us directly.' },
      502,
    );
  }

  return json({ success: true, message: 'Thank you! Your message has been sent.' }, 200);
};
