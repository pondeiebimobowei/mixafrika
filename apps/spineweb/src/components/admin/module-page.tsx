import type { ReactNode } from 'react';

export function ModulePage({
  title,
  description,
  sidebar,
  children,
}: {
  title: string;
  description: string;
  sidebar?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {children}
      </section>
      <aside className="space-y-4">{sidebar}</aside>
    </div>
  );
}
