'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { slugify } from '@/lib/slugify';
import { Category } from '@/shared/types';
import { Loading } from '@/components/ui/Loading';

export default function AdminDanhMucPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory, isLoading } = useStore();

  // Create form state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Subcategory add state
  const [activeCatForSub, setActiveCatForSub] = useState<string | null>(null);
  const [subCatName, setSubCatName] = useState('');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Edit category state
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, itemsPerPage]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const trimmedName = newCatName.trim();
    addCategory({
      name: trimmedName,
      slug: slugify(trimmedName),
      description: newCatDesc.trim(),
      subcategories: [],
    });

    setNewCatName('');
    setNewCatDesc('');
  };

  const handleStartEdit = (cat: Category) => {
    setEditingCatId(cat.id);
    setEditName(cat.name);
    setEditDesc(cat.description || '');
  };

  const handleSaveEdit = (catId: string) => {
    if (!editName.trim()) return;
    updateCategory(catId, {
      name: editName.trim(),
      slug: slugify(editName.trim()),
      description: editDesc.trim(),
    });
    setEditingCatId(null);
  };

  const handleAddSubcategory = (categoryId: string) => {
    if (!subCatName.trim()) return;

    const targetCategory = categories.find((c) => c.id === categoryId);
    if (!targetCategory) return;

    const trimmedSub = subCatName.trim();
    const newSub = {
      id: `sub-${Date.now()}`,
      name: trimmedSub,
      slug: slugify(trimmedSub),
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

  // Filter categories
  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý danh mục sản phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng <strong className="text-slate-800 font-bold">{categories.length}</strong> danh mục chính. Dùng để phân loại sản phẩm và hiển thị menu cửa hàng.
          </p>
        </div>
      </div>

      {/* Form Add New Category - Flat & Simple */}
      <form
        onSubmit={handleCreateCategory}
        className="bg-white p-5 rounded-lg border border-slate-200 space-y-3"
      >
        <div className="border-b border-slate-100 pb-2">
          <h2 className="font-bold text-slate-900 text-sm">
            Thêm danh mục mới
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên danh mục *
            </label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Bột Nhũ Đồng"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded p-2.5 outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mô tả ngắn
            </label>
            <input
              type="text"
              placeholder="Mô tả ứng dụng..."
              value={newCatDesc}
              onChange={(e) => setNewCatDesc(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded p-2.5 outline-none focus:border-slate-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs px-4 py-2 rounded transition-colors cursor-pointer"
          >
            Lưu danh mục
          </button>
        </div>
      </form>

      {/* Search & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900 text-sm">
          Danh sách danh mục ({filteredCategories.length})
        </h2>

        <input
          type="text"
          placeholder="Tìm danh mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-60 bg-white border border-slate-300 text-slate-900 text-xs rounded px-3 py-1.5 outline-none focus:border-slate-800"
        />
      </div>

      {/* Category List Cards (10 per page) */}
      <div className="space-y-3">
        {isLoading && categories.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200">
            <Loading
              size="md"
              text="Đang tải danh mục hàng hóa..."
              subtext="Đang kết nối hệ thống phân loại sản phẩm"
            />
          </div>
        ) : paginatedCategories.length === 0 ? (
          <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-400 text-xs">
            Không tìm thấy danh mục nào phù hợp.
          </div>
        ) : (
          paginatedCategories.map((cat) => {
            const productCount = products.filter((p) => p.categoryId === cat.id).length;
            const isEditing = editingCatId === cat.id;

            return (
              <div
                key={cat.id}
                className="bg-white p-4 rounded-lg border border-slate-200 space-y-3"
              >
                {isEditing ? (
                  /* Inline Edit Form */
                  <div className="space-y-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Tên danh mục
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full bg-white border border-slate-300 text-xs rounded p-2 outline-none focus:border-slate-800 font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                          Mô tả
                        </label>
                        <input
                          type="text"
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          className="w-full bg-white border border-slate-300 text-xs rounded p-2 outline-none focus:border-slate-800"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="px-3 py-1 rounded text-slate-600 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(cat.id)}
                        className="px-4 py-1 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold cursor-pointer"
                      >
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Normal View */
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">
                          {cat.name}
                        </h3>
                        <span className="text-[11px] text-sky-800 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                          {productCount} sản phẩm
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {cat.description || 'Chưa có mô tả'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveCatForSub(activeCatForSub === cat.id ? null : cat.id);
                          setSubCatName('');
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                          activeCatForSub === cat.id
                            ? 'bg-sky-700 text-white border-sky-700'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        + Danh mục con
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStartEdit(cat)}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
                      >
                        Sửa
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (productCount > 0) {
                            if (
                              !confirm(
                                `Danh mục này đang có ${productCount} sản phẩm. Xóa danh mục sẽ ảnh hưởng đến các sản phẩm này. Bạn vẫn muốn xóa?`
                              )
                            ) {
                              return;
                            }
                          } else if (!confirm(`Xóa danh mục "${cat.name}"?`)) {
                            return;
                          }
                          deleteCategory(cat.id);
                        }}
                        className="px-2.5 py-1 rounded text-xs font-semibold text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Subcategory Add Form */}
                {activeCatForSub === cat.id && (
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Tên danh mục con mới..."
                      value={subCatName}
                      onChange={(e) => setSubCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcategory(cat.id);
                        }
                      }}
                      className="flex-1 bg-white border border-slate-300 text-slate-900 text-xs rounded p-1.5 outline-none focus:border-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubcategory(cat.id)}
                      className="bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs px-3 py-1.5 rounded cursor-pointer"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCatForSub(null)}
                      className="bg-white border border-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      Đóng
                    </button>
                  </div>
                )}

                {/* Subcategories chips */}
                {cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                      Con ({cat.subcategories.length}):
                    </span>
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="bg-slate-100 text-slate-800 text-xs font-medium px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1.5"
                      >
                        <span>{sub.name}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubcategory(cat.id, sub.id)}
                          className="text-slate-400 hover:text-red-600 font-bold text-xs"
                          title="Xóa"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Bar */}
      {filteredCategories.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-500 font-medium">
              Hiển thị <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + itemsPerPage, filteredCategories.length)}</strong> trên tổng số <strong>{filteredCategories.length}</strong> danh mục
            </span>

            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>• Số lượng:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 text-slate-800 font-bold rounded px-2 py-0.5 text-xs outline-none focus:border-slate-800 cursor-pointer"
              >
                <option value={5}>5 / trang</option>
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium cursor-pointer transition-colors"
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    currentPage === page
                      ? 'bg-sky-700 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-700 font-medium cursor-pointer transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
