'use client';

import React from 'react';
import { Phone, User } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

interface HeaderActionsProps {
  onOpenLoginModal: () => void;
  isMobile?: boolean;
}

export function HeaderActions({ onOpenLoginModal, isMobile = false }: HeaderActionsProps) {
  if (isMobile) {
    return (
      <button
        onClick={onOpenLoginModal}
        className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
        title="Đăng nhập quản lý Admin"
        aria-label="Đăng nhập Admin"
      >
        <User className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div className="shrink-0 flex items-center gap-3">
      {/* Hotline / Zalo Box */}
      <div className="flex items-center gap-2.5 border-r border-slate-200 pr-3">
        <div className="w-9 h-9 rounded-full bg-sky-900 flex items-center justify-center shrink-0">
          <Phone className="w-4 h-4 text-white" />
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
            Hotline / Zalo
          </span>
          <a
            href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
            className="text-sm font-black text-sky-950 hover:text-sky-700 transition-colors block leading-tight"
          >
            {INITIAL_STORE_SETTINGS.hotline}
          </a>
        </div>
      </div>

      {/* Admin Login Button */}
      <button
        onClick={onOpenLoginModal}
        className="p-2.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white transition-colors cursor-pointer flex items-center justify-center shadow-xs"
        title="Đăng nhập quản lý Admin Dashboard"
        aria-label="Đăng nhập quản lý Admin"
      >
        <User className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}
