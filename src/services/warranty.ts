import { generateClient } from 'aws-amplify/api';

const client = generateClient<any>();

export interface WarrantyData {
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  purchaseDate: string;
  warrantyNumber: string;
}

export const warrantyService = {
  async validateWarranty(warrantyNumber: string) {
    try {
      const { data, errors } = await client.models.Warranty.list({
        filter: { warrantyNumber: { eq: warrantyNumber } }
      });
      
      if (errors) throw new Error(errors[0].message);
      return data?.[0] || null;
    } catch (error) {
      console.error('Error validating warranty:', error);
      throw error;
    }
  },

  async registerWarranty(data: WarrantyData) {
    try {
      const { data: result, errors } = await client.models.Warranty.create({
        ...data,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      });
      
      if (errors) throw new Error(errors[0].message);
      return result;
    } catch (error) {
      console.error('Error registering warranty:', error);
      throw error;
    }
  }
};