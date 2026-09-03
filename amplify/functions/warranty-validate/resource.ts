import { defineFunction } from '@aws-amplify/backend';

/**
 * Public warranty lookup. Runs server-side so the browser never receives
 * customer PII - it only ever sees the fields in the WarrantyStatus type.
 */
export const warrantyValidate = defineFunction({
  name: 'warranty-validate',
  entry: './handler.ts',
  timeoutSeconds: 20,
});
