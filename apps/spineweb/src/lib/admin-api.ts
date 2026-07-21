import { request, type ApiResponse, type QueryValue } from './api-request';

export type AdminOverview = {
  users: {
    total: number;
    verified: number;
    pendingVerification: number;
    unverified: number;
  };
  businesses: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  activity: {
    pendingUserVerifications: number;
    pendingBusinessVerifications: number;
    totalBranches: number;
    totalCustomers: number;
  };
};

export type AdminUser = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  is_verified: boolean;
  createdAt: string;
  verification?: unknown;
  businesses?: unknown[];
  branches?: unknown[];
};

export type AdminBusiness = {
  id: string;
  name: string;
  type: string;
  city: string;
  state: string;
  country: string;
  is_verified: boolean;
  createdAt: string;
  verification?: unknown;
  users?: unknown[];
  branches?: unknown[];
};

export type AdminVerification = {
  id: string;
  status: string;
  rejection_reason?: string;
  submitted_at?: string;
  reviewed_at?: string;
  user_id?: string;
  business_id?: string;
};

export async function getOverview() {
  return request<ApiResponse<AdminOverview>>('/v1/admin/dashboard/overview');
}

export async function getUsers(query?: Record<string, QueryValue>) {
  return request<ApiResponse<any>>('/v1/admin/users', undefined, query);
}

export async function getUser(id: string) {
  return request<ApiResponse<AdminUser>>(`/v1/admin/users/${id}`);
}

export async function createUser(payload: Record<string, unknown>) {
  return request<ApiResponse<AdminUser>>('/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateUser(id: string, payload: Record<string, unknown>) {
  return request<ApiResponse<AdminUser>>(`/v1/admin/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(id: string) {
  return request<ApiResponse<null>>(`/v1/admin/users/${id}`, {
    method: 'DELETE',
  });
}

export async function getBusinesses(query?: Record<string, QueryValue>) {
  return request<ApiResponse<any>>('/v1/admin/businesses', undefined, query);
}

export async function getBusiness(id: string) {
  return request<ApiResponse<AdminBusiness>>(`/v1/admin/businesses/${id}`);
}

export async function createBusiness(payload: Record<string, unknown>) {
  return request<ApiResponse<AdminBusiness>>('/v1/admin/businesses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateBusiness(id: string, payload: Record<string, unknown>) {
  return request<ApiResponse<AdminBusiness>>(`/v1/admin/businesses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteBusiness(id: string) {
  return request<ApiResponse<null>>(`/v1/admin/businesses/${id}`, {
    method: 'DELETE',
  });
}

export async function getUserVerifications(query?: Record<string, QueryValue>) {
  return request<ApiResponse<any>>('/v1/admin/verifications/users', undefined, query);
}

export async function getBusinessVerifications(query?: Record<string, QueryValue>) {
  return request<ApiResponse<any>>('/v1/admin/verifications/businesses', undefined, query);
}

export async function reviewUserVerification(
  verificationId: string,
  payload: { status: string; rejection_reason?: string },
) {
  return request(`/v1/admin/verifications/users/${verificationId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function reviewBusinessVerification(
  verificationId: string,
  payload: { status: string; rejection_reason?: string },
) {
  return request(`/v1/admin/verifications/businesses/${verificationId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}
