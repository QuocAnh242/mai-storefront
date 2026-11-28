import * as React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'flat' | 'lift' | 'glass' | 'subtle';
}

export function Card({ className, variant = 'flat', ...props }: CardProps) {
  const variantClasses = {
    flat: 'card-flat rounded-xl',
    lift: 'bg-white border border-slate-200 card-lift rounded-xl',
    glass: 'glass-surface rounded-xl',
    subtle: 'bg-slate-50 border border-slate-200 rounded-xl',
  };

  return <div className={cn(variantClasses[variant], className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4 border-b border-slate-100', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('text-sm sm:text-base font-bold text-slate-900 tracking-tight', className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />;
}
