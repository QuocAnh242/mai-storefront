'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/shared/types';
import { getProductUrl } from '@/lib/productUrl';
import { formatVND, getSafeImageUrl, isContactProduct } from '@/lib/format';
import { Badge, Button } from '@/components/ui';

interface ProductMobileCardsProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

export function ProductMobileCards({
  products,
  onEdit,
  onToggleStock,
  onToggleFeatured,
  onRequestDelete,
}: ProductMobileCardsProps) {
  return (
    <div className="block sm:hidden space-y-3">
      {products.map((product) => {
        const isContact = isContactProduct(product);
        return (
          <div
            key={product.id}
            className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
          >
            <div className="flex items-start gap-3">
              <Image
                src={getSafeImageUrl(product.images?.[0])}
                alt={product.title}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
              />
              <div className="min-w-0 flex-1">
                <Link
                  href={getProductUrl(product)}
                  target="_blank"
                  className="font-bold text-slate-900 text-xs hover:text-sky-700 block line-clamp-2"
                >
                  {product.title}
                </Link>
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  <Badge size="sm">{product.categoryName}</Badge>
                  {product.isFeatured && (
                    <Badge variant="amber" size="sm">
                      Nổi bật
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Giá bán / {product.unit}</span>
                <span className="font-extrabold text-sky-900">
                  {isContact ? 'Liên hệ' : formatVND(product.price)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleStock(product)}
                  className={`font-semibold px-2.5 py-1 rounded text-[10px] cursor-pointer ${
                    product.inStock
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                </button>
                <button
                  type="button"
                  onClick={() => onToggleFeatured(product)}
                  className={`px-2 py-1 rounded text-[10px] font-semibold border cursor-pointer ${
                    product.isFeatured
                      ? 'bg-amber-100 border-amber-300 text-amber-900'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {product.isFeatured ? 'Đang nổi bật' : '+ Nổi bật'}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <Button type="button" variant="secondary" size="xs" className="flex-1" onClick={() => onEdit(product)}>
                Chỉnh sửa
              </Button>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="text-rose-600 border-rose-200 hover:bg-rose-50"
                onClick={() => onRequestDelete(product)}
              >
                Xóa
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
