'use client';

import React, { useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { Category } from '@/shared/types';
import { getProductUrl } from '@/lib/productUrl';
import { HeaderSearchDropdown } from './HeaderSearchDropdown';
import { useHeaderSearch } from './useHeaderSearch';

interface HeaderSearchProps {
  isMobile?: boolean;
  categories?: Category[];
}

export function HeaderSearch({ isMobile = false, categories = [] }: HeaderSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    query,
    setQuery,
    categoryId,
    priceRange,
    setPriceRange,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    results,
    facets,
    totalMatches,
    isSearching,
    handleQueryChange,
    handleCategoryChange,
    handleResetAll,
    handleResetFilters,
  } = useHeaderSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  const navigateCatalog = (opts: { q?: string; cat?: string; price?: string }) => {
    const sp = new URLSearchParams();
    if (opts.q?.trim()) sp.set('q', opts.q.trim());
    if (opts.cat) sp.set('category', opts.cat);
    if (opts.price && opts.price !== 'all') sp.set('price', opts.price);
    const qs = sp.toString();
    setIsOpen(false);
    router.push(qs ? `/products?${qs}` : '/products');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      setIsOpen(false);
      router.push(getProductUrl(results[activeIndex]));
      return;
    }
    navigateCatalog({ q: query, cat: categoryId, price: priceRange });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) {
      if (e.key === 'Escape') setIsOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-white border border-slate-300 rounded-xl shadow-2xs focus-within:border-sky-700 focus-within:ring-2 focus-within:ring-sky-700/15 transition-all"
      >
        {!isMobile && categories.length > 0 && (
          <select
            aria-label="Lọc danh mục tìm kiếm"
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="hidden lg:block max-w-[138px] truncate bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 pl-3 pr-2 py-2.5 rounded-l-[11px] border-r border-slate-200 outline-none cursor-pointer transition-colors"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        )}

        <div className="relative flex-1 flex items-center min-w-0">
          <input
            type="text"
            placeholder="Tìm bột kim tuyến, bột màu, băng keo..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            className={`w-full bg-transparent text-slate-800 outline-none placeholder:text-slate-400 ${
              isMobile ? 'text-xs pl-3 pr-8 py-2' : 'text-sm pl-3.5 pr-8 py-2'
            }`}
          />

          {(query || categoryId || priceRange !== 'all') && (
            <button
              type="button"
              onClick={handleResetAll}
              className="absolute right-2 text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer"
              title="Xóa tìm kiếm & bộ lọc"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className={`m-1 bg-sky-900 hover:bg-sky-950 text-white rounded-lg flex items-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer shrink-0 ${
            isMobile ? 'px-2.5 py-1.5' : 'px-3.5 py-2'
          }`}
          title="Tìm kiếm"
          aria-label="Bấm tìm kiếm"
        >
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {!isMobile && <span>Tìm</span>}
        </button>
      </form>

      {isOpen && (
        <HeaderSearchDropdown
          query={query}
          results={results}
          totalMatches={totalMatches}
          isSearching={isSearching}
          categories={categories}
          facets={facets}
          selectedCategoryId={categoryId}
          selectedPrice={priceRange}
          activeIndex={activeIndex}
          onSelectCategoryFilter={handleCategoryChange}
          onSelectPriceFilter={setPriceRange}
          onSelectKeyword={(kw) => {
            setQuery(kw);
            navigateCatalog({ q: kw, cat: categoryId, price: priceRange });
          }}
          onSelectQuickCategory={(catId) => navigateCatalog({ cat: catId })}
          onSelectQuickPrice={(price) => navigateCatalog({ price })}
          onResetFilters={handleResetFilters}
          onClose={() => setIsOpen(false)}
          onSubmitAll={() => navigateCatalog({ q: query, cat: categoryId, price: priceRange })}
        />
      )}
    </div>
  );
}
