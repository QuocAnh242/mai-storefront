'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Category, Product } from '@/shared/types';
import { ProductCard } from '../products/ProductCard';
import { EmptyState } from '@/components/ui';
import { CategoryScrollBar } from './CategoryScrollBar';
import { StorefrontCategorySection } from './StorefrontCategorySection';

interface FeaturedProductsSectionProps {
  products: Product[];
  featuredProducts: Product[];
  categories: Category[];
}

export function FeaturedProductsSection({
  products,
  featuredProducts,
  categories,
}: FeaturedProductsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleCategoryClick = (catId: string | null) => {
    setSelectedCategory(catId);
    if (catId !== null) {
      const el = document.getElementById('danh-sach-san-pham');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : [];

  const powderCategoryIds = [
    'cat-kim-tuyen',
    'cat-camay',
    'cat-da-quang',
    'cat-phan-quang',
    'cat-bot-mau',
  ];
  const powderProducts = products.filter((p) => powderCategoryIds.includes(p.categoryId));

  const adhesiveCategoryIds = ['cat-bang-keo', 'cat-son-xit', 'cat-keo-dan'];
  const adhesiveProducts = products.filter((p) => adhesiveCategoryIds.includes(p.categoryId));

  const shoePolishCategoryIds = ['cat-xi-giay'];
  const shoePolishProducts = products.filter((p) => shoePolishCategoryIds.includes(p.categoryId));

  const otherProducts = products.filter(
    (p) =>
      !powderCategoryIds.includes(p.categoryId) &&
      !adhesiveCategoryIds.includes(p.categoryId) &&
      !shoePolishCategoryIds.includes(p.categoryId),
  );

  return (
    <div id="danh-sach-san-pham" className="space-y-12 py-4">
      <CategoryScrollBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryClick}
      />

      {selectedCategory ? (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {categories.find((c) => c.id === selectedCategory)?.name || 'Sản phẩm'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Hiển thị {filteredProducts.length} sản phẩm phù hợp
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/products?category=${encodeURIComponent(selectedCategory)}`}
                className="text-xs font-bold text-sky-900 hover:underline"
              >
                Lọc nâng cao trong danh mục →
              </Link>
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ← Xem tất cả
              </button>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có sản phẩm nào trong danh mục này"
              description="Vui lòng chọn danh mục khác hoặc liên hệ Zalo để kiểm tra hàng tại kho."
            />
          )}
        </section>
      ) : (
        <div className="space-y-14">
          {featuredProducts.length > 0 && (
            <section className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Sản phẩm nổi bật
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Mặt hàng bán chạy, giá sỉ rõ ràng – bấm để nhận báo giá qua Zalo
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
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Xem thêm {featuredProducts.length - 4} sản phẩm nổi bật →
                  </Link>
                </div>
              )}
            </section>
          )}

          <StorefrontCategorySection
            title="Bột Kim Tuyến & Các Loại Bột Màu"
            subtitle="Bột kim tuyến, Bột Camay, Bột Dạ Quang, Bột Phản Quang, Bột Màu Xây Dựng"
            products={powderProducts}
            maxDisplay={4}
            viewMoreHref="/products?category=cat-kim-tuyen"
            viewMoreLabel="sản phẩm Bột Kim Tuyến & Bột Màu"
            emptyText="Đang cập nhật danh mục Bột Kim Tuyến & Bột Màu..."
          />

          <StorefrontCategorySection
            title="Băng Keo, Sơn Xịt & Keo Dán Chuyên Dụng"
            subtitle="Băng keo dán thùng, Sơn xịt ATM/Samurai, Keo con chó Dog X66, Keo 502"
            products={adhesiveProducts}
            maxDisplay={4}
            viewMoreHref="/products?category=cat-bang-keo"
            viewMoreLabel="sản phẩm Băng Keo, Sơn Xịt & Keo Dán"
            emptyText="Đang cập nhật danh mục Băng Keo, Sơn Xịt & Keo Dán..."
          />

          <StorefrontCategorySection
            title="Xi Đánh Giày & Bảo Vệ Đồ Da"
            subtitle="Xi Thái Kleen, Xi Aromax, Xi Ximo, Xi Starwax, Xi CF"
            products={shoePolishProducts}
            maxDisplay={4}
            viewMoreHref="/products?category=cat-xi-giay"
            viewMoreLabel="sản phẩm Xi Đánh Giày"
            emptyText="Đang cập nhật danh mục Xi Đánh Giày..."
          />

          <StorefrontCategorySection
            title="Dụng Cụ Đóng Gói & Vật Tư Khác"
            subtitle="Cắt băng keo cầm tay, Máy bắn giá tiền & phụ kiện vật tư"
            products={otherProducts}
            maxDisplay={4}
            viewMoreHref="/products"
            viewMoreLabel="vật tư khác"
            emptyText="Đang cập nhật các vật tư khác..."
          />
        </div>
      )}
    </div>
  );
}
