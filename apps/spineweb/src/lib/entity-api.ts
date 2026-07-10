import { request, type ApiResponse, type QueryValue } from './api-request';

export const entityApi = {
  products: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/product', undefined, query),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/product', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/product/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/product/${id}`, { method: 'DELETE' }),
  },
  batches: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/batch', undefined, query),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/batch', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/batch/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/batch/${id}`, { method: 'DELETE' }),
  },
  inventory: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/inventory', undefined, query),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/inventory', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/inventory/${id}`, { method: 'DELETE' }),
  },
  sales: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/sales', undefined, query),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/sales', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/sales/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    remove: (id: string) => request<ApiResponse<void>>(`/sales/${id}`, { method: 'DELETE' }),
  },
};
