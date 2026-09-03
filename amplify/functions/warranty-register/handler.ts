import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/warranty-register';
import type { Schema } from '../../data/resource';

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>({ authMode: 'iam' });

export const handler: Schema['registerWarranty']['functionHandler'] = async (event) => {
  const { warrantyNumber, customerName, email, phone, purchaseCountry, purchaseDate } = event.arguments;

  const trimmed = warrantyNumber?.trim();
  if (!trimmed) {
    return { success: false, message: 'Warranty number is required.' };
  }

  const { data, errors } = await client.models.Warranty.list({
    filter: { warrantyNumber: { eq: trimmed } },
    limit: 1,
  });

  if (errors?.length) {
    console.error('Warranty lookup failed during registration', errors);
    return { success: false, message: 'Registration failed. Please try again.' };
  }

  const record = data?.[0];
  if (!record) {
    return { success: false, message: 'No warranty found with that number.' };
  }

  // Enforced here rather than in the browser, where it could simply be skipped.
  if (record.status !== 'UNREGISTERED') {
    return { success: false, message: 'This warranty has already been registered.' };
  }

  const { errors: updateErrors } = await client.models.Warranty.update({
    id: record.id,
    customerName,
    email,
    phone: phone ?? undefined,
    purchaseCountry: purchaseCountry ?? undefined,
    purchaseDate: purchaseDate ?? undefined,
    status: 'ACTIVE',
    registrationDate: new Date().toISOString(),
  });

  if (updateErrors?.length) {
    console.error('Warranty registration update failed', updateErrors);
    return { success: false, message: 'Registration failed. Please try again.' };
  }

  return { success: true, message: 'Warranty registered successfully.', warrantyNumber: trimmed };
};
