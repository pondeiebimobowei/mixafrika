import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminInput, AdminSelect, FieldWrapper, FormGrid, FormPanel } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { createUser, deleteUser, getUser, getUsers, updateUser } from '#/lib/admin-api';
import { unwrapPagedResponse } from '#/lib/api-request';

const userSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required'),
  last_name: z.string().trim().min(1, 'Last name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  role: z.string().trim().min(1, 'Role is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  is_verified: z.boolean().default(true),
  is_email_verified: z.boolean().default(true),
});

type UserFormValues = z.infer<typeof userSchema>;

export const Route = createFileRoute('/users')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: UsersPage,
});

function UsersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const createForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'admin',
      password: '',
      is_verified: true,
      is_email_verified: true,
    },
  });

  const editForm = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      role: 'admin',
      password: '',
      is_verified: true,
      is_email_verified: true,
    },
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        page: search.page,
        q: search.q || undefined,
        limit: search.limit,
      });
      const paged = unwrapPagedResponse<any>(res);
      setUsers(paged.rows);
      setMeta(paged.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {
      adminToast.error('Failed to load users');
    });
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelectedUser(null);
      return;
    }

    getUser(selectedId)
      .then((res) => {
        setSelectedUser(res.data);
        editForm.reset({
          first_name: res.data.first_name ?? '',
          last_name: res.data.last_name ?? '',
          email: res.data.email ?? '',
          role: res.data.role ?? 'admin',
          password: '',
          is_verified: Boolean(res.data.is_verified),
          is_email_verified: Boolean(res.data.is_email_verified),
        });
      })
      .catch(() => adminToast.error('Failed to load user details'));
  }, [editForm, search.selected]);

  const openUser = (id: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        selected: id,
      }),
    });
  };

  const selectedSummary = useMemo(() => {
    if (!selectedUser) {
      return 'Select a user to see details.';
    }
    return `${selectedUser.first_name} ${selectedUser.last_name} • ${selectedUser.email}`;
  }, [selectedUser]);

  return (
    <DashboardShell>
      <ModulePage
        title="Users"
        description="Create, inspect, edit, and delete user accounts from a dedicated CRUD surface."
        sidebar={
          <FormPanel
            title="Create user"
            description="Labels, validation, and field types are wired for accessible admin entry."
          >
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  createUser({
                    ...values,
                    credit_score: 0,
                    credit_score_status: 'not set',
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating user...',
                    success: 'User created',
                    error: 'Failed to create user',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FormGrid>
                <FieldWrapper label="First name" htmlFor="create-first-name" error={createForm.formState.errors.first_name?.message}>
                  <AdminInput id="create-first-name" type="text" autoComplete="given-name" {...createForm.register('first_name')} error={createForm.formState.errors.first_name?.message} />
                </FieldWrapper>
                <FieldWrapper label="Last name" htmlFor="create-last-name" error={createForm.formState.errors.last_name?.message}>
                  <AdminInput id="create-last-name" type="text" autoComplete="family-name" {...createForm.register('last_name')} error={createForm.formState.errors.last_name?.message} />
                </FieldWrapper>
              </FormGrid>
              <FieldWrapper label="Email address" htmlFor="create-email" error={createForm.formState.errors.email?.message}>
                <AdminInput id="create-email" type="email" autoComplete="email" {...createForm.register('email')} error={createForm.formState.errors.email?.message} />
              </FieldWrapper>
              <FieldWrapper label="Role" htmlFor="create-role" error={createForm.formState.errors.role?.message}>
                <AdminSelect id="create-role" {...createForm.register('role')} error={createForm.formState.errors.role?.message}>
                  {['admin', 'manager', 'staff', 'trader', 'customer'].map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </AdminSelect>
              </FieldWrapper>
              <FieldWrapper label="Password" htmlFor="create-password" error={createForm.formState.errors.password?.message}>
                <AdminInput id="create-password" type="password" autoComplete="new-password" {...createForm.register('password')} error={createForm.formState.errors.password?.message} />
              </FieldWrapper>
              <div className="grid gap-3">
                <Controller
                  control={createForm.control}
                  name="is_verified"
                  render={({ field }) => (
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} className="h-4 w-4 border-slate-300 text-[#1f6f4a]" />
                      Verified account
                    </label>
                  )}
                />
                <Controller
                  control={createForm.control}
                  name="is_email_verified"
                  render={({ field }) => (
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} className="h-4 w-4 border-slate-300 text-[#1f6f4a]" />
                      Email verified
                    </label>
                  )}
                />
              </div>
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save user
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">User list</h2>
              <p className="mt-1 text-sm text-slate-500">Click a row to inspect the full user record.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="user-search">
                <AdminInput
                  id="user-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search name, email, or role"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Users"
            description="Rows are paged server-side and support direct detail drill-down."
            rows={users}
            columns={['Name', 'Email', 'Role', 'Status']}
            selectedId={search.selected}
            onSelect={openUser}
            loading={loading}
            getRowLabel={(user) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">
                  {user.first_name} {user.last_name}
                </td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3 text-slate-600">{user.role}</td>
                <td className="px-4 py-3 text-slate-600">{user.is_verified ? 'Verified' : 'Pending'}</td>
              </>
            )}
          />

          <PaginationBar
            page={meta.page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={(page) =>
              navigate({
                search: (prev) => ({ ...prev, page }),
              })
            }
            onLimitChange={(limit) =>
              navigate({
                search: (prev) => ({ ...prev, page: 1, limit }),
              })
            }
          />
        </section>

        <Drawer
          open={Boolean(selectedUser)}
          title={selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : 'User details'}
          subtitle={selectedSummary}
          onClose={() =>
            navigate({
              search: (prev) => ({ ...prev, selected: undefined }),
            })
          }
        >
          {selectedUser ? (
            <div className="space-y-5">
              <section className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Email', selectedUser.email],
                  ['Role', selectedUser.role],
                  ['Verified', selectedUser.is_verified ? 'Yes' : 'No'],
                  ['Email verified', selectedUser.is_email_verified ? 'Yes' : 'No'],
                  ['Credit score', selectedUser.credit_score ?? '—'],
                  ['Credit status', selectedUser.credit_score_status ?? '—'],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value)}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit user" description="Update identity and security attributes in one place.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      updateUser(selectedUser.id, {
                        ...values,
                        password: values.password || undefined,
                      }),
                      {
                        loading: 'Saving user...',
                        success: 'User updated',
                        error: 'Failed to update user',
                      },
                    );
                    await load();
                  })}
                >
                  <FormGrid>
                    <FieldWrapper label="First name" htmlFor="edit-first-name" error={editForm.formState.errors.first_name?.message}>
                      <AdminInput id="edit-first-name" type="text" autoComplete="given-name" {...editForm.register('first_name')} error={editForm.formState.errors.first_name?.message} />
                    </FieldWrapper>
                    <FieldWrapper label="Last name" htmlFor="edit-last-name" error={editForm.formState.errors.last_name?.message}>
                      <AdminInput id="edit-last-name" type="text" autoComplete="family-name" {...editForm.register('last_name')} error={editForm.formState.errors.last_name?.message} />
                    </FieldWrapper>
                  </FormGrid>
                  <FieldWrapper label="Email address" htmlFor="edit-email" error={editForm.formState.errors.email?.message}>
                    <AdminInput id="edit-email" type="email" autoComplete="email" {...editForm.register('email')} error={editForm.formState.errors.email?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Role" htmlFor="edit-role" error={editForm.formState.errors.role?.message}>
                    <AdminSelect id="edit-role" {...editForm.register('role')} error={editForm.formState.errors.role?.message}>
                      {['admin', 'manager', 'staff', 'trader', 'customer'].map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </AdminSelect>
                  </FieldWrapper>
                  <FieldWrapper label="Password" htmlFor="edit-password" hint="Optional" error={editForm.formState.errors.password?.message}>
                    <AdminInput id="edit-password" type="password" autoComplete="new-password" {...editForm.register('password')} error={editForm.formState.errors.password?.message} />
                  </FieldWrapper>
                  <div className="grid gap-3">
                    <Controller
                      control={editForm.control}
                      name="is_verified"
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input type="checkbox" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} className="h-4 w-4 border-slate-300 text-[#1f6f4a]" />
                          Verified account
                        </label>
                      )}
                    />
                    <Controller
                      control={editForm.control}
                      name="is_email_verified"
                      render={({ field }) => (
                        <label className="flex items-center gap-2 text-sm text-slate-700">
                          <input type="checkbox" checked={field.value} onChange={(event) => field.onChange(event.target.checked)} className="h-4 w-4 border-slate-300 text-[#1f6f4a]" />
                          Email verified
                        </label>
                      )}
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(deleteUser(selectedUser.id), {
                          loading: 'Deleting user...',
                          success: 'User deleted',
                          error: 'Failed to delete user',
                        });
                        navigate({
                          search: (prev) => ({ ...prev, selected: undefined }),
                        });
                        await load();
                      }}
                    >
                      Delete
                    </button>
                    {selectedUser.businesses?.length ? (
                      <Link
                        to="/businesses"
                        search={{ selected: selectedUser.businesses[0].id }}
                        className="border border-slate-200 px-4 py-2 text-sm font-medium text-[#1f6f4a] transition hover:border-[#1f6f4a]"
                      >
                        Open first business
                      </Link>
                    ) : null}
                  </div>
                </form>
              </FormPanel>

              <FormPanel title="Verification" description="Structured identity and KYB/KYC information.">
                {selectedUser.verification ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['Type', selectedUser.verification.type],
                      ['ID number', selectedUser.verification.id_number],
                      ['Status', selectedUser.verification.status],
                      ['Submitted at', selectedUser.verification.submitted_at],
                      ['Reviewed at', selectedUser.verification.reviewed_at],
                      ['Rejection reason', selectedUser.verification.rejection_reason ?? '—'],
                    ].map(([label, value]) => (
                      <article key={label} className="border border-slate-200 p-3">
                        <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                        <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No verification record available.</p>
                )}
              </FormPanel>

              <FormPanel title="Associated businesses" description="Linked records stay clickable for quick drill-down.">
                <div className="space-y-3">
                  {(selectedUser.businesses ?? []).map((business: any) => (
                    <div key={business.id} className="flex items-center justify-between gap-4 border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{business.name}</p>
                        <p className="text-xs text-slate-500">
                          {business.type} • {business.city}, {business.state}
                        </p>
                      </div>
                      <Link
                        to="/businesses"
                        search={{ selected: business.id }}
                        className="border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1f6f4a]"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
                  {(selectedUser.businesses ?? []).length === 0 ? (
                    <p className="text-sm text-slate-500">No linked businesses.</p>
                  ) : null}
                </div>
              </FormPanel>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
