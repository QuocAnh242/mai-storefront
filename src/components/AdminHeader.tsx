'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Package, Layers, ShoppingBag, Newspaper, ExternalLink, LogOut } from 'lucide-react';

export function AdminHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/san-pham', label: 'Quản Lý Sản Phẩm', icon: Package },
    { href: '/admin/danh-muc', label: 'Quản Lý Danh Mục', icon: Layers },
    { href: '/admin/don-hang', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag },
    { href: '/admin/tin-tuc', label: 'Bài Viết / Blog', icon: Newspaper },
  ];

  return (
    <header className="bg-sky-950 text-white border-b border-sky-900 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-800 flex items-center justify-center text-white">
            <Sparkles className="w-5 h-5 text-sky-300" />
          </div>
          <div>
            <span className="font-black text-base text-white tracking-tight">Admin Mai Store</span>
            <p className="text-[11px] text-sky-300 font-semibold">Hệ thống quản lý xưởng & đơn hàng</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-colors shrink-0 ${
                  isActive ? 'bg-sky-600 text-white' : 'text-slate-200 hover:bg-sky-900/60 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Storefront Link & Logout */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-sky-200 hover:text-white font-semibold bg-sky-900/60 hover:bg-sky-900 px-3.5 py-1.5 rounded-full border border-sky-800 transition-colors"
          >
            <span>Trang chủ shop</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/login"
            className="p-2 text-slate-300 hover:text-red-400 rounded-full hover:bg-sky-900 transition-colors"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
