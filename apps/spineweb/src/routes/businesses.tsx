import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminCheckbox, AdminInput, AdminTextarea, FieldWrapper, FormGrid, FormPanel } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { createBusiness, deleteBusiness, getBusiness, getBusinesses, updateBusiness } from '#/lib/admin-api';
import { unwrapPagedResponse } from '#/lib/api-request';

const businessSchema = z.object({
  name: z.string().trim().min(1, 'Business name is required'),
  type: z.string().trim().min(1, 'Business type is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  street_address: z.string().trim().min(1, 'Street address is required'),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  country: z.string().trim().min(1, 'Country is required'),
  is_verified: z.boolean().default(false),
});

type BusinessFormValues = z.infer<typeof businessSchema>;

export const Route = createFileRoute('/businesses')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: BusinessesPage,
});

function BusinessesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null);

  const createForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      type: '',
      phone: '',
      street_address: '',
      city: '',
      state: '',
      country: '',
      is_verified: false,
    },
  });

  const editForm = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      name: '',
      type: '',
      phone: '',
      street_address: '',
      city: '',
      state: '',
      country: '',
      is_verified: false,
    },
  });

  const load = async () => {
    const res = await getBusinesses({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setBusinesses(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load businesses'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelectedBusiness(null);
      return;
    }

    getBusiness(selectedId)
      .then((res) => {
        setSelectedBusiness(res.data);
        editForm.reset({
          name: res.data.name ?? '',
          type: res.data.type ?? '',
          phone: res.data.phone ?? '',
          street_address: res.data.street_address ?? '',
          city: res.data.city ?? '',
          state: res.data.state ?? '',
          country: res.data.country ?? '',
          is_verified: Boolean(res.data.is_verified),
        });
      })
      .catch(() => adminToast.error('Failed to load business details'));
  }, [editForm, search.selected]);

  const openBusiness = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, selected: id }),
    });
  };

  const selectedSummary = useMemo(() => {
    if (!selectedBusiness) {
      return 'Select a business to see details.';
    }

    return `${selectedBusiness.type} • ${selectedBusiness.city}, ${selectedBusiness.state}`;
  }, [selectedBusiness]);

  return (
    <DashboardShell>
      <ModulePage
        title="Businesses"
        description="Manage business records, their structured details, linked branches, and business users."
        sidebar={
          <FormPanel title="Create business" description="Use the dedicated form to create a business record.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  createBusiness({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating business...',
                    success: 'Business created',
                    error: 'Failed to create business',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FieldWrapper label="Business name" htmlFor="business-name" error={createForm.formState.errors.name?.message}>
                <AdminInput id="business-name" type="text" {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </FieldWrapper>
              <FormGrid>
                <FieldWrapper label="Type" htmlFor="business-type" error={createForm.formState.errors.type?.message}>
                  <AdminInput id="business-type" type="text" {...createForm.register('type')} error={createForm.formState.errors.type?.message} />
                </FieldWrapper>
                <FieldWrapper label="Phone" htmlFor="business-phone" error={createForm.formState.errors.phone?.message}>
                  <AdminInput id="business-phone" type="tel" {...createForm.register('phone')} error={createForm.formState.errors.phone?.message} />
                </FieldWrapper>
              </FormGrid>
              <FieldWrapper label="Street address" htmlFor="business-street" error={createForm.formState.errors.street_address?.message}>
                <AdminTextarea id="business-street" {...createForm.register('street_address')} error={createForm.formState.errors.street_address?.message} />
              </FieldWrapper>
              <FormGrid>
                <FieldWrapper label="City" htmlFor="business-city" error={createForm.formState.errors.city?.message}>
                  <AdminInput id="business-city" type="text" {...createForm.register('city')} error={createForm.formState.errors.city?.message} />
                </FieldWrapper>
                <FieldWrapper label="State" htmlFor="business-state" error={createForm.formState.errors.state?.message}>
                  <AdminInput id="business-state" type="text" {...createForm.register('state')} error={createForm.formState.errors.state?.message} />
                </FieldWrapper>
              </FormGrid>
              <FieldWrapper label="Country" htmlFor="business-country" error={createForm.formState.errors.country?.message}>
                <AdminInput id="business-country" type="text" {...createForm.register('country')} error={createForm.formState.errors.country?.message} />
              </FieldWrapper>
              <AdminCheckbox
                label="Verified business"
                description="Mark the business as verified on creation."
                checked={Boolean(createForm.watch('is_verified'))}
                onCheckedChange={(checked) => createForm.setValue('is_verified', checked)}
              />
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save business
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Business list</h2>
              <p className="mt-1 text-sm text-slate-500">Search and open a row to inspect branches, users, and verification data.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="business-search">
                <AdminInput
                  id="business-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search business name, type, city, state, or country"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Businesses"
            description="Results are paged on the backend and open into a structured drawer."
            rows={businesses}
            columns={['Name', 'Type', 'Location', 'Branches']}
            selectedId={search.selected}
            onSelect={openBusiness}
            getRowLabel={(business) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">{business.name}</td>
                <td className="px-4 py-3 text-slate-600">{business.type}</td>
                <td className="px-4 py-3 text-slate-600">
                  {business.city}, {business.state}
                </td>
                <td className="px-4 py-3 text-slate-600">{business.branches?.length ?? 0}</td>
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
          open={Boolean(selectedBusiness)}
          title={selectedBusiness?.name ?? 'Business details'}
          subtitle={selectedSummary}
          onClose={() =>
            navigate({
              search: (prev) => ({ ...prev, selected: undefined }),
            })
          }
        >
          {selectedBusiness ? (
            <div className="space-y-5">
              <section className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Type', selectedBusiness.type],
                  ['Phone', selectedBusiness.phone],
                  ['Street address', selectedBusiness.street_address],
                  ['City', selectedBusiness.city],
                  ['State', selectedBusiness.state],
                  ['Country', selectedBusiness.country],
                  ['Verified', selectedBusiness.is_verified ? 'Yes' : 'No'],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit business" description="Keep business profile data current.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      updateBusiness(selectedBusiness.id, {
                        ...values,
                        sync_status: 'completed',
                        sync_date: new Date().toISOString(),
                      }),
                      {
                        loading: 'Saving business...',
                        success: 'Business updated',
                        error: 'Failed to update business',
                      },
                    );
                    await load();
                  })}
                >
                  <FieldWrapper label="Business name" htmlFor="edit-business-name" error={editForm.formState.errors.name?.message}>
                    <AdminInput id="edit-business-name" type="text" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
                  </FieldWrapper>
                  <FormGrid>
                    <FieldWrapper label="Type" htmlFor="edit-business-type" error={editForm.formState.errors.type?.message}>
                      <AdminInput id="edit-business-type" type="text" {...editForm.register('type')} error={editForm.formState.errors.type?.message} />
                    </FieldWrapper>
                    <FieldWrapper label="Phone" htmlFor="edit-business-phone" error={editForm.formState.errors.phone?.message}>
                      <AdminInput id="edit-business-phone" type="tel" {...editForm.register('phone')} error={editForm.formState.errors.phone?.message} />
                    </FieldWrapper>
                  </FormGrid>
                  <FieldWrapper label="Street address" htmlFor="edit-business-street" error={editForm.formState.errors.street_address?.message}>
                    <AdminTextarea id="edit-business-street" {...editForm.register('street_address')} error={editForm.formState.errors.street_address?.message} />
                  </FieldWrapper>
                  <FormGrid>
                    <FieldWrapper label="City" htmlFor="edit-business-city" error={editForm.formState.errors.city?.message}>
                      <AdminInput id="edit-business-city" type="text" {...editForm.register('city')} error={editForm.formState.errors.city?.message} />
                    </FieldWrapper>
                    <FieldWrapper label="State" htmlFor="edit-business-state" error={editForm.formState.errors.state?.message}>
                      <AdminInput id="edit-business-state" type="text" {...editForm.register('state')} error={editForm.formState.errors.state?.message} />
                    </FieldWrapper>
                  </FormGrid>
                  <FieldWrapper label="Country" htmlFor="edit-business-country" error={editForm.formState.errors.country?.message}>
                    <AdminInput id="edit-business-country" type="text" {...editForm.register('country')} error={editForm.formState.errors.country?.message} />
                  </FieldWrapper>
                  <AdminCheckbox
                    label="Verified business"
                    description="Toggle the verification flag for this business."
                    checked={Boolean(editForm.watch('is_verified'))}
                    onCheckedChange={(checked) => editForm.setValue('is_verified', checked)}
                  />
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(deleteBusiness(selectedBusiness.id), {
                          loading: 'Deleting business...',
                          success: 'Business deleted',
                          error: 'Failed to delete business',
                        });
                        navigate({
                          search: (prev) => ({ ...prev, selected: undefined }),
                        });
                        await load();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </form>
              </FormPanel>

              <FormPanel title="Branches" description="Linked branches stay visible and actionable.">
                <div className="space-y-3">
                  {(selectedBusiness.branches ?? []).map((branch: any) => (
                    <div key={branch.id} className="flex items-center justify-between gap-4 border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{branch.name}</p>
                        <p className="text-xs text-slate-500">
                          {branch.city}, {branch.state}
                          {branch.is_head_office ? ' • Head office' : ''}
                        </p>
                      </div>
                      <Link
                        to="/branches"
                        search={{ selected: branch.id }}
                        className="border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1f6f4a]"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
                  {(selectedBusiness.branches ?? []).length === 0 ? <p className="text-sm text-slate-500">No linked branches.</p> : null}
                </div>
              </FormPanel>

              <FormPanel title="Business users" description="Structured membership records linked to this business.">
                <div className="space-y-3">
                  {(selectedBusiness.users ?? []).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between gap-4 border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-950">
                          {user.user?.first_name ?? user.first_name ?? 'User'} {user.user?.last_name ?? user.last_name ?? ''}
                        </p>
                        <p className="text-xs text-slate-500">{user.role}</p>
                      </div>
                      <Link
                        to="/users"
                        search={{ selected: user.user?.id ?? user.user_id }}
                        className="border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1f6f4a]"
                      >
                        Open
                      </Link>
                    </div>
                  ))}
                  {(selectedBusiness.users ?? []).length === 0 ? <p className="text-sm text-slate-500">No linked users.</p> : null}
                </div>
              </FormPanel>

              <FormPanel title="Verification" description="KYB documents and review status.">
                {selectedBusiness.verification ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      ['Status', selectedBusiness.verification.status],
                      ['Type', selectedBusiness.verification.type],
                      ['Document number', selectedBusiness.verification.doc_number],
                      ['Submitted at', selectedBusiness.verification.submitted_at],
                      ['Reviewed at', selectedBusiness.verification.reviewed_at],
                      ['Rejection reason', selectedBusiness.verification.rejection_reason ?? '—'],
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
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
