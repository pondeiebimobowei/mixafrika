import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/sales-items')({
  component: SalesItemsPage,
});

function SalesItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    sale_id: '',
    product_id: '',
    batch_id: '',
    name: '',
    quantity: '1',
    type: 'product',
    unit_price: '0',
    cost_price: '0',
    total: '0',
    description: '',
  });
  const [editForm, setEditForm] = useState<any>(createForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.salesItems.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load sales items'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({
        sale_id: selected.sale_id ?? '',
        product_id: selected.product_id ?? '',
        batch_id: selected.batch_id ?? '',
        name: selected.name ?? '',
        quantity: String(selected.quantity ?? 1),
        type: selected.type ?? 'product',
        unit_price: String(selected.unit_price ?? 0),
        cost_price: String(selected.cost_price ?? 0),
        total: String(selected.total ?? 0),
        description: selected.description ?? '',
      });
    }
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Sales items"
        description="Manage the line items that make up a sale."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.salesItems.create({ ...createForm, quantity: Number(createForm.quantity), unit_price: Number(createForm.unit_price), cost_price: Number(createForm.cost_price), total: Number(createForm.total) }); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create sales item</h3>
            {['sale_id', 'product_id', 'batch_id', 'name', 'quantity', 'type', 'unit_price', 'cost_price', 'total', 'description'].map((field) => (
              <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(createForm as any)[field]} onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))} />
            ))}
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save item</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Sales item list"
          description="Select a sales item to inspect its line-level data."
          rows={items}
          columns={['Name', 'Sale', 'Type', 'Total']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
              <td className="px-4 py-3">{item.sale?.id ?? item.sale_id}</td>
              <td className="px-4 py-3">{item.type}</td>
              <td className="px-4 py-3">{item.total}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.name ?? 'Sales item details'} subtitle={selected ? `${selected.type} • ${selected.total}` : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Quantity', selected.quantity],
                  ['Unit price', selected.unit_price],
                  ['Cost price', selected.cost_price],
                  ['Description', selected.description],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.salesItems.update(selected.id, { ...editForm, quantity: Number(editForm.quantity), unit_price: Number(editForm.unit_price), cost_price: Number(editForm.cost_price), total: Number(editForm.total) }); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit sales item</h4>
                {['sale_id', 'product_id', 'batch_id', 'name', 'quantity', 'type', 'unit_price', 'cost_price', 'total', 'description'].map((field) => (
                  <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(editForm as any)[field]} onChange={(e) => setEditForm((curr: any) => ({ ...curr, [field]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.salesItems.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
