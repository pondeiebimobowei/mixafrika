import { getSession } from './session';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type PageMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PagedResponse<T> = {
  rows: T[];
  meta: PageMeta;
};

export type QueryValue = string | number | boolean | null | undefined;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function buildSearchParams(params?: Record<string, QueryValue>) {
  const searchParams = new URLSearchParams();

  if (!params) {
    return searchParams;
  }

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === '') {
      continue;
    }

    searchParams.set(key, String(value));
  }

  return searchParams;
}

function normalizeErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'string') {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;

    if (typeof record.message === 'string') {
      return record.message;
    }

    if (Array.isArray(record.message) && record.message.length > 0) {
      return String(record.message[0]);
    }
  }

  return `Request failed (${status})`;
}

export async function request<T>(
  path: string,
  init?: RequestInit,
  query?: Record<string, QueryValue>,
): Promise<T> {
  const session = getSession();
  const searchParams = buildSearchParams(query);
  const suffix = searchParams.toString() ? `?${searchParams.toString()}` : '';

  const response = await fetch(`${API_BASE_URL}${path}${suffix}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    throw new Error(normalizeErrorMessage(payload, response.status));
  }

  return payload as T;
}

export function isPagedResponse<T>(value: unknown): value is PagedResponse<T> {
  return Boolean(
    value &&
      typeof value === 'object' &&
      'rows' in value &&
      'meta' in value &&
      Array.isArray((value as PagedResponse<T>).rows),
  );
}

export function unwrapPagedResponse<T>(payload: ApiResponse<T[] | PagedResponse<T>>) {
  if (isPagedResponse<T>(payload.data)) {
    return payload.data;
  }

  const rows = Array.isArray(payload.data) ? payload.data : [];

  return {
    rows,
    meta: {
      page: 1,
      limit: rows.length || 1,
      total: rows.length,
      totalPages: 1,
    },
  } satisfies PagedResponse<T>;
}
