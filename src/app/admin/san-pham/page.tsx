'use client';

import React, { useState } from 'react';
import { useStore } from '@/shared/context/StoreContext';
import { DragDropProductList } from '@/features/admin/DragDropProductList';
import { ProductFormModal } from '@/features/admin/ProductFormModal';
import { Product } from '@/shared/types';
import { Plus, Package, Edit, Trash2, Tag, Search, Star } from 'lucide-react';

export default function AdminSanPhamPage() {
  const { products, featuredProducts, reorderFeaturedProducts, updateProduct, deleteProduct } = useStore();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.categoryName.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-8">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Package className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Sản Phẩm Mai Kim Tuyến</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng: <strong className="text-slate-800">{products.length}</strong> mặt hàng | <strong className="text-sky-700">{featuredProducts.length}</strong> nổi bật
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Drag & Drop Reorder Featured Section */}
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

      {/* All Products List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Tất Cả Danh Sách Sản Phẩm</h3>

          {/* Search in Admin */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Lọc tên sản phẩm..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs rounded-lg pl-9 pr-3 py-2 outline-none focus:border-sky-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-900 font-bold uppercase border-b border-slate-200">
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
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 block">{product.title}</span>
                        {product.isFeatured && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            ★ Nổi bật
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 font-medium">
                    {product.categoryName}
                    {product.subcategoryName && (
                      <span className="block text-[11px] text-slate-400">({product.subcategoryName})</span>
                    )}
                  </td>
                  <td className="p-3 font-black text-sky-700">{formatVND(product.price)}</td>
                  <td className="p-3">{product.unit}</td>
                  <td className="p-3">
                    {product.inStock ? (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        Còn hàng
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded text-[11px]">
                        Hết hàng
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Button toggle status Nổi Bật */}
                      <button
                        type="button"
                        onClick={() => updateProduct(product.id, { isFeatured: !product.isFeatured })}
                        className={`px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer shrink-0 ${
                          product.isFeatured
                            ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                        title={product.isFeatured ? 'Bỏ sản phẩm khỏi danh sách Nổi Bật' : 'Đưa sản phẩm lên danh sách Nổi Bật (Trang chủ)'}
                      >
                        <Star className={`w-3.5 h-3.5 ${product.isFeatured ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                        <span>{product.isFeatured ? '★ Đang Nổi Bật' : '+ Nổi Bật'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                        title="Chỉnh sửa sản phẩm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Xóa sản phẩm này?')) deleteProduct(product.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
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
