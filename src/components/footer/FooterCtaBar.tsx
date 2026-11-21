'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function FooterCtaBar() {
  return (
    <div className="border-b border-sky-900/60 bg-sky-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Cần tư vấn &amp; báo giá sỉ lẻ?
          </h3>
          <p className="text-sky-300/70 text-xs mt-0.5">
            Liên hệ trực tiếp — phản hồi nhanh trong 5 phút
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto justify-center">
          {/* Hotline button */}
          <a
            href="tel:0704479791"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-slate-100 text-sky-950 font-extrabold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-sky-950" />
            <span>0704 479 791</span>
          </a>

          {/* Zalo & Messenger */}
          <div className="grid grid-cols-2 gap-2.5 w-full sm:w-auto">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/25 active:scale-95 cursor-pointer"
            >
              <span className="font-black text-xs uppercase tracking-wider">Zalo</span>
            </a>
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.715 7.218V22l3.39-1.861c.92.256 1.897.394 2.895.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.449l-2.548-2.721-4.97 2.721 5.466-5.801 2.607 2.72 4.911-2.72-5.466 5.801z" />
              </svg>
              <span>Messenger</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
