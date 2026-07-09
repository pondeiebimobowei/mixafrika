const TOKEN_KEY = 'spine_admin_token';
const REFRESH_KEY = 'spine_admin_refresh_token';
const USER_KEY = 'spine_admin_user';

export type SessionUser = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

export function getSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = window.localStorage.getItem(TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_KEY);
  const userRaw = window.localStorage.getItem(USER_KEY);

  return {
    token,
    refreshToken,
    user: userRaw ? (JSON.parse(userRaw) as SessionUser) : null,
  };
}

export function saveSession(session: {
  token: string;
  refreshToken: string;
  user: SessionUser | null;
}) {
  window.localStorage.setItem(TOKEN_KEY, session.token);
  window.localStorage.setItem(REFRESH_KEY, session.refreshToken);
  if (session.user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
}

export function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  window.localStorage.removeItem(USER_KEY);
}
