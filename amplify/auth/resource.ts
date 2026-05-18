import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: {
      required: true,
    },
  },
  multifactor: {
    mode: 'OPTIONAL',
    email: true,
  },
  senders: {
    email: {
      fromEmail: 'noreply@yourdomain.com', // Replace with your verified email
      fromName: 'Zeo Shields',
    },
  },
});