import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/shared/types';
import { getProductUrl } from '@/lib/productUrl';
import {
  formatVND,
  getDiscountPercent,
  getSafeImageUrl,
  isContactProduct,
} from '@/lib/format';
import { Badge } from '@/components/ui';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isContact = isContactProduct(product);
  const discountPercent = getDiscountPercent(
    product.price,
    product.originalPrice,
    product.isContactPrice,
  );
  const detailUrl = getProductUrl(product);
  const imageSrc = getSafeImageUrl(product.images?.[0]);

  return (
    <Link href={detailUrl} className="group flex flex-col cursor-pointer select-none">
      <div className="relative aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs group-hover:shadow-md group-hover:border-slate-300 transition-all duration-200">
        <Image
          src={imageSrc}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {discountPercent > 0 && (
          <Badge variant="rose" size="sm" className="absolute top-2 left-2 shadow-xs">
            -{discountPercent}%
          </Badge>
        )}

        {!product.inStock && (
          <Badge variant="amber" size="sm" className="absolute top-2 right-2 shadow-xs">
            Liên hệ kho
          </Badge>
        )}
      </div>

      <div className="pt-2 sm:pt-2.5 px-0.5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-500 font-semibold uppercase tracking-wider truncate">
            <span className="truncate">{product.categoryName}</span>
            {product.unit && (
              <span className="shrink-0 lowercase text-[10px] sm:text-[11px] text-slate-400">
                · {product.unit}
              </span>
            )}
          </div>

          <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug line-clamp-2 mt-1 min-h-[2.25rem] group-hover:text-sky-900 transition-colors">
            {product.title}
          </h3>
        </div>

        <div className="pt-1.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {isContact ? (
              <span className="text-xs sm:text-sm font-bold text-sky-800">Liên hệ báo giá</span>
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

          <div className="mt-2 w-full py-1.5 sm:py-2 px-2 rounded-lg border border-slate-300 group-hover:border-sky-950 group-hover:bg-sky-950 group-hover:text-white text-slate-800 font-bold text-[11px] sm:text-xs transition-colors text-center">
            Xem chi tiết &amp; Báo giá
          </div>
        </div>
      </div>
    </Link>
  );
}
