'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { Category } from '@/shared/types';
import { QUICK_PRICE_FILTERS, getMatchHighlightParts } from '@/lib/searchUtils';
import { getProductUrl } from '@/lib/productUrl';
import { formatVND, getSafeImageUrl, isContactProduct } from '@/lib/format';
import { HeaderSearchEmpty } from './HeaderSearchEmpty';

export interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  isContactPrice?: boolean;
  unit: string;
  categoryName: string;
  categoryId: string;
  images: string[];
}

export interface SearchFacetCategory {
  id: string;
  name: string;
  count: number;
}

interface HeaderSearchDropdownProps {
  query: string;
  results: SearchResultItem[];
  totalMatches: number;
  isSearching: boolean;
  categories: Category[];
  facets: SearchFacetCategory[];
  selectedCategoryId: string;
  selectedPrice: string;
  activeIndex: number;
  onSelectCategoryFilter: (catId: string) => void;
  onSelectPriceFilter: (priceId: string) => void;
  onSelectKeyword: (kw: string) => void;
  onSelectQuickCategory: (catId: string) => void;
  onSelectQuickPrice: (priceId: string) => void;
  onResetFilters: () => void;
  onClose: () => void;
  onSubmitAll: () => void;
}

export function HeaderSearchDropdown({
  query,
  results,
  totalMatches,
  isSearching,
  categories,
  facets,
  selectedCategoryId,
  selectedPrice,
  activeIndex,
  onSelectCategoryFilter,
  onSelectPriceFilter,
  onSelectKeyword,
  onSelectQuickCategory,
  onSelectQuickPrice,
  onResetFilters,
  onClose,
  onSubmitAll,
}: HeaderSearchDropdownProps) {
  const trimmed = query.trim();
  const hasFilters = Boolean(selectedCategoryId || (selectedPrice && selectedPrice !== 'all'));
  const showActiveView = Boolean(trimmed || hasFilters);

  const chipCategories: { id: string; name: string; count?: number }[] =
    facets.length > 0
      ? facets
      : categories.map((c) => ({ id: c.id, name: c.name }));

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden z-[80] animate-in fade-in duration-150">
      {showActiveView && (
        <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 space-y-2">
          {chipCategories.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              <button
                type="button"
                onClick={() => onSelectCategoryFilter('')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  !selectedCategoryId
                    ? 'bg-sky-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300'
                }`}
              >
                Tất cả danh mục
              </button>
              {chipCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategoryFilter(cat.id === selectedCategoryId ? '' : cat.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategoryId === cat.id
                      ? 'bg-sky-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-300'
                  }`}
                >
                  {cat.name}
                  {typeof cat.count === 'number' ? ` (${cat.count})` : ''}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => onSelectPriceFilter('all')}
                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                  selectedPrice === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800'
                }`}
              >
                Mọi giá
              </button>
              {QUICK_PRICE_FILTERS.map((pf) => (
                <button
                  key={pf.id}
                  type="button"
                  onClick={() => onSelectPriceFilter(selectedPrice === pf.id ? 'all' : pf.id)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors cursor-pointer ${
                    selectedPrice === pf.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {pf.label}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-400">
              {isSearching ? 'Đang tìm...' : `${totalMatches} sản phẩm`}
            </span>
          </div>
        </div>
      )}

      {showActiveView && results.length > 0 ? (
        <div>
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 bg-white">
            {results.map((p, idx) => {
              const priceLabel = isContactProduct(p) ? 'Liên hệ báo giá' : formatVND(p.price);
              const titleParts = getMatchHighlightParts(p.title, trimmed);
              const isHighlighted = idx === activeIndex;

              return (
                <Link
                  key={p.id}
                  href={getProductUrl(p)}
                  onClick={onClose}
                  className={`flex items-center gap-3 p-2.5 transition-colors group ${
                    isHighlighted ? 'bg-sky-50' : 'hover:bg-sky-50/70'
                  }`}
                >
                  <Image
                    src={getSafeImageUrl(p.images?.[0])}
                    alt={p.title}
                    width={44}
                    height={44}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-sky-700 tracking-wider block truncate">
                      {p.categoryName}
                    </span>
                    <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-sky-950">
                      {titleParts.map((part, pIdx) =>
                        part.matched ? (
                          <mark
                            key={pIdx}
                            className="bg-sky-100 text-sky-950 font-bold rounded-xs px-0.5"
                          >
                            {part.text}
                          </mark>
                        ) : (
                          <React.Fragment key={pIdx}>{part.text}</React.Fragment>
                        ),
                      )}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-extrabold text-slate-900">{priceLabel}</span>
                      {p.unit && <span className="text-[10px] text-slate-400">/{p.unit}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-900 shrink-0" />
                </Link>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onSubmitAll}
            className="w-full text-left px-3.5 py-2.5 bg-slate-50 hover:bg-sky-100/70 border-t border-slate-100 text-xs font-bold text-sky-900 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>
              Xem tất cả {totalMatches} kết quả
              {trimmed ? ` cho "${trimmed}"` : ''}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <HeaderSearchEmpty
          query={query}
          isSearching={isSearching}
          hasActiveFilters={hasFilters}
          categories={categories}
          onSelectKeyword={onSelectKeyword}
          onSelectCategory={onSelectQuickCategory}
          onSelectQuickPrice={onSelectQuickPrice}
          onResetFilters={onResetFilters}
        />
      )}
    </div>
  );
}
