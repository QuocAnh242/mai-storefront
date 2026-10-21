'use client';

import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col items-end select-none">
      
      {/* ─── Expanded Quick Consultation Menu ─── */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-sky-950 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.jpg"
                alt="Mai Kim Tuyến"
                className="w-8 h-8 rounded-full object-cover border border-sky-400 shrink-0"
              />
              <div>
                <h4 className="font-extrabold text-xs">Mai Kim Tuyến</h4>
                <span className="text-[10px] text-sky-200 block">
                  Tư vấn &amp; Báo giá sỉ lẻ 24/7
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sky-300 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Contact Channels */}
          <div className="p-3 space-y-2 bg-slate-50/60">
            {/* 1. Zalo */}
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 text-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-[#0068FF] flex items-center justify-center text-white font-black text-[10px] uppercase shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                Zalo
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">Chat Zalo Báo Giá</h5>
                <p className="text-[10px] text-slate-500">Phản hồi nhanh trong 5 phút</p>
              </div>
            </a>

            {/* 2. Messenger */}
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 text-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.715 7.218V22l3.39-1.861c.92.256 1.897.394 2.895.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.449l-2.548-2.721-4.97 2.721 5.466-5.801 2.607 2.72 4.911-2.72-5.466 5.801z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">Nhắn Tin Messenger</h5>
                <p className="text-[10px] text-slate-500">Fanpage chính thức</p>
              </div>
            </a>

            {/* 3. Hotline */}
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-300 text-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-sky-950 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                <Phone className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">Gọi Hotline Trực Tiếp</h5>
                <p className="text-[10px] font-bold text-sky-900">{INITIAL_STORE_SETTINGS.hotline}</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* ─── Single Clean Circular Floating Logo Button ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-sky-600 bg-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center overflow-hidden p-0.5"
        title="Tư vấn & Báo giá nhanh"
      >
        {isOpen ? (
          <div className="w-full h-full bg-sky-950 text-white flex items-center justify-center rounded-full">
            <X className="w-5 h-5 text-white" />
          </div>
        ) : (
          <img
            src="/logo.jpg"
            alt="Mai Kim Tuyến Chat"
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </button>

    </div>
  );
}
