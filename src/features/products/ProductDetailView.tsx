'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Product } from '@/shared/types';
import { getDiscountPercent, isContactProduct } from '@/lib/format';
import { ProductReviews } from '@/features/products/ProductReviews';
import { ProductGallery } from './detail/ProductGallery';
import { ProductImageLightbox } from './detail/ProductImageLightbox';
import { ProductInfo } from './detail/ProductInfo';
import { ProductRelatedGrid } from './detail/ProductRelatedGrid';
import { ProductMobileStickyBar } from './detail/ProductMobileStickyBar';
import { buttonVariants } from '@/components/ui';

interface ProductDetailViewProps {
  initialProduct?: Product | null;
  initialRelatedProducts?: Product[];
}

export function ProductDetailView({
  initialProduct,
  initialRelatedProducts = [],
}: ProductDetailViewProps) {
  const router = useRouter();
  const product = initialProduct || null;
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'product_view',
        productId: product.id,
        productTitle: product.title,
      }),
    }).catch(() => {});
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Không tìm thấy sản phẩm!</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Sản phẩm bạn đang tìm kiếm có thể đã bị ngưng kinh doanh hoặc đường dẫn không đúng.
        </p>
        <Link href="/products" className={buttonVariants({ variant: 'primary', size: 'md' })}>
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách sản phẩm</span>
        </Link>
      </div>
    );
  }

  const isContact = isContactProduct(product);
  const discountPercent = getDiscountPercent(
    product.price,
    product.originalPrice,
    product.isContactPrice,
  );
  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'];

  const zaloMessage = encodeURIComponent(
    `Xin chào shop Mai Kim Tuyến, tôi muốn nhận báo giá sỉ cho sản phẩm: ${product.title} (${product.unit})`,
  );

  const handlePrevImage = () =>
    setSelectedImgIdx((prev) => (prev - 1 + images.length) % images.length);
  const handleNextImage = () => setSelectedImgIdx((prev) => (prev + 1) % images.length);
  const scrollToReviews = () => {
    document.getElementById('product-reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-24 sm:pb-12">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 pt-1 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap font-medium truncate">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Trang chủ
          </Link>
          <span>›</span>
          <Link href="/products" className="hover:text-slate-900 transition-colors">
            Sản phẩm
          </Link>
          <span>›</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.categoryId)}`}
            className="text-slate-600 hover:text-sky-900 font-medium"
          >
            {product.categoryName}
          </Link>
          <span>›</span>
          <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        <div className="lg:col-span-6">
          <ProductGallery
            images={images}
            selectedImgIdx={selectedImgIdx}
            onSelectImage={setSelectedImgIdx}
            onPrevImage={handlePrevImage}
            onNextImage={handleNextImage}
            onOpenLightbox={() => setIsLightboxOpen(true)}
            discountPercent={discountPercent}
            productTitle={product.title}
          />
        </div>

        <div className="lg:col-span-6">
          <ProductInfo product={product} onScrollToReviews={scrollToReviews} />
        </div>
      </div>

      <div
        id="product-reviews-section"
        className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 sm:p-8 space-y-6 scroll-mt-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
            Đánh Giá &amp; Cảm Nhận Của Khách Hàng
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Đánh giá thực tế từ khách hàng đã mua sản phẩm này
          </p>
        </div>

        <ProductReviews productId={product.id || product.slug} productTitle={product.title} />
      </div>

      <ProductRelatedGrid
        relatedProducts={initialRelatedProducts}
        categoryName={product.categoryName}
      />

      <ProductMobileStickyBar
        price={product.price}
        isContactPrice={isContact}
        zaloMessage={zaloMessage}
      />

      <ProductImageLightbox
        isOpen={isLightboxOpen}
        images={images}
        selectedImgIdx={selectedImgIdx}
        onSelectImage={setSelectedImgIdx}
        onPrevImage={handlePrevImage}
        onNextImage={handleNextImage}
        onClose={() => setIsLightboxOpen(false)}
        productTitle={product.title}
      />
    </div>
  );
}
