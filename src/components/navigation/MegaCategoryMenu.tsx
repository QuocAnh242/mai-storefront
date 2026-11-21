'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Menu, ChevronDown, ChevronRight } from 'lucide-react';
import { Category } from '@/shared/types';

interface MegaCategoryMenuProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export function MegaCategoryMenu({
  categories,
  selectedCategoryId,
  onSelectCategory,
}: MegaCategoryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (catId: string | null) => {
    onSelectCategory(catId);
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className="relative z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        className={`flex items-center gap-1.5 px-3 sm:px-4 py-2.5 sm:py-3 font-extrabold text-[11px] sm:text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
          selectedCategoryId === null || isOpen
            ? 'bg-sky-950 text-white'
            : 'bg-sky-950/80 text-white hover:bg-sky-950'
        }`}
        aria-expanded={isOpen}
      >
        <Menu className="w-4 h-4 text-white shrink-0" />
        <span className="hidden sm:inline">DANH MỤC SẢN PHẨM</span>
        <span className="sm:hidden">DANH MỤC</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-white/70 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute left-0 top-full w-60 sm:w-64 bg-white text-slate-800 rounded-b-xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in duration-150 max-h-[70vh] overflow-y-auto">
          <div className="px-4 py-1.5 text-[10px] font-bold text-sky-800 uppercase tracking-widest border-b border-slate-100 mb-1 sticky top-0 bg-white">
            <span>TẤT CẢ VẬT TƯ ({categories.length})</span>
          </div>

          <button
            type="button"
            onClick={() => handleSelect(null)}
            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
              selectedCategoryId === null
                ? 'bg-sky-50 text-sky-900'
                : 'hover:bg-slate-50 text-slate-700'
            }`}
          >
            <span>Tất Cả Sản Phẩm</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelect(cat.id)}
              className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                selectedCategoryId === cat.id
                  ? 'bg-sky-50 text-sky-900 font-bold'
                  : 'hover:bg-sky-50/70 text-slate-700'
              }`}
            >
              <span>{cat.name}</span>
              {cat.subcategories && cat.subcategories.length > 0 && (
                <span className="text-[10px] text-slate-400">›</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
