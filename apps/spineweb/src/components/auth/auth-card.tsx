import type { ReactNode } from 'react';

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.16),_transparent_30%),linear-gradient(180deg,#0f172a_0%,#111827_44%,#f8fafc_44%,#f8fafc_100%)] px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border border-white/10 bg-slate-950/90 p-8 text-white shadow-2xl shadow-slate-950/40">
            <p className="text-xs uppercase tracking-[0.35em] text-amber-300/80">{eyebrow}</p>
            <h1 className="mt-5 max-w-xl text-5xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">{description}</p>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['RBAC', 'Role-aware admin access'],
                ['Audit', 'Operational accountability'],
                ['Oversight', 'Data-driven support desk'],
              ].map(([label, hint]) => (
                <div key={label} className="border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-medium text-amber-200">{label}</p>
                  <p className="mt-2 text-sm text-slate-300">{hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
