/**
 * Google reCAPTCHA v2 server-side verification.
 *
 * Shared by the contact form and warranty registration. The token a browser
 * produces means nothing until it is checked here: a client that skips the
 * widget and posts straight to the API simply gets rejected.
 *
 * Tokens are single-use and short-lived at Google's end, so a replayed one
 * comes back with `timeout-or-duplicate` and fails. Nothing is cached here,
 * which is what keeps that true.
 */
const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function verifyRecaptcha(
  token: string,
  secret: string,
  ip: string | null,
): Promise<boolean> {
  if (!token || !secret) return false;

  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);

  let response: Response;
  try {
    response = await fetch(VERIFY_URL, { method: 'POST', body: form });
  } catch (error) {
    // Reaching Google failed. Refusing is the safe direction: the alternative
    // is that a network blip turns the form into an open relay for spam.
    console.error('reCAPTCHA verify unreachable', error);
    return false;
  }

  if (!response.ok) {
    console.error('reCAPTCHA verify HTTP error', response.status);
    return false;
  }

  const result = (await response.json()) as { success?: boolean; 'error-codes'?: string[] };
  if (!result.success) {
    console.warn('reCAPTCHA rejected submission', result['error-codes']);
  }
  return result.success === true;
}
