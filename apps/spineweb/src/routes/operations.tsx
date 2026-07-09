import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { ModulePage } from '#/components/admin/module-page';
import { entityApi } from '#/lib/entity-api';

export const Route = createFileRoute('/operations')({
  component: OperationsRoute,
});

function OperationsRoute() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [inventoryRes, salesRes] = await Promise.all([entityApi.inventory.list(), entityApi.sales.list()]);
      setInventory(inventoryRes.data);
      setSales(salesRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load operations');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <ModulePage
        title="Operations management"
        description="Inspect inventory, stock movement, and sales with CRUD actions."
        sidebar={
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-600">
            Inventory, sales, and batch records now load from their own modules instead of crowding the home page.
          </div>
        }
      >
        {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Section title="Inventory" items={inventory} onDelete={async (id) => { await entityApi.inventory.remove(id); await load(); }} />
        <div className="mt-8">
          <Section title="Sales" items={sales} onDelete={async (id) => { await entityApi.sales.remove(id); await load(); }} />
        </div>
      </ModulePage>
    </DashboardShell>
  );
}

function Section({ title, items, onDelete }: { title: string; items: any[]; onDelete: (id: string) => Promise<void> }) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-slate-950">{title}</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3">{item.quantity ?? item.total_amount}</td>
                <td className="px-4 py-3">
                  <button className="rounded-lg border px-3 py-1" onClick={() => onDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
