import { getSession } from './session';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3003';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const session = getSession();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message ?? `Request failed (${response.status})`);
  }

  return data as T;
}

type ApiResponse<T> = { success: boolean; message: string; data: T };

export const entityApi = {
  products: {
    list: () => request<ApiResponse<any[]>>('/product'),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/product', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/product/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/product/${id}`, { method: 'DELETE' }),
  },
  batches: {
    list: () => request<ApiResponse<any[]>>('/batch'),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/batch', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/batch/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/batch/${id}`, { method: 'DELETE' }),
  },
  inventory: {
    list: () => request<ApiResponse<any[]>>('/inventory'),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/inventory', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/inventory/${id}`, { method: 'DELETE' }),
  },
  sales: {
    list: () => request<ApiResponse<any[]>>('/sales'),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/sales', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/sales/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/sales/${id}`, { method: 'DELETE' }),
  },
};
