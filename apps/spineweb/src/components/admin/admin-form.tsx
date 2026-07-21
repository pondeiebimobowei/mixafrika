import { forwardRef, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

type FieldWrapperProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
};

export function FieldWrapper({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-900">
          {label}
          {required ? <span className="ml-1 text-rose-500">*</span> : null}
        </label>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>
      {children}
      {error ? <p className="mt-2 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

const inputClassName =
  'block w-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1f6f4a] focus:ring-2 focus:ring-[#1f6f4a]/10';

export const AdminInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
  function AdminInput(props, ref) {
    const { error, className, ...rest } = props;
    return (
      <input
        ref={ref}
        {...rest}
        className={[inputClassName, className].filter(Boolean).join(' ')}
        aria-invalid={Boolean(error)}
      />
    );
  },
);

export const AdminTextarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(function AdminTextarea(props, ref) {
  const { error, className, ...rest } = props;
  return (
    <textarea
      ref={ref}
      {...rest}
      className={[inputClassName, 'min-h-[120px] resize-y', className].filter(Boolean).join(' ')}
      aria-invalid={Boolean(error)}
    />
  );
});

export const AdminSelect = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(function AdminSelect(props, ref) {
  const { error, className, ...rest } = props;
  return (
    <select
      ref={ref}
      {...rest}
      className={[inputClassName, 'pr-10', className].filter(Boolean).join(' ')}
      aria-invalid={Boolean(error)}
    />
  );
});

export function AdminCheckbox({
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 transition hover:border-[#1f6f4a]"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
        disabled={disabled}
        className="mt-1 h-4 w-4 border-slate-300 text-[#1f6f4a] focus:ring-[#1f6f4a]"
      />
      <span>
        <span className="block font-medium text-slate-900">{label}</span>
        {description ? <span className="mt-1 block text-xs text-slate-500">{description}</span> : null}
      </span>
    </label>
  );
}

export function FormGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

export function FormPanel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
        {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

type ReferenceOption = {
  value: string;
  label: string;
  description?: string;
};

export function SearchableReferenceField({
  label,
  value,
  onChange,
  loadOptions,
  error,
  hint,
  placeholder = 'Search and select',
  disabled,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  loadOptions: (query: string) => Promise<ReferenceOption[]>;
  error?: string;
  hint?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const fieldId = useId();
  const listId = `${fieldId}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<ReferenceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (!open) {
        return;
      }

      setLoading(true);
      try {
        const nextOptions = await loadOptions(query);
        if (active) {
          setOptions(nextOptions);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    const handle = window.setTimeout(run, 150);
    return () => {
      active = false;
      window.clearTimeout(handle);
    };
  }, [loadOptions, open, query]);

  useEffect(() => {
    let active = true;

    const resolveSelected = async () => {
      if (!value) {
        setSelectedLabel(null);
        return;
      }

      const current = await loadOptions('');
      if (!active) {
        return;
      }

      const match = current.find((item) => item.value === value);
      setSelectedLabel(match?.label ?? value);
    };

    resolveSelected().catch(() => {
      if (active) {
        setSelectedLabel(value);
      }
    });

    return () => {
      active = false;
    };
  }, [loadOptions, value]);

  const visibleOptions = useMemo(() => options, [options]);

  return (
    <div className="relative">
      <FieldWrapper label={label} htmlFor={fieldId} hint={hint} error={error} required={required}>
        <button
          id={fieldId}
          type="button"
          disabled={disabled}
          onClick={() => setOpen((current) => !current)}
          className={[
            inputClassName,
            'flex min-h-[44px] items-center justify-between gap-3 text-left',
            disabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : 'cursor-pointer',
          ].join(' ')}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
        >
          <span className={value ? 'text-slate-900' : 'text-slate-400'}>
            {selectedLabel ?? placeholder}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>
      </FieldWrapper>

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 w-full border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.14)]"
        >
          <div className="border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2 border border-slate-200 px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search..."
                className="w-full text-sm outline-none placeholder:text-slate-400"
              />
              {query ? (
                <button
                  type="button"
                  className="text-slate-400 transition hover:text-slate-600"
                  onClick={() => setQuery('')}
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
          <div className="max-h-64 overflow-auto">
            {loading ? <p className="px-4 py-3 text-sm text-slate-500">Loading options...</p> : null}
            {!loading && visibleOptions.length === 0 ? (
              <p className="px-4 py-3 text-sm text-slate-500">No matches found.</p>
            ) : null}
            {!loading
              ? visibleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className="flex w-full items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-[#eef7f1]"
                    onClick={() => {
                      onChange(option.value);
                      setSelectedLabel(option.label);
                      setOpen(false);
                    }}
                  >
                    <span>
                      <span className="block text-sm font-medium text-slate-950">{option.label}</span>
                      {option.description ? (
                        <span className="mt-1 block text-xs text-slate-500">{option.description}</span>
                      ) : null}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{option.value.slice(0, 8)}</span>
                  </button>
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
