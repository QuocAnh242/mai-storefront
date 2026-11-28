import React from 'react';
import Link from 'next/link';
import { Product } from '@/shared/types';
import { ProductCard } from '../products/ProductCard';

interface StorefrontCategorySectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  maxDisplay?: number;
  viewMoreHref?: string;
  viewMoreLabel?: string;
  emptyText?: string;
}

export function StorefrontCategorySection({
  title,
  subtitle,
  products,
  maxDisplay = 4,
  viewMoreHref,
  viewMoreLabel,
  emptyText = 'Đang cập nhật danh mục...',
}: StorefrontCategorySectionProps) {
  const displayItems = products.slice(0, maxDisplay);
  const remainingCount = products.length - maxDisplay;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b-2 border-sky-950 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
            {products.length} sản phẩm
          </span>
          {remainingCount > 0 && viewMoreHref && (
            <Link
              href={viewMoreHref}
              className="hidden sm:inline-block text-xs font-bold text-sky-900 hover:underline ml-1"
            >
              Xem tất cả →
            </Link>
          )}
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
            {displayItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {remainingCount > 0 && viewMoreHref && (
            <div className="flex justify-center pt-2">
              <Link
                href={viewMoreHref}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Xem thêm {remainingCount} {viewMoreLabel || 'sản phẩm'} →
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-400">{emptyText}</p>
        </div>
      )}
    </section>
  );
}
