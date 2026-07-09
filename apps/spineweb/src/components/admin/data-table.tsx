import type { ReactNode } from 'react';

export function DataTable<T>({
  title,
  description,
  columns,
  rows,
  emptyState,
  renderRow,
}: {
  title: string;
  description: string;
  columns: string[];
  rows: T[];
  emptyState: ReactNode;
  renderRow: (row: T) => ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-medium">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-500" colSpan={columns.length}>
                  {emptyState}
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={index} className="align-top">
                  <td className="px-4 py-4 text-sm text-slate-700" colSpan={columns.length}>
                    {renderRow(row)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
