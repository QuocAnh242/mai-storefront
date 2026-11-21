'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/shared/types';
import { ProductCard } from '@/features/products/ProductCard';

interface ProductRelatedGridProps {
  relatedProducts: Product[];
  categoryName: string;
}

export function ProductRelatedGrid({ relatedProducts, categoryName }: ProductRelatedGridProps) {
  if (relatedProducts.length === 0) return null;

  return (
    <div className="space-y-4 pt-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
            Sản phẩm cùng danh mục
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Các mặt hàng tương tự thuộc nhóm {categoryName}
          </p>
        </div>
        <Link
          href="/products"
          className="text-xs font-bold text-sky-900 hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
        {relatedProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
