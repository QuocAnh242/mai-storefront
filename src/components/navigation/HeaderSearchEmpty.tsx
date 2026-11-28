'use client';

import React from 'react';
import { Search, Layers, CircleDollarSign, RotateCcw } from 'lucide-react';
import { Category } from '@/shared/types';
import { POPULAR_SEARCH_KEYWORDS, QUICK_PRICE_FILTERS } from '@/lib/searchUtils';

interface HeaderSearchEmptyProps {
  query: string;
  isSearching: boolean;
  hasActiveFilters: boolean;
  categories: Category[];
  onSelectKeyword: (kw: string) => void;
  onSelectCategory: (catId: string) => void;
  onSelectQuickPrice: (priceId: string) => void;
  onResetFilters: () => void;
}

export function HeaderSearchEmpty({
  query,
  isSearching,
  hasActiveFilters,
  categories,
  onSelectKeyword,
  onSelectCategory,
  onSelectQuickPrice,
  onResetFilters,
}: HeaderSearchEmptyProps) {
  const trimmed = query.trim();

  if (trimmed || hasActiveFilters) {
    if (isSearching) {
      return (
        <div className="p-5 text-center text-xs text-slate-500">
          Đang tìm sản phẩm phù hợp...
        </div>
      );
    }

    return (
      <div className="p-4 text-center space-y-3 bg-white">
        <p className="text-xs text-slate-600">
          Không tìm thấy sản phẩm khớp
          {trimmed ? (
            <>
              {' '}
              với &quot;<span className="font-bold text-slate-900">{trimmed}</span>&quot;
            </>
          ) : (
            ' trong bộ lọc đã chọn'
          )}
          .
        </p>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bỏ lọc &amp; tìm trên tất cả sản phẩm</span>
          </button>
        )}

        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <span className="text-[11px] text-slate-400 block">Gợi ý tìm nhanh:</span>
          <div className="flex flex-wrap justify-center gap-1.5">
            {POPULAR_SEARCH_KEYWORDS.slice(0, 4).map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => onSelectKeyword(kw)}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-900 text-slate-700 transition-colors cursor-pointer"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3.5 sm:p-4 space-y-3.5 bg-white">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-sky-700" />
            Từ khóa phổ biến
          </span>
          <span className="text-[10px] font-normal normal-case text-slate-400">
            Bấm để tìm nhanh
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SEARCH_KEYWORDS.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => onSelectKeyword(kw)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-900 border border-transparent hover:border-sky-200 text-slate-700 transition-colors cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <div className="pt-2.5 border-t border-slate-100 space-y-2">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-sky-700" />
            Lọc theo danh mục
          </span>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-sky-50/70 hover:bg-sky-900 hover:text-white text-sky-900 border border-sky-200/80 transition-colors cursor-pointer"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2.5 border-t border-slate-100 space-y-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          <CircleDollarSign className="w-3.5 h-3.5 text-sky-700" />
          Xem theo khoảng giá
        </span>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_PRICE_FILTERS.map((pf) => (
            <button
              key={pf.id}
              type="button"
              onClick={() => onSelectQuickPrice(pf.id)}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-900 hover:text-white border border-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              {pf.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
