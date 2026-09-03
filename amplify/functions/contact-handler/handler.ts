import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/contact-handler';
import type { Schema } from '../../data/resource';
import { sendEmail } from './email';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>({ authMode: 'iam' });

const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

/** Escape user-supplied text before it goes into the notification email body. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function verifyRecaptcha(token: string, remoteIp?: string): Promise<boolean> {
  const params = new URLSearchParams({ secret: env.RECAPTCHA_SECRET, response: token });
  if (remoteIp) params.append('remoteip', remoteIp);

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    console.error('reCAPTCHA verify HTTP error', response.status);
    return false;
  }

  const result = (await response.json()) as { success: boolean; 'error-codes'?: string[] };
  if (!result.success) {
    console.warn('reCAPTCHA rejected submission', result['error-codes']);
  }
  return result.success === true;
}

function buildEmailBody(input: {
  name: string;
  email: string;
  phone?: string | null;
  region: string;
  interest: string;
  message: string;
}): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px;font-weight:bold;vertical-align:top">${label}</td>` +
    `<td style="padding:6px 12px">${escapeHtml(value)}</td></tr>`;

  return `<div style="font-family:Arial,Helvetica,sans-serif;color:#111">
  <h2 style="color:#E50914;margin-bottom:4px">New enquiry from zeoshields.com</h2>
  <table style="border-collapse:collapse;font-size:14px">
    ${row('Name', input.name)}
    ${row('Email', input.email)}
    ${row('Phone', input.phone || '-')}
    ${row('Region', input.region)}
    ${row('Interest', input.interest)}
  </table>
  <h3 style="margin-bottom:4px">Message</h3>
  <p style="white-space:pre-wrap;font-size:14px">${escapeHtml(input.message)}</p>
</div>`;
}

export const handler: Schema['submitContact']['functionHandler'] = async (event) => {
  const { name, email, phone, region, interest, message, recaptchaToken } = event.arguments;

  // 1. Server-side reCAPTCHA verification. A token that never reaches Google
  //    is worthless, so this is the only check that actually stops bots.
  const humanVerified = await verifyRecaptcha(recaptchaToken);
  if (!humanVerified) {
    return { success: false, message: 'reCAPTCHA verification failed. Please try again.' };
  }

  // 2. Persist first, so an email-provider outage never loses an enquiry.
  try {
    const { errors } = await client.models.ContactSubmission.create({
      name,
      email,
      phone: phone ?? undefined,
      region,
      interest,
      message,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });
    if (errors?.length) {
      console.error('Failed to persist contact submission', errors);
      return { success: false, message: 'Could not save your message. Please try again.' };
    }
  } catch (error) {
    console.error('Unexpected error persisting contact submission', error);
    return { success: false, message: 'Could not save your message. Please try again.' };
  }

  // 3. Notify. The submission is already stored and visible in the dashboard,
  //    so a send failure is logged but not surfaced as a user-facing error.
  if (!env.CONTACT_TO_EMAIL) {
    console.warn('CONTACT_TO_EMAIL is not set - submission stored but no email sent.');
    return { success: true, message: 'Thank you! Your message has been received.' };
  }

  try {
    await sendEmail(
      {
        to: env.CONTACT_TO_EMAIL.split(',').map((address) => address.trim()).filter(Boolean),
        subject: `New enquiry from ${name} (${region})`,
        html: buildEmailBody({ name, email, phone, region, interest, message }),
        replyTo: email,
      },
      {
        provider: env.EMAIL_PROVIDER.toLowerCase(),
        apiKey: env.EMAIL_API_KEY,
        from: env.CONTACT_FROM_EMAIL,
      },
    );
  } catch (error) {
    console.error('Contact submission stored but email notification failed', error);
  }

  return { success: true, message: 'Thank you! Your message has been received.' };
};
