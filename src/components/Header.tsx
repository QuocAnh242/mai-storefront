'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Phone, User } from 'lucide-react';
import { useStore } from '@/shared/context/StoreContext';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { AdminLoginModal } from './AdminLoginModal';

export function Header() {
  const { searchQuery, setSearchQuery, setSelectedCategory } = useStore();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const el = document.getElementById('danh-sach-san-pham');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">

        {/* ─── MOBILE VIEW: Centered Logo & Search ─── */}
        <div className="md:hidden">
          <div className="relative flex items-center justify-center py-1">
            {/* Center: Logo */}
            <Link
              href="/"
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2.5 group"
            >
              <img
                src="/logo.jpg"
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

            {/* Right: Admin Icon Button */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="absolute right-0 w-8 h-8 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors shrink-0"
              title="Đăng nhập quản lý Admin"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-2">
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, bột màu, kim tuyến..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 border-r-0 text-xs text-slate-800 rounded-l-xl px-3.5 py-2 outline-none focus:border-sky-600 focus:bg-white transition-colors placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-sky-900 active:bg-sky-950 text-white px-3.5 rounded-r-xl transition-colors flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* ─── DESKTOP VIEW: Clean horizontal layout ─── */}
        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Logo & Slogan */}
          <Link
            href="/"
            onClick={() => setSelectedCategory(null)}
            className="shrink-0 flex items-center gap-3.5 group"
          >
            <img
              src="/logo.jpg"
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

          {/* Desktop Search */}
          <div className="flex-1 max-w-lg">
            <form onSubmit={handleSearchSubmit} className="flex">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm, vật tư, bột màu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-slate-200 border-r-0 text-sm text-slate-800 rounded-l-xl px-4 py-2.5 outline-none focus:border-sky-600 transition-colors placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-sky-900 hover:bg-sky-800 text-white px-5 rounded-r-xl transition-colors cursor-pointer flex items-center justify-center"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Section: Hotline & Admin Login */}
          <div className="shrink-0 flex items-center gap-3">
            {/* Hotline */}
            <div className="flex items-center gap-2.5 border-r border-slate-200 pr-3">
              <div className="w-9 h-9 rounded-full bg-sky-900 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Hotline / Zalo</span>
                <a
                  href={`tel:${INITIAL_STORE_SETTINGS.zaloPhone}`}
                  className="text-sm font-black text-sky-950 hover:text-sky-700 transition-colors block leading-tight"
                >
                  {INITIAL_STORE_SETTINGS.hotline}
                </a>
              </div>
            </div>

            {/* Admin Login */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="p-2.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white transition-colors cursor-pointer flex items-center justify-center shadow-xs"
              title="Đăng nhập quản lý Admin Dashboard"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

      </div>

      {/* Admin Login Modal */}
      {isLoginModalOpen && (
        <AdminLoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </header>
  );
}
