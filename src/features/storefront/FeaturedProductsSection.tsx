'use client';

import React from 'react';
import Link from 'next/link';
import { useStore } from '@/shared/context/StoreContext';
import { ProductCard } from '../products/ProductCard';
import { Loading, ProductGridSkeleton } from '@/components/ui/Loading';
import { CategoryScrollBar } from './CategoryScrollBar';
import { StorefrontCategorySection } from './StorefrontCategorySection';

export function FeaturedProductsSection() {
  const {
    products,
    featuredProducts,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    categories,
    isLoading,
  } = useStore();

  const handleCategoryClick = (catId: string | null) => {
    setSelectedCategory(catId);
    if (catId !== null) {
      const el = document.getElementById('danh-sach-san-pham');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Active filter logic
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory
      ? p.categoryId === selectedCategory
      : true;
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  const isFiltering = Boolean(selectedCategory || searchQuery);

  // Section Group 1: glitter powder & color powders
  const powderCategoryIds = [
    'cat-kim-tuyen',
    'cat-camay',
    'cat-da-quang',
    'cat-phan-quang',
    'cat-bot-mau',
  ];
  const powderProducts = products.filter((p) =>
    powderCategoryIds.includes(p.categoryId)
  );

  // Section Group 2: adhesive tape, spray paint & glue
  const adhesiveCategoryIds = ['cat-bang-keo', 'cat-son-xit', 'cat-keo-dan'];
  const adhesiveProducts = products.filter((p) =>
    adhesiveCategoryIds.includes(p.categoryId)
  );

  // Section Group 3: shoe polish
  const shoePolishCategoryIds = ['cat-xi-giay'];
  const shoePolishProducts = products.filter((p) =>
    shoePolishCategoryIds.includes(p.categoryId)
  );

  // Section Group 4: other supplies
  const otherProducts = products.filter(
    (p) =>
      !powderCategoryIds.includes(p.categoryId) &&
      !adhesiveCategoryIds.includes(p.categoryId) &&
      !shoePolishCategoryIds.includes(p.categoryId)
  );

  if (isLoading && products.length === 0) {
    return (
      <div id="danh-sach-san-pham" className="space-y-8 py-6">
        <div className="py-6 flex justify-center">
          <Loading
            size="lg"
            text="Đang tải danh sách sản phẩm..."
            subtext="Đang kết nối kho hàng và đồng bộ danh mục"
          />
        </div>
        <ProductGridSkeleton count={8} />
      </div>
    );
  }

  return (
    <div id="danh-sach-san-pham" className="space-y-12 py-4">
      {/* 1. Category Filter Bar (Original Design & Scroll Affordance) */}
      <CategoryScrollBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryClick}
      />

      {/* 2. FILTER SEARCH OR CATEGORY MODE */}
      {isFiltering ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name ||
                    'Sản phẩm'
                  : `Kết quả tìm kiếm: "${searchQuery}"`}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Hiển thị {filteredProducts.length} sản phẩm phù hợp
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs font-bold text-sky-800 hover:underline cursor-pointer"
            >
              ← Xem tất cả sản phẩm
            </button>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm font-medium text-slate-500">
                Chưa có sản phẩm nào trong danh mục này.
              </p>
            </div>
          )}
        </section>
      ) : (
        /* 3. COMPACT CATEGORY OVERVIEW (4 ITEMS PER SECTION) */
        <div className="space-y-14">
          {/* Section 0: Featured Products */}
          {featuredProducts.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Sản phẩm nổi bật
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Mặt hàng bán chạy, giá sỉ rõ ràng – bấm để nhận báo giá qua
                    Zalo
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                    {featuredProducts.length} nổi bật
                  </span>
                  {featuredProducts.length > 4 && (
                    <Link
                      href="/products"
                      className="hidden sm:inline-block text-xs font-bold text-sky-900 hover:underline ml-1"
                    >
                      Xem tất cả →
                    </Link>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {featuredProducts.length > 4 && (
                <div className="flex justify-center pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-98 transition-all"
                  >
                    Xem thêm {featuredProducts.length - 4} sản phẩm nổi bật →
                  </Link>
                </div>
              )}
            </section>
          )}

          {/* Section 1: glitter powder & color powders */}
          <StorefrontCategorySection
            title="Bột Kim Tuyến & Các Loại Bột Màu"
            subtitle="Bột kim tuyến, Bột Camay, Bột Dạ Quang, Bột Phản Quang, Bột Màu Xây Dựng"
            products={powderProducts}
            maxDisplay={4}
            onViewMore={() => handleCategoryClick('cat-kim-tuyen')}
            viewMoreLabel="sản phẩm Bột Kim Tuyến & Bột Màu"
            emptyText="Đang cập nhật danh mục Bột Kim Tuyến & Bột Màu..."
          />

          {/* Section 2: adhesive tape, spray paint & glue */}
          <StorefrontCategorySection
            title="Băng Keo, Sơn Xịt & Keo Dán Chuyên Dụng"
            subtitle="Băng keo dán thùng, Sơn xịt ATM/Samurai, Keo con chó Dog X66, Keo 502"
            products={adhesiveProducts}
            maxDisplay={4}
            onViewMore={() => handleCategoryClick('cat-bang-keo')}
            viewMoreLabel="sản phẩm Băng Keo, Sơn Xịt & Keo Dán"
            emptyText="Đang cập nhật danh mục Băng Keo, Sơn Xịt & Keo Dán..."
          />

          {/* Section 3: shoe polish */}
          <StorefrontCategorySection
            title="Xi Đánh Giày & Bảo Vệ Đồ Da"
            subtitle="Xi Thái Kleen, Xi Aromax, Xi Ximo, Xi Starwax, Xi CF"
            products={shoePolishProducts}
            maxDisplay={4}
            onViewMore={() => handleCategoryClick('cat-xi-giay')}
            viewMoreLabel="sản phẩm Xi Đánh Giày"
            emptyText="Đang cập nhật danh mục Xi Đánh Giày..."
          />

          {/* Section 4: packing tools & other supplies */}
          <StorefrontCategorySection
            title="Dụng Cụ Đóng Gói & Vật Tư Khác"
            subtitle="Cắt băng keo cầm tay, Máy bắn giá tiền & phụ kiện vật tư"
            products={otherProducts}
            maxDisplay={4}
            onViewMore={() => handleCategoryClick(null)}
            viewMoreLabel="vật tư khác"
            emptyText="Đang cập nhật các vật tư khác..."
          />
        </div>
      )}
    </div>
  );
}
