import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { ModulePage } from '#/components/admin/module-page';
import { entityApi } from '#/lib/entity-api';

export const Route = createFileRoute('/operations')({
  component: OperationsRoute,
});

function OperationsRoute() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedInventory, setSelectedInventory] = useState<any | null>(null);
  const [selectedSale, setSelectedSale] = useState<any | null>(null);
  const [inventoryEditForm, setInventoryEditForm] = useState({ quantity: '', product_id: '', branch_id: '', batch_id: '' });
  const [saleEditForm, setSaleEditForm] = useState({ total_amount: '', amount_paid: '', balance: '', payment_method: '', status: '', note: '', customer_id: '', branch_id: '' });

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

  useEffect(() => {
    if (selectedInventory) {
      setInventoryEditForm({
        quantity: String(selectedInventory.quantity ?? ''),
        product_id: selectedInventory.product_id ?? '',
        branch_id: selectedInventory.branch_id ?? '',
        batch_id: selectedInventory.batch_id ?? '',
      });
    }
  }, [selectedInventory]);

  useEffect(() => {
    if (selectedSale) {
      setSaleEditForm({
        total_amount: String(selectedSale.total_amount ?? ''),
        amount_paid: String(selectedSale.amount_paid ?? ''),
        balance: String(selectedSale.balance ?? ''),
        payment_method: selectedSale.payment_method ?? '',
        status: selectedSale.status ?? '',
        note: selectedSale.note ?? '',
        customer_id: selectedSale.customer_id ?? '',
        branch_id: selectedSale.branch_id ?? '',
      });
    }
  }, [selectedSale]);

  return (
    <DashboardShell>
      <ModulePage
        title="Operations management"
        description="Inspect inventory, stock movement, and sales with CRUD actions."
        sidebar={
          <div className="border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-600">
            Inventory, sales, and batch records now load from their own modules instead of crowding the home page.
          </div>
        }
      >
        {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Section title="Inventory" items={inventory} onSelect={setSelectedInventory} onDelete={async (id) => { await entityApi.inventory.remove(id); await load(); }} />
        <div className="mt-8">
          <Section title="Sales" items={sales} onSelect={setSelectedSale} onDelete={async (id) => { await entityApi.sales.remove(id); await load(); }} />
        </div>
        <Drawer open={Boolean(selectedInventory)} title={selectedInventory?.product?.name ?? 'Inventory details'} subtitle={selectedInventory?.branch?.name} onClose={() => setSelectedInventory(null)}>
          {selectedInventory ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Quantity', selectedInventory.quantity],
                  ['Product', selectedInventory.product?.name ?? selectedInventory.product_id],
                  ['Branch', selectedInventory.branch?.name ?? selectedInventory.branch_id],
                  ['Batch', selectedInventory.batch?.batch_number ?? selectedInventory.batch_id ?? '—'],
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
                  await entityApi.inventory.update(selectedInventory.id, {
                    ...inventoryEditForm,
                    quantity: Number(inventoryEditForm.quantity || 0),
                  });
                  await load();
                }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit inventory</h4>
                {Object.entries(inventoryEditForm).map(([key, value]) => (
                  <input key={key} className="w-full border border-slate-200 px-3 py-2" placeholder={key} value={value} onChange={(e) => setInventoryEditForm((curr) => ({ ...curr, [key]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await entityApi.inventory.remove(selectedInventory.id); setSelectedInventory(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
        <Drawer open={Boolean(selectedSale)} title={selectedSale?.id ?? 'Sale details'} subtitle={selectedSale?.customer?.name} onClose={() => setSelectedSale(null)}>
          {selectedSale ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Total amount', selectedSale.total_amount],
                  ['Amount paid', selectedSale.amount_paid],
                  ['Balance', selectedSale.balance],
                  ['Payment method', selectedSale.payment_method],
                  ['Status', selectedSale.status],
                  ['Branch', selectedSale.branch?.name ?? selectedSale.branch_id],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Customer</h4>
                <p className="mt-3 text-sm text-slate-600">{selectedSale.customer?.name ?? 'No linked customer'}</p>
              </section>
              <form
                className="border border-slate-200 p-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await entityApi.sales.update(selectedSale.id, {
                    ...saleEditForm,
                    total_amount: Number(saleEditForm.total_amount || 0),
                    amount_paid: Number(saleEditForm.amount_paid || 0),
                    balance: Number(saleEditForm.balance || 0),
                  });
                  await load();
                }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit sale</h4>
                {Object.entries(saleEditForm).map(([key, value]) => (
                  <input key={key} className="w-full border border-slate-200 px-3 py-2" placeholder={key} value={value} onChange={(e) => setSaleEditForm((curr) => ({ ...curr, [key]: e.target.value }))} />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await entityApi.sales.remove(selectedSale.id); setSelectedSale(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}

function Section({ title, items, onDelete, onSelect }: { title: string; items: any[]; onDelete: (id: string) => Promise<void>; onSelect: (item: any) => void }) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-slate-950">{title}</h2>
      <div className="overflow-hidden border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t cursor-pointer hover:bg-[#eef7f1]" onClick={() => onSelect(item)}>
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3">{item.quantity ?? item.total_amount}</td>
                <td className="px-4 py-3">
                  <button className="border px-3 py-1" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
