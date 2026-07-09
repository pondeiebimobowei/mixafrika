import { createFileRoute } from '@tanstack/react-router';
import { ChartLine, Building2, Users, Boxes } from 'lucide-react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { MetricCard } from '#/components/admin/metric-card';

export const Route = createFileRoute('/')({
  component: OverviewPage,
});

function OverviewPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">Overview</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            Analytics only. Operational work lives in dedicated entity pages so the dashboard stays readable.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Users" value="—" hint="Open the Users page for management" icon={<Users className="h-5 w-5" />} />
          <MetricCard label="Businesses" value="—" hint="Open the Businesses page for management" icon={<Building2 className="h-5 w-5" />} />
          <MetricCard label="Products" value="—" hint="Open the Catalog page for management" icon={<Boxes className="h-5 w-5" />} />
          <MetricCard label="Trend" value="—" hint="Charts will sit here once metrics are wired" icon={<ChartLine className="h-5 w-5" />} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card title="Charts and time series" text="Add sales, stock, and verification charts here when the metrics endpoint is ready." />
          <Card title="Quick access" text="Use the sidebar to jump directly to Users, Businesses, Catalog, Operations, and Verifications." />
        </section>
      </div>
    </DashboardShell>
  );
}

function Card({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </article>
  );
}
