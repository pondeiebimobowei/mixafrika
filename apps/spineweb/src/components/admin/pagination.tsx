export function PaginationBar({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
      <p>
        Showing <span className="font-medium text-slate-900">{start}</span> to{' '}
        <span className="font-medium text-slate-900">{end}</span> of{' '}
        <span className="font-medium text-slate-900">{total}</span>
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {onLimitChange ? (
          <select
            value={limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            className="border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
          >
            {[10, 20, 50].map((value) => (
              <option key={value} value={value}>
                {value} / page
              </option>
            ))}
          </select>
        ) : null}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        <span className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
