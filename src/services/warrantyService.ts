import { WarrantyRecord, WarrantyValidationResult, WarrantyRegistrationData } from '../types/warranty';

// API endpoints (will be configured after backend setup)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const warrantyService = {
  // Validate warranty by ID
  async validateWarranty(warrantyId: string): Promise<WarrantyValidationResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/validate/${warrantyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to validate warranty');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error validating warranty:', error);
      throw error;
    }
  },
  
  // Register a new warranty
  async registerWarranty(data: WarrantyRegistrationData): Promise<WarrantyRecord> {
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register warranty');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering warranty:', error);
      throw error;
    }
  },
  
  // Get warranty by ID
  async getWarrantyById(warrantyId: string): Promise<WarrantyRecord | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/warranty/${warrantyId}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch warranty');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching warranty:', error);
      throw error;
    }
  }
};