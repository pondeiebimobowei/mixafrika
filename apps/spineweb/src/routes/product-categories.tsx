import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/product-categories')({
  component: ProductCategoriesPage,
});

function ProductCategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: '' });
  const [editForm, setEditForm] = useState({ name: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.productCategories.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load product categories'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) setEditForm({ name: selected.name ?? '' });
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Product categories"
        description="Organize global products into reusable catalog categories."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.productCategories.create(createForm); setCreateForm({ name: '' }); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create category</h3>
            <input className="w-full border border-slate-200 px-3 py-2" placeholder="name" value={createForm.name} onChange={(e) => setCreateForm({ name: e.target.value })} />
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save category</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Category list"
          description="Select a row to inspect linked global products."
          rows={items}
          columns={['Name', 'Linked products']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
              <td className="px-4 py-3">{item.global_products ?? item.globalProducts ?? 0}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.name ?? 'Category details'} subtitle={selected ? `${selected.global_products ?? 0} global products` : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="border border-slate-200 p-3">
                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">Category name</p>
                <p className="mt-1 text-sm font-medium text-slate-950">{selected.name}</p>
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.productCategories.update(selected.id, editForm); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit category</h4>
                <input className="w-full border border-slate-200 px-3 py-2" placeholder="name" value={editForm.name} onChange={(e) => setEditForm({ name: e.target.value })} />
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.productCategories.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Linked global products</h4>
                <div className="mt-4 space-y-3">
                  {(selected.global_products ?? selected.globalProducts ?? []).map((product: any) => (
                    <div key={product.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.barcode ?? 'No barcode'}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
