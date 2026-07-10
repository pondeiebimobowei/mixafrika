import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/branches')({
  component: BranchesPage,
});

function BranchesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    business_id: '',
    phone: '',
    street_address: '',
    city: '',
    state: '',
    country: '',
    is_head_office: false,
  });
  const [editForm, setEditForm] = useState<any>(createForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.branches.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load branches'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({
        name: selected.name ?? '',
        business_id: selected.business_id ?? '',
        phone: selected.phone ?? '',
        street_address: selected.street_address ?? '',
        city: selected.city ?? '',
        state: selected.state ?? '',
        country: selected.country ?? '',
        is_head_office: Boolean(selected.is_head_office),
      });
    }
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Branches"
        description="Manage branch records and inspect their linked business, products, customers, and users."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.branches.create(createForm); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create branch</h3>
            {['name', 'business_id', 'phone', 'street_address', 'city', 'state', 'country'].map((field) => (
              <input
                key={field}
                className="w-full border border-slate-200 px-3 py-2"
                placeholder={field}
                value={(createForm as any)[field]}
                onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))}
              />
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={createForm.is_head_office} onChange={(e) => setCreateForm((curr) => ({ ...curr, is_head_office: e.target.checked }))} />
              Head office
            </label>
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save branch</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Branch list"
          description="Click a row to manage and inspect a branch."
          rows={items}
          columns={['Name', 'Business', 'City', 'Products']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
              <td className="px-4 py-3">{item.business?.name ?? '—'}</td>
              <td className="px-4 py-3">{item.city}</td>
              <td className="px-4 py-3">{item.products?.length ?? 0}</td>
            </>
          )}
        />
        <Drawer
          open={Boolean(selected)}
          title={selected?.name ?? 'Branch details'}
          subtitle={selected ? `${selected.business?.name ?? 'No business'} • ${selected.products?.length ?? 0} products` : undefined}
          onClose={() => setSelectedId(null)}
        >
          {selected ? (
            <div className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Phone', selected.phone],
                  ['Street', selected.street_address],
                  ['City', selected.city],
                  ['State', selected.state],
                  ['Country', selected.country],
                  ['Head office', selected.is_head_office ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>

              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.branches.update(selected.id, editForm); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit branch</h4>
                {['name', 'business_id', 'phone', 'street_address', 'city', 'state', 'country'].map((field) => (
                  <input
                    key={field}
                    className="w-full border border-slate-200 px-3 py-2"
                    placeholder={field}
                    value={(editForm as any)[field]}
                    onChange={(e) => setEditForm((curr: any) => ({ ...curr, [field]: e.target.value }))}
                  />
                ))}
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={Boolean(editForm.is_head_office)} onChange={(e) => setEditForm((curr: any) => ({ ...curr, is_head_office: e.target.checked }))} />
                  Head office
                </label>
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.branches.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>

              <section className="border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Business</h4>
                  {selected.business ? <Link className="text-sm text-[#1f6f4a]" to="/businesses" search={{ selected: selected.business.id }}>Open business</Link> : null}
                </div>
                <p className="mt-3 text-sm text-slate-600">{selected.business?.name ?? 'No linked business'}</p>
              </section>

              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Products</h4>
                <div className="mt-4 space-y-3">
                  {(selected.products ?? []).map((product: any) => (
                    <div key={product.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{product.category}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Customers</h4>
                <div className="mt-4 space-y-3">
                  {(selected.customers ?? []).map((customer: any) => (
                    <div key={customer.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{customer.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{customer.phone ?? 'No phone'}</p>
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
