import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { EntityTable } from '#/components/admin/entity-table';
import { ModulePage } from '#/components/admin/module-page';
import { AdminInput, FieldWrapper, FormPanel } from '#/components/admin/admin-form';
import { PaginationBar } from '#/components/admin/pagination';
import { adminToast } from '#/lib/toast';
import { unwrapPagedResponse } from '#/lib/api-request';
import { spineAdminApi } from '#/lib/spine-admin-api';

const categorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export const Route = createFileRoute('/product-categories')({
  validateSearch: (search: Record<string, unknown>) => ({
    page: typeof search.page === 'number' ? search.page : 1,
    limit: typeof search.limit === 'number' ? search.limit : 20,
    q: typeof search.q === 'string' ? search.q : '',
    selected: typeof search.selected === 'string' ? search.selected : undefined,
  }),
  component: ProductCategoriesPage,
});

function ProductCategoriesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [meta, setMeta] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 });
  const [selected, setSelected] = useState<any | null>(null);

  const createForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const editForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: '' },
  });

  const load = async () => {
    const res = await spineAdminApi.productCategories.list({ page: search.page, q: search.q || undefined, limit: search.limit });
    const paged = unwrapPagedResponse<any>(res);
    setItems(paged.rows);
    setMeta(paged.meta);
  };

  useEffect(() => {
    load().catch(() => adminToast.error('Failed to load product categories'));
  }, [search.page, search.q, search.limit]);

  useEffect(() => {
    const selectedId = search.selected;
    if (!selectedId) {
      setSelected(null);
      return;
    }

    spineAdminApi.productCategories.get(selectedId)
      .then((res) => {
        setSelected(res.data);
        editForm.reset({
          name: res.data.name ?? '',
        });
      })
      .catch(() => adminToast.error('Failed to load category details'));
  }, [editForm, search.selected]);

  const openCategory = (id: string) => {
    navigate({
      search: (prev) => ({ ...prev, selected: id }),
    });
  };

  const selectedSummary = useMemo(() => {
    if (!selected) {
      return 'Select a category to see details.';
    }
    return `${selected.global_products ?? 0} linked products`;
  }, [selected]);

  return (
    <DashboardShell>
      <ModulePage
        title="Product categories"
        description="Organize the global catalog using simple, searchable category records."
        sidebar={
          <FormPanel title="Create category" description="Categories keep the catalog structured.">
            <form
              className="space-y-4"
              onSubmit={createForm.handleSubmit(async (values) => {
                await adminToast.promise(
                  spineAdminApi.productCategories.create({
                    ...values,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  }),
                  {
                    loading: 'Creating category...',
                    success: 'Category created',
                    error: 'Failed to create category',
                  },
                );
                createForm.reset();
                await load();
              })}
            >
              <FieldWrapper label="Category name" htmlFor="create-category-name" error={createForm.formState.errors.name?.message}>
                <AdminInput id="create-category-name" type="text" {...createForm.register('name')} error={createForm.formState.errors.name?.message} />
              </FieldWrapper>
              <button type="submit" className="w-full border border-slate-950 bg-slate-950 px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                Save category
              </button>
            </form>
          </FormPanel>
        }
      >
        <section className="border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Category list</h2>
              <p className="mt-1 text-sm text-slate-500">Open a category to inspect linked global products.</p>
            </div>
            <div className="w-full max-w-md">
              <FieldWrapper label="Search" htmlFor="category-search">
                <AdminInput
                  id="category-search"
                  type="search"
                  value={search.q}
                  onChange={(event) =>
                    navigate({
                      search: (prev) => ({ ...prev, q: event.target.value, page: 1 }),
                    })
                  }
                  placeholder="Search category name"
                />
              </FieldWrapper>
            </div>
          </div>

          <EntityTable
            title="Product categories"
            description="Server-side paged category rows."
            rows={items}
            columns={['Name', 'Linked products']}
            selectedId={search.selected}
            onSelect={openCategory}
            getRowLabel={(item) => (
              <>
                <td className="px-4 py-3 font-medium text-slate-950">{item.name}</td>
                <td className="px-4 py-3 text-slate-600">{item.global_products ?? 0}</td>
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
          title={selected?.name ?? 'Category details'}
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
                  ['Category name', selected.name],
                  ['Linked products', selected.global_products ?? 0],
                ].map(([label, value]) => (
                  <article key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </article>
                ))}
              </section>

              <FormPanel title="Edit category" description="Rename the category or remove it after moving linked products.">
                <form
                  className="space-y-4"
                  onSubmit={editForm.handleSubmit(async (values) => {
                    await adminToast.promise(
                      spineAdminApi.productCategories.update(selected.id, values),
                      {
                        loading: 'Saving category...',
                        success: 'Category updated',
                        error: 'Failed to update category',
                      },
                    );
                    await load();
                  })}
                >
                  <FieldWrapper label="Category name" htmlFor="edit-category-name" error={editForm.formState.errors.name?.message}>
                    <AdminInput id="edit-category-name" type="text" {...editForm.register('name')} error={editForm.formState.errors.name?.message} />
                  </FieldWrapper>
                  <div className="flex flex-wrap gap-3">
                    <button type="submit" className="border border-slate-950 bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f6f4a]">
                      Save changes
                    </button>
                    <button
                      type="button"
                      className="border border-slate-200 px-4 py-2 text-sm font-medium text-rose-600 transition hover:border-rose-300"
                      onClick={async () => {
                        await adminToast.promise(spineAdminApi.productCategories.remove(selected.id), {
                          loading: 'Deleting category...',
                          success: 'Category deleted',
                          error: 'Failed to delete category',
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

              <FormPanel title="Linked global products" description="The detail view stays structured rather than raw JSON.">
                <div className="space-y-3">
                  {(selected.global_products ?? []).map((product: any) => (
                    <div key={product.id} className="border border-slate-200 p-3">
                      <p className="text-sm font-medium text-slate-950">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.barcode ?? 'No barcode'}</p>
                    </div>
                  ))}
                </div>
              </FormPanel>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}
