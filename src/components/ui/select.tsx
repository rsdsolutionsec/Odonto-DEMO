import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, children, id, ...props }, ref) => {
    const selectId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
