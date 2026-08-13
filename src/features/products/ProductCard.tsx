'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/shared/types';
import { useCart } from '@/shared/context/CartContext';
import { ShoppingBag, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const detailUrl = `/san-pham/${product.slug || product.id}`;

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group">
      {/* Image Container */}
      <Link href={detailUrl} className="relative aspect-square bg-slate-100 overflow-hidden cursor-pointer block">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discountPercent > 0 && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between gap-2 sm:gap-3">
        <div>
          <span className="text-[9px] sm:text-[10px] font-bold text-sky-800 uppercase tracking-wider block mb-0.5 sm:mb-1 truncate">
            {product.categoryName}
          </span>
          <Link href={detailUrl}>
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2 group-hover:text-sky-800 transition-colors cursor-pointer">
              {product.title}
            </h3>
          </Link>
          <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 mt-0.5 sm:mt-1 truncate">{product.unit}</p>
        </div>

        <div>
          {/* Price */}
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-xs sm:text-base font-black text-sky-950">
              {formatVND(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 line-through">
                {formatVND(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-2 sm:mt-3 flex gap-1.5">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-sky-900 hover:bg-sky-950 text-white font-bold text-[11px] sm:text-xs py-2 sm:py-2.5 px-1 sm:px-2 rounded-lg sm:rounded-xl transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Thêm vào giỏ</span>
            </button>

            <Link
              href={detailUrl}
              className="p-2 sm:px-3 sm:py-2.5 bg-slate-100 hover:bg-sky-50 text-sky-900 border border-slate-200 font-bold text-xs rounded-lg sm:rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1 cursor-pointer"
              title="Xem chi tiết sản phẩm"
            >
              <Eye className="w-3.5 h-3.5 text-sky-800 shrink-0" />
              <span className="hidden sm:inline">Chi tiết</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
