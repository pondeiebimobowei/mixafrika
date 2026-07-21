import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { AuthCard } from '#/components/auth/auth-card';
import { signup } from '#/lib/auth-api';
import { getSession, saveSession } from '#/lib/session';

export const Route = createFileRoute('/signup')({
  beforeLoad: () => {
    if (getSession()?.token) {
      throw redirect({ to: '/' });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone_number: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AuthCard
      eyebrow="Create admin access"
      title="Set up an admin account"
      description="Create an admin account for Spine operations, then use it to access the dashboard and moderation tools."
    >
      <form
        className="space-y-5"
        onSubmit={async (event) => {
          event.preventDefault();
          setLoading(true);
          setError(null);
          try {
            const response = await signup({
              ...form,
              role: 'admin',
            });
            saveSession({
              token: response.data.token,
              refreshToken: response.data.refresh_token ?? response.data.refreshToken ?? '',
              user: response.data.user,
            });
            window.location.assign('/');
          } catch (signupError) {
            setError(signupError instanceof Error ? signupError.message : 'Unable to sign up');
          } finally {
            setLoading(false);
          }
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="First name"
            value={form.first_name}
            onChange={(value) => setForm((current) => ({ ...current, first_name: value }))}
            placeholder="Ada"
          />
          <Field
            label="Last name"
            value={form.last_name}
            onChange={(value) => setForm((current) => ({ ...current, last_name: value }))}
            placeholder="Okafor"
          />
        </div>
        <Field
          label="Phone number"
          value={form.phone_number}
          onChange={(value) => setForm((current) => ({ ...current, phone_number: value }))}
          placeholder="08012345678"
        />
        <Field
          label="Email"
          value={form.email}
          onChange={(value) => setForm((current) => ({ ...current, email: value }))}
          placeholder="admin@spine.app"
          type="email"
        />
        <Field
          label="Password"
          value={form.password}
          onChange={(value) => setForm((current) => ({ ...current, password: value }))}
          placeholder="••••••••"
          type="password"
        />

        {error ? (
          <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-500 px-4 py-3 font-medium text-slate-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="text-sm text-slate-500">
          Already have access?{' '}
          <Link to="/login" className="font-medium text-amber-700">
            Sign in
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type={type}
        className="w-full border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-500"
        placeholder={placeholder}
        required
      />
    </div>
  );
}
