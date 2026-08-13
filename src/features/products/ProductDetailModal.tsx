'use client';

import React, { useState } from 'react';
import { Product } from '@/shared/types';
import { useCart } from '@/shared/context/CartContext';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { X, ShoppingBag, Plus, Minus, ShieldCheck, Truck, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { addToCart, setIsCartOpen } = useCart();
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const images = product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
              <img
                src={images[selectedImgIdx]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Thumbnail Pickers */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`w-16 h-16 rounded-xl border-2 overflow-hidden shrink-0 cursor-pointer transition-all ${
                      selectedImgIdx === idx ? 'border-sky-800 ring-2 ring-sky-200' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Commitments Pill Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hàng có sẵn tại kho Trịnh Hoài Đức - Giao ngay</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Hỗ trợ gửi chành xe / Giao chuyển phát toàn quốc</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Bao đổi trả nếu sản phẩm lỗi quy cách</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-sky-800 uppercase tracking-widest block mb-1">
                  {product.categoryName} {product.subcategoryName ? `• ${product.subcategoryName}` : ''}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {product.title}
                </h2>
                <span className="inline-block mt-2 text-xs font-bold bg-sky-100 text-sky-900 px-3 py-1 rounded-full border border-sky-200">
                  Quy cách: {product.unit}
                </span>
              </div>

              {/* Pricing */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-baseline gap-3">
                <span className="text-2xl font-black text-sky-950">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Product Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Mô Tả Sản Phẩm</h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto pr-1">
                  {product.description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Số Lượng Mua</h4>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 font-black text-sm text-slate-900 select-none">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    = {formatVND(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                onClick={handleAddToCart}
                className="w-full bg-sky-900 hover:bg-sky-950 text-white font-bold text-sm py-3.5 rounded-2xl shadow-md transition-colors flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 text-amber-400" />
                <span>Thêm Vào Giỏ Hàng</span>
              </button>

              <a
                href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${encodeURIComponent(`Tư vấn sản phẩm chi tiết: ${product.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-100 hover:bg-slate-200 text-sky-950 font-bold text-xs py-3 rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              >
                <span>Tư Vấn Giá Sỉ Số Lượng Lớn qua Zalo</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
