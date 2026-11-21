'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { findProductBySlugOrId } from '@/lib/productUrl';
import { ProductReviews } from '@/features/products/ProductReviews';
import { Loading } from '@/components/ui/Loading';
import { Product } from '@/shared/types';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { ProductGallery } from './detail/ProductGallery';
import { ProductImageLightbox } from './detail/ProductImageLightbox';
import { ProductInfo } from './detail/ProductInfo';
import { ProductRelatedGrid } from './detail/ProductRelatedGrid';
import { ProductMobileStickyBar } from './detail/ProductMobileStickyBar';

interface ProductDetailViewProps {
  initialProduct?: Product | null;
  initialRelatedProducts?: Product[];
}

export function ProductDetailView({
  initialProduct,
  initialRelatedProducts,
}: ProductDetailViewProps) {
  const params = useParams();
  const router = useRouter();
  const slugParam = params?.slug;

  const { products, isLoading } = useStore();

  const product =
    initialProduct ||
    findProductBySlugOrId(products, slugParam as string | string[]);

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Track product view for analytics
  React.useEffect(() => {
    if (product) {
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'product_view',
            productId: product.id,
            productTitle: product.title,
          }),
        }).catch(() => {});
      } catch {}
    }
  }, [product?.id, product?.title]);

  if (isLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 py-8">
        <div className="py-12 flex justify-center">
          <Loading
            size="lg"
            text="Đang tải sản phẩm..."
            subtext="Đang đồng bộ chi tiết sản phẩm và bảng giá mới nhất"
          />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Không tìm thấy sản phẩm!
        </h2>
        <p className="text-xs text-slate-500 max-w-sm">
          Sản phẩm bạn đang tìm kiếm có thể đã bị ngưng kinh doanh hoặc đường dẫn không đúng.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <span>Quay lại danh sách sản phẩm</span>
        </Link>
      </div>
    );
  }

  const isContact = Boolean(product.isContactPrice || product.price <= 1);
  const discountPercent =
    !isContact && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'];

  const relatedProducts =
    initialRelatedProducts && initialRelatedProducts.length > 0
      ? initialRelatedProducts
      : products
          .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
          .slice(0, 4);

  const zaloMessage = encodeURIComponent(
    `Xin chào shop Mai Kim Tuyến, tôi muốn nhận báo giá sỉ cho sản phẩm: ${product.title} (${product.unit})`
  );

  const handlePrevImage = () => {
    setSelectedImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setSelectedImgIdx((prev) => (prev + 1) % images.length);
  };

  const scrollToReviews = () => {
    const el = document.getElementById('product-reviews-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-12">
      {/* ─── Breadcrumb Navigation ─── */}
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
          <span className="text-slate-600 font-medium">
            {product.categoryName}
          </span>
          <span>›</span>
          <span className="text-slate-900 font-bold truncate max-w-[140px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* ─── Main Product Container ─── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
        {/* Left Column: Image Gallery */}
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

        {/* Right Column: Product Specs & Contact */}
        <div className="lg:col-span-6">
          <ProductInfo
            product={product}
            onScrollToReviews={scrollToReviews}
          />
        </div>
      </div>

      {/* ─── Reviews Section ─── */}
      <div
        id="product-reviews-section"
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xs p-5 sm:p-8 space-y-6 scroll-mt-6"
      >
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
            Đánh Giá &amp; Cảm Nhận Của Khách Hàng
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Đánh giá thực tế từ khách hàng đã mua sản phẩm này
          </p>
        </div>

        <ProductReviews
          productId={product.id || product.slug}
          productTitle={product.title}
        />
      </div>

      {/* ─── Related Products Grid ─── */}
      <ProductRelatedGrid
        relatedProducts={relatedProducts}
        categoryName={product.categoryName}
      />

      {/* ─── Mobile Sticky Bar ─── */}
      <ProductMobileStickyBar
        price={product.price}
        zaloMessage={zaloMessage}
      />

      {/* ─── Fullscreen Lightbox Modal ─── */}
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
