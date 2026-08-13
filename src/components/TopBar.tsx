'use client';

import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export function TopBar() {
  return (
    <div className="bg-sky-950 text-white text-[12px] sm:text-[13px] font-medium py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-5 text-white">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{INITIAL_STORE_SETTINGS.address}</span>
          </span>
          <span className="hidden md:flex items-center gap-1.5 border-l border-sky-900 pl-5">
            <Clock className="w-3.5 h-3.5 text-white shrink-0" />
            <span>{INITIAL_STORE_SETTINGS.workingHours}</span>
          </span>
        </div>
        <a
          href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
          className="flex items-center gap-1.5 font-bold text-white hover:text-sky-200 transition-colors shrink-0"
        >
          <Phone className="w-3.5 h-3.5 text-white shrink-0" />
          <span>{INITIAL_STORE_SETTINGS.hotline}</span>
        </a>
      </div>
    </div>
  );
}
