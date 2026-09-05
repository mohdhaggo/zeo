/**
 * D1 row mapping.
 *
 * The database uses snake_case; the admin UI already speaks camelCase. Mapping
 * here keeps the SQL idiomatic without rewriting the dashboard's shapes.
 */
export interface WarrantyRow {
  id: string;
  warranty_number: string;
  product_name: string;
  manufacture_date: string | null;
  status: string;
  registration_date: string | null;
  customer_name: string | null;
  phone: string | null;
  email: string | null;
  purchase_date: string | null;
  purchase_country: string | null;
  created_at: string;
}

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  region: string;
  interest: string;
  message: string;
  status: string;
  created_at: string;
}

export function warrantyToJson(row: WarrantyRow) {
  return {
    id: row.id,
    warrantyNumber: row.warranty_number,
    productName: row.product_name,
    manufactureDate: row.manufacture_date ?? undefined,
    status: row.status,
    registrationDate: row.registration_date ?? undefined,
    customerName: row.customer_name ?? undefined,
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    purchaseDate: row.purchase_date ?? undefined,
    purchaseCountry: row.purchase_country ?? undefined,
    createdAt: row.created_at,
  };
}

/** Public-safe projection: never includes customer name, phone or email. */
export function warrantyToPublicJson(row: WarrantyRow) {
  return {
    found: true,
    warrantyNumber: row.warranty_number,
    productName: row.product_name,
    manufactureDate: row.manufacture_date ?? undefined,
    status: row.status,
    registrationDate: row.registration_date ?? undefined,
    eligibleForRegistration: row.status === 'UNREGISTERED',
  };
}

export function contactToJson(row: ContactRow) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone ?? undefined,
    region: row.region,
    interest: row.interest,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Crypto-random id, replacing the ids DynamoDB used to generate. */
export function newId(): string {
  return crypto.randomUUID();
}
