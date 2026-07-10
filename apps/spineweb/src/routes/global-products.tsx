import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/global-products')({
  component: GlobalProductsPage,
});

function GlobalProductsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', description: '', barcode: '', image_url: '', product_category_id: '' });
  const [editForm, setEditForm] = useState({ name: '', description: '', barcode: '', image_url: '', product_category_id: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.globalProducts.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load global products'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (!selected) return;
    setEditForm({
      name: selected.name ?? '',
      description: selected.description ?? '',
      barcode: selected.barcode ?? '',
      image_url: selected.image_url ?? '',
      product_category_id: selected.product_category_id ?? '',
    });
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Global products"
        description="Manage the product master list that branches use to create inventory items."
        sidebar={
          <form
            className="border border-slate-200 bg-white p-4 shadow-sm space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await spineAdminApi.globalProducts.create(createForm);
              setCreateForm({ name: '', description: '', barcode: '', image_url: '', product_category_id: '' });
              await load();
            }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Create global product</h3>
            {Object.entries(createForm).map(([key, value]) => (
              <input
                key={key}
                className="w-full border border-slate-200 px-3 py-2"
                placeholder={key}
                value={value}
                onChange={(e) => setCreateForm((curr) => ({ ...curr, [key]: e.target.value }))}
              />
            ))}
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save product</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Global product list"
          description="Select a row to inspect and edit the product master record."
          rows={items}
          columns={['Name', 'Barcode', 'Category', 'Products']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
              <td className="px-4 py-3">{item.barcode ?? '—'}</td>
              <td className="px-4 py-3">{item.product_category?.name ?? '—'}</td>
              <td className="px-4 py-3">{item.products?.length ?? 0}</td>
            </>
          )}
        />
        <Drawer
          open={Boolean(selected)}
          title={selected?.name ?? 'Global product details'}
          subtitle={selected ? `${selected.barcode ?? 'No barcode'} • ${selected.products?.length ?? 0} linked products` : undefined}
          onClose={() => setSelectedId(null)}
        >
          {selected ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Description', selected.description],
                  ['Barcode', selected.barcode],
                  ['Image URL', selected.image_url],
                  ['Category', selected.product_category?.name ?? '—'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>

              <form
                className="border border-slate-200 p-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await spineAdminApi.globalProducts.update(selected.id, editForm);
                  await load();
                }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit global product</h4>
                {Object.entries(editForm).map(([key, value]) => (
                  <input
                    key={key}
                    className="w-full border border-slate-200 px-3 py-2"
                    placeholder={key}
                    value={value}
                    onChange={(e) => setEditForm((curr) => ({ ...curr, [key]: e.target.value }))}
                  />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button
                    type="button"
                    className="border border-slate-200 px-3 py-2 text-rose-600"
                    onClick={async () => {
                      await spineAdminApi.globalProducts.remove(selected.id);
                      setSelectedId(null);
                      await load();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </form>

              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Linked products</h4>
                <div className="mt-4 space-y-3">
                  {(selected.products ?? []).map((product: any) => (
                    <div key={product.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.category} · {product.branch?.name ?? 'No branch'}</p>
                    </div>
                  ))}
                  {(selected.products ?? []).length === 0 ? <p className="text-sm text-slate-500">No linked products.</p> : null}
                </div>
              </section>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
