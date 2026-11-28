'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Category } from '@/shared/types';

interface CategoryTabsProps {
  categories: Category[];
  selectedCategoryId: string | null;
  selectedSubId: string | null;
  onSelectCategory: (catId: string | null, subId?: string | null) => void;
}

export function CategoryTabs({
  categories,
  selectedCategoryId,
  selectedSubId,
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
              onClick={() => onSelectCategory(cat.id, null)}
              className={`flex items-center gap-1.5 px-3.5 py-3 uppercase tracking-wider transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white/15 text-white font-bold'
                  : 'text-white/90 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
              {hasSubs && <ChevronDown className="w-3 h-3 text-white/75" />}
            </button>

            {hasSubs && activeDropdown === cat.id && (
              <div className="absolute left-0 top-full w-56 glass-modal-panel rounded-b-xl py-1.5 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-1.5 text-[10px] font-bold text-sky-900 uppercase tracking-wider border-b border-slate-100">
                  {cat.name}
                </div>
                {cat.subcategories?.map((sub) => {
                  const isSubSelected = selectedSubId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id, sub.id);
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        isSubSelected
                          ? 'bg-sky-50 text-sky-950 font-bold'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-sky-900'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
