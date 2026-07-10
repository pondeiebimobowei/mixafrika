import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { ModulePage } from '#/components/admin/module-page';
import { entityApi } from '#/lib/entity-api';

export const Route = createFileRoute('/catalog')({
  component: CatalogRoute,
});

function CatalogRoute() {
  const navigate = Route.useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    barcode: '',
    branch_id: '',
    description: '',
    bulk_unit_name: '',
    piece_unit_name: '',
    units_per_bulk: '',
    selling_price_per_piece: '',
    selling_price_per_bulk: '',
    category: '',
    image_url: '',
  });

  const load = async () => {
    const [productRes, batchRes, inventoryRes] = await Promise.all([
      entityApi.products.list(),
      entityApi.batches.list(),
      entityApi.inventory.list(),
    ]);
    setProducts(productRes.data);
    setBatches(batchRes.data);
    setInventory(inventoryRes.data);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load catalog'));
  }, []);

  const metrics = useMemo(() => {
    const batchCount = new Map<string, number>();
    const stockCount = new Map<string, number>();

    for (const batch of batches) {
      batchCount.set(batch.product_id, (batchCount.get(batch.product_id) ?? 0) + 1);
    }

    for (const item of inventory) {
      stockCount.set(item.product_id, (stockCount.get(item.product_id) ?? 0) + Number(item.quantity ?? 0));
    }

    return { batchCount, stockCount };
  }, [batches, inventory]);

  return (
    <DashboardShell>
      <ModulePage
        title="Catalog management"
        description="Products are listed here. Click any product to open its dedicated detail page where batches, inventory, and related records live."
        sidebar={
          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">Create product</h3>
            <p className="mt-1 text-sm text-slate-500">
              The product detail page will own batch creation and inspection.
            </p>
            <form
              className="mt-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);

                try {
                  const createdProduct = await entityApi.products.create({
                    ...productForm,
                    units_per_bulk: Number(productForm.units_per_bulk || 1),
                    selling_price_per_piece: Number(productForm.selling_price_per_piece || 0),
                    selling_price_per_bulk: Number(productForm.selling_price_per_bulk || 0),
                    reviews: '',
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  });

                  if (!createdProduct.data?.id) {
                    throw new Error('Product was created but no product ID was returned');
                  }

                  await entityApi.inventory.create({
                    product_id: createdProduct.data.id,
                    branch_id: productForm.branch_id,
                    quantity: 0,
                    sync_status: 'completed',
                    sync_date: new Date().toISOString(),
                  });

                  setProductForm({
                    name: '',
                    barcode: '',
                    branch_id: '',
                    description: '',
                    bulk_unit_name: '',
                    piece_unit_name: '',
                    units_per_bulk: '',
                    selling_price_per_piece: '',
                    selling_price_per_bulk: '',
                    category: '',
                    image_url: '',
                  });
                  await load();
                } catch (submitError) {
                  setError(submitError instanceof Error ? submitError.message : 'Failed to create product');
                }
              }}
            >
              {[
                ['name', 'Name'],
                ['barcode', 'Barcode'],
                ['branch_id', 'Branch ID'],
                ['description', 'Description'],
                ['bulk_unit_name', 'Bulk Unit'],
                ['piece_unit_name', 'Piece Unit'],
                ['units_per_bulk', 'Units Per Bulk'],
                ['selling_price_per_piece', 'Selling Price Per Piece'],
                ['selling_price_per_bulk', 'Selling Price Per Bulk'],
                ['category', 'Category'],
                ['image_url', 'Image URL'],
              ].map(([key, label]) => (
                <input
                  key={key}
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder={label}
                  value={(productForm as any)[key]}
                  onChange={(e) => setProductForm((curr) => ({ ...curr, [key]: e.target.value }))}
                />
              ))}
              <button className="w-full border border-slate-900 bg-slate-950 px-4 py-2 text-white">Save product</button>
            </form>
          </div>
        }
      >
        {error ? <div className="mb-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

        <section className="border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">Products</h2>
              <p className="mt-1 text-sm text-slate-500">Row click opens the product detail page.</p>
            </div>
            <div className="hidden items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400 md:flex">
              <span>{products.length} rows</span>
            </div>
          </div>

          <div className="mt-5 overflow-hidden border border-slate-200">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">Name</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">Branch</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">Barcode</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">Category</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">Batches</th>
                  <th className="border-b border-slate-200 px-4 py-3 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="cursor-pointer border-b border-slate-100 transition hover:bg-[#eef7f1]"
                    onClick={() => navigate({ to: '/catalog/$productId', params: { productId: product.id } })}
                  >
                    <td className="px-4 py-3 font-medium text-slate-950">{product.name}</td>
                    <td className="px-4 py-3 text-slate-600">{product.branch?.name ?? product.branch_id ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{product.global_product?.barcode ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{product.category ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{metrics.batchCount.get(product.id) ?? 0}</td>
                    <td className="px-4 py-3 text-slate-600">{metrics.stockCount.get(product.id) ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ModulePage>
    </DashboardShell>
  );
}
