/**
 * Admin API client.
 *
 * Requests are authenticated by the Cloudflare Access cookie the browser
 * already holds, so there is no token handling here. A 401 means Access did not
 * authorise the caller, which the UI surfaces rather than silently retrying.
 */
export interface WarrantyRecord {
  id: string;
  warrantyNumber: string;
  productName: string;
  manufactureDate?: string;
  status: string;
  registrationDate?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  purchaseDate?: string;
  purchaseCountry?: string;
  createdAt?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  region: string;
  interest: string;
  message: string;
  status: string;
  createdAt: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    credentials: 'same-origin',
  });

  if (response.status === 401) {
    throw new Error('Your session has expired. Reload the page to sign in again.');
  }

  const body = (await response.json().catch(() => ({}))) as { error?: string } & T;
  if (!response.ok) {
    throw new Error(body.error || `Request failed (${response.status})`);
  }
  return body;
}

export const adminApi = {
  listWarranties: () =>
    request<{ data: WarrantyRecord[] }>('/api/admin/warranties').then((r) => r.data),

  createWarranty: (record: Partial<WarrantyRecord>) =>
    request<{ id: string }>('/api/admin/warranties', {
      method: 'POST',
      body: JSON.stringify(record),
    }),

  updateWarranty: (id: string, changes: Partial<WarrantyRecord>) =>
    request<{ success: boolean }>(`/api/admin/warranties/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(changes),
    }),

  deleteWarranty: (id: string) =>
    request<{ success: boolean }>(`/api/admin/warranties/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }),

  listContacts: () =>
    request<{ data: ContactSubmission[] }>('/api/admin/contacts').then((r) => r.data),

  setContactStatus: (id: string, status: string) =>
    request<{ success: boolean }>(`/api/admin/contacts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
