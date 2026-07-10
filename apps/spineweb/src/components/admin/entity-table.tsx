import type { ReactNode } from 'react';

export function EntityTable({
  title,
  description,
  rows,
  columns,
  onSelect,
  selectedId,
  getRowLabel,
  loading,
  emptyMessage = 'No rows found.',
}: {
  title: string;
  description: string;
  rows: { id: string }[];
  columns: string[];
  onSelect: (id: string) => void;
  selectedId?: string;
  getRowLabel: (row: any) => ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}) {
  return (
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
          <span>{rows.length} rows</span>
        </div>
      </div>
      <div className="mt-5 overflow-hidden border border-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-[0.2em] text-slate-500">
            <tr>{columns.map((col) => <th key={col} className="border-b border-slate-200 px-4 py-3 font-medium">{col}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-500" colSpan={columns.length}>
                  Loading rows...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-slate-500" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id}
                  className={`cursor-pointer border-b border-slate-100 transition hover:bg-[#eef7f1] ${selectedId === row.id ? 'bg-[#e9f4ee]' : ''}`}
                  onClick={() => onSelect(row.id)}
                >
                  {getRowLabel(row)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
