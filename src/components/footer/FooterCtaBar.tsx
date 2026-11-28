'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function FooterCtaBar() {
  return (
    <div className="border-b border-sky-900/60 bg-sky-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Cần tư vấn &amp; báo giá sỉ lẻ?
          </h3>
          <p className="text-sky-300/75 text-xs mt-0.5">
            Liên hệ trực tiếp — phản hồi nhanh trong 5 phút
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-center">
          <a
            href="tel:0704479791"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-sky-950 font-extrabold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-sky-950" />
            <span>0704 479 791</span>
          </a>

          <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="font-black text-xs uppercase tracking-wider">Zalo</span>
            </a>
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full glass-surface-dark font-bold text-xs transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Messenger</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
