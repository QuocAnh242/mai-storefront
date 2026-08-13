'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu } from 'lucide-react';
import { useStore } from '@/shared/context/StoreContext';

export function NavigationBar() {
  const { categories, selectedCategory, setSelectedCategory } = useStore();
  const [showAllCatDropdown, setShowAllCatDropdown] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Key main categories to show directly on top bar (4-5 items to leave room for Tin tức & Liên hệ)
  const mainFeaturedCategories = categories.slice(0, 5);

  return (
    <nav className="bg-sky-900 sticky top-[69px] z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        
        {/* Left Section: All Categories Menu + Main Category Tabs */}
        <div className="flex items-center gap-1">

          {/* 1. "DANH MỤC SẢN PHẨM" Mega Dropdown Button */}
          <div
            className="relative"
            onMouseEnter={() => setShowAllCatDropdown(true)}
            onMouseLeave={() => setShowAllCatDropdown(false)}
          >
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex items-center gap-2 px-4 py-3 font-black text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                selectedCategory === null
                  ? 'bg-sky-950 text-white'
                  : 'bg-sky-950/80 text-white hover:bg-sky-950'
              }`}
            >
              <Menu className="w-4 h-4 text-white" />
              <span>DANH MỤC SẢN PHẨM</span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/70 transition-transform ${showAllCatDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* All Categories Dropdown List */}
            {showAllCatDropdown && (
              <div className="absolute left-0 top-full w-64 bg-white text-slate-800 rounded-b-xl border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in duration-150">
                <div className="px-4 py-1.5 text-[10px] font-bold text-sky-800 uppercase tracking-widest border-b border-slate-100 mb-1">
                  <span>TẤT CẢ VẬT TƯ ({categories.length})</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowAllCatDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                    selectedCategory === null ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>Tất Cả Sản Phẩm</span>
                  <span className="text-[10px] text-slate-400">➔</span>
                </button>

                {categories.map((cat) => (
                  <div key={cat.id} className="relative group/sub">
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setShowAllCatDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                        selectedCategory === cat.id ? 'bg-sky-50 text-sky-900 font-bold' : 'hover:bg-sky-50/70 text-slate-700'
                      }`}
                    >
                      <span>{cat.name}</span>
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <span className="text-[10px] text-slate-400">›</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Featured Category Tabs (Shown directly on bar) */}
          <div className="hidden lg:flex items-center text-xs font-semibold">
            {mainFeaturedCategories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const hasSubs = cat.subcategories && cat.subcategories.length > 0;

              return (
                <div
                  key={cat.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(cat.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-3 uppercase tracking-wider transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-sky-950 text-white font-bold'
                        : 'text-white/90 hover:bg-sky-950/60 hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {hasSubs && <ChevronDown className="w-3 h-3 text-white/70" />}
                  </button>

                  {/* Subcategory Dropdown Popup */}
                  {hasSubs && activeDropdown === cat.id && (
                    <div className="absolute left-0 top-full w-56 bg-white text-slate-800 rounded-b-xl border border-slate-200 shadow-2xl py-1.5 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-1.5 text-[10px] font-bold text-sky-900 uppercase tracking-wider border-b border-slate-100">
                        {cat.name}
                      </div>
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
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

        </div>

        {/* Right Section: Fixed News & Contact Links (Always visible & fits on bar) */}
        <div className="flex items-center text-xs font-bold">
          <Link
            href="/tin-tuc"
            className="px-4 py-3 text-white/90 hover:bg-sky-950/60 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            Tin tức
          </Link>
          <Link
            href="/lien-he"
            className="px-4 py-3 text-white/90 hover:bg-sky-950/60 hover:text-white uppercase tracking-wider transition-colors shrink-0"
          >
            Liên hệ
          </Link>
        </div>

      </div>
    </nav>
  );
}
