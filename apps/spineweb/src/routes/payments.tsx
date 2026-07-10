import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/payments')({
  component: PaymentsPage,
});

function PaymentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ amount: '0', reference: '', payment_method: '', status: 'pending', sale_id: '' });
  const [editForm, setEditForm] = useState<any>(createForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.payments.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load payments'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({
        amount: String(selected.amount ?? 0),
        reference: selected.reference ?? '',
        payment_method: selected.payment_method ?? '',
        status: selected.status ?? 'pending',
        sale_id: selected.sale_id ?? '',
      });
    }
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Payments"
        description="Manage payment records and inspect the sale they belong to."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.payments.create({ ...createForm, amount: Number(createForm.amount) }); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create payment</h3>
            {['amount', 'reference', 'payment_method', 'status', 'sale_id'].map((field) => (
              <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(createForm as any)[field]} onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))} />
            ))}
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save payment</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Payment list"
          description="Select a payment to inspect its linked sale."
          rows={items}
          columns={['Amount', 'Method', 'Status', 'Sale']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.amount}</td>
              <td className="px-4 py-3">{item.payment_method}</td>
              <td className="px-4 py-3">{item.status}</td>
              <td className="px-4 py-3">{item.sale?.id ?? item.sale_id}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.reference ?? 'Payment details'} subtitle={selected ? `${selected.status} • ${selected.amount}` : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Amount', selected.amount],
                  ['Method', selected.payment_method],
                  ['Reference', selected.reference],
                  ['Sale', selected.sale?.id ?? selected.sale_id],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.payments.update(selected.id, { ...editForm, amount: Number(editForm.amount) }); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit payment</h4>
                {['amount', 'reference', 'payment_method', 'status', 'sale_id'].map((field) => (
                  <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(editForm as any)[field]} onChange={(e) => setEditForm((curr: any) => ({ ...curr, [field]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.payments.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
