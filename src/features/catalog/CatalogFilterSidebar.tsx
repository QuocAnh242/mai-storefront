'use client';

import React from 'react';
import { Category } from '@/shared/types';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Select } from '@/components/ui';

interface CatalogFilterSidebarProps {
  categories: Category[];
  selectedCategoryId: string | null;
  selectedSubId: string | null;
  selectedPriceRange: string;
  selectedSort: string;
  onSelectCategory: (catId: string | null) => void;
  onSelectSubcategory: (subId: string | null) => void;
  onSelectPriceRange: (range: string) => void;
  onSelectSort: (sort: string) => void;
}

export function CatalogFilterSidebar({
  categories,
  selectedCategoryId,
  selectedSubId,
  selectedPriceRange,
  selectedSort,
  onSelectCategory,
  onSelectSubcategory,
  onSelectPriceRange,
  onSelectSort,
}: CatalogFilterSidebarProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <ArrowUpDown className="w-3.5 h-3.5 text-sky-900" />
          <span>Sắp xếp</span>
        </label>
        <Select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value)}
          className="text-xs font-semibold py-2"
        >
          <option value="featured">Nổi bật / Bán chạy</option>
          <option value="price_asc">Giá: Thấp đến cao</option>
          <option value="price_desc">Giá: Cao đến thấp</option>
          <option value="newest">Sản phẩm mới nhất</option>
        </Select>
      </div>

      <div className="border-t border-slate-100" />

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-sky-900" />
          <span>Khoảng giá</span>
        </label>
        <div className="space-y-1.5 text-xs">
          {[
            { id: 'all', label: 'Tất cả mức giá' },
            { id: 'under-100k', label: 'Dưới 100.000đ' },
            { id: '100k-500k', label: '100.000đ – 500.000đ' },
            { id: 'above-500k', label: 'Trên 500.000đ' },
          ].map((item) => (
            <label
              key={item.id}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                selectedPriceRange === item.id
                  ? 'bg-sky-50 text-sky-900 font-bold'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <input
                type="radio"
                name="priceRange"
                value={item.id}
                checked={selectedPriceRange === item.id}
                onChange={() => onSelectPriceRange(item.id)}
                className="w-3.5 h-3.5 text-sky-900 accent-sky-900 cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-100" />

      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 block uppercase tracking-wider">
          Danh mục ({categories.length})
        </label>
        <div className="space-y-1 text-xs max-h-72 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
              selectedCategoryId === null
                ? 'bg-sky-950 text-white font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Tất cả vật tư
          </button>

          {categories.map((cat) => {
            const isActive = selectedCategoryId === cat.id;
            const subs = cat.subcategories || [];

            return (
              <div key={cat.id} className="space-y-1">
                <button
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-950 text-white font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat.name}
                </button>

                {isActive && subs.length > 0 && (
                  <div className="pl-3 space-y-0.5 border-l-2 border-sky-200 ml-2">
                    {subs.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() =>
                          onSelectSubcategory(selectedSubId === sub.id ? null : sub.id)
                        }
                        className={`w-full text-left px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                          selectedSubId === sub.id
                            ? 'bg-sky-100 text-sky-950 font-bold'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                        }`}
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
    </div>
  );
}
