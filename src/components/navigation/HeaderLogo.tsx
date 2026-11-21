'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderLogoProps {
  isMobile?: boolean;
}

export function HeaderLogo({ isMobile = false }: HeaderLogoProps) {
  if (isMobile) {
    return (
      <Link href="/" className="flex items-center gap-2.5 group">
        <img
          src="/logo2.jpeg"
          alt="Mai Kim Tuyến Shop"
          className="h-11 w-11 rounded-full object-cover border-2 border-sky-100 shadow-xs"
        />
        <div className="text-left">
          <span className="text-sm font-black tracking-tight text-sky-950 block leading-none">
            MAI KIM TUYẾN
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide block mt-0.5">
            Vật tư sỉ &amp; lẻ uy tín
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className="shrink-0 flex items-center gap-3.5 group">
      <img
        src="/logo2.jpeg"
        alt="Mai Kim Tuyến Shop"
        className="h-12 w-12 rounded-full object-cover border-2 border-sky-100 shadow-xs"
      />
      <div>
        <span className="text-lg font-black tracking-tight text-sky-950 block leading-none">
          MAI KIM TUYẾN
        </span>
        <span className="text-[11px] text-slate-400 tracking-wide block mt-1">
          Sỉ &amp; lẻ kim tuyến · bột màu · băng keo · keo dán
        </span>
      </div>
    </Link>
  );
}
