'use client';

import React from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { ProductCard } from '../products/ProductCard';

export function FeaturedProductsSection() {
  const { products, featuredProducts, selectedCategory, setSelectedCategory, searchQuery, categories } = useStore();

  // Active filter logic
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory ? p.categoryId === selectedCategory : true;
    const matchesSearch = searchQuery
      ? p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCat && matchesSearch;
  });

  const isFiltering = Boolean(selectedCategory || searchQuery);

  // Section Group 1: Bột Kim Tuyến & Các Loại Bột Màu
  const powderCategoryIds = ['cat-kim-tuyen', 'cat-camay', 'cat-da-quang', 'cat-phan-quang', 'cat-bot-mau'];
  const powderProducts = products.filter((p) => powderCategoryIds.includes(p.categoryId));

  // Section Group 2: Băng Keo, Sơn Xịt & Keo Dán
  const adhesiveCategoryIds = ['cat-bang-keo', 'cat-son-xit', 'cat-keo-dan'];
  const adhesiveProducts = products.filter((p) => adhesiveCategoryIds.includes(p.categoryId));

  // Section Group 3: Xi Đánh Giày
  const shoePolishCategoryIds = ['cat-xi-giay'];
  const shoePolishProducts = products.filter((p) => shoePolishCategoryIds.includes(p.categoryId));

  // Section Group 4: Vật Tư Khác
  const otherProducts = products.filter(
    (p) =>
      !powderCategoryIds.includes(p.categoryId) &&
      !adhesiveCategoryIds.includes(p.categoryId) &&
      !shoePolishCategoryIds.includes(p.categoryId)
  );

  return (
    <div id="danh-sach-san-pham" className="space-y-12 py-4">
      {/* Clean Category Filter Bar with Scroll Affordance */}
      <div className="relative bg-white p-2.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none py-0.5 pr-8 sm:pr-0 scroll-smooth">
          <span className="hidden sm:inline font-extrabold text-slate-900 text-xs sm:text-sm uppercase tracking-wide shrink-0">
            Danh Mục:
          </span>

          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              selectedCategory === null
                ? 'bg-sky-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-sky-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Right Fade Edge for mobile scroll affordance */}
        <div className="pointer-events-none absolute right-1 top-1 bottom-1 w-8 sm:w-10 bg-gradient-to-l from-white via-white/80 to-transparent rounded-r-xl flex items-center justify-end pr-1 sm:hidden">
          <span className="text-[10px] text-slate-400 font-bold">›</span>
        </div>
      </div>

      {/* FILTER SEARCH OR CATEGORY MODE */}
      {isFiltering ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {selectedCategory
                  ? categories.find((c) => c.id === selectedCategory)?.name || 'Sản phẩm'
                  : `Kết quả tìm kiếm: "${searchQuery}"`}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Hiển thị {filteredProducts.length} sản phẩm phù hợp</p>
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
              <p className="text-sm font-medium text-slate-500">Chưa có sản phẩm nào trong danh mục này.</p>
            </div>
          )}
        </section>
      ) : (
        /* STANDARD 4 MAIN SECTIONS STOREFRONT DISPLAY */
        <div className="space-y-14">
          {/* Section 0: Featured Products (If Admin marked any featured) */}
          {featuredProducts.length > 0 && (
            <section className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sản Phẩm Nổi Bật</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Danh sách các mặt hàng bán chạy được chọn lọc</p>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                  {featuredProducts.length} nổi bật
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          )}

          {/* Section 1: Bột Kim Tuyến & Các Loại Bột Màu */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-sky-950 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  Bột Kim Tuyến & Các Loại Bột Màu
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bột kim tuyến, Bột Camay, Bột Dạ Quang, Bột Phản Quang, Bột Màu Xây Dựng
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                {powderProducts.length} sản phẩm
              </span>
            </div>

            {powderProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
                {powderProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400">Đang cập nhật danh mục Bột Kim Tuyến & Bột Màu...</p>
              </div>
            )}
          </section>

          {/* Section 2: Băng Keo, Sơn Xịt & Keo Dán */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-sky-950 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  Băng Keo, Sơn Xịt & Keo Dán Chuyên Dụng
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Băng keo dán thùng, Sơn xịt ATM/Samurai, Keo con chó Dog X66, Keo 502
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                {adhesiveProducts.length} sản phẩm
              </span>
            </div>

            {adhesiveProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
                {adhesiveProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400">Đang cập nhật danh mục Băng Keo, Sơn Xịt & Keo Dán...</p>
              </div>
            )}
          </section>

          {/* Section 3: Xi Đánh Giày */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-sky-950 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  Xi Đánh Giày & Bảo Vệ Đồ Da
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xi Thái Kleen, Xi Aromax, Xi Ximo, Xi Starwax, Xi CF
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                {shoePolishProducts.length} sản phẩm
              </span>
            </div>

            {shoePolishProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
                {shoePolishProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400">Đang cập nhật danh mục Xi Đánh Giày...</p>
              </div>
            )}
          </section>

          {/* Section 4: Dụng Cụ & Vật Tư Khác */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b-2 border-sky-950 pb-3">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                  Dụng Cụ Đóng Gói & Vật Tư Khác
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cắt băng keo cầm tay, Máy bắn giá tiền & phụ kiện vật tư
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full shrink-0">
                {otherProducts.length} sản phẩm
              </span>
            </div>

            {otherProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
                {otherProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-400">Đang cập nhật các vật tư khác...</p>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

