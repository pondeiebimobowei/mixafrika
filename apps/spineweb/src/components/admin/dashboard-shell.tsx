import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { LayoutDashboard, ShieldCheck, Users, Building2, Activity } from 'lucide-react';
import { clearSession } from '#/lib/session';

const navItems = [
  { label: 'Overview', href: '#overview', icon: LayoutDashboard },
  { label: 'Users', href: '#users', icon: Users },
  { label: 'Businesses', href: '#businesses', icon: Building2 },
  { label: 'Verifications', href: '#verifications', icon: ShieldCheck },
  { label: 'Catalog', href: '/catalog', icon: Building2 },
  { label: 'Operations', href: '/operations', icon: Activity },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,208,122,0.22),_transparent_38%),linear-gradient(180deg,#0b1220_0%,#111827_48%,#f8fafc_48%,#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] gap-6 px-4 py-4 lg:px-6">
        <aside className="hidden w-72 shrink-0 rounded-3xl border border-white/15 bg-slate-950/85 p-5 text-white shadow-2xl shadow-slate-950/40 backdrop-blur lg:block">
          <div className="mb-10">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">Spine Admin</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Command center</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Operational control for users, businesses, verifications, and stock oversight.
            </p>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const className =
                'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white';

              if (item.href.startsWith('/')) {
                return (
                  <Link key={item.label} to={item.href} className={className}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              }

              return (
                <a key={item.label} href={item.href} className={className}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1">
          <header className="mb-6 rounded-[2rem] border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-200/70 backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  SpineWeb Admin Dashboard
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                  Monitor the platform from one place.
                </h2>
              </div>
              <div className="flex gap-3 text-sm">
                <Link
                  to="/"
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Refresh data
                </Link>
                <span className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white">
                  Admin role: Super Admin
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearSession();
                    window.location.assign('/login');
                  }}
                  className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
