'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { useCart } from '@/shared/context/CartContext';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { ProductCard } from '@/features/products/ProductCard';
import {
  ShoppingBag,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Check,
  ArrowLeft,
  MessageCircle,
  Share2,
  CheckCircle2,
  Sparkles,
  Zap,
  Tag
} from 'lucide-react';
import { CheckoutModal } from '@/features/cart/CheckoutModal';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products, categories } = useStore();
  const { addToCart, setIsCartOpen } = useCart();

  // Find product by id or slug
  const product = products.find(
    (p) => p.id === productId || p.slug === productId
  );

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'policy'>('desc');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

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
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 bg-sky-950 text-white font-bold text-xs px-5 py-3 rounded-xl hover:bg-sky-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400" />
          <span>Quay lại danh sách sản phẩm</span>
        </Link>
      </div>
    );
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'];

  const relatedProducts = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCheckoutModalOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Breadcrumb Navigation & Back Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 flex-wrap font-medium">
          <Link href="/" className="hover:text-sky-900 transition-colors">
            Trang Chủ
          </Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-sky-900 transition-colors">
            Sản Phẩm
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">{product.categoryName}</span>
          <span>/</span>
          <span className="text-sky-950 font-bold truncate max-w-[200px] sm:max-w-xs">
            {product.title}
          </span>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-950 hover:text-sky-700 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* Main Product Grid Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Featured Large Image View */}
          <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs group">
            <img
              src={images[selectedImgIdx]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {discountPercent > 0 && (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                GIẢM {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 cursor-pointer transition-all ${
                    selectedImgIdx === idx
                      ? 'border-sky-900 ring-2 ring-sky-200 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Commitments & Policy Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 font-semibold text-slate-800">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
              <span>Hàng luôn có sẵn kho Trịnh Hoài Đức - Giao Hỏa Tốc</span>
            </div>
            <div className="flex items-center gap-2.5 font-semibold text-slate-800">
              <Truck className="w-4.5 h-4.5 text-sky-600 shrink-0" />
              <span>Gửi chành xe đi tỉnh / Giao hàng toàn quốc</span>
            </div>
            <div className="flex items-center gap-2.5 font-semibold text-slate-800">
              <ShieldCheck className="w-4.5 h-4.5 text-amber-600 shrink-0" />
              <span>Đổi trả 1-1 nếu sản phẩm sai quy cách hoặc lỗi nhà sản xuất</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Specs & Buy Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & Tags */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-sky-900 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.categoryName}
                </span>
                {product.subcategoryName && (
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                    {product.subcategoryName}
                  </span>
                )}
              </div>

              <button
                onClick={handleShare}
                className="text-xs font-semibold text-slate-500 hover:text-sky-950 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Chia sẻ sản phẩm này"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {product.title}
            </h1>

            {/* Stock status & Unit Badge */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Còn hàng tại kho
              </span>
              <span className="font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                Quy cách: {product.unit}
              </span>
            </div>

            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-slate-50 to-sky-50/50 p-5 rounded-2xl border border-sky-100 flex items-baseline justify-between flex-wrap gap-3">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Giá bán niêm yết:</span>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-3xl font-black text-sky-950 tracking-tight">
                    {formatVND(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-base font-semibold text-slate-400 line-through">
                      {formatVND(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-right">
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-lg">
                    Tiết kiệm {formatVND(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Short Description */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Mô Tả Nhanh</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                {product.description || 'Sản phẩm chất lượng cao đến từ thương hiệu Mai Kim Tuyến. Phù hợp cho nhu cầu sản xuất, thủ công công nghiệp và trang trí mỹ thuật.'}
              </p>
            </div>

            {/* Quantity Controls & Live Total */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Số Lượng Đặt Mua</h4>
              <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white shadow-2xs overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Giảm số lượng"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-5 font-black text-base text-slate-900 select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Tăng số lượng"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 font-medium block">Tạm tính:</span>
                  <span className="text-lg font-black text-sky-950">
                    {formatVND(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Grid */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Add To Cart Button - Only this button retains the icon */}
              <button
                onClick={handleAddToCart}
                className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-slate-900/20"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              {/* Buy Now Button - Icon removed */}
              <button
                onClick={handleBuyNow}
                className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-950 hover:from-sky-950 hover:to-sky-900 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer hover:shadow-sky-900/20"
              >
                <span>Mua Ngay Đơn Này</span>
              </button>
            </div>

            {/* Direct Zalo Wholesale Price Query - Icon removed */}
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${encodeURIComponent(
                `Xin chào shop Mai Kim Tuyến, tôi muốn tư vấn báo giá sỉ cho sản phẩm: ${product.title} (Số lượng: ${quantity} ${product.unit})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-sky-50 hover:bg-sky-100 text-sky-950 font-bold text-xs py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-sky-200/90 shadow-2xs"
            >
              <span>Tư Vấn Giá Sỉ Số Lượng Lớn qua Zalo</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Section: Detailed Description & Policy */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 shrink-0 ${
              activeTab === 'desc'
                ? 'border-sky-950 text-sky-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mô Tả Chi Tiết Sản Phẩm
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 shrink-0 ${
              activeTab === 'specs'
                ? 'border-sky-950 text-sky-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Thông Số & Quy Cách
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-6 py-4 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 shrink-0 ${
              activeTab === 'policy'
                ? 'border-sky-950 text-sky-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chính Sách Giao Hàng & Đổi Trả
          </button>
        </div>

        <div className="p-6 sm:p-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-base font-black text-slate-900">
                Chi tiết về sản phẩm {product.title}
              </h3>
              <p className="whitespace-pre-line text-slate-600">
                {product.description ||
                  `Sản phẩm ${product.title} là dòng vật tư cao cấp do đại lý Mai Kim Tuyến phân phối chính hãng. Đạt tiêu chuẩn chất lượng cao, độ hạt mịn, bám dính cực tốt và màu sắc tươi sáng lâu bền.`}
              </p>
              <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-2">
                <h4 className="font-bold text-sky-950 text-xs uppercase tracking-wider">Ưu điểm nổi bật:</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                  <li>Màu sắc nét, độ phản quang và ánh kim rực rỡ dưới ánh sáng.</li>
                  <li>Không chứa hóa chất độc hại, an toàn khi gia công và đóng gói.</li>
                  <li>Đa dạng quy cách đóng gói sỉ lẻ từ hũ nhỏ đến bao lớn 25kg.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl space-y-3">
              <h3 className="text-base font-black text-slate-900 mb-4">Thông số kỹ thuật sản phẩm</h3>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-500">Tên sản phẩm:</span>
                <span className="font-bold text-slate-900">{product.title}</span>
                <span className="font-semibold text-slate-500">Danh mục:</span>
                <span className="font-bold text-slate-900">{product.categoryName}</span>
                <span className="font-semibold text-slate-500">Quy cách bán:</span>
                <span className="font-bold text-slate-900">{product.unit}</span>
                <span className="font-semibold text-slate-500">Tình trạng kho:</span>
                <span className="font-bold text-emerald-700">Sẵn hàng tại TP.HCM</span>
                <span className="font-semibold text-slate-500">Nhà cung cấp:</span>
                <span className="font-bold text-slate-900">Cửa hàng Mai Kim Tuyến</span>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-black text-slate-900">Chính sách mua hàng & Vận chuyển</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-700" />
                    Vận chuyển & Chành Xe
                  </h4>
                  <p className="text-xs text-slate-600">
                    Giao hàng nội thành TP.HCM trong ngày. Hỗ trợ đóng thùng gửi chành xe uy tín đi các tỉnh thành miền Tây, Miền Trung và Miền Bắc.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Đổi trả & Bảo hành
                  </h4>
                  <p className="text-xs text-slate-600">
                    Bao đổi trả miễn phí trong vòng 7 ngày nếu hàng gửi bị đổ vỡ, hư hỏng hoặc không đúng quy cách cam kết khi đặt mua.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b-2 border-sky-950 pb-3">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Sản Phẩm Cùng Danh Mục</h3>
              <p className="text-xs text-slate-500">Các sản phẩm thuộc nhóm {product.categoryName}</p>
            </div>
            <Link
              href="/san-pham"
              className="text-xs font-bold text-sky-900 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Direct Checkout Modal if Buy Now clicked */}
      {isCheckoutModalOpen && (
        <CheckoutModal onClose={() => setIsCheckoutModalOpen(false)} />
      )}
    </div>
  );
}
