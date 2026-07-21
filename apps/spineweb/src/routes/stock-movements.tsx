import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';
import { getSession } from '#/lib/session';

export const Route = createFileRoute('/stock-movements')({
  component: StockMovementsPage,
});

function StockMovementsPage() {
  const session = getSession();
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    type: 'purchase',
    quantity: '1',
    reference_id: '',
    note: '',
    product_id: '',
    branch_id: '',
    batch_id: '',
    created_by_id: session?.user?.id ?? '',
  });
  const [editForm, setEditForm] = useState<any>(createForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.stockMovements.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stock movements'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({
        type: selected.type ?? 'purchase',
        quantity: String(selected.quantity ?? 1),
        reference_id: selected.reference_id ?? '',
        note: selected.note ?? '',
        product_id: selected.product_id ?? '',
        branch_id: selected.branch_id ?? '',
        batch_id: selected.batch_id ?? '',
        created_by_id: selected.created_by_id ?? session?.user?.id ?? '',
      });
    }
  }, [selected, session?.user?.id]);

  return (
    <DashboardShell>
      <ModulePage
        title="Stock movements"
        description="Track all inventory inflow, outflow, and adjustments."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.stockMovements.create({ ...createForm, quantity: Number(createForm.quantity) }); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create stock movement</h3>
            {['type', 'quantity', 'reference_id', 'note', 'product_id', 'branch_id', 'batch_id', 'created_by_id'].map((field) => (
              <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(createForm as any)[field]} onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))} />
            ))}
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save movement</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Stock movement list"
          description="Select a row to inspect product and branch movement details."
          rows={items}
          columns={['Type', 'Quantity', 'Product', 'Branch']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.type}</td>
              <td className="px-4 py-3">{item.quantity}</td>
              <td className="px-4 py-3">{item.product?.name ?? item.product_id}</td>
              <td className="px-4 py-3">{item.branch?.name ?? item.branch_id}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.type ?? 'Stock movement details'} subtitle={selected ? `${selected.product?.name ?? selected.product_id}` : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Quantity', selected.quantity],
                  ['Reference', selected.reference_id],
                  ['Note', selected.note],
                  ['Created by', selected.created_by?.first_name ? `${selected.created_by.first_name} ${selected.created_by.last_name}` : selected.created_by_id],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.stockMovements.update(selected.id, { ...editForm, quantity: Number(editForm.quantity) }); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit stock movement</h4>
                {['type', 'quantity', 'reference_id', 'note', 'product_id', 'branch_id', 'batch_id', 'created_by_id'].map((field) => (
                  <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(editForm as any)[field]} onChange={(e) => setEditForm((curr: any) => ({ ...curr, [field]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.stockMovements.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
