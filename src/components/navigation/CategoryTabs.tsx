'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Category } from '@/shared/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: CategoryTabsProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const featuredCategories = categories.slice(0, 5);

  return (
    <div className="hidden lg:flex items-center text-xs font-semibold">
      {featuredCategories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const hasSubs = Boolean(cat.subcategories && cat.subcategories.length > 0);

        return (
          <div
            key={cat.id}
            className="relative"
            onMouseEnter={() => setActiveDropdown(cat.id)}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-3 uppercase tracking-wider transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-sky-950 text-white font-bold'
                  : 'text-white/90 hover:bg-sky-950/60 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              {hasSubs && <ChevronDown className="w-3 h-3 text-white/70" />}
            </button>

            {/* Subcategories dropdown on hover */}
            {hasSubs && activeDropdown === cat.id && (
              <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl border border-slate-200 shadow-2xl py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-1.5 text-[10px] font-bold text-sky-900 uppercase tracking-wider border-b border-slate-100">
                  {cat.name}
                </div>
                {cat.subcategories?.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setActiveDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-900 font-medium transition-colors cursor-pointer"
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
