import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { LayoutDashboard, ShieldCheck, Users, Building2, Activity, ChevronLeft, Sparkles } from 'lucide-react';
import { clearSession } from '#/lib/session';

const navItems = [
  { label: 'Overview', href: '#overview', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Businesses', href: '/businesses', icon: Building2 },
  { label: 'Verifications', href: '/verifications', icon: ShieldCheck },
  { label: 'Catalog', href: '/catalog', icon: Building2 },
  { label: 'Operations', href: '/operations', icon: Activity },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4f6f2] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-[1640px] gap-5 px-4 py-4 lg:px-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:flex lg:flex-col">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1f6f4a] text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#1f6f4a]">Spine Admin</p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Operations hub</h1>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Dedicated workspaces for analytics, users, businesses, catalog, inventory, and verifications.
            </p>
          </div>

          <nav className="flex-1 space-y-1 overflow-auto p-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const className =
                'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition';

              if (item.href.startsWith('/')) {
                return (
                  <Link key={item.label} to={item.href} className={`${className} text-slate-600 hover:bg-[#e9f4ee] hover:text-[#1f6f4a]`}>
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <ChevronLeft className="h-4 w-4 opacity-0" />
                  </Link>
                );
              }

              return (
                <a key={item.label} href={item.href} className={`${className} text-slate-600 hover:bg-[#e9f4ee] hover:text-[#1f6f4a]`}>
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <span className="text-xs uppercase tracking-[0.25em] text-slate-400">Local</span>
                </a>
              );
            })}
          </nav>

          <div className="border-t border-slate-100 p-4">
            <button
              type="button"
              onClick={() => {
                clearSession();
                window.location.assign('/login');
              }}
              className="flex w-full items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Sign out
              <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-white">
                Exit
              </span>
            </button>
          </div>
        </aside>

        <main className="flex-1 pb-8">
          <header className="mb-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col gap-5 border-b border-slate-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,249,245,0.95))] p-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#1f6f4a]">
                  SpineWeb Admin Console
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 lg:text-[2rem]">
                  Focused workspaces for each operational domain
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  The interface is intentionally split so analytics, user management, business management,
                  catalog, inventory, and compliance each get their own task-oriented page.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-sm">
                <Link
                  to="/"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-[#1f6f4a] hover:text-[#1f6f4a]"
                >
                  Overview
                </Link>
                <span className="rounded-full bg-[#1f6f4a] px-4 py-2 font-medium text-white">
                  Super Admin
                </span>
              </div>
            </div>
            <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Users', 'CRUD + details'],
                ['Businesses', 'CRUD + associations'],
                ['Catalog', 'Products + batches'],
                ['Operations', 'Inventory + sales'],
              ].map(([label, hint]) => (
                <div key={label} className="rounded-[1.25rem] border border-slate-200 bg-[#f8faf8] p-4">
                  <p className="text-sm font-medium text-slate-950">{label}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.25em] text-slate-500">{hint}</p>
                </div>
              ))}
            </div>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
