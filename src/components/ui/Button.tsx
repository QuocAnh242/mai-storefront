import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-bold transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700/30 active:scale-[0.98] select-none shrink-0',
  {
    variants: {
      variant: {
        primary: 'bg-sky-900 hover:bg-sky-950 text-white shadow-xs',
        secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
        accent: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
        outline: 'border border-slate-300 bg-white hover:bg-slate-50 text-slate-900',
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
        danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
        zalo: 'bg-[#0068FF] hover:bg-blue-600 text-white shadow-sm',
        glassDark: 'glass-surface-dark rounded-full',
        glassLight: 'glass-surface text-slate-900 hover:bg-white/95',
      },
      size: {
        xs: 'h-7 px-2.5 text-[11px] rounded-md',
        sm: 'h-9 px-3.5 text-xs rounded-lg',
        md: 'h-10 px-4 text-xs sm:text-sm rounded-lg',
        lg: 'h-11 px-5 text-sm rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
      },
      pill: {
        true: 'rounded-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      pill: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  pill,
  isLoading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, pill }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin shrink-0" />}
      {children}
    </button>
  );
}
