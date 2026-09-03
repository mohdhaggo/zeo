import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { contactHandler } from './functions/contact-handler/resource';
import { warrantyValidate } from './functions/warranty-validate/resource';
import { warrantyRegister } from './functions/warranty-register/resource';

const backend = defineBackend({
  auth,
  data,
  contactHandler,
  warrantyValidate,
  warrantyRegister,
});

export default backend;
