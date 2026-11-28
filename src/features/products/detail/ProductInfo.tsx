'use client';

import React from 'react';
import { Star, Phone, MessageCircle } from 'lucide-react';
import { Product } from '@/shared/types';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { formatVND, isContactProduct } from '@/lib/format';
import { Badge, buttonVariants } from '@/components/ui';
import { cn } from '@/lib/cn';

interface ProductInfoProps {
  product: Product;
  onScrollToReviews: () => void;
}

export function ProductInfo({ product, onScrollToReviews }: ProductInfoProps) {
  const isContact = isContactProduct(product);
  const specEntries = Object.entries(product.specs || {}).filter(
    ([k, v]) => k.trim() && String(v || '').trim(),
  );

  const zaloMessage = encodeURIComponent(
    `Xin chào shop Mai Kim Tuyến, tôi muốn nhận báo giá sỉ cho sản phẩm: ${product.title} (${product.unit})`,
  );

  return (
    <div className="flex flex-col justify-between space-y-5">
      <div className="space-y-4">
        <div>
          <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest block">
            {product.categoryName}
            {product.subcategoryName ? ` · ${product.subcategoryName}` : ''}
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug tracking-tight mt-1">
            {product.title}
          </h1>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs flex-wrap">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            {product.inStock ? (
              <Badge variant="emerald" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                Sẵn kho TP.HCM
              </Badge>
            ) : (
              <Badge variant="amber" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
                Liên hệ kiểm kho
              </Badge>
            )}
            <span>·</span>
            <span className="text-slate-500 text-[11px]">Quy cách: {product.unit}</span>
          </div>

          <button
            type="button"
            onClick={onScrollToReviews}
            className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            title="Bấm để cuộn xuống xem đánh giá sản phẩm"
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
            <span>Đánh giá sản phẩm</span>
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          {isContact ? (
            <span className="text-2xl sm:text-3xl font-black text-sky-900 tracking-tight">
              Liên hệ báo giá sỉ
            </span>
          ) : (
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatVND(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-sm sm:text-base font-semibold text-slate-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                  <Badge variant="amber" size="sm">
                    Tiết kiệm {formatVND(product.originalPrice - product.price)}
                  </Badge>
                </>
              )}
            </div>
          )}
        </div>

        {specEntries.length > 0 && (
          <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
            <div className="bg-slate-50 px-3.5 py-2 font-bold text-slate-800 uppercase tracking-wider border-b border-slate-200">
              Thông số &amp; Quy cách
            </div>
            <dl className="divide-y divide-slate-100">
              {specEntries.map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-2 px-3.5 py-2">
                  <dt className="text-slate-500 font-medium">{key}</dt>
                  <dd className="col-span-2 text-slate-900 font-semibold">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {product.description && (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
            {product.description}
          </div>
        )}
      </div>

      <div className="pt-2 space-y-3">
        <a
          href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${zaloMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: 'zalo', size: 'lg' }), 'w-full')}
        >
          <span>Nhận báo giá qua Zalo</span>
        </a>

        <div className="grid grid-cols-2 gap-3">
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'w-full text-xs')}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gọi {INITIAL_STORE_SETTINGS.hotline}</span>
          </a>

          <a
            href="https://m.me/chuyencungcapkimtuyensivale"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: 'outline', size: 'md' }), 'w-full text-xs')}
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-700" />
            <span>Nhắn Messenger</span>
          </a>
        </div>

        <div className="flex items-center gap-5 text-xs text-slate-500 pt-0.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Hỗ trợ gửi chành xe toàn quốc
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Đổi trả trong 7 ngày nếu sai quy cách
          </span>
        </div>
      </div>
    </div>
  );
}
