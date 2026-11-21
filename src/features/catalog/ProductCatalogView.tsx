'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { filterProductsBySearch } from '@/lib/searchUtils';
import { CatalogFilterSidebar } from './CatalogFilterSidebar';
import { CatalogActiveBadges } from './CatalogActiveBadges';
import { CatalogProductGrid } from './CatalogProductGrid';
import { Loading } from '@/components/ui/Loading';

export function ProductCatalogView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, categories, isLoading } = useStore();

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || null;
  const selectedPriceRange = searchParams.get('price') || 'all';
  const selectedSort = searchParams.get('sort') || 'featured';

  // Helper to update URL params
  const updateUrl = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '' || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });
    router.push(`/products?${params.toString()}`);
  };

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Text Search Filter (Vietnamese accent-insensitive)
    if (searchQuery.trim()) {
      result = filterProductsBySearch(result, searchQuery.trim());
    }

    // 2. Category Filter
    if (selectedCategory) {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    // 3. Price Filter
    if (selectedPriceRange === 'under-100k') {
      result = result.filter((p) => p.price > 0 && p.price < 100000);
    } else if (selectedPriceRange === '100k-500k') {
      result = result.filter((p) => p.price >= 100000 && p.price <= 500000);
    } else if (selectedPriceRange === 'above-500k') {
      result = result.filter((p) => p.price > 500000);
    }

    // 4. Sorting
    if (selectedSort === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedPriceRange, selectedSort]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory);

  if (isLoading && products.length === 0) {
    return (
      <div className="py-16 flex justify-center">
        <Loading
          size="lg"
          text="Đang tải danh mục sản phẩm..."
          subtext="Đang kết nối kho hàng và đồng bộ bảng giá mới nhất"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Catalog Header Banner */}
      <div className="bg-sky-950 text-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-sky-900 shadow-xs">
        <h1 className="text-2xl sm:text-3xl font-black">
          {activeCategoryObj?.name || 'Tất Cả Sản Phẩm Mai Store'}
        </h1>
        <p className="text-xs sm:text-sm text-sky-200 mt-1">
          {activeCategoryObj?.description ||
            'Khám phá trọn bộ hạt nhũ Kim Tuyến, Bột Màu xây dựng, Băng Keo và Keo Dán thủ công chất lượng cao.'}
        </p>
      </div>

      {/* Main Grid: Sidebar Filters on Desktop + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Filter */}
        <div className="lg:col-span-1">
          <CatalogFilterSidebar
            categories={categories}
            selectedCategoryId={selectedCategory}
            selectedPriceRange={selectedPriceRange}
            selectedSort={selectedSort}
            onSelectCategory={(catId) => updateUrl({ category: catId })}
            onSelectPriceRange={(range) => updateUrl({ price: range })}
            onSelectSort={(sort) => updateUrl({ sort })}
          />
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-slate-700">
                Tìm thấy {filteredProducts.length} sản phẩm
              </span>
            </div>
            <CatalogActiveBadges
              selectedCategoryName={activeCategoryObj?.name}
              selectedPriceRange={selectedPriceRange !== 'all' ? selectedPriceRange : undefined}
              searchQuery={searchQuery || undefined}
              onClearCategory={() => updateUrl({ category: null })}
              onClearPrice={() => updateUrl({ price: null })}
              onClearSearch={() => updateUrl({ q: null })}
              onClearAll={() => router.push('/products')}
            />
          </div>

          <CatalogProductGrid
            products={filteredProducts}
            onResetFilters={() => router.push('/products')}
          />
        </div>
      </div>
    </div>
  );
}
