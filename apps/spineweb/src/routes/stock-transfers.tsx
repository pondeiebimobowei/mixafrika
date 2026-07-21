import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';
import { getSession } from '#/lib/session';

export const Route = createFileRoute('/stock-transfers')({
  component: StockTransfersPage,
});

function StockTransfersPage() {
  const session = getSession();
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    reason: '',
    status: 'pending',
    created_by_id: session?.user?.id ?? '',
    from_branch_id: '',
    to_branch_id: '',
  });
  const [editForm, setEditForm] = useState<any>(createForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.stockTransfers.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load stock transfers'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({
        reason: selected.reason ?? '',
        status: selected.status ?? 'pending',
        created_by_id: selected.created_by_id ?? session?.user?.id ?? '',
        from_branch_id: selected.from_branch_id ?? '',
        to_branch_id: selected.to_branch_id ?? '',
      });
    }
  }, [selected, session?.user?.id]);

  return (
    <DashboardShell>
      <ModulePage
        title="Stock transfers"
        description="Manage transfer requests between branches and inspect their item lists."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.stockTransfers.create(createForm); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create stock transfer</h3>
            {['reason', 'status', 'created_by_id', 'from_branch_id', 'to_branch_id'].map((field) => (
              <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(createForm as any)[field]} onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))} />
            ))}
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save transfer</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Stock transfer list"
          description="Select a transfer to inspect its route and items."
          rows={items}
          columns={['Reason', 'Status', 'From', 'To']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.reason}</td>
              <td className="px-4 py-3">{item.status}</td>
              <td className="px-4 py-3">{item.from_branch?.name ?? item.from_branch_id}</td>
              <td className="px-4 py-3">{item.to_branch?.name ?? item.to_branch_id}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.reason ?? 'Stock transfer details'} subtitle={selected ? `${selected.status} • ${selected.items?.length ?? 0} items` : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['From', selected.from_branch?.name ?? selected.from_branch_id],
                  ['To', selected.to_branch?.name ?? selected.to_branch_id],
                  ['Created by', selected.created_by?.first_name ? `${selected.created_by.first_name} ${selected.created_by.last_name}` : selected.created_by_id],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.stockTransfers.update(selected.id, editForm); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit stock transfer</h4>
                {['reason', 'status', 'created_by_id', 'from_branch_id', 'to_branch_id'].map((field) => (
                  <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(editForm as any)[field]} onChange={(e) => setEditForm((curr: any) => ({ ...curr, [field]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.stockTransfers.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Items</h4>
                <div className="mt-4 space-y-3">
                  {(selected.items ?? []).map((item: any) => (
                    <div key={item.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{item.product?.name ?? item.product_id}</p>
                      <p className="mt-1 text-sm text-slate-500">Quantity {item.quantity}</p>
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
