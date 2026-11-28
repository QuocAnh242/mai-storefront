import * as React from 'react';
import { cn } from '@/lib/cn';

interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export function Field({
  label,
  required,
  error,
  hint,
  htmlFor,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-bold text-slate-800 uppercase tracking-wider"
        >
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p role="alert" className="text-[11px] font-medium text-rose-600">
          {error}
        </p>
      )}
      {!error && hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

const controlBaseClass =
  'w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm rounded-lg px-3 py-2.5 outline-none transition-colors placeholder:text-slate-400 focus:bg-white focus:border-sky-700 focus:ring-2 focus:ring-sky-700/15 disabled:opacity-50 disabled:cursor-not-allowed';

export function Input({
  className,
  hasError,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }) {
  return (
    <input
      className={cn(
        controlBaseClass,
        hasError && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15',
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  hasError,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }) {
  return (
    <textarea
      className={cn(
        controlBaseClass,
        hasError && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15',
        className,
      )}
      {...props}
    />
  );
}

export function Select({
  className,
  hasError,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      className={cn(
        controlBaseClass,
        'cursor-pointer',
        hasError && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/15',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
