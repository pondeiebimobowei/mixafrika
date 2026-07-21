import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminInput, FieldWrapper, FormPanel, SearchableReferenceField } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { unwrapPagedResponse } from '#/lib/api-request';
import { getUsers } from '#/lib/admin-api';
import { spineAdminApi } from '#/lib/spine-admin-api';

const branchUserSchema = z.object({
  user_id: z.string().trim().min(1, 'User is required'),
  branch_id: z.string().trim().min(1, 'Branch is required'),
  role: z.string().trim().min(1, 'Role is required'),
  is_active: z.boolean().default(true),
});

type BranchUserFormValues = z.infer<typeof branchUserSchema>;

export const Route = createFileRoute('/branch-users')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: BranchUsersPage,
});

function BranchUsersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<any | null>(null);

  const createForm = useForm<BranchUserFormValues>({
    resolver: zodResolver(branchUserSchema),
    defaultValues: { user_id: '', branch_id: '', role: 'staff', is_active: true },
  });

  const editForm = useForm<BranchUserFormValues>({
    resolver: zodResolver(branchUserSchema),
    defaultValues: { user_id: '', branch_id: '', role: 'staff', is_active: true },
  });

  const load = async () => {
    const res = await spineAdminApi.branchUsers.list({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setItems(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load branch users'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelected(null);
      return;
    }

    const match = items.find((item) => item.id === selectedId) ?? null;
    setSelected(match);
    if (match) {
      editForm.reset({
        user_id: match.user_id ?? '',
        branch_id: match.branch_id ?? '',
        role: match.role ?? 'staff',
        is_active: Boolean(match.is_active),
      });
    }
  }, [editForm, items, search.selected]);

  const openRow = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, selected: id }),
    });
  };

  const userLookup = async (query: string) => {
    const response = await getUsers({ q: query, limit: 12 });
    const paged = unwrapPagedResponse<any>(response);
    return paged.rows.map((user) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name}`,
      description: user.email,
    }));
  };

  const branchLookup = async (query: string) => {
    const response = await spineAdminApi.branches.list({ q: query, limit: 12 });
    const paged = unwrapPagedResponse<any>(response);
    return paged.rows.map((branch) => ({
      value: branch.id,
      label: branch.name,
      description: [branch.city, branch.state].filter(Boolean).join(' • '),
    }));
  };

  const selectedSummary = useMemo(() => {
    if (!selected) {
      return 'Select a branch user to see details.';
    }
    return `${selected.branch?.name ?? 'No branch'} • ${selected.user?.email ?? 'No email'}`;
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Branch users"
        description="Assign users to branches and manage branch-level access."
        sidebar={
          <FormPanel title="Create branch user" description="Search both the user and the branch before saving.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  spineAdminApi.branchUsers.create({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating assignment...',
                    success: 'Branch user created',
                    error: 'Failed to create branch user',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <SearchableReferenceField
                label="User"
                value={createForm.watch('user_id')}
                onChange={(value) => createForm.setValue('user_id', value)}
                loadOptions={userLookup}
                error={createForm.formState.errors.user_id?.message}
                placeholder="Search users"
                required
              />
              <SearchableReferenceField
                label="Branch"
                value={createForm.watch('branch_id')}
                onChange={(value) => createForm.setValue('branch_id', value)}
                loadOptions={branchLookup}
                error={createForm.formState.errors.branch_id?.message}
                placeholder="Search branches"
                required
              />
              <FieldWrapper label="Role" htmlFor="create-branch-user-role" error={createForm.formState.errors.role?.message}>
                <AdminInput id="create-branch-user-role" type="text" {...createForm.register('role')} error={createForm.formState.errors.role?.message} />
              </FieldWrapper>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={Boolean(createForm.watch('is_active'))} onChange={(event) => createForm.setValue('is_active', event.target.checked)} className="h-4 w-4 border-slate-300 text-[#1f6f4a]" />
                Active
              </label>
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save assignment
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Branch user list</h2>
              <p className="mt-1 text-sm text-slate-500">Search and page the branch membership records.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="branch-user-search">
                <AdminInput
                  id="branch-user-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search role or IDs"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Branch users"
            description="Searchable and paged branch memberships."
            rows={items}
            columns={['User', 'Branch', 'Role']}
            selectedId={search.selected}
            onSelect={openRow}
            getRowLabel={(item) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">
                  {item.user?.first_name ?? 'User'} {item.user?.last_name ?? ''}
                </td>
                <td className="px-4 py-3 text-slate-600">{item.branch?.name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">{item.role}</td>
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
          open={Boolean(selected)}
          title={selected?.user ? `${selected.user.first_name} ${selected.user.last_name}` : 'Branch user details'}
          subtitle={selectedSummary}
          onClose={() =>
            navigate({
              search: (prev) => ({ ...prev, selected: undefined }),
            })
          }
        >
          {selected ? (
            <div className="space-y-5">
              <section className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Role', selected.role],
                  ['Active', selected.is_active ? 'Yes' : 'No'],
                  ['Assigned', selected.assigned_at ?? '—'],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value)}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit branch user" description="Update the assigned user, branch, or role.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      spineAdminApi.branchUsers.update(selected.id, values),
                      {
                        loading: 'Saving assignment...',
                        success: 'Branch user updated',
                        error: 'Failed to update branch user',
                      },
                    );
                    await load();
                  })}
                >
                  <SearchableReferenceField
                    label="User"
                    value={editForm.watch('user_id')}
                    onChange={(value) => editForm.setValue('user_id', value)}
                    loadOptions={userLookup}
                    error={editForm.formState.errors.user_id?.message}
                    placeholder="Search users"
                    required
                  />
                  <SearchableReferenceField
                    label="Branch"
                    value={editForm.watch('branch_id')}
                    onChange={(value) => editForm.setValue('branch_id', value)}
                    loadOptions={branchLookup}
                    error={editForm.formState.errors.branch_id?.message}
                    placeholder="Search branches"
                    required
                  />
                  <FieldWrapper label="Role" htmlFor="edit-branch-user-role" error={editForm.formState.errors.role?.message}>
                    <AdminInput id="edit-branch-user-role" type="text" {...editForm.register('role')} error={editForm.formState.errors.role?.message} />
                  </FieldWrapper>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={Boolean(editForm.watch('is_active'))} onChange={(event) => editForm.setValue('is_active', event.target.checked)} className="h-4 w-4 border-slate-300 text-[#1f6f4a]" />
                    Active
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(spineAdminApi.branchUsers.remove(selected.id), {
                          loading: 'Deleting assignment...',
                          success: 'Branch user deleted',
                          error: 'Failed to delete branch user',
                        });
                        navigate({
                          search: (prev) => ({ ...prev, selected: undefined }),
                        });
                        await load();
                      }}
                    >
                      Delete
                    </button>
                    {selected.branch ? (
                      <Link
                        to="/branches"
                        search={{ selected: selected.branch.id }}
                        className="border border-slate-200 px-4 py-2 text-sm font-medium text-[#1f6f4a]"
                      >
                        Open branch
                      </Link>
                    ) : null}
                  </div>
                </form>
              </FormPanel>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
