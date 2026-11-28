import * as React from 'react';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'bg-slate-50/80 border border-slate-200 rounded-xl p-8 sm:p-10 text-center space-y-3',
        className,
      )}
    >
      <div className="w-12 h-12 rounded-full bg-slate-200/75 flex items-center justify-center text-slate-500 mx-auto">
        <Icon className="w-6 h-6" strokeWidth={1.75} />
      </div>
      <div className="space-y-1 max-w-md mx-auto">
        <h3 className="text-sm sm:text-base font-bold text-slate-900">{title}</h3>
        {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
      </div>
      {action && <div className="pt-1 flex justify-center">{action}</div>}
    </div>
  );
}
