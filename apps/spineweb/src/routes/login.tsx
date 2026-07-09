import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { AuthCard } from '#/components/auth/auth-card';
import { login } from '#/lib/auth-api';
import { getSession, saveSession } from '#/lib/session';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (getSession()?.token) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthCard
      eyebrow="Secure access"
      title="Sign in to Spine Admin"
      description="Use your admin credentials to access moderation, operations, and dashboard controls."
    >
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          try {
            const response = await login({ email, password });
            saveSession({
              token: response.data.token,
              refreshToken: response.data.refresh_token ?? response.data.refreshToken ?? '',
              user: response.data.user,
            });
            window.location.assign('/');
          } catch (loginError) {
            setError(loginError instanceof Error ? loginError.message : 'Unable to login');
          } finally {
            setLoading(false);
          }
        }}
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-500"
            placeholder="admin@spine.app"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-500"
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="text-sm text-slate-500">
          Need an account?{' '}
          <Link to="/signup" className="font-medium text-amber-700">
            Create one
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
