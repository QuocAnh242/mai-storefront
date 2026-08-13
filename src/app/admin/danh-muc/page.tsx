'use client';

import React, { useState } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { Layers, Plus, Trash2, Edit, ChevronRight, Tag } from 'lucide-react';

export default function AdminDanhMucPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [activeCatForSub, setActiveCatForSub] = useState<string | null>(null);
  const [subCatName, setSubCatName] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newCatDesc.trim(),
      subcategories: [],
    });

    setNewCatName('');
    setNewCatDesc('');
  };

  const handleAddSubcategory = (categoryId: string) => {
    if (!subCatName.trim()) return;

    const targetCategory = categories.find((c) => c.id === categoryId);
    if (!targetCategory) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      name: subCatName.trim(),
      slug: subCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      categoryId,
    };

    const updatedSubcategories = [...(targetCategory.subcategories || []), newSub];

    updateCategory(categoryId, {
      subcategories: updatedSubcategories,
    });

    setSubCatName('');
    setActiveCatForSub(null);
  };

  const handleDeleteSubcategory = (categoryId: string, subId: string) => {
    const targetCategory = categories.find((c) => c.id === categoryId);
    if (!targetCategory) return;

    const updatedSubcategories = (targetCategory.subcategories || []).filter((s) => s.id !== subId);

    updateCategory(categoryId, {
      subcategories: updatedSubcategories,
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Layers className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Danh Mục Sản Phẩm</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng: <strong className="text-slate-800">{categories.length}</strong> danh mục chính.
          </p>
        </div>
      </div>

      {/* Form Add New Category */}
      <form onSubmit={handleCreateCategory} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
          <Plus className="w-4 h-4 text-sky-700" />
          <span>Tạo Danh Mục Mới</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tên danh mục (*)</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Bột Sơn Phủ Camay"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 outline-none focus:border-sky-600 focus:bg-white font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả danh mục</label>
            <input
              type="text"
              placeholder="Mô tả ngắn gọn..."
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-2.5 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Lưu Danh Mục Mới</span>
        </button>
      </form>

      {/* Category List */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-800 font-black text-lg flex items-center justify-center border border-sky-200 shrink-0">
                  {cat.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                      {cat.slug}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cat.description || 'Chưa có mô tả'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCatForSub(activeCatForSub === cat.id ? null : cat.id);
                    setSubCatName('');
                  }}
                  className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs px-3 py-1.5 rounded-lg border border-sky-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>+ Thêm Danh Mục Con</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Xóa danh mục "${cat.name}"?`)) deleteCategory(cat.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Xóa danh mục này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Inline Subcategory Add Form */}
            {activeCatForSub === cat.id && (
              <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-200/80 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Tên danh mục con mới (ví dụ: Kim tuyến Ngũ Sắc)..."
                  value={subCatName}
                  onChange={(e) => setSubCatName(e.target.value)}
                  className="flex-1 bg-white border border-sky-300 text-slate-900 text-xs rounded-lg p-2 outline-none focus:border-sky-600"
                />
                <button
                  type="button"
                  onClick={() => handleAddSubcategory(cat.id)}
                  className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Lưu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCatForSub(null)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3 py-2 rounded-lg cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            )}

            {/* Subcategories list */}
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="pt-3 border-t border-slate-100 pl-4 border-l-2 border-sky-400 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Danh mục con ({cat.subcategories.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {cat.subcategories.map((sub) => (
                    <span
                      key={sub.id}
                      className="bg-slate-100 text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1.5 group"
                    >
                      <ChevronRight className="w-3 h-3 text-sky-600" />
                      <span>{sub.name}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                        className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-1 cursor-pointer"
                        title="Xóa danh mục con"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
