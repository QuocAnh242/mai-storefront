'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { DragDropProductList } from '@/features/admin/DragDropProductList';
import { ProductFormModal } from '@/features/admin/ProductFormModal';
import { Product } from '@/shared/types';
import { getProductUrl } from '@/lib/productUrl';
import Link from 'next/link';
import { Loading, TableRowsSkeleton } from '@/components/ui/Loading';

export default function AdminSanPhamPage() {
  const { products, categories, featuredProducts, reorderFeaturedProducts, updateProduct, deleteProduct, isLoading } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'featured' | 'in_stock' | 'out_of_stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [adminSearch, selectedCatFilter, statusFilter, itemsPerPage]);

  // Filter products by search, category, and status
  const filtered = products.filter((p) => {
    // 1. Search text
    const matchesSearch =
      p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      (p.subcategoryName && p.subcategoryName.toLowerCase().includes(adminSearch.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Category filter
    if (selectedCatFilter !== 'all' && p.categoryId !== selectedCatFilter) {
      return false;
    }

    // 3. Status filter
    if (statusFilter === 'featured' && !p.isFeatured) return false;
    if (statusFilter === 'in_stock' && !p.inStock) return false;
    if (statusFilter === 'out_of_stock' && p.inStock) return false;

    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

  // Pagination page buttons generator
  const getPageNumbers = (current: number, total: number): (number | string)[] => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, 4, '...', total];
    }
    if (current >= total - 2) {
      return [1, '...', total - 3, total - 2, total - 1, total];
    }
    return [1, '...', current - 1, current, current + 1, '...', total];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý sản phẩm
          </h1>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap font-medium">
            <span>
              Tổng số: <strong className="text-slate-900 font-bold">{products.length}</strong> sản phẩm
            </span>
            <span>•</span>
            <span className="text-amber-800 font-semibold">
              {featuredProducts.length} nổi bật
            </span>
            <span>•</span>
            <span className="text-emerald-800 font-semibold">
              {inStockCount} còn hàng
            </span>
            {outOfStockCount > 0 && (
              <>
                <span>•</span>
                <span className="text-red-700 font-semibold">
                  {outOfStockCount} hết hàng
                </span>
              </>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs px-4 py-2.5 rounded transition-colors cursor-pointer shrink-0"
        >
          + Thêm sản phẩm mới
        </button>
      </div>

      {/* Featured Products Reordering */}
      <DragDropProductList
        products={featuredProducts}
        onReorder={(reordered) => reorderFeaturedProducts(reordered)}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) deleteProduct(id);
        }}
      />

      {/* Product List Table with Pagination */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 space-y-4">
        {/* Controls: Filter Tabs & Search */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tất cả ({products.length})
            </button>

            <button
              onClick={() => setStatusFilter('featured')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === 'featured'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Nổi bật ({featuredProducts.length})
            </button>

            <button
              onClick={() => setStatusFilter('in_stock')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === 'in_stock'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Còn hàng ({inStockCount})
            </button>

            {outOfStockCount > 0 && (
              <button
                onClick={() => setStatusFilter('out_of_stock')}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === 'out_of_stock'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Hết hàng ({outOfStockCount})
              </button>
            )}
          </div>

          {/* Search + Category Dropdown */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <select
              value={selectedCatFilter}
              onChange={(e) => setSelectedCatFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs rounded px-3 py-1.5 outline-none focus:border-slate-800 font-medium"
            >
              <option value="all">Tất cả danh mục ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Tìm theo tên sản phẩm..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full sm:w-60 bg-white border border-slate-300 text-slate-900 text-xs rounded px-3 py-1.5 outline-none focus:border-slate-800"
            />
          </div>
        </div>

        {/* Mobile View: Product Cards (< 640px) */}
        <div className="block sm:hidden space-y-3">
          {isLoading && products.length === 0 ? (
            <div className="p-6 bg-slate-50 rounded-xl text-center">
              <Loading
                size="md"
                text="Đang tải danh sách sản phẩm..."
                subtext="Đang kết nối cơ sở dữ liệu kho hàng"
              />
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl text-xs">
              Không tìm thấy sản phẩm nào phù hợp.
            </div>
          ) : (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=100'}
                    alt=""
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <Link
                      href={getProductUrl(product)}
                      target="_blank"
                      className="font-bold text-slate-900 text-xs hover:text-sky-700 block line-clamp-2"
                    >
                      {product.title}
                    </Link>
                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      <span className="text-[10px] text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-medium">
                        {product.categoryName}
                      </span>
                      {product.isFeatured && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                          Nổi bật
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Giá bán / {product.unit}</span>
                    <span className="font-extrabold text-sky-900">
                      {product.isContactPrice || product.price <= 1 ? (
                        <span className="text-[11px] font-bold text-sky-700">Liên hệ</span>
                      ) : (
                        formatVND(product.price)
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                      className={`font-semibold px-2.5 py-1 rounded text-[10px] transition-colors cursor-pointer ${
                        product.inStock
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateProduct(product.id, { isFeatured: !product.isFeatured })}
                      className={`px-2 py-1 rounded text-[10px] font-semibold border transition-colors cursor-pointer ${
                        product.isFeatured
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {product.isFeatured ? '★ Nổi bật' : '+ Nổi bật'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                  <button
                    onClick={() => {
                      setEditingProduct(product);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 py-2 text-center rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Xóa vĩnh viễn sản phẩm "${product.title}"?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="px-4 py-2 text-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Product Table (>= 640px) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Sản phẩm</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Giá bán</th>
                <th className="p-3">Quy cách</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <Loading
                      size="md"
                      text="Đang tải danh sách sản phẩm..."
                      subtext="Đang kết nối cơ sở dữ liệu kho hàng"
                    />
                    <div className="mt-4">
                      <TableRowsSkeleton rows={5} />
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Không tìm thấy sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=100'}
                          alt=""
                          className="w-10 h-10 object-cover rounded border border-slate-200 shrink-0 bg-white"
                        />
                        <div className="min-w-0">
                          <Link
                            href={getProductUrl(product)}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-sky-700 block line-clamp-1"
                          >
                            {product.title}
                          </Link>
                          {product.isFeatured && (
                            <div className="mt-1">
                              <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.5 rounded">
                                Nổi bật
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-slate-800 font-medium">{product.categoryName}</span>
                      {product.subcategoryName && (
                        <span className="block text-[11px] text-slate-400">
                          ↳ {product.subcategoryName}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-bold text-sky-900">
                      {product.isContactPrice || product.price <= 1 ? (
                        <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          Liên hệ
                        </span>
                      ) : (
                        <>
                          {formatVND(product.price)}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="block text-[10px] text-slate-400 line-through font-normal">
                              {formatVND(product.originalPrice)}
                            </span>
                          )}
                        </>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">{product.unit}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => updateProduct(product.id, { inStock: !product.inStock })}
                        className={`inline-block font-semibold px-2 py-0.5 rounded text-[10px] transition-colors cursor-pointer ${
                          product.inStock
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-red-50 text-red-800 border border-red-200 hover:bg-red-100'
                        }`}
                        title="Bấm để đổi trạng thái"
                      >
                        {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateProduct(product.id, { isFeatured: !product.isFeatured })}
                          className={`px-2 py-1 rounded text-xs font-semibold border transition-colors cursor-pointer ${
                            product.isFeatured
                              ? 'bg-amber-100 border-amber-300 text-amber-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          title="Bật/tắt nổi bật"
                        >
                          {product.isFeatured ? 'Đang nổi bật' : '+ Nổi bật'}
                        </button>

                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Sửa
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Xóa vĩnh viễn sản phẩm "${product.title}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="px-2 py-1 rounded bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-slate-500 font-medium">
                Hiển thị <strong>{startIndex + 1}</strong> - <strong>{Math.min(startIndex + itemsPerPage, filtered.length)}</strong> trên tổng số <strong>{filtered.length}</strong> sản phẩm
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
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                  <option value={50}>50 / trang</option>
                  <option value={100}>100 / trang</option>
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

                {getPageNumbers(currentPage, totalPages).map((item, idx) =>
                  typeof item === 'number' ? (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      className={`w-7 h-7 rounded text-xs font-semibold transition-colors cursor-pointer ${
                        currentPage === item
                          ? 'bg-sky-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={idx} className="w-5 text-center text-slate-400">
                      ...
                    </span>
                  )
                )}

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

      {/* Product Form Modal (Original full form) */}
      {isModalOpen && (
        <ProductFormModal
          editingProduct={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
