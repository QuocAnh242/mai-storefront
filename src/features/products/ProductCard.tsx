'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/shared/types';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const detailUrl = `/san-pham/${product.slug || product.id}`;

  return (
    <Link
      href={detailUrl}
      className="group flex flex-col cursor-pointer select-none"
    >
      {/* ─── Clean Product Image (Editorial Minimalist Style) ─── */}
      <div className="relative aspect-square bg-slate-50 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-2xs group-hover:shadow-md group-hover:border-slate-200 transition-all duration-300">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Minimalist Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* ─── Minimalist Typography Under Image (Matching White reference) ─── */}
      <div className="pt-2 sm:pt-2.5 px-0.5 space-y-0.5">
        {/* Category & Unit */}
        <div className="flex items-center justify-between gap-1 text-[10px] text-slate-400 font-semibold uppercase tracking-wider truncate">
          <span className="truncate">{product.categoryName}</span>
          {product.unit && <span className="shrink-0 lowercase text-[10px] text-slate-400">· {product.unit}</span>}
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-800 transition-colors">
          {product.title}
        </h3>

        {/* Price */}
        <div className="pt-0.5 flex items-baseline gap-1.5 flex-wrap">
          <span className="text-xs sm:text-sm font-black text-sky-950">
            {formatVND(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-slate-400 line-through">
              {formatVND(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
