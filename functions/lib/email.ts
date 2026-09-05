/**
 * Minimal transactional-email adapter (Cloudflare Pages Function).
 *
 * Every supported provider is a single authenticated POST, so switching
 * provider is an environment-variable change rather than a code change.
 */
export interface EmailMessage {
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}

interface ProviderConfig {
  provider: string;
  apiKey: string;
  from: string;
}

export async function sendEmail(message: EmailMessage, config: ProviderConfig): Promise<void> {
  const { provider, apiKey, from } = config;

  let url: string;
  let headers: Record<string, string>;
  let body: unknown;

  switch (provider) {
    case 'resend':
      url = 'https://api.resend.com/emails';
      headers = { Authorization: `Bearer ${apiKey}` };
      body = {
        from,
        to: message.to,
        subject: message.subject,
        html: message.html,
        ...(message.replyTo ? { reply_to: message.replyTo } : {}),
      };
      break;

    case 'sendgrid':
      url = 'https://api.sendgrid.com/v3/mail/send';
      headers = { Authorization: `Bearer ${apiKey}` };
      body = {
        personalizations: [{ to: message.to.map((email) => ({ email })) }],
        from: { email: from },
        subject: message.subject,
        content: [{ type: 'text/html', value: message.html }],
        ...(message.replyTo ? { reply_to: { email: message.replyTo } } : {}),
      };
      break;

    case 'brevo':
      url = 'https://api.brevo.com/v3/smtp/email';
      headers = { 'api-key': apiKey };
      body = {
        sender: { email: from },
        to: message.to.map((email) => ({ email })),
        subject: message.subject,
        htmlContent: message.html,
        ...(message.replyTo ? { replyTo: { email: message.replyTo } } : {}),
      };
      break;

    case 'mailersend':
      url = 'https://api.mailersend.com/v1/email';
      headers = { Authorization: `Bearer ${apiKey}` };
      body = {
        from: { email: from },
        to: message.to.map((email) => ({ email })),
        subject: message.subject,
        html: message.html,
        ...(message.replyTo ? { reply_to: { email: message.replyTo } } : {}),
      };
      break;

    default:
      throw new Error(`Unsupported EMAIL_PROVIDER "${provider}"`);
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${provider} responded ${response.status}: ${detail.slice(0, 500)}`);
  }
}
