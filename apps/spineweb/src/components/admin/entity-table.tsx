import type { ReactNode } from 'react';

export function EntityTable({
  title,
  description,
  rows,
  columns,
  onSelect,
  selectedId,
  getRowLabel,
}: {
  title: string;
  description: string;
  rows: { id: string }[];
  columns: string[];
  onSelect: (id: string) => void;
  selectedId?: string;
  getRowLabel: (row: any) => ReactNode;
}) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>{columns.map((col) => <th key={col} className="px-4 py-3 font-medium">{col}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`cursor-pointer border-t transition hover:bg-amber-50 ${selectedId === row.id ? 'bg-amber-50' : ''}`}
                onClick={() => onSelect(row.id)}
              >
                {getRowLabel(row)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
