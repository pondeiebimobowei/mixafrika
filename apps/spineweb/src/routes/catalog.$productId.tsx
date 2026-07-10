import { Link, createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Drawer } from '#/components/admin/drawer';
import { spineAdminApi } from '#/lib/spine-admin-api';

export const Route = createFileRoute('/catalog/$productId')({
  component: ProductDetailRoute,
});

function ProductDetailRoute() {
  const { productId } = Route.useParams();
  const navigate = Route.useNavigate();
  const [product, setProduct] = useState<any | null>(null);
  const [batches, setBatches] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [salesItems, setSalesItems] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
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
  const [batchForm, setBatchForm] = useState({
    batch_number: '',
    branch_id: '',
    expiry_date: '',
    cost_price_per_unit: '',
    selling_price_per_piece: '',
    selling_price_per_bulk: '',
    initial_quantity: '',
    remaining_quantity: '',
  });
  const [batchEditForm, setBatchEditForm] = useState({
    batch_number: '',
    branch_id: '',
    expiry_date: '',
    cost_price_per_unit: '',
    selling_price_per_piece: '',
    selling_price_per_bulk: '',
    initial_quantity: '',
    remaining_quantity: '',
  });

  const load = async () => {
    const productRes = await spineAdminApi.products.get(productId);
    const currentProduct = productRes.data;

    setProduct(currentProduct);
    setBatches(currentProduct.batches ?? []);
    setInventory(currentProduct.inventory ?? []);
    setSalesItems(currentProduct.sales_items ?? []);
    setMovements(currentProduct.stock_movements ?? []);
  };

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : 'Failed to load product'));
  }, [productId]);

  useEffect(() => {
    if (!product) return;

    setProductForm({
      name: product.name ?? '',
      barcode: product.global_product?.barcode ?? '',
      branch_id: product.branch_id ?? '',
      description: product.description ?? '',
      bulk_unit_name: product.bulk_unit_name ?? '',
      piece_unit_name: product.piece_unit_name ?? '',
      units_per_bulk: String(product.units_per_bulk ?? ''),
      selling_price_per_piece: String(product.selling_price_per_piece ?? ''),
      selling_price_per_bulk: String(product.selling_price_per_bulk ?? ''),
      category: product.category ?? '',
      image_url: product.image_url ?? '',
    });

    setBatchForm((curr) => ({
      ...curr,
      branch_id: curr.branch_id || product.branch_id || '',
    }));
  }, [product]);

  useEffect(() => {
    const selected = batches.find((item) => item.id === selectedBatchId) ?? null;
    if (!selected) return;

    setBatchEditForm({
      batch_number: selected.batch_number ?? '',
      branch_id: selected.branch_id ?? '',
      expiry_date: selected.expiry_date ?? '',
      cost_price_per_unit: String(selected.cost_price_per_unit ?? ''),
      selling_price_per_piece: String(selected.selling_price_per_piece ?? ''),
      selling_price_per_bulk: String(selected.selling_price_per_bulk ?? ''),
      initial_quantity: String(selected.initial_quantity ?? ''),
      remaining_quantity: String(selected.remaining_quantity ?? ''),
    });
  }, [batches, selectedBatchId]);

  const selectedBatch = useMemo(
    () => batches.find((item) => item.id === selectedBatchId) ?? null,
    [batches, selectedBatchId],
  );

  const summary = useMemo(() => {
    const totalQuantity = inventory.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);
    const totalRemaining = batches.reduce((sum, batch) => sum + Number(batch.remaining_quantity ?? 0), 0);

    return {
      totalQuantity,
      totalRemaining,
    };
  }, [batches, inventory]);

  return (
    <div className="space-y-6 border-t border-slate-200 pt-6">
      <section className="border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-[#1f6f4a]">Catalog / Product Detail</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              {product?.name ?? 'Product details'}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              This route is a single product view. It differs from the catalogue list by showing only the selected record and its related batches, inventory, and movements.
            </p>
          </div>
          <Link
            to="/catalog"
            className="border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-[#1f6f4a] hover:text-[#1f6f4a]"
          >
            Back to catalog
          </Link>
        </div>
      </section>

      {error ? <div className="border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}

      {product ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ['Branch', product.branch?.name ?? product.branch_id ?? '—'],
                ['Global barcode', product.global_product?.barcode ?? '—'],
                ['Category', product.category ?? '—'],
                ['Total stock', summary.totalQuantity],
                ['Batch count', batches.length],
                ['Remaining units', summary.totalRemaining],
                ['Piece price', product.selling_price_per_piece ?? '—'],
                ['Bulk price', product.selling_price_per_bulk ?? '—'],
              ].map(([label, value]) => (
                <article key={label} className="border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-slate-950">{String(value)}</p>
                </article>
              ))}
            </section>

            <section className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">Batches</h3>
                  <p className="mt-1 text-sm text-slate-500">Click a batch row to inspect and edit expiry, quantity, and price details.</p>
                </div>
                <span className="border border-slate-200 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                  {batches.length} batches
                </span>
              </div>

              <div className="mt-5 overflow-x-auto border border-slate-200">
                <table className="min-w-[760px] border-collapse text-left text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Batch</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Branch</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Expiry</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Initial</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Remaining</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Cost / Unit</th>
                      <th className="border-b border-slate-200 px-4 py-3 font-medium">Piece / Bulk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr
                        key={batch.id}
                        className="cursor-pointer border-b border-slate-100 transition hover:bg-[#eef7f1]"
                        onClick={() => setSelectedBatchId(batch.id)}
                      >
                        <td className="px-4 py-3 font-medium text-slate-950">{batch.batch_number}</td>
                        <td className="px-4 py-3 text-slate-600">{batch.branch?.name ?? batch.branch_id ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-600">{formatDate(batch.expiry_date)}</td>
                        <td className="px-4 py-3 text-slate-600">{batch.initial_quantity ?? 0}</td>
                        <td className="px-4 py-3 text-slate-600">{batch.remaining_quantity ?? 0}</td>
                        <td className="px-4 py-3 text-slate-600">{batch.cost_price_per_unit ?? '—'}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {batch.selling_price_per_piece ?? '—'} / {batch.selling_price_per_bulk ?? '—'}
                        </td>
                      </tr>
                    ))}
                    {batches.length === 0 ? (
                      <tr>
                        <td className="px-4 py-4 text-sm text-slate-500" colSpan={7}>
                          No batches have been created for this product yet.
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <SimpleTable
                title="Inventory snapshot"
                description="Branch-level inventory records linked to this product."
                columns={['Branch', 'Quantity', 'Batch', 'Sync']}
                rows={inventory.map((item) => ({
                  id: item.id,
                  cells: [
                    item.branch?.name ?? item.branch_id ?? '—',
                    item.quantity ?? 0,
                    item.batch?.batch_number ?? item.batch_id ?? '—',
                    item.sync_status ?? '—',
                  ],
                }))}
              />
              <SimpleTable
                title="Sales items"
                description="Sales lines tied to this product."
                columns={['Sale', 'Batch', 'Quantity', 'Total']}
                rows={salesItems.map((item) => ({
                  id: item.id,
                  cells: [
                    item.sale_id ?? '—',
                    item.batch?.batch_number ?? item.batch_id ?? '—',
                    item.quantity ?? '—',
                    item.total ?? '—',
                  ],
                }))}
              />
            </section>

            <SimpleTable
              title="Stock movements"
              description="Operational movement history for the selected product."
              columns={['Type', 'Quantity', 'Branch', 'Batch', 'Note']}
              rows={movements.map((item) => ({
                id: item.id,
                cells: [
                  item.type ?? '—',
                  item.quantity ?? '—',
                  item.branch?.name ?? item.branch_id ?? '—',
                  item.batch?.batch_number ?? item.batch_id ?? '—',
                  item.note ?? '—',
                ],
              }))}
            />

            <section className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-slate-950">Add stock</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Confirm a stock receipt for this product. The backend will create the batch, record the stock movement, and update inventory together.
                  </p>
                </div>
                <span className="border border-slate-200 px-3 py-2 text-xs uppercase tracking-[0.25em] text-slate-500">
                  Stock receipt
                </span>
              </div>

              <form
                className="mt-5 grid gap-3 sm:grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setError(null);

                  try {
                    await entityApi.batches.create({
                      ...batchForm,
                      product_id: productId,
                      branch_id: batchForm.branch_id || product?.branch_id || '',
                      batch_number: batchForm.batch_number || `BATCH-${Date.now()}`,
                      cost_price_per_unit: Number(batchForm.cost_price_per_unit || 0),
                      selling_price_per_piece: Number(batchForm.selling_price_per_piece || 0),
                      selling_price_per_bulk: Number(batchForm.selling_price_per_bulk || 0),
                      initial_quantity: Number(batchForm.initial_quantity || 0),
                      remaining_quantity: Number(batchForm.remaining_quantity || batchForm.initial_quantity || 0),
                      sync_status: 'completed',
                      sync_date: new Date().toISOString(),
                    });
                    setBatchForm({
                      batch_number: '',
                      branch_id: product?.branch_id ?? '',
                      expiry_date: '',
                      cost_price_per_unit: '',
                      selling_price_per_piece: '',
                      selling_price_per_bulk: '',
                      initial_quantity: '',
                      remaining_quantity: '',
                    });
                    await load();
                  } catch (submitError) {
                    setError(submitError instanceof Error ? submitError.message : 'Failed to create batch');
                  }
                }}
              >
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Batch Number"
                  value={batchForm.batch_number}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, batch_number: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Branch ID"
                  value={batchForm.branch_id}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, branch_id: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Expiry Date"
                  value={batchForm.expiry_date}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, expiry_date: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Cost Price Per Unit"
                  value={batchForm.cost_price_per_unit}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, cost_price_per_unit: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Selling Price Per Piece"
                  value={batchForm.selling_price_per_piece}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, selling_price_per_piece: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Selling Price Per Bulk"
                  value={batchForm.selling_price_per_bulk}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, selling_price_per_bulk: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Initial Quantity"
                  value={batchForm.initial_quantity}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, initial_quantity: e.target.value }))}
                />
                <input
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder="Remaining Quantity"
                  value={batchForm.remaining_quantity}
                  onChange={(e) => setBatchForm((curr) => ({ ...curr, remaining_quantity: e.target.value }))}
                />
                  <button className="sm:col-span-2 border border-slate-900 bg-slate-950 px-4 py-2 text-white">
                  Confirm stock
                </button>
              </form>
            </section>
          </div>

          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <section className="border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-950">Selected product</h3>
              <p className="mt-1 text-sm text-slate-500">
                Structured product data for the singular record currently in view.
              </p>

              <dl className="mt-5 grid gap-3">
                {[
                  ['Name', product?.name ?? '—'],
                  ['Barcode', product?.global_product?.barcode ?? '—'],
                  ['Branch', product?.branch?.name ?? product?.branch_id ?? '—'],
                  ['Description', product?.description ?? '—'],
                  ['Bulk unit', product?.bulk_unit_name ?? '—'],
                  ['Piece unit', product?.piece_unit_name ?? '—'],
                  ['Units per bulk', product?.units_per_bulk ?? '—'],
                  ['Piece price', product?.selling_price_per_piece ?? '—'],
                  ['Bulk price', product?.selling_price_per_bulk ?? '—'],
                  ['Category', product?.category ?? '—'],
                  ['Image URL', product?.image_url ?? '—'],
                ].map(([label, value]) => (
                  <div key={label as string} className="border border-slate-200 px-3 py-2">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</dt>
                    <dd className="mt-1 break-words text-sm font-medium text-slate-950">{String(value)}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      ) : (
        <div className="border border-slate-200 bg-white p-5 text-sm text-slate-500 shadow-sm">Loading product details...</div>
      )}

      <Drawer
        open={Boolean(selectedBatch)}
        title={selectedBatch?.batch_number ?? 'Batch details'}
        subtitle={selectedBatch ? `${selectedBatch.branch?.name ?? selectedBatch.branch_id ?? 'No branch'} • ${formatDate(selectedBatch.expiry_date)}` : undefined}
        onClose={() => setSelectedBatchId(null)}
      >
        {selectedBatch ? (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ['Batch number', selectedBatch.batch_number],
                ['Branch', selectedBatch.branch?.name ?? selectedBatch.branch_id],
                ['Expiry date', formatDate(selectedBatch.expiry_date)],
                ['Initial quantity', selectedBatch.initial_quantity],
                ['Remaining quantity', selectedBatch.remaining_quantity],
                ['Cost per unit', selectedBatch.cost_price_per_unit],
                ['Selling price / piece', selectedBatch.selling_price_per_piece],
                ['Selling price / bulk', selectedBatch.selling_price_per_bulk],
              ].map(([label, value]) => (
                <div key={label} className="border border-slate-200 p-3">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                </div>
              ))}
            </div>

            <form
              className="border border-slate-200 p-4 space-y-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);

                try {
                  await entityApi.batches.update(selectedBatch.id, {
                    ...batchEditForm,
                    cost_price_per_unit: Number(batchEditForm.cost_price_per_unit || 0),
                    selling_price_per_piece: Number(batchEditForm.selling_price_per_piece || 0),
                    selling_price_per_bulk: Number(batchEditForm.selling_price_per_bulk || 0),
                    initial_quantity: Number(batchEditForm.initial_quantity || 0),
                    remaining_quantity: Number(batchEditForm.remaining_quantity || 0),
                  });
                  await load();
                } catch (submitError) {
                  setError(submitError instanceof Error ? submitError.message : 'Failed to update batch');
                }
              }}
            >
              <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit batch</h4>
              {Object.entries(batchEditForm).map(([key, value]) => (
                <input
                  key={key}
                  className="w-full border border-slate-200 px-3 py-2"
                  placeholder={key}
                  value={value}
                  onChange={(e) => setBatchEditForm((curr) => ({ ...curr, [key]: e.target.value }))}
                />
              ))}
              <div className="flex gap-2">
                <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                <button
                  type="button"
                  className="border border-slate-200 px-3 py-2 text-rose-600"
                  onClick={async () => {
                    await entityApi.batches.remove(selectedBatch.id);
                    setSelectedBatchId(null);
                    await load();
                  }}
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function SimpleTable({
  title,
  description,
  columns,
  rows,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: Array<{ id: string; cells: Array<string | number> }>;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="mt-5 overflow-x-auto border border-slate-200">
        <table className="min-w-[640px] border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="border-b border-slate-200 px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  {row.cells.map((cell, index) => (
                    <td key={`${row.id}-${index}`} className="px-4 py-3 text-slate-600">
                      {String(cell)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-4 text-sm text-slate-500" colSpan={columns.length}>
                  No records available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDate(value: string | number | null | undefined) {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return String(value);
  }
  return parsed.toLocaleDateString();
}
