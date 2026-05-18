export interface WarrantyRecord {
  id: string;
  warrantyId: string;
  productType: string;
  customerName: string;
  email: string;
  phone: string;
  purchaseCountry: string;
  purchaseDate: string;
  registrationDate: string | null;
  status: 'ACTIVE' | 'EXPIRED' | 'CLAIMED' | 'PENDING';
  validUntil: string;
}

export interface WarrantyValidationResult {
  isValid: boolean;
  record?: WarrantyRecord;
  message: string;
  isEligibleForRegistration: boolean;
}

export interface WarrantyRegistrationData {
  warrantyId: string;
  customerName: string;
  email: string;
  phone: string;
  purchaseCountry: string;
  purchaseDate: string;
}