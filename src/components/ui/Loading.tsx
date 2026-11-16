'use client';

import React from 'react';

export type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps {
  /**
   * Kích thước của loading spinner và typography:
   * - 'xs': Siêu nhỏ gọn cho inline, dropdown, button con, badge
   * - 'sm': Nhỏ gọn cho UI nhỏ, card phụ, widget con
   * - 'md': Chuẩn cho card nội dung, khối thông tin
   * - 'lg': Rộng rãi thoải mái cho component lớn, biểu đồ, bảng dữ liệu
   * - 'xl': Toàn trang, vùng hiển thị lớn (full page / container rộng)
   */
  size?: LoadingSize;
  /** Dòng chữ hiển thị dưới spinner, mặc định là "Đang tải..." */
  text?: string;
  /** Dòng chữ phụ nhỏ bên dưới chữ chính (tùy chọn) */
  subtext?: string;
  /** Class tùy biến cho wrapper container */
  className?: string;
  /** Chiếm trọn chiều cao tối thiểu cho khung rộng rãi (mặc định false) */
  fullHeight?: boolean;
  /** Rút gọn padding tối đa cho các khung UI chật hẹp */
  compact?: boolean;
  /** Màu sắc điểm nhấn cho spinner (mặc định sky-700) */
  color?: string;
}

const SIZE_CONFIGS: Record<
  LoadingSize,
  {
    spinnerSize: string;
    strokeWidth: number;
    textSize: string;
    subtextSize: string;
    gap: string;
    padding: string;
  }
> = {
  xs: {
    spinnerSize: 'w-3.5 h-3.5',
    strokeWidth: 3,
    textSize: 'text-[10px]',
    subtextSize: 'text-[9px]',
    gap: 'gap-1',
    padding: 'py-1 px-2',
  },
  sm: {
    spinnerSize: 'w-5 h-5',
    strokeWidth: 3,
    textSize: 'text-[11px]',
    subtextSize: 'text-[10px]',
    gap: 'gap-1.5',
    padding: 'py-3 px-3',
  },
  md: {
    spinnerSize: 'w-7 h-7',
    strokeWidth: 2.75,
    textSize: 'text-xs',
    subtextSize: 'text-[11px]',
    gap: 'gap-2',
    padding: 'py-6 px-4',
  },
  lg: {
    spinnerSize: 'w-10 h-10',
    strokeWidth: 2.5,
    textSize: 'text-sm font-semibold',
    subtextSize: 'text-xs',
    gap: 'gap-2.5',
    padding: 'py-12 px-6',
  },
  xl: {
    spinnerSize: 'w-12 h-12',
    strokeWidth: 2.25,
    textSize: 'text-base font-bold',
    subtextSize: 'text-xs',
    gap: 'gap-3',
    padding: 'py-16 px-8',
  },
};

/**
 * Component Loading chuyên dụng:
 * - Spinner xoay mượt mà, phẳng, hiện đại.
 * - Có chữ "Đang tải..." hoặc text tùy chọn hiển thị căn giữa ở DƯỚI spinner.
 * - Phù hợp linh hoạt từ UI nhỏ gọn đến component rộng thoải mái.
 */
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
      className={`flex flex-col items-center justify-center text-center select-none transition-all ${
        conf.gap
      } ${compact ? 'py-1 px-1' : conf.padding} ${
        fullHeight ? 'min-h-[40vh] w-full flex-1' : ''
      } ${className}`}
    >
      {/* SVG Spinner Tinh Xảo: Ring nền mờ + Vòng xoay mượt */}
      <div className={`relative ${conf.spinnerSize} shrink-0`}>
        <svg
          className={`animate-spin ${conf.spinnerSize} ${color}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          {/* Vòng tròn nền nhạt */}
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth={conf.strokeWidth}
          />
          {/* Cung xoay gradient mượt mà */}
          <path
            className="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>

      {/* Dòng chữ Đang tải... ở bên dưới */}
      {text && (
        <div className="flex flex-col items-center">
          <span
            className={`${conf.textSize} text-slate-700 tracking-tight leading-tight`}
          >
            {text}
          </span>
          {subtext && (
            <span
              className={`${conf.subtextSize} text-slate-400 mt-1 max-w-xs leading-normal font-normal`}
            >
              {subtext}
            </span>
          )}
        </div>
      )}
      <span className="sr-only">Đang tải dữ liệu...</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON UI COMPONENTS CHO CÁC TRƯỜNG HỢP GIAO DIỆN CỤ THỂ
// ─────────────────────────────────────────────────────────────────────────────

/** Thanh Shimmer nguyên bản */
export function Skeleton({
  className = '',
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-slate-200/80 rounded ${className}`}
    />
  );
}

/** Khung Skeleton cho 1 thẻ sản phẩm Storefront */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col p-3 sm:p-4 space-y-3 animate-pulse">
      <div className="w-full aspect-square bg-slate-100 rounded-xl" />
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

/** Lưới Skeleton cho danh sách sản phẩm */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Khung Skeleton cho một bài nhận xét / review khách hàng */
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

/** Khung Skeleton cho Thẻ Thống Kê / KPI trên Dashboard Admin */
export function StatCardSkeleton({ title }: { title?: string }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 animate-pulse">
      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
        {title || <div className="h-3 bg-slate-200 rounded w-24" />}
      </div>
      <div className="h-7 bg-slate-200 rounded w-20" />
      <div className="h-3 bg-slate-100 rounded w-32" />
    </div>
  );
}

/** Khung Skeleton cho Biểu Đồ Thống Kê Lưu Lượng */
export function ChartSkeleton() {
  return (
    <div className="w-full h-48 bg-slate-50/60 rounded-lg border border-dashed border-slate-200 flex flex-col items-center justify-center p-6 space-y-3">
      <Loading size="sm" text="Đang tải biểu đồ..." subtext="Đang xử lý dữ liệu lưu lượng truy cập 7 ngày" />
    </div>
  );
}

/** Khung Skeleton cho các hàng bảng dữ liệu Admin (Table Rows) */
export function TableRowsSkeleton({ rows = 4, cols = 5 }: { rows?: number; cols?: number }) {
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

