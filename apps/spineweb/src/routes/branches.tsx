import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminCheckbox, AdminInput, AdminTextarea, FieldWrapper, FormGrid, FormPanel, SearchableReferenceField } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { unwrapPagedResponse } from '#/lib/api-request';
import { spineAdminApi } from '#/lib/spine-admin-api';
import { getBusinesses } from '#/lib/admin-api';

const branchSchema = z.object({
  name: z.string().trim().min(1, 'Branch name is required'),
  business_id: z.string().trim().min(1, 'Business is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  street_address: z.string().trim().min(1, 'Street address is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  country: z.string().trim().min(1, 'Country is required'),
  is_head_office: z.boolean().default(false),
});

type BranchFormValues = z.infer<typeof branchSchema>;

export const Route = createFileRoute('/branches')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: BranchesPage,
});

function BranchesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<any | null>(null);

  const createForm = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      business_id: '',
      phone: '',
      street_address: '',
      city: '',
      state: '',
      country: '',
      is_head_office: false,
    },
  });

  const editForm = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      name: '',
      business_id: '',
      phone: '',
      street_address: '',
      city: '',
      state: '',
      country: '',
      is_head_office: false,
    },
  });

  const load = async () => {
    const res = await spineAdminApi.branches.list({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setItems(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load branches'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelected(null);
      return;
    }

    spineAdminApi.branches.get(selectedId)
      .then((res) => setSelected(res.data))
      .catch(() => adminToast.error('Failed to load branch details'));
  }, [search.selected]);

  useEffect(() => {
    if (selected) {
      editForm.reset({
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
  }, [editForm, selected]);

  const openBranch = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, selected: id }),
    });
  };

  const businessLookup = async (query: string) => {
    const response = await getBusinesses({ q: query, limit: 12 });
    const paged = unwrapPagedResponse<any>(response);
    return paged.rows.map((business) => ({
      value: business.id,
      label: business.name,
      description: [business.type, business.city, business.state].filter(Boolean).join(' • '),
    }));
  };

  const selectedSummary = useMemo(() => {
    if (!selected) {
      return 'Select a branch to see details.';
    }

    return `${selected.business?.name ?? 'No business'} • ${selected.products?.length ?? 0} products`;
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Branches"
        description="Manage branch records, linked business ownership, and branch-level operational data."
        sidebar={
          <FormPanel title="Create branch" description="Choose a business and enter the branch profile details.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                    spineAdminApi.branches.create({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating branch...',
                    success: 'Branch created',
                    error: 'Failed to create branch',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FieldWrapper label="Branch name" htmlFor="create-branch-name" error={createForm.formState.errors.name?.message}>
                <AdminInput id="create-branch-name" type="text" {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </FieldWrapper>
              <SearchableReferenceField
                label="Business"
                value={createForm.watch('business_id')}
                onChange={(value) => createForm.setValue('business_id', value)}
                loadOptions={businessLookup}
                error={createForm.formState.errors.business_id?.message}
                placeholder="Search businesses"
                required
              />
              <FormGrid>
                <FieldWrapper label="Phone" htmlFor="create-branch-phone" error={createForm.formState.errors.phone?.message}>
                  <AdminInput id="create-branch-phone" type="tel" {...createForm.register('phone')} error={createForm.formState.errors.phone?.message} />
                </FieldWrapper>
                <FieldWrapper label="City" htmlFor="create-branch-city" error={createForm.formState.errors.city?.message}>
                  <AdminInput id="create-branch-city" type="text" {...createForm.register('city')} error={createForm.formState.errors.city?.message} />
                </FieldWrapper>
              </FormGrid>
              <FieldWrapper label="Street address" htmlFor="create-branch-street" error={createForm.formState.errors.street_address?.message}>
                <AdminTextarea id="create-branch-street" {...createForm.register('street_address')} error={createForm.formState.errors.street_address?.message} />
              </FieldWrapper>
              <FormGrid>
                <FieldWrapper label="State" htmlFor="create-branch-state" error={createForm.formState.errors.state?.message}>
                  <AdminInput id="create-branch-state" type="text" {...createForm.register('state')} error={createForm.formState.errors.state?.message} />
                </FieldWrapper>
                <FieldWrapper label="Country" htmlFor="create-branch-country" error={createForm.formState.errors.country?.message}>
                  <AdminInput id="create-branch-country" type="text" {...createForm.register('country')} error={createForm.formState.errors.country?.message} />
                </FieldWrapper>
              </FormGrid>
              <AdminCheckbox
                label="Head office"
                description="Mark the branch as the business head office."
                checked={Boolean(createForm.watch('is_head_office'))}
                onCheckedChange={(checked) => createForm.setValue('is_head_office', checked)}
              />
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save branch
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Branch list</h2>
              <p className="mt-1 text-sm text-slate-500">Search and select a branch to inspect its products, customers, and inventory.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="branch-search">
                <AdminInput
                  id="branch-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search name, city, state, country, or phone"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Branches"
            description="Row click opens the structured branch drawer."
            rows={items}
            columns={['Name', 'Business', 'Location', 'Products']}
            selectedId={search.selected}
            onSelect={openBranch}
            getRowLabel={(item) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">{item.business?.name ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">
                  {item.city}, {item.state}
                </td>
                <td className="px-4 py-3 text-slate-600">{item.products?.length ?? 0}</td>
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
          title={selected?.name ?? 'Branch details'}
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
                  ['Street address', selected.street_address],
                  ['City', selected.city],
                  ['State', selected.state],
                  ['Country', selected.country],
                  ['Head office', selected.is_head_office ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit branch" description="Update the branch profile or move it to another business.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                    spineAdminApi.branches.update(selected.id, {
                        ...values,
                        sync_status: 'completed',
                        sync_date: new Date().toISOString(),
                      }),
                      {
                        loading: 'Saving branch...',
                        success: 'Branch updated',
                        error: 'Failed to update branch',
                      },
                    );
                    await load();
                  })}
                >
                  <FieldWrapper label="Branch name" htmlFor="edit-branch-name" error={editForm.formState.errors.name?.message}>
                    <AdminInput id="edit-branch-name" type="text" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
                  </FieldWrapper>
                  <SearchableReferenceField
                    label="Business"
                    value={editForm.watch('business_id')}
                    onChange={(value) => editForm.setValue('business_id', value)}
                    loadOptions={businessLookup}
                    error={editForm.formState.errors.business_id?.message}
                    placeholder="Search businesses"
                    required
                  />
                  <FormGrid>
                    <FieldWrapper label="Phone" htmlFor="edit-branch-phone" error={editForm.formState.errors.phone?.message}>
                      <AdminInput id="edit-branch-phone" type="tel" {...editForm.register('phone')} error={editForm.formState.errors.phone?.message} />
                    </FieldWrapper>
                    <FieldWrapper label="City" htmlFor="edit-branch-city" error={editForm.formState.errors.city?.message}>
                      <AdminInput id="edit-branch-city" type="text" {...editForm.register('city')} error={editForm.formState.errors.city?.message} />
                    </FieldWrapper>
                  </FormGrid>
                  <FieldWrapper label="Street address" htmlFor="edit-branch-street" error={editForm.formState.errors.street_address?.message}>
                    <AdminTextarea id="edit-branch-street" {...editForm.register('street_address')} error={editForm.formState.errors.street_address?.message} />
                  </FieldWrapper>
                  <FormGrid>
                    <FieldWrapper label="State" htmlFor="edit-branch-state" error={editForm.formState.errors.state?.message}>
                      <AdminInput id="edit-branch-state" type="text" {...editForm.register('state')} error={editForm.formState.errors.state?.message} />
                    </FieldWrapper>
                    <FieldWrapper label="Country" htmlFor="edit-branch-country" error={editForm.formState.errors.country?.message}>
                      <AdminInput id="edit-branch-country" type="text" {...editForm.register('country')} error={editForm.formState.errors.country?.message} />
                    </FieldWrapper>
                  </FormGrid>
                  <AdminCheckbox
                    label="Head office"
                    description="Mark the branch as the business head office."
                    checked={Boolean(editForm.watch('is_head_office'))}
                    onCheckedChange={(checked) => editForm.setValue('is_head_office', checked)}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(spineAdminApi.branches.remove(selected.id), {
                          loading: 'Deleting branch...',
                          success: 'Branch deleted',
                          error: 'Failed to delete branch',
                        });
                        navigate({
                          search: (prev) => ({ ...prev, selected: undefined }),
                        });
                        await load();
                      }}
                    >
                      Delete
                    </button>
                    {selected.business ? (
                      <Link
                        to="/businesses"
                        search={{ selected: selected.business.id }}
                        className="border border-slate-200 px-4 py-2 text-sm font-medium text-[#1f6f4a]"
                      >
                        Open business
                      </Link>
                    ) : null}
                  </div>
                </form>
              </FormPanel>

              <FormPanel title="Business" description="The linked parent business remains a clickable relationship.">
                <div className="flex items-center justify-between gap-4 border border-slate-200 p-3">
                  <div>
                    <p className="text-sm font-medium text-slate-950">{selected.business?.name ?? 'No linked business'}</p>
                    <p className="text-xs text-slate-500">{selected.business?.type ?? '—'}</p>
                  </div>
                  {selected.business ? (
                    <Link
                      to="/businesses"
                      search={{ selected: selected.business.id }}
                      className="border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1f6f4a]"
                    >
                      Open
                    </Link>
                  ) : null}
                </div>
              </FormPanel>

              <FormPanel title="Related products" description="Products, customers, inventory, and users tied to this branch.">
                <div className="grid gap-3">
                  {(selected.products ?? []).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between gap-3 border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.barcode ?? 'No barcode'}</p>
                      </div>
                      <Link to="/catalog/$productId" params={{ productId: product.id }} className="border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1f6f4a]">
                        Open
                      </Link>
                    </div>
                  ))}
                  {(selected.products ?? []).length === 0 ? <p className="text-sm text-slate-500">No linked products.</p> : null}
                </div>
              </FormPanel>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
