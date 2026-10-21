'use client';

import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function TopBar() {
  return (
    <div className="bg-sky-950 text-white text-[12px] sm:text-[13px] font-medium py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        
        {/* Left: Address & Hours */}
        <div className="flex items-center gap-5 text-white truncate">
          <span className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="truncate">{INITIAL_STORE_SETTINGS.address}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 border-l border-sky-900 pl-5 text-white shrink-0">
            <Clock className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{INITIAL_STORE_SETTINGS.workingHours}</span>
          </span>
        </div>

        {/* Right: Mobile Hours & Hotline */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="md:hidden flex items-center gap-1 text-[11px] text-white shrink-0">
            <Clock className="w-3 h-3 text-white shrink-0" />
            <span>T2 - T7: 8:00 - 18:00</span>
          </span>
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="flex items-center gap-1.5 font-bold text-white hover:text-sky-200 transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{INITIAL_STORE_SETTINGS.hotline}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
