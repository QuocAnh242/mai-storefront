'use client';

import React from 'react';
import { Star, Phone, MessageCircle } from 'lucide-react';
import { Product } from '@/shared/types';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

interface ProductInfoProps {
  product: Product;
  onScrollToReviews: () => void;
}

export function ProductInfo({ product, onScrollToReviews }: ProductInfoProps) {
  const isContact = Boolean(product.isContactPrice || product.price <= 1);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const zaloMessage = encodeURIComponent(
    `Xin chào shop Mai Kim Tuyến, tôi muốn nhận báo giá sỉ cho sản phẩm: ${product.title} (${product.unit})`
  );

  return (
    <div className="flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        {/* Category tag & Title */}
        <div>
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest block">
            {product.categoryName}
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug tracking-tight mt-1">
            {product.title}
          </h1>
        </div>

        {/* Meta row: Kho, Quy cách & Nút Đánh giá sản phẩm trên 1 dòng */}
        <div className="flex items-center justify-between gap-2 text-xs flex-wrap pb-0.5">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/80 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
              Sẵn kho TP.HCM
            </span>
            <span>·</span>
            <span className="text-slate-500 text-[11px]">Quy cách: {product.unit}</span>
          </div>

          <button
            type="button"
            onClick={onScrollToReviews}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-md transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Bấm để cuộn xuống xem đánh giá sản phẩm"
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
            <span>Đánh giá sản phẩm</span>
          </button>
        </div>

        {/* Clean Price Card */}
        <div className="bg-slate-50/80 p-3.5 sm:p-4 rounded-xl border border-slate-200">
          {isContact ? (
            <div className="flex items-center gap-2 py-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Liên hệ báo giá
              </span>
            </div>
          ) : (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                  {formatVND(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs font-bold text-white bg-amber-600 px-2 py-0.5 rounded-md shadow-2xs">
                  Tiết kiệm {formatVND(product.originalPrice - product.price)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Quick Description */}
        {product.description && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-0.5">
            {product.description}
          </p>
        )}
      </div>

      {/* Desktop Contact CTA Buttons */}
      <div className="pt-2 space-y-3">
        {/* Primary Zalo CTA */}
        <a
          href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${zaloMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Nhận báo giá qua Zalo</span>
        </a>

        {/* Secondary Row: Call & Messenger */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="py-2.5 px-3 rounded-xl border border-slate-900 hover:bg-slate-50 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gọi {INITIAL_STORE_SETTINGS.hotline}</span>
          </a>

          <a
            href="https://m.me/chuyencungcapkimtuyensivale"
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Nhắn Messenger</span>
          </a>
        </div>

        {/* Grounded Trust Signals */}
        <div className="flex items-center gap-5 text-xs text-slate-500 pt-0.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Hỗ trợ gửi chành xe toàn quốc
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Đổi trả nếu sai quy cách
          </span>
        </div>
      </div>
    </div>
  );
}
