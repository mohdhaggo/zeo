import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/warranty-validate';
import type { Schema } from '../../data/resource';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>({ authMode: 'iam' });

export const handler: Schema['validateWarranty']['functionHandler'] = async (event) => {
  const warrantyNumber = event.arguments.warrantyNumber?.trim();

  if (!warrantyNumber) {
    return { found: false, message: 'Please enter a warranty number.', eligibleForRegistration: false };
  }

  const { data, errors } = await client.models.Warranty.list({
    filter: { warrantyNumber: { eq: warrantyNumber } },
    limit: 1,
  });

  if (errors?.length) {
    console.error('Warranty lookup failed', errors);
    return { found: false, message: 'Lookup failed. Please try again.', eligibleForRegistration: false };
  }

  const record = data?.[0];
  if (!record) {
    return {
      found: false,
      message: 'No warranty found with that number. Please check and try again.',
      eligibleForRegistration: false,
    };
  }

  // Deliberately narrow: name, email, phone and purchase country are never returned.
  return {
    found: true,
    warrantyNumber: record.warrantyNumber,
    productName: record.productName,
    manufactureDate: record.manufactureDate ?? undefined,
    status: record.status,
    registrationDate: record.registrationDate ?? undefined,
    eligibleForRegistration: record.status === 'UNREGISTERED',
    message:
      record.status === 'UNREGISTERED'
        ? 'Warranty found and is eligible for registration.'
        : 'This warranty is already registered.',
  };
};
