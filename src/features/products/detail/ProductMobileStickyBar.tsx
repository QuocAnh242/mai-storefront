'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

interface ProductMobileStickyBarProps {
  price: number;
  zaloMessage: string;
}

export function ProductMobileStickyBar({ price, zaloMessage }: ProductMobileStickyBarProps) {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
      <div className="truncate">
        <span className="text-[10px] text-slate-400 block font-semibold leading-tight">
          Giá niêm yết:
        </span>
        <span className="text-base font-black text-slate-900 leading-tight">
          {formatVND(price)}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
          className="w-10 h-10 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-900 flex items-center justify-center border border-slate-200"
          title="Gọi Hotline"
          aria-label="Gọi hotline"
        >
          <Phone className="w-4 h-4 text-slate-900" />
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
  );
}
