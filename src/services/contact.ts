import { generateClient } from 'aws-amplify/api';

const client = generateClient<any>();

export const contactService = {
  async submitContact(formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
    recaptchaToken: string;
  }) {
    try {
      // Store in database
      const { data, errors } = await client.models.ContactSubmission.create({
        ...formData,
        createdAt: new Date().toISOString()
      });
      
      if (errors) throw new Error(errors[0].message);
      
      // Send email via Lambda function
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) throw new Error('Failed to send email');
      
      return data;
    } catch (error) {
      console.error('Error submitting contact:', error);
      throw error;
    }
  }
};