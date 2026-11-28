'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  size?: LoadingSize;
  text?: string;
  subtext?: string;
  className?: string;
  fullHeight?: boolean;
  compact?: boolean;
  color?: string;
}

const SIZE_CONFIGS: Record<
  LoadingSize,
  { spinnerSize: string; textSize: string; subtextSize: string; gap: string; padding: string }
> = {
  xs: { spinnerSize: 'w-3.5 h-3.5', textSize: 'text-[10px]', subtextSize: 'text-[9px]', gap: 'gap-1', padding: 'py-1 px-2' },
  sm: { spinnerSize: 'w-5 h-5', textSize: 'text-[11px]', subtextSize: 'text-[10px]', gap: 'gap-1.5', padding: 'py-3 px-3' },
  md: { spinnerSize: 'w-7 h-7', textSize: 'text-xs', subtextSize: 'text-[11px]', gap: 'gap-2', padding: 'py-6 px-4' },
  lg: { spinnerSize: 'w-9 h-9', textSize: 'text-sm font-semibold', subtextSize: 'text-xs', gap: 'gap-2.5', padding: 'py-10 px-6' },
  xl: { spinnerSize: 'w-11 h-11', textSize: 'text-base font-bold', subtextSize: 'text-xs', gap: 'gap-3', padding: 'py-16 px-8' },
};

export function Loading({
  size = 'md',
  text = 'Đang tải...',
  subtext,
  className = '',
  fullHeight = false,
  compact = false,
  color = 'text-sky-700',
}: LoadingProps) {
  const conf = SIZE_CONFIGS[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex flex-col items-center justify-center text-center select-none',
        conf.gap,
        compact ? 'py-1 px-1' : conf.padding,
        fullHeight && 'min-h-[40vh] w-full flex-1',
        className,
      )}
    >
      <Loader2 className={cn('animate-spin shrink-0', conf.spinnerSize, color)} strokeWidth={2.25} />
      {text && (
        <div className="flex flex-col items-center">
          <span className={cn(conf.textSize, 'text-slate-700 tracking-tight leading-tight')}>
            {text}
          </span>
          {subtext && (
            <span className={cn(conf.subtextSize, 'text-slate-400 mt-1 max-w-xs leading-normal font-normal')}>
              {subtext}
            </span>
          )}
        </div>
      )}
      <span className="sr-only">Đang tải dữ liệu...</span>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div aria-hidden="true" className={cn('animate-pulse bg-slate-200/80 rounded', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden flex flex-col p-3 sm:p-4 space-y-3 animate-pulse">
      <div className="w-full aspect-square bg-slate-100 rounded-lg" />
      <div className="space-y-2 flex-1 pt-1">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-2/3" />
      </div>
      <div className="pt-2 flex items-center justify-between">
        <div className="h-5 bg-slate-200 rounded w-24" />
        <div className="h-8 bg-slate-100 rounded-lg w-16" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReviewSkeleton() {
  return (
    <div className="p-4 sm:p-5 space-y-3 bg-white rounded-xl border border-slate-100 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 bg-slate-200 rounded w-28" />
            <div className="h-2.5 bg-slate-100 rounded w-16" />
          </div>
        </div>
        <div className="h-4 bg-slate-100 rounded w-20" />
      </div>
      <div className="space-y-1.5 pl-12">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-4/5" />
      </div>
    </div>
  );
}

export function StatCardSkeleton({ title }: { title?: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 animate-pulse">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {title || <div className="h-3 bg-slate-200 rounded w-24" />}
      </div>
      <div className="h-7 bg-slate-200 rounded w-20" />
      <div className="h-3 bg-slate-100 rounded w-32" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-48 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 space-y-3">
      <Loading size="sm" text="Đang tải biểu đồ..." subtext="Đang xử lý dữ liệu lưu lượng truy cập 7 ngày" />
    </div>
  );
}

export function TableRowsSkeleton({ rows = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-slate-100 animate-pulse">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-slate-200 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-3.5 bg-slate-200 rounded w-1/3" />
              <div className="h-2.5 bg-slate-100 rounded w-1/4" />
            </div>
          </div>
          <div className="hidden sm:block h-3 bg-slate-100 rounded w-20" />
          <div className="h-6 bg-slate-200 rounded w-16" />
        </div>
      ))}
    </div>
  );
}
