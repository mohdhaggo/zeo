import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Guest access through the Cognito identity pool.
const client = generateClient<Schema>();

export interface ContactFormInput {
  name: string;
  email: string;
  phone: string;
  region: string;
  interest: string;
  message: string;
  recaptchaToken: string;
}

export interface ContactResult {
  success: boolean;
  message: string;
}

export const contactService = {
  /**
   * Submits an enquiry. The Lambda behind this mutation verifies the reCAPTCHA
   * token with Google, stores the submission, then emails it on - so a caller
   * that fakes the token gets rejected server-side.
   */
  async submitContact(input: ContactFormInput): Promise<ContactResult> {
    const { data, errors } = await client.mutations.submitContact(input);

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    return {
      success: data?.success ?? false,
      message: data?.message ?? 'Unexpected response from the server.',
    };
  },
};
