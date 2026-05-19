
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // Warranty model
  Warranty: a.model({
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
  .authorization(allow => [
    allow.owner(),
    allow.authenticated()
  ]),

  // Contact submission model
  ContactSubmission: a.model({
    name: a.string().required(),
    email: a.string().required(),
    phone: a.string(),
    region: a.string().required(),
    interest: a.string().required(),
    message: a.string().required(),
    status: a.string().default('PENDING'),
    createdAt: a.datetime(),
  })
  .authorization(allow => [
    allow.owner(),
    allow.authenticated()
  ]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
