import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminInput, FieldWrapper, FormGrid, FormPanel, SearchableReferenceField } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { unwrapPagedResponse } from '#/lib/api-request';
import { spineAdminApi } from '#/lib/spine-admin-api';

const customerSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  branch_id: z.string().trim().min(1, 'Branch is required'),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export const Route = createFileRoute('/customers')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<any | null>(null);

  const createForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', phone: '', branch_id: '' },
  });

  const editForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', phone: '', branch_id: '' },
  });

  const load = async () => {
    const res = await spineAdminApi.customers.list({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setItems(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load customers'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelected(null);
      return;
    }

    spineAdminApi.customers.get(selectedId)
      .then((res) => {
        setSelected(res.data);
        editForm.reset({
          name: res.data.name ?? '',
          phone: res.data.phone ?? '',
          branch_id: res.data.branch_id ?? '',
        });
      })
      .catch(() => adminToast.error('Failed to load customer details'));
  }, [editForm, search.selected]);

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
      return 'Select a customer to see details.';
    }
    return `${selected.branch?.name ?? 'No branch'} • ${selected.phone ?? 'No phone'}`;
  }, [selected]);

  const openCustomer = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, selected: id }),
    });
  };

  return (
    <DashboardShell>
      <ModulePage
        title="Customers"
        description="Manage customer records and their branch affiliation."
        sidebar={
          <FormPanel title="Create customer" description="Labels and searchable branch selection keep entries accurate.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  spineAdminApi.customers.create({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating customer...',
                    success: 'Customer created',
                    error: 'Failed to create customer',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FieldWrapper label="Customer name" htmlFor="create-customer-name" error={createForm.formState.errors.name?.message}>
                <AdminInput id="create-customer-name" type="text" {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </FieldWrapper>
              <FieldWrapper label="Phone" htmlFor="create-customer-phone" error={createForm.formState.errors.phone?.message}>
                <AdminInput id="create-customer-phone" type="tel" {...createForm.register('phone')} error={createForm.formState.errors.phone?.message} />
              </FieldWrapper>
              <SearchableReferenceField
                label="Branch"
                value={createForm.watch('branch_id')}
                onChange={(value) => createForm.setValue('branch_id', value)}
                loadOptions={branchLookup}
                error={createForm.formState.errors.branch_id?.message}
                placeholder="Search branches"
                required
              />
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save customer
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Customer list</h2>
              <p className="mt-1 text-sm text-slate-500">Open a row to see branch assignments and linked activity.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="customer-search">
                <AdminInput
                  id="customer-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search name or phone"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Customers"
            description="Paged and filterable customer records."
            rows={items}
            columns={['Name', 'Branch', 'Phone']}
            selectedId={search.selected}
            onSelect={openCustomer}
            getRowLabel={(item) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">{item.branch?.name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">{item.phone ?? '—'}</td>
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
          title={selected?.name ?? 'Customer details'}
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
                  ['Phone', selected.phone],
                  ['Branch', selected.branch?.name],
                  ['Sync status', selected.sync_status],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit customer" description="Update the branch assignment or the visible customer contact details.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      spineAdminApi.customers.update(selected.id, {
                        ...values,
                        sync_status: 'completed',
                        sync_date: new Date().toISOString(),
                      }),
                      {
                        loading: 'Saving customer...',
                        success: 'Customer updated',
                        error: 'Failed to update customer',
                      },
                    );
                    await load();
                  })}
                >
                  <FieldWrapper label="Customer name" htmlFor="edit-customer-name" error={editForm.formState.errors.name?.message}>
                    <AdminInput id="edit-customer-name" type="text" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Phone" htmlFor="edit-customer-phone" error={editForm.formState.errors.phone?.message}>
                    <AdminInput id="edit-customer-phone" type="tel" {...editForm.register('phone')} error={editForm.formState.errors.phone?.message} />
                  </FieldWrapper>
                  <SearchableReferenceField
                    label="Branch"
                    value={editForm.watch('branch_id')}
                    onChange={(value) => editForm.setValue('branch_id', value)}
                    loadOptions={branchLookup}
                    error={editForm.formState.errors.branch_id?.message}
                    placeholder="Search branches"
                    required
                  />
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(spineAdminApi.customers.remove(selected.id), {
                          loading: 'Deleting customer...',
                          success: 'Customer deleted',
                          error: 'Failed to delete customer',
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
