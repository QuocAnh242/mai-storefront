'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import { MegaCategoryMenu } from './MegaCategoryMenu';
import { CategoryTabs } from './CategoryTabs';

export function NavigationBar() {
  const router = useRouter();
  const { categories, selectedCategory, setSelectedCategory } = useStore();

  const handleCategorySelect = (catId: string | null) => {
    setSelectedCategory(catId);

    // If on homepage, smooth scroll to product section; otherwise navigate to /products
    const el = document.getElementById('danh-sach-san-pham');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (catId) {
        router.push(`/products?category=${encodeURIComponent(catId)}`);
      } else {
        router.push('/products');
      }
    }
  };

  return (
    <nav className="bg-sky-900 shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center gap-0">
          <MegaCategoryMenu
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
          <CategoryTabs
            categories={categories}
            selectedCategoryId={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Right Section: Fixed News & Contact Links */}
        <div className="flex items-center text-[11px] sm:text-xs font-bold shrink-0">
          <Link
            href="/news"
            className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-white/90 hover:bg-sky-950/60 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            Tin tức
          </Link>
          <Link
            href="/contact"
            className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-white/90 hover:bg-sky-950/60 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            Liên hệ
          </Link>
        </div>
      </div>
    </nav>
  );
}
