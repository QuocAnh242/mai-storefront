'use client';

import React, { useState } from 'react';
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
    <div className="bg-sky-950 text-white text-[12px] sm:text-[13px] font-medium py-2 px-3 sm:px-4 select-none relative z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 sm:gap-4">
        
        {/* Left: Address & Hours (min-w-0 flex-1 truncate ensures it never pushes phone off screen) */}
        <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-5 text-white">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">{INITIAL_STORE_SETTINGS.address}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 border-l border-sky-900 pl-4 text-white shrink-0">
            <Clock className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{INITIAL_STORE_SETTINGS.workingHours}</span>
          </span>
        </div>

        {/* Right: 3 Hotlines on Desktop / Dropdown on Mobile */}
        <div className="relative shrink-0 flex items-center gap-2 sm:gap-3 text-white">
          {/* Desktop & Tablet: Display all 3 numbers in pure white */}
          <div className="hidden sm:flex items-center gap-2 text-white">
            <Phone className="w-3.5 h-3.5 text-white shrink-0" />
            <div className="flex items-center gap-2 font-bold text-white">
              {hotlines.map((h, idx) => (
                <React.Fragment key={h.number}>
                  <a
                    href={`tel:${h.number}`}
                    className="text-white hover:text-sky-200 transition-colors inline-block"
                    title={`${h.display} - ${h.label}`}
                  >
                    {h.display}
                  </a>
                  {idx < hotlines.length - 1 && (
                    <span className="text-white/60 font-normal select-none">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Mobile: Compact with tap to show all 3 numbers */}
          <div className="sm:hidden relative text-white">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-1 font-bold text-white hover:text-sky-200 transition-colors cursor-pointer py-1 px-1.5 rounded-lg active:bg-sky-900"
            >
              <Phone className="w-3.5 h-3.5 text-white shrink-0" />
              <span className="text-white whitespace-nowrap">{hotlines[0].display}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-[100]"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-sky-950/98 backdrop-blur-md rounded-2xl p-2.5 shadow-2xl border border-sky-800 z-[110] text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] text-sky-300/80 uppercase font-bold px-2 py-1.5 border-b border-sky-800/80 flex items-center justify-between">
                    <span>Hotline liên hệ</span>
                    <span className="text-[9px] text-sky-400 font-normal">Chạm để gọi</span>
                  </div>
                  <div className="py-1.5 space-y-1">
                    {hotlines.map((h) => (
                      <a
                        key={h.number}
                        href={`tel:${h.number}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-sky-900 active:bg-sky-800 text-white font-medium transition-colors"
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
