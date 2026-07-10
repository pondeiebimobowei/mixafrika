import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/branch-users')({
  component: BranchUsersPage,
});

function BranchUsersPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({ user_id: '', branch_id: '', role: 'staff', is_active: true });
  const [editForm, setEditForm] = useState<any>(createForm);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    const res = await spineAdminApi.branchUsers.list();
    setItems(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load branch users'));
  }, []);

  const selected = useMemo(() => items.find((item) => item.id === selectedId) ?? null, [items, selectedId]);

  useEffect(() => {
    if (selected) {
      setEditForm({
        user_id: selected.user_id ?? '',
        branch_id: selected.branch_id ?? '',
        role: selected.role ?? 'staff',
        is_active: Boolean(selected.is_active),
      });
    }
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Branch users"
        description="Assign users to branches and maintain branch-level access."
        sidebar={
          <form className="border border-slate-200 bg-white p-4 shadow-sm space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.branchUsers.create(createForm); await load(); }}>
            <h3 className="text-lg font-semibold text-slate-950">Create branch user</h3>
            {['user_id', 'branch_id', 'role'].map((field) => (
              <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(createForm as any)[field]} onChange={(e) => setCreateForm((curr) => ({ ...curr, [field]: e.target.value }))} />
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={createForm.is_active} onChange={(e) => setCreateForm((curr) => ({ ...curr, is_active: e.target.checked }))} />
              Active
            </label>
            <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save assignment</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="Branch user list"
          description="Select a row to edit the branch assignment."
          rows={items}
          columns={['User', 'Branch', 'Role']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(item) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{item.user?.first_name} {item.user?.last_name}</td>
              <td className="px-4 py-3">{item.branch?.name ?? '—'}</td>
              <td className="px-4 py-3">{item.role}</td>
            </>
          )}
        />
        <Drawer open={Boolean(selected)} title={selected?.user ? `${selected.user.first_name} ${selected.user.last_name}` : 'Branch user details'} subtitle={selected ? selected.branch?.name : undefined} onClose={() => setSelectedId(null)}>
          {selected ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Role', selected.role],
                  ['Active', selected.is_active ? 'Yes' : 'No'],
                  ['Assigned', selected.assigned_at ?? '—'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value)}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <Link to="/users" className="border border-slate-200 px-3 py-2 text-[#1f6f4a]">Open user</Link>
                <Link to="/branches" search={{}} className="border border-slate-200 px-3 py-2 text-[#1f6f4a]">Open branch</Link>
              </div>
              <form className="border border-slate-200 p-4 space-y-3" onSubmit={async (e) => { e.preventDefault(); await spineAdminApi.branchUsers.update(selected.id, editForm); await load(); }}>
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit branch user</h4>
                {['user_id', 'branch_id', 'role'].map((field) => (
                  <input key={field} className="w-full border border-slate-200 px-3 py-2" placeholder={field} value={(editForm as any)[field]} onChange={(e) => setEditForm((curr: any) => ({ ...curr, [field]: e.target.value }))} />
                ))}
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" checked={Boolean(editForm.is_active)} onChange={(e) => setEditForm((curr: any) => ({ ...curr, is_active: e.target.checked }))} />
                  Active
                </label>
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await spineAdminApi.branchUsers.remove(selected.id); setSelectedId(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
