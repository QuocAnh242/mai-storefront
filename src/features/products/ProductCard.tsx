'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/shared/types';
import { getProductUrl } from '@/lib/productUrl';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const isContact = Boolean(product.isContactPrice || product.price <= 1);

  const discountPercent =
    !isContact && product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const detailUrl = getProductUrl(product);

  return (
    <Link
      href={detailUrl}
      className="group flex flex-col cursor-pointer select-none"
    >
      {/* ─── Product Image (Tràn viền, bắt mắt, không khung đệm thừa) ─── */}
      <div className="relative aspect-square bg-slate-50 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:shadow-md group-hover:border-slate-300 transition-all duration-300">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* ─── Typography & Actions Under Image (Tối ưu UI/UX Mobile & Desktop) ─── */}
      <div className="pt-2 sm:pt-2.5 px-0.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Unit */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">
            <span className="truncate">{product.categoryName}</span>
            {product.unit && (
              <span className="shrink-0 lowercase text-[10px] sm:text-[11px] text-slate-400">
                · {product.unit}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 mt-1 min-h-[2.25rem] group-hover:text-sky-950 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price & Action Button */}
        <div className="pt-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {isContact ? (
              <span className="text-xs sm:text-sm font-bold text-sky-800">
                Liên hệ báo giá
              </span>
            ) : (
              <>
                <span className="text-sm sm:text-base font-black text-slate-900">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-2 w-full py-1.5 sm:py-2 px-2 rounded-lg border border-slate-900 group-hover:bg-slate-900 group-hover:text-white text-slate-900 font-bold text-[11px] sm:text-xs transition-colors text-center active:scale-95">
            Nhận báo giá
          </div>
        </div>
      </div>
    </Link>
  );
}
