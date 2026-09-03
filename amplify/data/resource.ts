import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { contactHandler } from '../functions/contact-handler/resource';
import { warrantyValidate } from '../functions/warranty-validate/resource';
import { warrantyRegister } from '../functions/warranty-register/resource';

/**
 * Authorization model
 * -------------------
 * The two tables hold customer PII, so nothing public can read them directly.
 * Visitors reach the data only through the three custom operations below, each
 * of which runs in a Lambda that returns a deliberately narrow shape.
 *
 * Guest access goes through the Cognito identity pool rather than an API key,
 * which also removes the expiring-API-key failure mode entirely.
 */
const schema = a.schema({
  Warranty: a
    .model({
      warrantyNumber: a.string().required(),
      productName: a.string().required(),
      manufactureDate: a.string(),
      status: a.string().required(),
      registrationDate: a.string(),
      customerName: a.string(),
      phone: a.string(),
      email: a.string(),
      purchaseDate: a.string(),
      purchaseCountry: a.string(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),

  ContactSubmission: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      region: a.string().required(),
      interest: a.string().required(),
      message: a.string().required(),
      status: a.string().default('PENDING'),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [allow.authenticated()]),

  /** Public-safe view of a warranty. Carries no customer PII by construction. */
  WarrantyStatus: a.customType({
    found: a.boolean().required(),
    warrantyNumber: a.string(),
    productName: a.string(),
    manufactureDate: a.string(),
    status: a.string(),
    registrationDate: a.string(),
    eligibleForRegistration: a.boolean(),
    message: a.string(),
  }),

  OperationResult: a.customType({
    success: a.boolean().required(),
    message: a.string().required(),
    warrantyNumber: a.string(),
  }),

  validateWarranty: a
    .query()
    .arguments({ warrantyNumber: a.string().required() })
    .returns(a.ref('WarrantyStatus'))
    .authorization((allow) => [allow.guest(), allow.authenticated()])
    .handler(a.handler.function(warrantyValidate)),

  registerWarranty: a
    .mutation()
    .arguments({
      warrantyNumber: a.string().required(),
      customerName: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      purchaseCountry: a.string(),
      purchaseDate: a.string(),
    })
    .returns(a.ref('OperationResult'))
    .authorization((allow) => [allow.guest(), allow.authenticated()])
    .handler(a.handler.function(warrantyRegister)),

  submitContact: a
    .mutation()
    .arguments({
      name: a.string().required(),
      email: a.string().required(),
      phone: a.string(),
      region: a.string().required(),
      interest: a.string().required(),
      message: a.string().required(),
      recaptchaToken: a.string().required(),
    })
    .returns(a.ref('OperationResult'))
    .authorization((allow) => [allow.guest(), allow.authenticated()])
    .handler(a.handler.function(contactHandler)),
}).authorization((allow) => [
  // The three Lambdas reach the tables on behalf of unauthenticated visitors.
  // Granted here because resource access is a schema-level rule in Gen 2.
  allow.resource(contactHandler),
  allow.resource(warrantyValidate),
  allow.resource(warrantyRegister),
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'identityPool',
  },
});
