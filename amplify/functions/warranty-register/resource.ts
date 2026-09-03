import { defineFunction } from '@aws-amplify/backend';

/**
 * Public warranty registration. Server-side so ownership rules are enforced
 * where the client cannot tamper with them.
 */
export const warrantyRegister = defineFunction({
  name: 'warranty-register',
  entry: './handler.ts',
  timeoutSeconds: 20,
});
