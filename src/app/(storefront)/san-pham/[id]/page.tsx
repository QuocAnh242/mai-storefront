'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { ProductCard } from '@/features/products/ProductCard';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Phone,
  MessageCircle,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { products } = useStore();

  // Find product by id or slug
  const product = products.find(
    (p) => p.id === productId || p.slug === productId
  );

  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'policy'>('desc');
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
          <ArrowLeft className="w-4 h-4 text-sky-400" />
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const zaloMessage = encodeURIComponent(
    `Xin chào shop Mai Kim Tuyến, tôi muốn tư vấn báo giá sỉ cho sản phẩm: ${product.title} (${product.unit})`
  );

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 sm:pb-12 animate-in fade-in duration-300">
      
      {/* ─── Breadcrumb Navigation & Back Button ─── */}
      <div className="flex items-center justify-between gap-3 text-xs text-slate-500 pt-1 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap font-medium truncate">
          <Link href="/" className="hover:text-sky-900 transition-colors">Trang Chủ</Link>
          <span>/</span>
          <Link href="/san-pham" className="hover:text-sky-900 transition-colors">Sản Phẩm</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate max-w-[140px] sm:max-w-xs">{product.categoryName}</span>
        </div>

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-950 hover:text-sky-700 transition-colors cursor-pointer bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại</span>
        </button>
      </div>

      {/* ─── Main Product Container ─── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">

        {/* ── Left Column: Clean Image Gallery ── */}
        <div className="lg:col-span-6 space-y-3 sm:space-y-4">
          {/* Main Large Image */}
          <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
            <img
              src={images[selectedImgIdx]}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            {discountPercent > 0 && (
              <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                GIẢM {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIdx(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 overflow-hidden shrink-0 cursor-pointer transition-all ${
                    selectedImgIdx === idx
                      ? 'border-sky-950 ring-2 ring-sky-200'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Store Commitments (Desktop only, concise) */}
          <div className="hidden sm:block bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Hàng luôn có sẵn kho Trịnh Hoài Đức — Giao nhanh TP.HCM</span>
            </div>
            <div className="flex items-center gap-2.5 font-semibold text-slate-800">
              <Truck className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Hỗ trợ gửi chành xe đi các tỉnh thành toàn quốc</span>
            </div>
            <div className="flex items-center gap-2.5 font-semibold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Bao đổi trả nếu sản phẩm sai quy cách cam kết</span>
            </div>
          </div>
        </div>

        {/* ── Right Column: Specs & Direct Inquiries ── */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            
            {/* Category tag & Share */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-black text-sky-900 bg-sky-50 border border-sky-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.categoryName}
              </span>

              <button
                onClick={handleShare}
                className="text-xs font-semibold text-slate-500 hover:text-sky-950 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                title="Chia sẻ link sản phẩm"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Đã sao chép link!' : 'Chia sẻ'}</span>
              </button>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug tracking-tight">
              {product.title}
            </h1>

            {/* Availability & Unit */}
            <div className="flex items-center gap-2.5 text-xs flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Sẵn hàng tại kho
              </span>
              <span className="font-bold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg">
                Quy cách: {product.unit}
              </span>
            </div>

            {/* Clean High-Visibility Price Card */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Giá bán niêm yết:
              </span>
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl sm:text-3xl font-black text-sky-950 tracking-tight">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                    Tiết kiệm {formatVND(product.originalPrice - product.price)}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 italic">
                * Khách mua số lượng lớn hoặc đại lý vui lòng liên hệ trực tiếp để có giá sỉ chiết khấu tốt nhất.
              </p>
            </div>

            {/* Quick Description */}
            <div className="space-y-1.5 pt-1">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Thông tin sản phẩm:</h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {product.description || 'Sản phẩm chất lượng cao đến từ thương hiệu Mai Kim Tuyến. Phù hợp cho nhu cầu sản xuất, thủ công công nghiệp và trang trí mỹ thuật.'}
              </p>
            </div>

          </div>

          {/* Desktop Contact CTA Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Liên hệ đặt mua &amp; báo giá sỉ:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Zalo Button */}
              <a
                href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${zaloMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span className="font-black text-xs uppercase bg-white/20 px-2 py-0.5 rounded">Zalo</span>
                <span>Tư Vấn Báo Giá Qua Zalo</span>
              </a>

              {/* Hotline Call Button */}
              <a
                href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
                className="bg-sky-950 hover:bg-sky-900 text-white font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-white" />
                <span>Gọi Hotline {INITIAL_STORE_SETTINGS.hotline}</span>
              </a>
            </div>

            {/* Messenger */}
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-slate-50 hover:bg-slate-100 text-sky-950 font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-blue-600" />
              <span>Nhắn Tin Qua Messenger</span>
            </a>
          </div>

        </div>

      </div>

      {/* ─── DESKTOP TABS VIEW (Kept 100% exactly as-is on PC) ─── */}
      <div className="hidden sm:block bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 shrink-0 ${
              activeTab === 'desc'
                ? 'border-sky-950 text-sky-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mô Tả Chi Tiết
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 shrink-0 ${
              activeTab === 'specs'
                ? 'border-sky-950 text-sky-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Thông Số &amp; Quy Cách
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`px-5 py-3.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border-b-2 shrink-0 ${
              activeTab === 'policy'
                ? 'border-sky-950 text-sky-950 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Chính Sách Chành Xe &amp; Đổi Trả
          </button>
        </div>

        <div className="p-5 sm:p-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
          {activeTab === 'desc' && (
            <div className="space-y-4 max-w-4xl">
              <h3 className="text-base font-black text-slate-900">
                Chi tiết về sản phẩm {product.title}
              </h3>
              <p className="whitespace-pre-line text-slate-600">
                {product.description ||
                  `Sản phẩm ${product.title} là dòng vật tư cao cấp do đại lý Mai Kim Tuyến phân phối chính hãng. Đạt tiêu chuẩn chất lượng cao, độ hạt mịn, bám dính cực tốt và màu sắc tươi sáng lâu bền.`}
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
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
              <h3 className="text-base font-black text-slate-900 mb-3">Thông số kỹ thuật</h3>
              <div className="grid grid-cols-2 gap-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-500">Tên sản phẩm:</span>
                <span className="font-bold text-slate-900">{product.title}</span>
                <span className="font-semibold text-slate-500">Danh mục:</span>
                <span className="font-bold text-slate-900">{product.categoryName}</span>
                <span className="font-semibold text-slate-500">Quy cách bán:</span>
                <span className="font-bold text-slate-900">{product.unit}</span>
                <span className="font-semibold text-slate-500">Tình trạng kho:</span>
                <span className="font-bold text-emerald-700">Sẵn hàng tại kho TP.HCM</span>
                <span className="font-semibold text-slate-500">Nhà cung cấp:</span>
                <span className="font-bold text-slate-900">Cửa hàng Mai Kim Tuyến</span>
              </div>
            </div>
          )}

          {activeTab === 'policy' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-black text-slate-900">Chính sách mua hàng &amp; Vận chuyển</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-700" />
                    Vận chuyển &amp; Chành Xe
                  </h4>
                  <p className="text-xs text-slate-600">
                    Giao hàng nội thành TP.HCM nhanh chóng. Hỗ trợ đóng thùng cẩn thận gửi chành xe uy tín đi các tỉnh thành toàn quốc.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-xs uppercase flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Đổi trả &amp; Bảo hành
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

      {/* ─── MOBILE VERTICAL SECTIONS VIEW (No cut-off tabs, everything clear on scroll) ─── */}
      <div className="sm:hidden space-y-4">
        {/* Section 1: Detailed Description */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Mô Tả Chi Tiết Sản Phẩm
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
            {product.description ||
              `Sản phẩm ${product.title} là dòng vật tư cao cấp do đại lý Mai Kim Tuyến phân phối chính hãng. Đạt tiêu chuẩn chất lượng cao, độ hạt mịn, bám dính cực tốt và màu sắc tươi sáng lâu bền.`}
          </p>
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
            <h4 className="font-bold text-sky-950 text-xs">Ưu điểm nổi bật:</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
              <li>Màu sắc nét, độ phản quang và ánh kim rực rỡ dưới ánh sáng.</li>
              <li>Không chứa hóa chất độc hại, an toàn khi gia công và đóng gói.</li>
              <li>Đa dạng quy cách đóng gói sỉ lẻ từ hũ nhỏ đến bao lớn 25kg.</li>
            </ul>
          </div>
        </div>

        {/* Section 2: Specifications Table */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Thông Số &amp; Quy Cách
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <span className="font-semibold text-slate-400">Tên sản phẩm:</span>
            <span className="font-bold text-slate-900">{product.title}</span>
            <span className="font-semibold text-slate-400">Danh mục:</span>
            <span className="font-bold text-slate-900">{product.categoryName}</span>
            <span className="font-semibold text-slate-400">Quy cách bán:</span>
            <span className="font-bold text-slate-900">{product.unit}</span>
            <span className="font-semibold text-slate-400">Tình trạng kho:</span>
            <span className="font-bold text-emerald-700">Sẵn hàng tại TP.HCM</span>
            <span className="font-semibold text-slate-400">Nhà cung cấp:</span>
            <span className="font-bold text-slate-900">Cửa hàng Mai Kim Tuyến</span>
          </div>
        </div>

        {/* Section 3: Shipping & Return Policy */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
            Chính Sách Chành Xe &amp; Đổi Trả
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900">Giao hàng &amp; Gửi chành xe:</h5>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Giao hỏa tốc nội thành TP.HCM trong ngày. Hỗ trợ đóng thùng cẩn thận gửi chành xe uy tín đi các tỉnh thành toàn quốc.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-slate-900">Đổi trả &amp; Bảo hành:</h5>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  Bao đổi trả miễn phí trong vòng 7 ngày nếu hàng gửi bị đổ vỡ, hư hỏng hoặc không đúng quy cách cam kết khi đặt mua.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Related Products Section (1 product per row on mobile) ─── */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-tight">
                Sản Phẩm Cùng Danh Mục
              </h3>
              <p className="text-xs text-slate-500">Các sản phẩm thuộc nhóm {product.categoryName}</p>
            </div>
            <Link
              href="/san-pham"
              className="text-xs font-bold text-sky-900 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-3.5 gap-y-6 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ─── MOBILE STICKY BOTTOM ACTION BAR (1-tap contact from anywhere on screen) ─── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="truncate">
          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Giá niêm yết:</span>
          <span className="text-base font-black text-sky-950 leading-tight">
            {formatVND(product.price)}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="w-10 h-10 rounded-xl bg-slate-100 active:bg-slate-200 text-sky-950 flex items-center justify-center border border-slate-200"
            title="Gọi Hotline"
          >
            <Phone className="w-4 h-4 text-sky-950" />
          </a>
          <a
            href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${zaloMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-[#0068FF] active:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
          >
            <span className="font-black text-[10px] uppercase">Zalo</span>
            <span>Báo Giá Sỉ</span>
          </a>
        </div>
      </div>

    </div>
  );
}
