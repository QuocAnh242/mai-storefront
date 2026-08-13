'use client';

import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function FloatingChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (hasUnread) {
      setHasUnread(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end select-none">
      {/* Expanded Popup Menu */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-sky-950 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 shrink-0">
                <div className="w-full h-full rounded-full bg-sky-600 border border-sky-400 overflow-hidden">
                  <img src="/logo.jpg" alt="Mai Kim Tuyến Logo" className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-sky-950 rounded-full z-10" />
              </div>
              <div>
                <h4 className="font-bold text-xs">Tư Vấn Mai Kim Tuyến</h4>
                <span className="text-[10px] text-sky-200 block">Sẵn sàng hỗ trợ 24/7</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sky-300 hover:text-white transition-colors cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Options List */}
          <div className="p-3 space-y-2 bg-slate-50/50">
            {/* 1. Messenger */}
            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.518 3.715 7.218V22l3.39-1.861c.92.256 1.897.394 2.895.394 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.066 12.449l-2.548-2.721-4.97 2.721 5.466-5.801 2.607 2.72 4.911-2.72-5.466 5.801z" />
                </svg>
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">Chat Messenger</h5>
                <p className="text-[10px] text-slate-500">Mở nhắn tin Fanpage ngay</p>
              </div>
            </a>

            {/* 2. Zalo */}
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-[#0068FF] flex items-center justify-center text-white font-black text-[10px] uppercase shrink-0 group-hover:scale-105 transition-transform">
                Zalo
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">Chat Zalo Báo Giá</h5>
                <p className="text-[10px] text-slate-500">Tư vấn báo giá sỉ & lẻ nhanh</p>
              </div>
            </a>

            {/* 3. Hotline */}
            <a
              href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 text-slate-800 transition-all cursor-pointer group shadow-2xs"
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">Gọi Hotline Trực Tiếp</h5>
                <p className="text-[10px] font-bold text-emerald-700">{INITIAL_STORE_SETTINGS.hotline}</p>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Main Single Floating Chat Bubble with Notification Badge "1" */}
      <button
        onClick={toggleWidget}
        className="relative w-14 h-14 bg-sky-600 hover:bg-sky-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-white"
        title="Tư vấn & Hỗ trợ khách hàng"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}

        {/* Notification Badge "1" */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-bounce">
            1
          </span>
        )}
      </button>
    </div>
  );
}
