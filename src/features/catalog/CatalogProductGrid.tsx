'use client';

import React from 'react';
import { Product } from '@/shared/types';
import { ProductCard } from '@/features/products/ProductCard';
import { ShoppingBag } from 'lucide-react';

interface CatalogProductGridProps {
  products: Product[];
  onResetFilters: () => void;
}

export function CatalogProductGrid({ products, onResetFilters }: CatalogProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mx-auto">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          Không tìm thấy sản phẩm phù hợp
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Không có mặt hàng nào thỏa mãn điều kiện lọc. Bạn hãy thử nới lỏng mức giá hoặc tìm kiếm theo từ khóa khác.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-950 text-white font-bold text-xs rounded-xl hover:bg-sky-900 transition-colors cursor-pointer"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
