'use client';

import React, { useState } from 'react';
import { Category } from '@/shared/types';
import { HeaderLogo } from './HeaderLogo';
import { HeaderSearch } from './HeaderSearch';
import { HeaderActions } from './HeaderActions';
import { AdminLoginModal } from '@/features/admin/AdminLoginModal';

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="relative z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        {/* Mobile Header: Centered Logo + Right Admin Trigger */}
        <div className="md:hidden">
          <div className="grid grid-cols-[40px_1fr_40px] items-center py-1">
            <div />
            <div className="justify-self-center">
              <HeaderLogo isMobile />
            </div>
            <div className="justify-self-end">
              <HeaderActions onOpenLoginModal={() => setIsLoginModalOpen(true)} isMobile />
            </div>
          </div>
          <div className="mt-2">
            <HeaderSearch isMobile categories={categories} />
          </div>
        </div>

        {/* Desktop Header: Normal Layout (Logo Left | Search Center | Hotline & Admin Right) */}
        <div className="hidden md:flex items-center justify-between gap-6">
          <HeaderLogo />
          <div className="flex-1 max-w-xl">
            <HeaderSearch categories={categories} />
          </div>
          <HeaderActions onOpenLoginModal={() => setIsLoginModalOpen(true)} />
        </div>
      </div>

      {isLoginModalOpen && (
        <AdminLoginModal open={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      )}
    </header>
  );
}
