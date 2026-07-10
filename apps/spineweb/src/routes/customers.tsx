import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/customers')({
  component: CustomersPage,
});

function CustomersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ name: '', phone: '', branch_id: '' });
  const [editForm, setEditForm] = useState({ name: '', phone: '', branch_id: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.customers.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load customers'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({ name: selected.name ?? '', phone: selected.phone ?? '', branch_id: selected.branch_id ?? '' });
    }
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Customers"
        description="Manage customer records that belong to a branch."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.customers.create(createForm); setCreateForm({ name: '', phone: '', branch_id: '' }); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create customer</h3>
            {['name', 'phone', 'branch_id'].map((field) => (
              <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(createForm as any)[field]} onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))} />
            ))}
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save customer</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Customer list"
          description="Inspect customers by branch."
          rows={items}
          columns={['Name', 'Branch', 'Phone']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
              <td className="px-4 py-3">{item.branch?.name ?? '—'}</td>
              <td className="px-4 py-3">{item.phone ?? '—'}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.name ?? 'Customer details'} subtitle={selected ? selected.branch?.name ?? 'No branch' : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Phone', selected.phone],
                  ['Branch', selected.branch?.name],
                  ['Sync status', selected.sync_status],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.customers.update(selected.id, editForm); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit customer</h4>
                {['name', 'phone', 'branch_id'].map((field) => (
                  <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(editForm as any)[field]} onChange={(e) => setEditForm((curr) => ({ ...curr, [field]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.customers.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
