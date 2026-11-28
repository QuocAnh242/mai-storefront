'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { formatVND, isContactProduct } from '@/lib/format';

interface ProductMobileStickyBarProps {
  price: number;
  isContactPrice?: boolean;
  zaloMessage: string;
}

export function ProductMobileStickyBar({
  price,
  isContactPrice,
  zaloMessage,
}: ProductMobileStickyBarProps) {
  const isContact = isContactProduct({ price, isContactPrice });

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 glass-nav-light px-4 py-2.5 shadow-lg flex items-center justify-between gap-3">
      <div className="truncate">
        <span className="text-[10px] text-slate-500 block font-semibold leading-tight">
          {isContact ? 'Bảng giá sỉ & lẻ:' : 'Giá niêm yết:'}
        </span>
        <span className="text-base font-black text-slate-900 leading-tight">
          {isContact ? 'Liên hệ báo giá' : formatVND(price)}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
          className="w-11 h-11 rounded-lg bg-slate-100 active:bg-slate-200 text-slate-900 flex items-center justify-center border border-slate-200"
          title="Gọi Hotline"
          aria-label="Gọi hotline"
        >
          <Phone className="w-4 h-4 text-slate-900" />
        </a>
        <a
          href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}?text=${zaloMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="h-11 px-4 rounded-lg bg-[#0068FF] active:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
        >
          <span className="font-black text-[10px] uppercase">Zalo</span>
          <span>Báo Giá Sỉ</span>
        </a>
      </div>
    </div>
  );
}
