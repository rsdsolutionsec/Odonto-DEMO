import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border rounded-lg transition-colors placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
