'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, X, ArrowUp, MessageCircle } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function FloatingActionDock() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const isProductDetailPage = Boolean(pathname?.startsWith('/products/'));

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hotlines = INITIAL_STORE_SETTINGS.hotlines || [
    { number: '0704479791', display: '0704 479 791', label: 'Ms Mai' },
    { number: '0908998098', display: '0908 998 098', label: 'Mrs Quoc' },
    { number: '0798584841', display: '0798 584 841', label: 'Ms Linh' },
  ];

  return (
    <div
      className={`fixed right-4 sm:right-6 z-50 flex flex-col items-end gap-3 select-none ${
        isProductDetailPage ? 'bottom-[74px] sm:bottom-6' : 'bottom-5 sm:bottom-6'
      }`}
    >
      {showScrollTop && !isOpen && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full glass-surface text-sky-950 hover:bg-white active:scale-95 transition-all flex items-center justify-center cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-200"
          title="Cuộn lên đầu trang"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-sky-950" />
        </button>
      )}

      {isOpen && (
        <div className="w-72 glass-modal-panel rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-sky-950 text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo2.jpeg"
                alt="Mai Kim Tuyến"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border border-sky-400 shrink-0"
              />
              <div>
                <h4 className="font-extrabold text-xs">Mai Kim Tuyến</h4>
                <span className="text-[10px] text-sky-200 block">Tư vấn &amp; Báo giá sỉ lẻ 24/7</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sky-200 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
              title="Đóng"
              aria-label="Đóng hộp thoại tư vấn"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 space-y-2 bg-slate-50/75">
            <a
              href={`https://zalo.me/${INITIAL_STORE_SETTINGS.zaloPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-[#0068FF] flex items-center justify-center text-white font-black text-[10px] uppercase shrink-0">
                Zalo
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">
                  Chat Zalo Báo Giá
                </h5>
                <p className="text-[10px] text-slate-500">Phản hồi nhanh trong 5 phút</p>
              </div>
            </a>

            <a
              href="https://m.me/chuyencungcapkimtuyensivale"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-800 transition-all cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-full bg-sky-700 flex items-center justify-center text-white shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h5 className="font-bold text-xs text-slate-900 group-hover:text-sky-900">
                  Nhắn Tin Messenger
                </h5>
                <p className="text-[10px] text-slate-500">Fanpage chính thức</p>
              </div>
            </a>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 space-y-1.5">
              <div className="flex items-center gap-2 px-0.5">
                <div className="w-7 h-7 rounded-full bg-sky-950 flex items-center justify-center text-white shrink-0">
                  <Phone className="w-3.5 h-3.5 text-sky-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-900 leading-tight">Gọi Hotline Trực Tiếp</h5>
                  <p className="text-[10px] text-slate-500">Tư vấn báo giá &amp; đặt hàng</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-1 pt-1 border-t border-slate-100">
                {hotlines.map((h) => (
                  <a
                    key={h.number}
                    href={`tel:${h.number}`}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 border border-slate-200/70 hover:border-sky-300 transition-all cursor-pointer group/item"
                  >
                    <span className="text-xs font-bold text-sky-950 group-hover/item:text-sky-700 flex items-center gap-2">
                      <Phone className="w-3 h-3 text-sky-600 shrink-0" />
                      {h.display}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium group-hover/item:text-sky-700">
                      {h.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border-2 border-sky-600 glass-surface shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center overflow-hidden p-0.5"
        title="Tư vấn & Báo giá nhanh"
        aria-label="Mở menu tư vấn Zalo và Hotline"
      >
        {isOpen ? (
          <div className="w-full h-full bg-sky-950 text-white flex items-center justify-center rounded-full">
            <X className="w-5 h-5 text-white" />
          </div>
        ) : (
          <Image
            src="/logo2.jpeg"
            alt="Mai Kim Tuyến Chat"
            width={52}
            height={52}
            className="w-full h-full object-cover rounded-full"
          />
        )}
      </button>
    </div>
  );
}
