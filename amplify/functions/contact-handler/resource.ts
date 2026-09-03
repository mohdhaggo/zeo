import { defineFunction, secret } from '@aws-amplify/backend';

/**
 * Handles public contact-form submissions.
 *
 * Everything sensitive lives in secrets or Amplify Hosting environment
 * variables so the destination inbox / provider can change without a code
 * change. Set these in the Amplify console:
 *
 *   Secrets              RECAPTCHA_SECRET, EMAIL_API_KEY
 *   Environment vars     EMAIL_PROVIDER, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL
 */
export const contactHandler = defineFunction({
  name: 'contact-handler',
  entry: './handler.ts',
  timeoutSeconds: 30,
  environment: {
    RECAPTCHA_SECRET: secret('RECAPTCHA_SECRET'),
    EMAIL_API_KEY: secret('EMAIL_API_KEY'),
    // resend | sendgrid | brevo | mailersend
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER ?? 'resend',
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL ?? '',
    CONTACT_FROM_EMAIL: process.env.CONTACT_FROM_EMAIL ?? 'noreply@zeoshields.com',
  },
});
