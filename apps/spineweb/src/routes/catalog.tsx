import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { ModulePage } from '#/components/admin/module-page';
import { entityApi } from '#/lib/entity-api';

export const Route = createFileRoute('/catalog')({
  component: CatalogRoute,
});

function CatalogRoute() {
  const [products, setProducts] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({ name: '', branch_id: '', description: '' });

  const load = async () => {
    try {
      const [productRes, batchRes] = await Promise.all([entityApi.products.list(), entityApi.batches.list()]);
      setProducts(productRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalog');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardShell>
      <ModulePage
        title="Catalog management"
        description="Manage branch products and stock batches with create, edit, and delete actions."
        sidebar={
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">Create product</h3>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                await entityApi.products.create({
                  ...productForm,
                  bulk_unit_name: 'box',
                  piece_unit_name: 'piece',
                  units_per_bulk: 1,
                  selling_price_per_piece: 0,
                  selling_price_per_bulk: 0,
                  category: 'general',
                  image_url: '',
                  reviews: '',
                  sync_status: 'completed',
                  sync_date: new Date().toISOString(),
                });
                setProductForm({ name: '', branch_id: '', description: '' });
                await load();
              }}
            >
              <input className="w-full rounded-xl border px-3 py-2" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))} />
              <input className="w-full rounded-xl border px-3 py-2" placeholder="Branch ID" value={productForm.branch_id} onChange={(e) => setProductForm((s) => ({ ...s, branch_id: e.target.value }))} />
              <textarea className="w-full rounded-xl border px-3 py-2" placeholder="Description" value={productForm.description} onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))} />
              <button className="w-full rounded-xl bg-slate-950 px-4 py-2 text-white">Save product</button>
            </form>
          </div>
        }
      >
        {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Section title="Products" items={products} onDelete={async (id) => { await entityApi.products.remove(id); await load(); }} />
        <div className="mt-8">
          <Section title="Batches" items={batches} onDelete={async (id) => { await entityApi.batches.remove(id); await load(); }} />
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
            <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3">{item.name ?? item.batch_number}</td>
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
