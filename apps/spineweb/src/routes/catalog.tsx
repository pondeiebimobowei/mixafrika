import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { DashboardShell } from '#/components/admin/dashboard-shell';
import { Drawer } from '#/components/admin/drawer';
import { ModulePage } from '#/components/admin/module-page';
import { entityApi } from '#/lib/entity-api';

export const Route = createFileRoute('/catalog')({
  component: CatalogRoute,
});

function CatalogRoute() {
  const [products, setProducts] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
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
  const [productEditForm, setProductEditForm] = useState({
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
  const [batchEditForm, setBatchEditForm] = useState({ batch_number: '', product_id: '', branch_id: '', expiry_date: '', cost_price_per_unit: '', selling_price_per_piece: '', selling_price_per_bulk: '', initial_quantity: '', remaining_quantity: '' });
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<any | null>(null);

  const load = async () => {
    try {
      const [productRes, batchRes] = await Promise.all([entityApi.products.list(), entityApi.batches.list()]);
      setProducts(productRes.data);
      setBatches(batchRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load catalog');
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setProductEditForm({
        name: selectedProduct.name ?? '',
        barcode: selectedProduct.global_product?.barcode ?? selectedProduct.barcode ?? '',
        branch_id: selectedProduct.branch_id ?? '',
        description: selectedProduct.description ?? '',
        bulk_unit_name: selectedProduct.bulk_unit_name ?? '',
        piece_unit_name: selectedProduct.piece_unit_name ?? '',
        units_per_bulk: String(selectedProduct.units_per_bulk ?? ''),
        selling_price_per_piece: String(selectedProduct.selling_price_per_piece ?? ''),
        selling_price_per_bulk: String(selectedProduct.selling_price_per_bulk ?? ''),
        category: selectedProduct.category ?? '',
        image_url: selectedProduct.image_url ?? '',
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedBatch) {
      setBatchEditForm({
        batch_number: selectedBatch.batch_number ?? '',
        product_id: selectedBatch.product_id ?? '',
        branch_id: selectedBatch.branch_id ?? '',
        expiry_date: selectedBatch.expiry_date ?? '',
        cost_price_per_unit: String(selectedBatch.cost_price_per_unit ?? ''),
        selling_price_per_piece: String(selectedBatch.selling_price_per_piece ?? ''),
        selling_price_per_bulk: String(selectedBatch.selling_price_per_bulk ?? ''),
        initial_quantity: String(selectedBatch.initial_quantity ?? ''),
        remaining_quantity: String(selectedBatch.remaining_quantity ?? ''),
      });
    }
  }, [selectedBatch]);

  return (
    <DashboardShell>
      <ModulePage
        title="Catalog management"
        description="Manage branch products and stock batches with create, edit, and delete actions."
        sidebar={
          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-950">Create product</h3>
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
                  onChange={(e) => setProductForm((s) => ({ ...s, [key]: e.target.value }))}
                />
              ))}
              <button className="w-full bg-slate-950 px-4 py-2 text-white">Save product</button>
            </form>
          </div>
        }
      >
        {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</div> : null}
        <Section title="Products" items={products} onSelect={setSelectedProduct} onDelete={async (id) => { await entityApi.products.remove(id); await load(); }} />
        <div className="mt-8">
          <Section title="Batches" items={batches} onSelect={setSelectedBatch} onDelete={async (id) => { await entityApi.batches.remove(id); await load(); }} />
        </div>
        <Drawer open={Boolean(selectedProduct)} title={selectedProduct?.name ?? 'Product details'} subtitle={selectedProduct?.category} onClose={() => setSelectedProduct(null)}>
          {selectedProduct ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Branch', selectedProduct.branch_id],
                  ['Bulk unit', selectedProduct.bulk_unit_name],
                  ['Piece unit', selectedProduct.piece_unit_name],
                  ['Units per bulk', selectedProduct.units_per_bulk],
                  ['Selling price / piece', selectedProduct.selling_price_per_piece],
                  ['Selling price / bulk', selectedProduct.selling_price_per_bulk],
                ].map(([label, value]) => (
                  <div key={label} className="border border-slate-200 p-3">
                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-950">{String(value ?? '—')}</p>
                  </div>
                ))}
              </div>
              <section className="border border-slate-200 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Description</h4>
                <p className="mt-3 text-sm text-slate-600">{selectedProduct.description ?? 'No description available.'}</p>
              </section>
              <form
                className="border border-slate-200 p-4 space-y-3"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await entityApi.products.update(selectedProduct.id, {
                    ...productEditForm,
                    units_per_bulk: Number(productEditForm.units_per_bulk || 1),
                    selling_price_per_piece: Number(productEditForm.selling_price_per_piece || 0),
                    selling_price_per_bulk: Number(productEditForm.selling_price_per_bulk || 0),
                  });
                  await load();
                }}
              >
                <h4 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Edit product</h4>
                {Object.entries(productEditForm).map(([key, value]) => (
                  <input
                    key={key}
                    className="w-full border border-slate-200 px-3 py-2"
                    placeholder={key}
                    value={value}
                    onChange={(e) => setProductEditForm((curr) => ({ ...curr, [key]: e.target.value }))}
                  />
                ))}
                <div className="flex gap-2">
                  <button className="border border-slate-900 bg-slate-950 px-3 py-2 text-white">Save changes</button>
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await entityApi.products.remove(selectedProduct.id); setSelectedProduct(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
        <Drawer open={Boolean(selectedBatch)} title={selectedBatch?.batch_number ?? 'Batch details'} subtitle={selectedBatch?.product?.name} onClose={() => setSelectedBatch(null)}>
          {selectedBatch ? (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ['Product', selectedBatch.product?.name ?? selectedBatch.product_id],
                  ['Branch', selectedBatch.branch?.name ?? selectedBatch.branch_id],
                  ['Expiry', selectedBatch.expiry_date],
                  ['Initial quantity', selectedBatch.initial_quantity],
                  ['Remaining quantity', selectedBatch.remaining_quantity],
                  ['Cost per unit', selectedBatch.cost_price_per_unit],
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
                  await entityApi.batches.update(selectedBatch.id, {
                    ...batchEditForm,
                    cost_price_per_unit: Number(batchEditForm.cost_price_per_unit || 0),
                    selling_price_per_piece: Number(batchEditForm.selling_price_per_piece || 0),
                    selling_price_per_bulk: Number(batchEditForm.selling_price_per_bulk || 0),
                    initial_quantity: Number(batchEditForm.initial_quantity || 0),
                    remaining_quantity: Number(batchEditForm.remaining_quantity || 0),
                  });
                  await load();
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
                  <button type="button" className="border border-slate-200 px-3 py-2 text-rose-600" onClick={async () => { await entityApi.batches.remove(selectedBatch.id); setSelectedBatch(null); await load(); }}>Delete</button>
                </div>
              </form>
            </div>
          ) : null}
        </Drawer>
      </ModulePage>
    </DashboardShell>
  );
}

function Section({ title, items, onDelete, onSelect }: { title: string; items: any[]; onDelete: (id: string) => Promise<void>; onSelect: (item: any) => void }) {
  return (
    <div>
      <h2 className="mb-3 text-xl font-semibold text-slate-950">{title}</h2>
      <div className="overflow-hidden border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr><th className="px-4 py-3">ID</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Actions</th></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t cursor-pointer hover:bg-[#eef7f1]" onClick={() => onSelect(item)}>
                <td className="px-4 py-3 font-mono text-xs">{item.id}</td>
                <td className="px-4 py-3">{item.name ?? item.batch_number}</td>
                <td className="px-4 py-3">
                  <button className="border px-3 py-1" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
