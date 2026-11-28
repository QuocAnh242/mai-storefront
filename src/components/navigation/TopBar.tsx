'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Phone, ChevronDown } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function TopBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const hotlines = INITIAL_STORE_SETTINGS.hotlines || [
    { number: '0704479791', display: '0704 479 791', label: 'Ms Mai' },
    { number: '0908998098', display: '0908 998 098', label: 'Mrs Quoc' },
    { number: '0798584841', display: '0798 584 841', label: 'Ms Linh' },
  ];

  return (
    <div className="bg-sky-950 text-white text-[12px] sm:text-[13px] font-medium py-2 px-3 sm:px-4 select-none relative z-50 border-b border-sky-900/70">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">
        <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-5 text-sky-50">
          <Link
            href="/contact"
            className="flex items-center gap-1.5 truncate text-sky-50 hover:text-sky-200 transition-colors"
            title="Xem địa chỉ & bản đồ cửa hàng"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">{INITIAL_STORE_SETTINGS.address}</span>
          </Link>
          <span className="hidden md:flex items-center gap-1.5 border-l border-sky-800/80 pl-4 text-sky-100/90 shrink-0">
            <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{INITIAL_STORE_SETTINGS.workingHours}</span>
          </span>
        </div>

        <div className="relative shrink-0 flex items-center gap-2 sm:gap-3 text-white">
          <div className="hidden sm:flex items-center gap-2 text-white">
            <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <div className="flex items-center gap-1.5 font-semibold tracking-tight tabular-nums text-white">
              {hotlines.map((h, idx) => (
                <React.Fragment key={h.number}>
                  <a
                    href={`tel:${h.number}`}
                    className="text-white/95 hover:text-sky-200 hover:bg-white/10 px-1.5 py-0.5 rounded-md transition-colors inline-block"
                    title={`${h.display} - ${h.label}`}
                  >
                    {h.display}
                  </a>
                  {idx < hotlines.length - 1 && (
                    <span className="text-sky-400/50 font-normal select-none">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="sm:hidden relative text-white">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1 font-semibold tabular-nums text-white hover:text-sky-200 hover:bg-white/10 transition-colors cursor-pointer py-1 px-2 rounded-lg active:bg-sky-900"
              aria-expanded={isMenuOpen}
            >
              <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span className="text-white whitespace-nowrap">{hotlines[0].display}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-sky-300 transition-transform duration-200 ${
                  isMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 glass-nav rounded-xl p-2.5 shadow-2xl border border-white/15 z-[110] text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] text-sky-300 uppercase font-bold px-2 py-1.5 border-b border-white/10 flex items-center justify-between">
                    <span>Hotline liên hệ</span>
                    <span className="text-[9px] text-sky-400 font-normal">Chạm để gọi</span>
                  </div>
                  <div className="py-1.5 space-y-1">
                    {hotlines.map((h) => (
                      <a
                        key={h.number}
                        href={`tel:${h.number}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/10 active:bg-white/15 text-white font-medium transition-colors tabular-nums"
                      >
                        <span className="text-white font-bold">{h.display}</span>
                        <span className="text-[11px] text-sky-300 font-semibold">{h.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
