'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Phone, ShoppingBag, User } from 'lucide-react';
import { useStore } from '@/shared/context/StoreContext';
import { useCart } from '@/shared/context/CartContext';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';
import { AdminLoginModal } from './AdminLoginModal';
import { CartDrawer } from '@/features/cart/CartDrawer';

export function Header() {
  const { searchQuery, setSearchQuery, setSelectedCategory } = useStore();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setSelectedCategory(null)}
          className="shrink-0 flex items-center gap-3"
        >
          <img
            src="/logo.jpg"
            alt="Mai Kim Tuyến Shop"
            className="h-12 w-12 rounded-full object-cover border-2 border-sky-100"
          />
          <div className="hidden sm:block">
            <span className="text-lg font-black tracking-tight text-sky-950 block leading-none">
              MAI KIM TUYẾN
            </span>
            <span className="text-[10px] text-slate-400 tracking-wide block mt-0.5">
              Sỉ & lẻ kim tuyến · bột màu · băng keo · keo dán
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-lg hidden md:block">
          <div className="flex">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border border-slate-200 border-r-0 text-sm text-slate-800 rounded-l-lg px-4 py-2.5 outline-none focus:border-sky-600 transition-colors placeholder:text-slate-400"
            />
            <button
              onClick={() => {
                const el = document.getElementById('danh-sach-san-pham');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-sky-900 hover:bg-sky-800 text-white px-4 rounded-r-lg transition-colors cursor-pointer flex items-center"
            >
              <Search className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Right Section: Hotline + Cart Icon + Admin Login Button */}
        <div className="shrink-0 flex items-center gap-3">
          {/* Hotline */}
          <div className="hidden lg:flex items-center gap-2.5 border-r border-slate-200 pr-3">
            <div className="w-9 h-9 rounded-full bg-sky-900 flex items-center justify-center shrink-0">
              <Phone className="w-4.5 h-4.5 text-white" />
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

          {/* Shopping Cart Icon Button (Opens Cart Drawer) */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200/80 transition-colors relative cursor-pointer flex items-center justify-center"
            title="Xem giỏ hàng mua hàng"
          >
            <ShoppingBag className="w-5 h-5 text-sky-950" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Login Button (Opens Modal Popup) */}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="p-2.5 rounded-xl bg-sky-900 hover:bg-sky-950 text-white transition-colors cursor-pointer flex items-center justify-center shadow-2xs"
            title="Đăng nhập quản lý Admin Dashboard"
          >
            <User className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Admin Login Modal Popup */}
      {isLoginModalOpen && (
        <AdminLoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}

      {/* Cart Drawer Panel */}
      <CartDrawer />
    </header>
  );
}
