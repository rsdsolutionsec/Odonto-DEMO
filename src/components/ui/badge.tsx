import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-300',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60 dark:bg-rose-950/40 dark:text-rose-300',
    info: 'bg-sky-50 text-sky-700 border border-sky-200/60 dark:bg-sky-950/40 dark:text-sky-300',
    purple: 'bg-purple-50 text-purple-700 border border-purple-200/60 dark:bg-purple-950/40 dark:text-purple-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium tracking-wide',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
