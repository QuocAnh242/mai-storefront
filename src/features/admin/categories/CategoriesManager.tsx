'use client';

import React, { useState } from 'react';
import { Category } from '@/shared/types';
import { normalizeSearchQuery } from '@/lib/searchUtils';
import { Card, ConfirmDialog, EmptyState, Input, Loading, Pagination } from '@/components/ui';
import { useAdminCategories } from '../hooks/useAdminCategories';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { CategoryCreateForm } from './CategoryCreateForm';
import { CategoryCardItem } from './CategoryCardItem';

export function CategoriesManager() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } =
    useAdminCategories();
  const { products } = useAdminProducts({ pageSize: 'all' });

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deletingTarget, setDeletingTarget] = useState<{
    cat: Category;
    productCount: number;
  } | null>(null);

  const qNorm = normalizeSearchQuery(searchQuery);
  const filtered = categories.filter(
    (c) =>
      !qNorm ||
      normalizeSearchQuery(c.name).includes(qNorm) ||
      normalizeSearchQuery(c.slug).includes(qNorm) ||
      (c.description && normalizeSearchQuery(c.description).includes(qNorm)),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản lý danh mục sản phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng <strong className="text-slate-800">{categories.length}</strong> danh mục chính. Dùng để phân loại sản phẩm và hiển thị menu cửa hàng.
          </p>
        </div>
      </Card>

      <CategoryCreateForm
        isCreating={createCategory.isPending}
        onCreate={async (payload) => {
          await createCategory.mutateAsync(payload);
        }}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="font-bold text-slate-900 text-sm">
          Danh sách danh mục ({filtered.length})
        </h2>
        <Input
          type="text"
          placeholder="Tìm danh mục..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full sm:w-60 bg-white py-1.5 text-xs"
        />
      </div>

      <div className="space-y-3">
        {isLoading && categories.length === 0 ? (
          <Card className="p-8">
            <Loading
              size="md"
              text="Đang tải danh mục hàng hóa..."
              subtext="Đang kết nối hệ thống phân loại sản phẩm"
            />
          </Card>
        ) : paginated.length === 0 ? (
          <EmptyState
            title="Không tìm thấy danh mục nào phù hợp"
            description="Thử tìm với từ khóa khác hoặc tạo danh mục mới phía trên."
          />
        ) : (
          paginated.map((cat) => (
            <CategoryCardItem
              key={cat.id}
              category={cat}
              productCount={products.filter((p) => p.categoryId === cat.id).length}
              onUpdate={async (id, payload) => {
                await updateCategory.mutateAsync({ id, ...payload });
              }}
              onRequestDelete={(target, productCount) =>
                setDeletingTarget({ cat: target, productCount })
              }
            />
          ))
        )}
      </div>

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={itemsPerPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={(next) => {
          setItemsPerPage(next);
          setCurrentPage(1);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingTarget)}
        onOpenChange={(open) => !open && setDeletingTarget(null)}
        title={`Xóa danh mục "${deletingTarget?.cat.name || ''}"?`}
        description={
          deletingTarget && deletingTarget.productCount > 0
            ? `Danh mục này đang có ${deletingTarget.productCount} sản phẩm. Xóa danh mục sẽ ảnh hưởng đến phân loại của các sản phẩm đó.`
            : 'Các danh mục con bên trong cũng sẽ bị xóa theo.'
        }
        confirmLabel="Xóa danh mục"
        isLoading={deleteCategory.isPending}
        onConfirm={async () => {
          if (!deletingTarget) return;
          await deleteCategory.mutateAsync(deletingTarget.cat.id);
          setDeletingTarget(null);
        }}
      />
    </div>
  );
}
