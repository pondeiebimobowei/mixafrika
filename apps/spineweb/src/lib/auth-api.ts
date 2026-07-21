const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3003';

async function request<T>(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json()) as T;

  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'Request failed');
  }

  return data;
}

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    token: string;
    refresh_token?: string;
    refreshToken?: string;
    user: {
      id?: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      role?: string;
    } | null;
  };
};

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>('/v1/auth/login', payload);
}

export function signup(payload: {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: 'admin' | 'subadmin' | 'agent' | 'trader' | 'investor';
  password: string;
}) {
  return request<AuthResponse>('/v1/auth/signup', payload);
}
