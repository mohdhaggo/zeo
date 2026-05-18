import { ContactFormData, ContactResponse, ContactSubmission } from '../types/contact';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const contactService = {
  async submitContact(formData: ContactFormData): Promise<ContactResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit contact form');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },
  
  // For dashboard - to fetch contact submissions (admin only)
  async getContactSubmissions(limit: number = 100, status?: string): Promise<ContactSubmission[]> {
    try {
      const url = new URL(`${API_BASE_URL}/contact/submissions`);
      url.searchParams.append('limit', limit.toString());
      if (status) url.searchParams.append('status', status);
      
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch submissions');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching submissions:', error);
      throw error;
    }
  },
  
  // Update submission status (admin only)
  async updateSubmissionStatus(submissionId: string, status: 'pending' | 'read' | 'replied'): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/contact/submissions/${submissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update submission status');
      }
    } catch (error) {
      console.error('Error updating submission:', error);
      throw error;
    }
  }
};