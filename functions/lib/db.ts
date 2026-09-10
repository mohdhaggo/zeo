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

/**
 * The columns the public lookup is allowed to read.
 *
 * Typed as its own thing so the query and the projection agree: a caller that
 * has not selected the PII columns cannot accidentally be handed a function
 * that returns them.
 */
export type PublicWarrantyRow = Pick<
  WarrantyRow,
  'warranty_number' | 'product_name' | 'manufacture_date' | 'status' | 'registration_date'
>;

/** Public-safe projection: never includes customer name, phone or email. */
export function warrantyToPublicJson(row: PublicWarrantyRow) {
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

/**
 * The JSON response every public endpoint returns.
 *
 * Headers live here rather than at each call site. The warranty lookup used to
 * return a bare response, so a browser or an intermediary was free to cache
 * {"eligibleForRegistration": true} heuristically - and then keep showing the
 * pre-registration answer to a customer who had already registered, or serve
 * one visitor's lookup to the next on a shared machine.
 */
export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
    },
  });
}

/** Crypto-random id, replacing the ids DynamoDB used to generate. */
export function newId(): string {
  return crypto.randomUUID();
}
