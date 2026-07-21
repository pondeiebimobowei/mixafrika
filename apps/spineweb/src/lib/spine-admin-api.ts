import { request, type ApiResponse, type QueryValue } from './api-request';

const toBody = (payload: Record<string, unknown>) => JSON.stringify(payload);

export const spineAdminApi = {
  products: {
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/products/${id}`),
  },
  globalProducts: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/global-products', undefined, query),
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
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/product-categories', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/product-categories/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/product-categories', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/product-categories/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/product-categories/${id}`, { method: 'DELETE' }),
  },
  branches: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/branches', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/branches/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/branches', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/branches/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/branches/${id}`, { method: 'DELETE' }),
  },
  customers: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/customers', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/customers/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/customers', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/customers/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/customers/${id}`, { method: 'DELETE' }),
  },
  businessUsers: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/business-users', undefined, query),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/business-users', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/business-users/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/business-users/${id}`, { method: 'DELETE' }),
  },
  branchUsers: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/branch-users', undefined, query),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/branch-users', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/branch-users/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/branch-users/${id}`, { method: 'DELETE' }),
  },
  salesItems: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/sales-items', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/sales-items/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/sales-items', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/sales-items/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/sales-items/${id}`, { method: 'DELETE' }),
  },
  stockMovements: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/stock-movements', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/stock-movements/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/stock-movements', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/stock-movements/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/stock-movements/${id}`, { method: 'DELETE' }),
  },
  stockTransfers: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/stock-transfers', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/stock-transfers/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/stock-transfers', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/stock-transfers/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/stock-transfers/${id}`, { method: 'DELETE' }),
  },
  payments: {
    list: (query?: Record<string, QueryValue>) => request<ApiResponse<any>>('/v1/admin/spine/payments', undefined, query),
    get: (id: string) => request<ApiResponse<any>>(`/v1/admin/spine/payments/${id}`),
    create: (payload: Record<string, unknown>) =>
      request<ApiResponse<any>>('/v1/admin/spine/payments', { method: 'POST', body: toBody(payload) }),
    update: (id: string, payload: Record<string, unknown>) =>
      request<ApiResponse<any>>(`/v1/admin/spine/payments/${id}`, { method: 'PATCH', body: toBody(payload) }),
    remove: (id: string) => request<ApiResponse<null>>(`/v1/admin/spine/payments/${id}`, { method: 'DELETE' }),
  },
};
