import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { createBusiness, deleteBusiness, getBusinesses, getBusiness, updateBusiness } from '#/lib/admin-api';

export const Route = createFileRoute('/businesses')({
  validateSearch: (search: Record<string, unknown>) => ({
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: BusinessesPage,
});

function BusinessesPage() {
  const search = Route.useSearch();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: '', phone: '', street_address: '', city: '', state: '', country: '' });

  const load = async () => {
    const res = await getBusinesses();
    setBusinesses(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load businesses'));
  }, []);

  useEffect(() => {
    if (search.selected) {
      setSelectedId(search.selected);
    }
  }, [search.selected]);

  useEffect(() => {
    if (!selectedId) return;
    getBusiness(selectedId)
      .then((res) => setSelectedBusiness(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load business'));
  }, [selectedId]);

  const selectedSummary = useMemo(() => {
    if (!selectedBusiness) return 'Select a business to see details.';
    return `${selectedBusiness.name} • ${selectedBusiness.city}, ${selectedBusiness.state}`;
  }, [selectedBusiness]);

  return (
    <DashboardShell>
      <ModulePage
        title="Businesses"
        description="Create, edit, inspect, and delete businesses in a dedicated workflow."
        sidebar={
          <form
            className="border border-slate-200 bg-white p-4 shadow-sm space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await createBusiness({ ...form, is_verified: false });
              setForm({ name: '', type: '', phone: '', street_address: '', city: '', state: '', country: '' });
              await load();
            }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Create business</h3>
            {Object.entries(form).map(([key, value]) => (
              <input
                key={key}
                className="w-full border border-slate-200 px-3 py-2"
                placeholder={key}
                value={value}
                onChange={(e) => setForm((curr) => ({ ...curr, [key]: e.target.value }))}
              />
            ))}
            <button className="w-full bg-slate-950 px-4 py-2 text-white">Save business</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Business list"
          description="Click a row to open the full business record."
          rows={businesses}
          columns={['Name', 'City', 'Type']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(business) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{business.name}</td>
              <td className="px-4 py-3">{business.city}</td>
              <td className="px-4 py-3">{business.type}</td>
            </>
          )}
        />
        <Drawer
          open={Boolean(selectedBusiness)}
          title={selectedBusiness ? selectedBusiness.name : 'Business details'}
          subtitle={selectedSummary}
          onClose={() => setSelectedBusiness(null)}
        >
          {selectedBusiness ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Type', selectedBusiness.type],
                  ['Phone', selectedBusiness.phone],
                  ['City', selectedBusiness.city],
                  ['State', selectedBusiness.state],
                  ['Country', selectedBusiness.country],
                  ['Verified', selectedBusiness.is_verified ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value)}</p>
                  </div>
                ))}
              </div>

              <section className="border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Branches</h4>
                    <p className="mt-1 text-sm text-slate-600">Business branch locations and head office details.</p>
                  </div>
                  <span className="border border-slate-200 px-2 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {selectedBusiness.branches?.length ?? 0}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {(selectedBusiness.branches ?? []).map((branch: any) => (
                    <div key={branch.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{branch.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {branch.city}, {branch.state} {branch.is_head_office ? '• Head office' : ''}
                      </p>
                    </div>
                  ))}
                  {(selectedBusiness.branches ?? []).length === 0 ? (
                    <p className="text-sm text-slate-500">No linked branches.</p>
                  ) : null}
                </div>
              </section>

              <section className="border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Users</h4>
                    <p className="mt-1 text-sm text-slate-600">Business users with access to this business.</p>
                  </div>
                  <span className="border border-slate-200 px-2 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {selectedBusiness.users?.length ?? 0}
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {(selectedBusiness.users ?? []).map((user: any) => (
                    <div key={user.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-semibold text-slate-950">{user.first_name} {user.last_name}</p>
                      <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                    </div>
                  ))}
                  {(selectedBusiness.users ?? []).length === 0 ? (
                    <p className="text-sm text-slate-500">No linked users.</p>
                  ) : null}
                </div>
              </section>

              <section className="border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Verification</h4>
                    <p className="mt-1 text-sm text-slate-600">KYB documents and review status.</p>
                  </div>
                  {selectedBusiness.verification ? (
                    <span className="border border-slate-200 px-2 py-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                      {selectedBusiness.verification.status}
                    </span>
                  ) : null}
                </div>
                {selectedBusiness.verification ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      ['Type', selectedBusiness.verification.type],
                      ['Doc number', selectedBusiness.verification.doc_number],
                      ['Reviewed', selectedBusiness.verification.reviewed_at],
                      ['Submitted by', selectedBusiness.verification.submitted_by],
                    ].map(([label, value]) => (
                      <div key={label} className="border border-slate-200 p-3">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                        <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">No verification record available.</p>
                )}
              </section>

              <div className="flex gap-2">
                <button className="border border-slate-200 px-3 py-2" onClick={async () => { await updateBusiness(selectedBusiness.id, { is_verified: !selectedBusiness.is_verified }); await load(); }}>
                  Toggle verify
                </button>
                <button className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await deleteBusiness(selectedBusiness.id); setSelectedBusiness(null); await load(); }}>
                  Delete
                </button>
              </div>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
