'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Layers,
  ShoppingBag,
  Newspaper,
  TrendingUp,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { href: '/admin/san-pham', label: 'Quản Lý Sản Phẩm', icon: Package },
    { href: '/admin/danh-muc', label: 'Quản Lý Danh Mục', icon: Layers },
    { href: '/admin/doanh-thu', label: 'Doanh Thu & Báo Cáo', icon: TrendingUp },
    { href: '/admin/don-hang', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag },
    { href: '/admin/tin-tuc', label: 'Bài Viết / Blog', icon: Newspaper },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 bg-sky-950 text-white">
      {/* Top Brand Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2 pt-2 border-b border-sky-900 pb-4">
          <img
            src="/logo.jpg"
            alt="Admin Logo"
            className="w-10 h-10 rounded-full object-cover border-2 border-sky-400 shrink-0"
          />
          <div>
            <span className="font-black text-sm text-white tracking-wider block uppercase leading-snug">
              MAI KIM TUYẾN
            </span>
            <span className="text-[10px] text-sky-400 font-bold uppercase tracking-widest block">
              Admin Dashboard
            </span>
          </div>
        </div>

        {/* Vertical Menu Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-sky-800 text-white shadow-md border-l-4 border-amber-400'
                    : 'text-slate-300 hover:bg-sky-900/70 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-sky-300'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-2 pt-4 border-t border-sky-900">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between gap-2 text-xs font-bold text-sky-200 hover:text-white bg-sky-900/60 hover:bg-sky-900 px-4 py-2.5 rounded-xl border border-sky-800 transition-colors"
        >
          <span>Xem Trang Chủ Shop</span>
          <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
        </Link>

        <button
          onClick={async () => {
            try {
              await supabase.auth.signOut();
              await fetch('/api/auth/logout', { method: 'POST' });
            } finally {
              window.location.href = '/admin/login';
            }
          }}
          className="w-full flex items-center gap-2 text-xs font-bold text-red-300 hover:text-red-100 hover:bg-red-900/40 px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Toggle Bar */}
      <div className="lg:hidden bg-sky-950 text-white p-3 flex items-center justify-between border-b border-sky-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover border border-sky-400" />
          <span className="font-bold text-sm">ADMIN MAI KIM TUYẾN</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-2 text-sky-200 hover:text-white rounded-lg bg-sky-900/80 cursor-pointer"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/70" onClick={() => setIsOpenMobile(false)} />
          <div className="relative w-64 h-full z-10 shadow-2xl animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Vertical Left Sidebar (Fixed / Sticky) */}
      <aside className="hidden lg:block w-64 min-h-screen shrink-0 border-r border-sky-900 sticky top-0 h-screen shadow-lg">
        {sidebarContent}
      </aside>
    </>
  );
}
