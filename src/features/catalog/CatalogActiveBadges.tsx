'use client';

import React from 'react';
import { X } from 'lucide-react';

interface CatalogActiveBadgesProps {
  selectedCategoryName?: string;
  selectedPriceRange?: string;
  searchQuery?: string;
  onClearCategory: () => void;
  onClearPrice: () => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}

export function CatalogActiveBadges({
  selectedCategoryName,
  selectedPriceRange,
  searchQuery,
  onClearCategory,
  onClearPrice,
  onClearSearch,
  onClearAll,
}: CatalogActiveBadgesProps) {
  const hasActiveFilters = Boolean(
    selectedCategoryName || selectedPriceRange || searchQuery
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
      <span className="text-slate-500 font-medium">Đang lọc:</span>

      {searchQuery && (
        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-0.5 rounded-full font-semibold">
          <span>Tìm: &quot;{searchQuery}&quot;</span>
          <button
            type="button"
            onClick={onClearSearch}
            className="hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Xóa tìm kiếm"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {selectedCategoryName && (
        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-0.5 rounded-full font-semibold">
          <span>{selectedCategoryName}</span>
          <button
            type="button"
            onClick={onClearCategory}
            className="hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Xóa bộ lọc danh mục"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {selectedPriceRange && (
        <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-900 border border-sky-200 px-2.5 py-0.5 rounded-full font-semibold">
          <span>
            {selectedPriceRange === 'under-100k' && 'Dưới 100.000đ'}
            {selectedPriceRange === '100k-500k' && '100.000đ – 500.000đ'}
            {selectedPriceRange === 'above-500k' && 'Trên 500.000đ'}
          </span>
          <button
            type="button"
            onClick={onClearPrice}
            className="hover:text-rose-600 transition-colors cursor-pointer"
            aria-label="Xóa bộ lọc giá"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline ml-1 cursor-pointer"
      >
        Xóa tất cả
      </button>
    </div>
  );
}
