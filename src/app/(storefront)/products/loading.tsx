import React from 'react';
import { ProductGridSkeleton, Loading } from '@/components/ui/Loading';

export default function ProductsLoading() {
  return (
    <div className="space-y-8 py-6">
      <div className="bg-slate-100 rounded-3xl p-8 animate-pulse space-y-3">
        <div className="h-8 bg-slate-200 rounded w-1/3" />
        <div className="h-4 bg-slate-200 rounded w-2/3" />
      </div>

      <div className="py-2 text-center">
        <Loading size="md" text="Đang tải danh sách sản phẩm..." />
      </div>

      <ProductGridSkeleton count={8} />
    </div>
  );
}

