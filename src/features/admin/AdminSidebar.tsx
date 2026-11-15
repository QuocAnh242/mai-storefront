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
  LayoutDashboard,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (pathname === '/admin/login') {
    return null;
  }

  const navItems = [
    { href: '/admin', label: 'Tổng Quan & Thống Kê', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Quản Lý Sản Phẩm', icon: Package },
    { href: '/admin/categories', label: 'Quản Lý Danh Mục', icon: Layers },
    { href: '/admin/revenue', label: 'Doanh Thu & Báo Cáo', icon: TrendingUp },
    { href: '/admin/orders', label: 'Quản Lý Đơn Hàng', icon: ShoppingBag },
    { href: '/admin/news', label: 'Bài Viết / Blog', icon: Newspaper },
    { href: '/admin/accounts', label: 'Quản Lý Tài Khoản', icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          'pending_toast',
          JSON.stringify({ message: 'Đăng xuất thành công', type: 'success' })
        );
        window.location.href = '/';
      }
    }
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full justify-between p-3.5 bg-slate-900 text-slate-100 transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Top Brand Section & Collapse Button */}
      <div className="space-y-4">
        <div className={`flex items-center border-b border-slate-800 pb-3.5 pt-1 ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {/* Brand info (only shown when expanded) */}
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                src="/logo2.jpeg"
                alt="Logo"
                className="w-9 h-9 rounded-full object-cover border-2 border-sky-500 shrink-0"
              />
              <div className="min-w-0">
                <span className="font-black text-xs text-white tracking-wider block uppercase truncate">
                  MAI KIM TUYẾN
                </span>
                <span className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider block">
                  Admin Panel
                </span>
              </div>
            </div>
          )}

          {/* Desktop Close/On Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={isCollapsed ? 'Mở rộng menu (Open)' : 'Thu gọn menu (Close)'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-sky-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>

        {/* Vertical Menu Navigation */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpenMobile(false)}
                title={isCollapsed ? item.label : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-sky-600/20 text-sky-400 font-bold border-l-4 border-sky-500'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="space-y-1.5 pt-3 border-t border-slate-800">
        <Link
          href="/"
          target="_blank"
          title={isCollapsed ? 'Xem Trang Chủ Shop' : undefined}
          className={`flex items-center gap-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors border border-slate-700/50 ${
            isCollapsed ? 'justify-center px-0' : 'justify-between'
          }`}
        >
          {!isCollapsed && <span>Xem Cửa Hàng</span>}
          <ExternalLink className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? 'Đăng Xuất' : undefined}
          className={`w-full flex items-center gap-2.5 text-xs font-semibold text-red-400 hover:text-red-200 hover:bg-red-950/40 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-4 h-4 text-red-400 shrink-0" />
          {!isCollapsed && <span>Đăng Xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Toggle Bar */}
      <div className="lg:hidden bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <img src="/logo2.jpeg" alt="Logo" className="w-7 h-7 rounded-full object-cover border border-sky-400" />
          <span className="font-bold text-xs tracking-wide">MAI KIM TUYẾN ADMIN</span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="p-1.5 text-slate-300 hover:text-white rounded-md bg-slate-800 cursor-pointer"
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

      {/* Desktop Vertical Left Sidebar (Collapsible) */}
      <aside className={`hidden lg:block shrink-0 border-r border-slate-800 sticky top-0 h-screen shadow-md transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>
    </>
  );
}

