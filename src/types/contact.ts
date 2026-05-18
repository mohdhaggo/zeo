export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  region: string;
  interest: string;
  message: string;
  recaptchaToken: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  region: string;
  interest: string;
  message: string;
  status: 'pending' | 'read' | 'replied';
  createdAt: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}