import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminInput, AdminTextarea, FieldWrapper, FormGrid, FormPanel, SearchableReferenceField } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { unwrapPagedResponse } from '#/lib/api-request';
import { spineAdminApi } from '#/lib/spine-admin-api';

const globalProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  description: z.string().trim().optional().or(z.literal('')),
  barcode: z.string().trim().min(1, 'Barcode is required'),
  image_url: z.string().trim().url('Enter a valid image URL').optional().or(z.literal('')),
  product_category_id: z.string().trim().min(1, 'Category is required'),
});

type GlobalProductFormValues = z.infer<typeof globalProductSchema>;

export const Route = createFileRoute('/global-products')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: GlobalProductsPage,
});

function GlobalProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<any | null>(null);

  const createForm = useForm<GlobalProductFormValues>({
    resolver: zodResolver(globalProductSchema),
    defaultValues: {
      name: '',
      description: '',
      barcode: '',
      image_url: '',
      product_category_id: '',
    },
  });

  const editForm = useForm<GlobalProductFormValues>({
    resolver: zodResolver(globalProductSchema),
    defaultValues: {
      name: '',
      description: '',
      barcode: '',
      image_url: '',
      product_category_id: '',
    },
  });

  const load = async () => {
    const res = await spineAdminApi.globalProducts.list({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setItems(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load global products'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelected(null);
      return;
    }

    spineAdminApi.globalProducts.get(selectedId)
      .then((res) => {
        setSelected(res.data);
        editForm.reset({
          name: res.data.name ?? '',
          description: res.data.description ?? '',
          barcode: res.data.barcode ?? '',
          image_url: res.data.image_url ?? '',
          product_category_id: res.data.product_category_id ?? '',
        });
      })
      .catch(() => adminToast.error('Failed to load product details'));
  }, [editForm, search.selected]);

  const categoryLookup = async (query: string) => {
    const response = await spineAdminApi.productCategories.list({ q: query, limit: 12 });
    const paged = unwrapPagedResponse<any>(response);
    return paged.rows.map((category) => ({
      value: category.id,
      label: category.name,
      description: `${category.global_products ?? 0} linked products`,
    }));
  };

  const selectedSummary = useMemo(() => {
    if (!selected) {
      return 'Select a global product to see details.';
    }
    return `${selected.barcode ?? 'No barcode'} • ${selected.products?.length ?? 0} linked products`;
  }, [selected]);

  const openProduct = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, selected: id }),
    });
  };

  return (
    <DashboardShell>
      <ModulePage
        title="Global products"
        description="Manage the master product catalog and connect products to a category."
        sidebar={
          <FormPanel title="Create global product" description="Category selection is searchable and the form is fully labeled.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  spineAdminApi.globalProducts.create({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating product...',
                    success: 'Product created',
                    error: 'Failed to create product',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FieldWrapper label="Product name" htmlFor="create-product-name" error={createForm.formState.errors.name?.message}>
                <AdminInput id="create-product-name" type="text" {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </FieldWrapper>
              <FieldWrapper label="Barcode" htmlFor="create-product-barcode" error={createForm.formState.errors.barcode?.message}>
                <AdminInput id="create-product-barcode" type="text" {...createForm.register('barcode')} error={createForm.formState.errors.barcode?.message} />
              </FieldWrapper>
              <SearchableReferenceField
                label="Product category"
                value={createForm.watch('product_category_id')}
                onChange={(value) => createForm.setValue('product_category_id', value)}
                loadOptions={categoryLookup}
                error={createForm.formState.errors.product_category_id?.message}
                placeholder="Search categories"
                required
              />
              <FieldWrapper label="Image URL" htmlFor="create-product-image" error={createForm.formState.errors.image_url?.message}>
                <AdminInput id="create-product-image" type="url" {...createForm.register('image_url')} error={createForm.formState.errors.image_url?.message} />
              </FieldWrapper>
              <FieldWrapper label="Description" htmlFor="create-product-description" error={createForm.formState.errors.description?.message}>
                <AdminTextarea id="create-product-description" {...createForm.register('description')} error={createForm.formState.errors.description?.message} />
              </FieldWrapper>
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save product
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Catalog management</h2>
              <p className="mt-1 text-sm text-slate-500">Search, page, and open individual product detail views for batches and inventory.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="global-product-search">
                <AdminInput
                  id="global-product-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search name, barcode, or normalized name"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Global products"
            description="This is the master catalog used by branch products."
            rows={items}
            columns={['Name', 'Barcode', 'Category', 'Linked products']}
            selectedId={search.selected}
            onSelect={openProduct}
            getRowLabel={(item) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">{item.barcode ?? '—'}</td>
                <td className="px-4 py-3 text-slate-600">{item.product_category?.name ?? '—'}</td>
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
          title={selected?.name ?? 'Global product details'}
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
                  ['Description', selected.description],
                  ['Barcode', selected.barcode],
                  ['Image URL', selected.image_url],
                  ['Category', selected.product_category?.name ?? '—'],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit global product" description="Update the master record that branch products reference.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      spineAdminApi.globalProducts.update(selected.id, values),
                      {
                        loading: 'Saving product...',
                        success: 'Product updated',
                        error: 'Failed to update product',
                      },
                    );
                    await load();
                  })}
                >
                  <FieldWrapper label="Product name" htmlFor="edit-product-name" error={editForm.formState.errors.name?.message}>
                    <AdminInput id="edit-product-name" type="text" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Barcode" htmlFor="edit-product-barcode" error={editForm.formState.errors.barcode?.message}>
                    <AdminInput id="edit-product-barcode" type="text" {...editForm.register('barcode')} error={editForm.formState.errors.barcode?.message} />
                  </FieldWrapper>
                  <SearchableReferenceField
                    label="Product category"
                    value={editForm.watch('product_category_id')}
                    onChange={(value) => editForm.setValue('product_category_id', value)}
                    loadOptions={categoryLookup}
                    error={editForm.formState.errors.product_category_id?.message}
                    placeholder="Search categories"
                    required
                  />
                  <FieldWrapper label="Image URL" htmlFor="edit-product-image" error={editForm.formState.errors.image_url?.message}>
                    <AdminInput id="edit-product-image" type="url" {...editForm.register('image_url')} error={editForm.formState.errors.image_url?.message} />
                  </FieldWrapper>
                  <FieldWrapper label="Description" htmlFor="edit-product-description" error={editForm.formState.errors.description?.message}>
                    <AdminTextarea id="edit-product-description" {...editForm.register('description')} error={editForm.formState.errors.description?.message} />
                  </FieldWrapper>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(spineAdminApi.globalProducts.remove(selected.id), {
                          loading: 'Deleting product...',
                          success: 'Product deleted',
                          error: 'Failed to delete product',
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

              <FormPanel title="Linked products" description="Branch products linked to this master record.">
                <div className="space-y-3">
                  {(selected.products ?? []).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between gap-4 border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-950">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.branch?.name ?? 'No branch'}</p>
                      </div>
                      <Link
                        to="/catalog/$productId"
                        params={{ productId: product.id }}
                        className="border border-slate-200 px-3 py-2 text-xs font-medium uppercase tracking-[0.2em] text-[#1f6f4a]"
                      >
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
