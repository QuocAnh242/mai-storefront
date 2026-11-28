'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/shared/types';
import { MegaCategoryMenu } from './MegaCategoryMenu';
import { CategoryTabs } from './CategoryTabs';

interface NavigationBarProps {
  categories: Category[];
}

function NavigationBarInner({ categories }: NavigationBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const selectedSub = searchParams.get('sub');

  const handleCategorySelect = (catId: string | null, subId?: string | null) => {
    const params = new URLSearchParams();
    if (catId) params.set('category', catId);
    if (subId) params.set('sub', subId);
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : '/products');
  };

  return (
    <nav className="relative z-20 glass-nav shadow-sm">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-0">
          <MegaCategoryMenu
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={(catId) => handleCategorySelect(catId, null)}
          />
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategory}
            selectedSubId={selectedSub}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        <div className="flex items-center text-[11px] sm:text-xs font-bold shrink-0">
          <Link
            href="/news"
            className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-white/90 hover:bg-white/10 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            Tin tức
          </Link>
          <Link
            href="/contact"
            className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-white/90 hover:bg-white/10 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function NavigationBar({ categories }: NavigationBarProps) {
  return (
    <Suspense fallback={<nav className="glass-nav h-11" />}>
      <NavigationBarInner categories={categories} />
    </Suspense>
  );
}
