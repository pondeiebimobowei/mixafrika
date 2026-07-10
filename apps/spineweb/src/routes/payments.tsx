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
import { entityApi } from '#/lib/entity-api';
import { spineAdminApi } from '#/lib/spine-admin-api';

const paymentSchema = z.object({
  amount: z.coerce.number().min(0, 'Amount is required'),
  reference: z.string().trim().min(1, 'Reference is required'),
  payment_method: z.string().trim().min(1, 'Payment method is required'),
  status: z.string().trim().min(1, 'Status is required'),
  sale_id: z.string().trim().min(1, 'Sale is required'),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export const Route = createFileRoute('/payments')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<any | null>(null);

  const createForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: 0, reference: '', payment_method: '', status: 'pending', sale_id: '' },
  });

  const editForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amount: 0, reference: '', payment_method: '', status: 'pending', sale_id: '' },
  });

  const load = async () => {
    const res = await spineAdminApi.payments.list({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setItems(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load payments'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelected(null);
      return;
    }

    spineAdminApi.payments.get(selectedId)
      .then((res) => {
        setSelected(res.data);
        editForm.reset({
          amount: res.data.amount ?? 0,
          reference: res.data.reference ?? '',
          payment_method: res.data.payment_method ?? '',
          status: res.data.status ?? 'pending',
          sale_id: res.data.sale_id ?? '',
        });
      })
      .catch(() => adminToast.error('Failed to load payment details'));
  }, [editForm, search.selected]);

  const saleLookup = async (query: string) => {
    const response = await entityApi.sales.list({ q: query, limit: 12 });
    const paged = unwrapPagedResponse<any>(response);
    return paged.rows.map((sale) => ({
      value: sale.id,
      label: sale.reference ?? sale.id,
      description: sale.customer?.name ?? sale.branch?.name ?? 'Sale record',
    }));
  };

  const selectedSummary = useMemo(() => {
    if (!selected) {
      return 'Select a payment to see details.';
    }
    return `${selected.status} • ${selected.amount}`;
  }, [selected]);

  const openRow = (id: string) => {
    navigate({ search: (prev) => ({ ...prev, selected: id }) });
  };

  return (
    <DashboardShell>
      <ModulePage
        title="Payments"
        description="Manage payment records with searchable sale links and structured details."
        sidebar={
          <FormPanel title="Create payment" description="Select the linked sale and capture the payment details.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  spineAdminApi.payments.create({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating payment...',
                    success: 'Payment created',
                    error: 'Failed to create payment',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FieldWrapper label="Amount" htmlFor="create-payment-amount" error={createForm.formState.errors.amount?.message}>
                <AdminInput id="create-payment-amount" type="number" step="0.01" {...createForm.register('amount')} error={createForm.formState.errors.amount?.message} />
              </FieldWrapper>
              <FieldWrapper label="Reference" htmlFor="create-payment-reference" error={createForm.formState.errors.reference?.message}>
                <AdminInput id="create-payment-reference" type="text" {...createForm.register('reference')} error={createForm.formState.errors.reference?.message} />
              </FieldWrapper>
              <FieldWrapper label="Payment method" htmlFor="create-payment-method" error={createForm.formState.errors.payment_method?.message}>
                <AdminInput id="create-payment-method" type="text" {...createForm.register('payment_method')} error={createForm.formState.errors.payment_method?.message} />
              </FieldWrapper>
              <FieldWrapper label="Status" htmlFor="create-payment-status" error={createForm.formState.errors.status?.message}>
                <AdminInput id="create-payment-status" type="text" {...createForm.register('status')} error={createForm.formState.errors.status?.message} />
              </FieldWrapper>
              <SearchableReferenceField
                label="Sale"
                value={createForm.watch('sale_id')}
                onChange={(value) => createForm.setValue('sale_id', value)}
                loadOptions={saleLookup}
                error={createForm.formState.errors.sale_id?.message}
                placeholder="Search sales"
                required
              />
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save payment
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Payment list</h2>
              <p className="mt-1 text-sm text-slate-500">Open a payment to inspect the linked sale and update the record.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="payment-search">
                <AdminInput
                  id="payment-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search reference, status, or payment method"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Payments"
            description="Server-side paged payment records."
            rows={items}
            columns={['Amount', 'Method', 'Status', 'Sale']}
            selectedId={search.selected}
            onSelect={openRow}
            getRowLabel={(item) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">{item.amount}</td>
                <td className="px-4 py-3 text-slate-600">{item.payment_method}</td>
                <td className="px-4 py-3 text-slate-600">{item.status}</td>
                <td className="px-4 py-3 text-slate-600">{item.sale?.id ?? item.sale_id}</td>
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
          title={selected?.reference ?? 'Payment details'}
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
                  ['Amount', selected.amount],
                  ['Method', selected.payment_method],
                  ['Reference', selected.reference],
                  ['Status', selected.status],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit payment" description="Update the payment amount, method, status, or linked sale.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      spineAdminApi.payments.update(selected.id, values),
                      {
                        loading: 'Saving payment...',
                        success: 'Payment updated',
                        error: 'Failed to update payment',
                      },
                    );
                    await load();
                  })}
                >
                  <FieldWrapper label="Amount" htmlFor="edit-payment-amount" error={editForm.formState.errors.amount?.message}>
                    <AdminInput id="edit-payment-amount" type="number" step="0.01" {...editForm.register('amount')} error={editForm.formState.errors.amount?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Reference" htmlFor="edit-payment-reference" error={editForm.formState.errors.reference?.message}>
                    <AdminInput id="edit-payment-reference" type="text" {...editForm.register('reference')} error={editForm.formState.errors.reference?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Payment method" htmlFor="edit-payment-method" error={editForm.formState.errors.payment_method?.message}>
                    <AdminInput id="edit-payment-method" type="text" {...editForm.register('payment_method')} error={editForm.formState.errors.payment_method?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Status" htmlFor="edit-payment-status" error={editForm.formState.errors.status?.message}>
                    <AdminInput id="edit-payment-status" type="text" {...editForm.register('status')} error={editForm.formState.errors.status?.message} />
                  </FieldWrapper>
                  <SearchableReferenceField
                    label="Sale"
                    value={editForm.watch('sale_id')}
                    onChange={(value) => editForm.setValue('sale_id', value)}
                    loadOptions={saleLookup}
                    error={editForm.formState.errors.sale_id?.message}
                    placeholder="Search sales"
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
                        await adminToast.promise(spineAdminApi.payments.remove(selected.id), {
                          loading: 'Deleting payment...',
                          success: 'Payment deleted',
                          error: 'Failed to delete payment',
                        });
                        navigate({
                          search: (prev) => ({ ...prev, selected: undefined }),
                        });
                        await load();
                      }}
                    >
                      Delete
                    </button>
                    {selected.sale ? (
                      <Link
                        to="/catalog/$productId"
                        params={{ productId: selected.sale.product_id ?? selected.sale.id }}
                        className="border border-slate-200 px-4 py-2 text-sm font-medium text-[#1f6f4a]"
                      >
                        Open sale context
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
