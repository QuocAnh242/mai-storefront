'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/shared/types';
import { DragDropProductList } from '@/features/admin/products/DragDropProductList';
import { ProductFormModal } from '@/features/admin/products/ProductFormModal';
import { ProductTableSection } from '@/features/admin/products/ProductTableSection';
import { useAdminProducts } from '@/features/admin/hooks/useAdminProducts';
import { useAdminCategories } from '@/features/admin/hooks/useAdminCategories';
import { Button, Card, ConfirmDialog, Input, Pagination, Select } from '@/components/ui';

export function ProductsManager() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const [adminSearch, setAdminSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'featured' | 'in_stock' | 'out_of_stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(adminSearch);
      setCurrentPage(1);
    }, 220);
    return () => clearTimeout(t);
  }, [adminSearch]);

  const { categories } = useAdminCategories();
  const {
    products,
    total,
    totalPages,
    featuredProducts,
    isLoading,
    updateProduct,
    deleteProduct,
    reorderFeatured,
  } = useAdminProducts({
    page: currentPage,
    pageSize: itemsPerPage,
    q: debouncedSearch,
    categoryId: selectedCatFilter,
    status: statusFilter,
  });

  const statusTabs: { id: 'all' | 'featured' | 'in_stock' | 'out_of_stock'; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'featured', label: `Nổi bật (${featuredProducts.length})` },
    { id: 'in_stock', label: 'Còn hàng' },
    { id: 'out_of_stock', label: 'Hết hàng' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý sản phẩm</h1>
          <p className="text-xs text-slate-500 mt-1">
            Tổng kết quả khớp lọc: <strong className="text-slate-900">{total}</strong> sản phẩm ·{' '}
            <span className="text-amber-800 font-semibold">{featuredProducts.length} nổi bật</span>
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          + Thêm sản phẩm mới
        </Button>
      </Card>

      <DragDropProductList
        products={featuredProducts}
        onReorder={(reordered) => reorderFeatured.mutate(reordered.map((p) => p.id))}
        onEdit={(prod) => {
          setEditingProduct(prod);
          setIsModalOpen(true);
        }}
        onDelete={(id) => {
          const target = featuredProducts.find((p) => p.id === id);
          if (target) setDeletingProduct(target);
        }}
      />

      <Card className="p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                  statusFilter === tab.id
                    ? 'bg-sky-950 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <Select
              value={selectedCatFilter}
              onChange={(e) => {
                setSelectedCatFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="py-1.5 text-xs bg-white w-auto"
            >
              <option value="all">Tất cả danh mục ({categories.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>

            <Input
              type="text"
              placeholder="Tìm theo tên sản phẩm..."
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              className="w-full sm:w-60 py-1.5 text-xs bg-white"
            />
          </div>
        </div>

        <ProductTableSection
          products={products}
          isLoading={isLoading}
          onEdit={(prod) => {
            setEditingProduct(prod);
            setIsModalOpen(true);
          }}
          onToggleStock={(prod) =>
            updateProduct.mutate({ id: prod.id, inStock: !prod.inStock })
          }
          onToggleFeatured={(prod) =>
            updateProduct.mutate({ id: prod.id, isFeatured: !prod.isFeatured })
          }
          onRequestDelete={setDeletingProduct}
        />

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={total}
          pageSize={itemsPerPage}
          onPageChange={setCurrentPage}
          onPageSizeChange={(next) => {
            setItemsPerPage(next);
            setCurrentPage(1);
          }}
        />
      </Card>

      {isModalOpen && (
        <ProductFormModal
          key={editingProduct?.id || 'new'}
          editingProduct={editingProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onOpenChange={(open) => !open && setDeletingProduct(null)}
        title={`Xóa sản phẩm "${deletingProduct?.title || ''}"?`}
        description="Hành động này sẽ xóa vĩnh viễn sản phẩm khỏi hệ thống cửa hàng."
        confirmLabel="Xóa sản phẩm"
        isLoading={deleteProduct.isPending}
        onConfirm={async () => {
          if (!deletingProduct) return;
          await deleteProduct.mutateAsync(deletingProduct.id);
          setDeletingProduct(null);
        }}
      />
    </div>
  );
}
