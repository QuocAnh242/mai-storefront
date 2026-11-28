import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const badgeVariants = cva(
  'inline-flex items-center gap-1 font-bold tracking-wide transition-colors shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700 border border-slate-200',
        navy: 'bg-sky-50 text-sky-900 border border-sky-200/80',
        amber: 'bg-amber-50 text-amber-900 border border-amber-200',
        emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
        rose: 'bg-rose-600 text-white',
        roseSoft: 'bg-rose-50 text-rose-700 border border-rose-200',
        glass: 'glass-surface text-slate-900',
        glassDark: 'bg-sky-950/85 backdrop-blur-md text-white border border-white/20',
      },
      size: {
        sm: 'text-[10px] sm:text-[11px] px-2 py-0.5 rounded-md',
        md: 'text-xs px-2.5 py-1 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
