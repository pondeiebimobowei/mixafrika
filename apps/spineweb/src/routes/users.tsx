import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '#/lib/admin-api';

export const Route = createFileRoute('/users')({
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', role: 'admin', password: '' });

  const load = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load users'));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    getUser(selectedId)
      .then((res) => setSelectedUser(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load user'));
  }, [selectedId]);

  const selectedSummary = useMemo(() => {
    if (!selectedUser) return 'Select a user to see details.';
    return `${selectedUser.first_name} ${selectedUser.last_name} • ${selectedUser.email}`;
  }, [selectedUser]);

  return (
    <DashboardShell>
      <ModulePage
        title="Users"
        description="Create, edit, inspect, and delete user accounts in a dedicated workflow."
        sidebar={
          <form
            className="border border-slate-200 bg-white p-4 shadow-sm space-y-3"
            onSubmit={async (e) => {
              e.preventDefault();
              await createUser({
                ...form,
                is_verified: true,
                is_email_verified: true,
                credit_score: 0,
              });
              setForm({ first_name: '', last_name: '', email: '', role: 'admin', password: '' });
              await load();
            }}
          >
            <h3 className="text-lg font-semibold text-slate-950">Create user</h3>
            {['first_name', 'last_name', 'email', 'password'].map((field) => (
              <input
                key={field}
                className="w-full border border-slate-200 px-3 py-2"
                placeholder={field}
                value={(form as any)[field]}
                type={field === 'password' ? 'password' : 'text'}
                onChange={(e) => setForm((curr) => ({ ...curr, [field]: e.target.value }))}
              />
            ))}
            <input className="w-full border border-slate-200 px-3 py-2" placeholder="role" value={form.role} onChange={(e) => setForm((curr) => ({ ...curr, role: e.target.value }))} />
            <button className="w-full bg-slate-950 px-4 py-2 text-white">Save user</button>
          </form>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <EntityTable
          title="User list"
          description="Click a row to open the full user record."
          rows={users}
          columns={['Name', 'Email', 'Role']}
          selectedId={selectedId ?? undefined}
          onSelect={setSelectedId}
          getRowLabel={(user) => (
            <>
              <td className="px-4 py-3 font-medium text-slate-950">{user.first_name} {user.last_name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
            </>
          )}
        />
        <Drawer
          open={Boolean(selectedUser)}
          title={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'User details'}
          subtitle={selectedSummary}
          onClose={() => setSelectedUser(null)}
        >
          {selectedUser ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Email', selectedUser.email],
                  ['Role', selectedUser.role],
                  ['Verified', selectedUser.is_verified ? 'Yes' : 'No'],
                  ['Email verified', selectedUser.is_email_verified ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value)}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="border border-slate-200 px-3 py-2" onClick={async () => { await updateUser(selectedUser.id, { is_verified: !selectedUser.is_verified }); await load(); }}>
                  Toggle verify
                </button>
                <button className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await deleteUser(selectedUser.id); setSelectedUser(null); await load(); }}>
                  Delete
                </button>
              </div>
              <pre className="overflow-auto border border-slate-200 bg-slate-50 p-4 text-xs text-slate-900">{JSON.stringify(selectedUser, null, 2)}</pre>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
