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

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

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

export async function getUsers() {
  return request<ApiResponse<AdminUser[]>>('/v1/admin/users');
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

export async function getBusinesses() {
  return request<ApiResponse<AdminBusiness[]>>('/v1/admin/businesses');
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

export async function getUserVerifications() {
  return request<ApiResponse<AdminVerification[]>>('/v1/admin/verifications/users');
}

export async function getBusinessVerifications() {
  return request<ApiResponse<AdminVerification[]>>('/v1/admin/verifications/businesses');
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
