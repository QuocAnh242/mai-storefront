'use client';

import React, { useState } from 'react';
import { HeaderLogo } from './HeaderLogo';
import { HeaderSearch } from './HeaderSearch';
import { HeaderActions } from './HeaderActions';
import { AdminLoginModal } from '@/features/admin/AdminLoginModal';

export function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        {/* Mobile View */}
        <div className="md:hidden">
          <div className="relative flex items-center justify-between py-1">
            <HeaderLogo isMobile />
            <HeaderActions onOpenLoginModal={() => setIsLoginModalOpen(true)} isMobile />
          </div>
          <div className="mt-2">
            <HeaderSearch isMobile />
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <HeaderLogo />
          <div className="flex-1 max-w-lg">
            <HeaderSearch />
          </div>
          <HeaderActions onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        </div>
      </div>

      {isLoginModalOpen && (
        <AdminLoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
    </header>
  );
}
