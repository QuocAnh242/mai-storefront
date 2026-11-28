'use client';

import React, { useMemo } from 'react';
import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs';
import { Search, X } from 'lucide-react';
import { Category, Product } from '@/shared/types';
import { filterProductsBySearch } from '@/lib/searchUtils';
import { CatalogFilterSidebar } from './CatalogFilterSidebar';
import { CatalogActiveBadges } from './CatalogActiveBadges';
import { CatalogProductGrid } from './CatalogProductGrid';
import { Pagination } from '@/components/ui';

interface ProductCatalogViewProps {
  initialProducts: Product[];
  initialCategories: Category[];
}

const ITEMS_PER_PAGE = 24;

export function ProductCatalogView({
  initialProducts,
  initialCategories,
}: ProductCatalogViewProps) {
  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString.withDefault(''),
      category: parseAsString,
      sub: parseAsString,
      price: parseAsString.withDefault('all'),
      sort: parseAsString.withDefault('featured'),
      page: parseAsInteger.withDefault(1),
    },
    { shallow: true },
  );

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (filters.q.trim()) {
      result = filterProductsBySearch(result, filters.q.trim());
    }

    if (filters.category) {
      result = result.filter((p) => p.categoryId === filters.category);
    }

    if (filters.sub) {
      result = result.filter((p) => p.subcategoryId === filters.sub);
    }

    if (filters.price === 'under-100k') {
      result = result.filter((p) => !p.isContactPrice && p.price > 1 && p.price < 100000);
    } else if (filters.price === '100k-500k') {
      result = result.filter((p) => !p.isContactPrice && p.price >= 100000 && p.price <= 500000);
    } else if (filters.price === 'above-500k') {
      result = result.filter((p) => !p.isContactPrice && p.price > 500000);
    }

    if (filters.sort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [initialProducts, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const safePage = Math.min(Math.max(1, filters.page), totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE,
  );

  const activeCategoryObj = initialCategories.find((c) => c.id === filters.category);
  const activeSubObj = activeCategoryObj?.subcategories?.find((s) => s.id === filters.sub);

  const clearAll = () => {
    setFilters({ q: null, category: null, sub: null, price: null, sort: null, page: null });
  };

  return (
    <div className="space-y-6">
      <div className="bg-sky-950 text-white p-6 sm:p-8 rounded-2xl border border-sky-900 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black">
          {activeSubObj?.name || activeCategoryObj?.name || 'Tất Cả Sản Phẩm Mai Store'}
        </h1>
        <p className="text-xs sm:text-sm text-sky-200 mt-1">
          {activeCategoryObj?.description ||
            'Khám phá trọn bộ hạt nhũ Kim Tuyến, Bột Màu xây dựng, Băng Keo và Keo Dán thủ công chất lượng cao.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-1">
          <CatalogFilterSidebar
            categories={initialCategories}
            selectedCategoryId={filters.category}
            selectedSubId={filters.sub}
            selectedPriceRange={filters.price}
            selectedSort={filters.sort}
            onSelectCategory={(catId) => setFilters({ category: catId, sub: null, page: 1 })}
            onSelectSubcategory={(subId) => setFilters({ sub: subId, page: 1 })}
            onSelectPriceRange={(range) =>
              setFilters({ price: range === 'all' ? null : range, page: 1 })
            }
            onSelectSort={(sort) => setFilters({ sort: sort === 'featured' ? null : sort, page: 1 })}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.q}
              onChange={(e) => setFilters({ q: e.target.value || null, page: 1 })}
              placeholder="Tìm nhanh theo tên sản phẩm, quy cách, màu sắc trong danh mục..."
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-sky-700 focus:ring-2 focus:ring-sky-700/15 shadow-2xs"
            />
            {filters.q && (
              <button
                type="button"
                onClick={() => setFilters({ q: null, page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700">
              Tìm thấy {filteredProducts.length} sản phẩm
            </span>
            <CatalogActiveBadges
              selectedCategoryName={activeCategoryObj?.name}
              selectedSubName={activeSubObj?.name}
              selectedPriceRange={filters.price !== 'all' ? filters.price : undefined}
              searchQuery={filters.q || undefined}
              onClearCategory={() => setFilters({ category: null, sub: null, page: 1 })}
              onClearSub={() => setFilters({ sub: null, page: 1 })}
              onClearPrice={() => setFilters({ price: null, page: 1 })}
              onClearSearch={() => setFilters({ q: null, page: 1 })}
              onClearAll={clearAll}
            />
          </div>

          <CatalogProductGrid products={paginatedProducts} onResetFilters={clearAll} />

          <Pagination
            page={safePage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            onPageChange={(nextPage) => setFilters({ page: nextPage })}
          />
        </div>
      </div>
    </div>
  );
}
