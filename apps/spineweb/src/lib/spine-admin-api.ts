import { getSession } from './session';

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

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

const toBody = (payload: Record<string, unknown>) => JSON.stringify(payload);

export const spineAdminApi = {
  products: {
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/products/${id}`),
  },
  globalProducts: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/global-products'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/global-products/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/global-products', {
        method: 'POST',
        body: toBody(payload),
      }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/global-products/${id}`, {
        method: 'PATCH',
        body: toBody(payload),
      }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/global-products/${id}`, { method: 'DELETE' }),
  },
  productCategories: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/product-categories'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/product-categories/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/product-categories', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/product-categories/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/product-categories/${id}`, { method: 'DELETE' }),
  },
  branches: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/branches'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/branches/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/branches', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/branches/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/branches/${id}`, { method: 'DELETE' }),
  },
  customers: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/customers'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/customers/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/customers', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/customers/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/customers/${id}`, { method: 'DELETE' }),
  },
  businessUsers: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/business-users'),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/business-users', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/business-users/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/business-users/${id}`, { method: 'DELETE' }),
  },
  branchUsers: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/branch-users'),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/branch-users', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/branch-users/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/branch-users/${id}`, { method: 'DELETE' }),
  },
  salesItems: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/sales-items'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/sales-items/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/sales-items', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/sales-items/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/sales-items/${id}`, { method: 'DELETE' }),
  },
  stockMovements: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/stock-movements'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/stock-movements/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/stock-movements', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/stock-movements/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/stock-movements/${id}`, { method: 'DELETE' }),
  },
  stockTransfers: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/stock-transfers'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/stock-transfers/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/stock-transfers', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/stock-transfers/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/stock-transfers/${id}`, { method: 'DELETE' }),
  },
  payments: {
    list: () => request<ApiResponse<any[]>>('/v1/admin/spine/payments'),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/payments/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/payments', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/payments/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/payments/${id}`, { method: 'DELETE' }),
  },
};
