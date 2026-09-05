/**
 * D1 row mapping.
 *
 * The database uses snake_case. Only the public projection lives here; the
 * admin console keeps its own copy in the zeoshields-admin repository.
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
