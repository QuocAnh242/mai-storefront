'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/shared/types';
import { getProductUrl } from '@/lib/productUrl';
import { formatVND, getSafeImageUrl, isContactProduct } from '@/lib/format';
import { Badge, Button, EmptyState, Loading, TableRowsSkeleton } from '@/components/ui';
import { ProductMobileCards } from './ProductMobileCards';

interface ProductTableSectionProps {
  products: Product[];
  isLoading: boolean;
  onEdit: (product: Product) => void;
  onToggleStock: (product: Product) => void;
  onToggleFeatured: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
}

export function ProductTableSection({
  products,
  isLoading,
  onEdit,
  onToggleStock,
  onToggleFeatured,
  onRequestDelete,
}: ProductTableSectionProps) {
  if (isLoading && products.length === 0) {
    return (
      <div className="p-8 space-y-4">
        <Loading
          size="md"
          text="Đang tải danh sách sản phẩm..."
          subtext="Đang kết nối cơ sở dữ liệu kho hàng"
        />
        <TableRowsSkeleton rows={5} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="Không tìm thấy sản phẩm nào phù hợp"
        description="Thử thay đổi bộ lọc hoặc tạo sản phẩm mới."
      />
    );
  }

  return (
    <>
      <ProductMobileCards
        products={products}
        onEdit={onEdit}
        onToggleStock={onToggleStock}
        onToggleFeatured={onToggleFeatured}
        onRequestDelete={onRequestDelete}
      />

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
            {products.map((product) => {
              const isContact = isContactProduct(product);
              return (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={getSafeImageUrl(product.images?.[0])}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0 bg-white"
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
                          <Badge variant="amber" size="sm" className="mt-1">
                            Nổi bật
                          </Badge>
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
                    {isContact ? (
                      <Badge variant="navy" size="sm">
                        Liên hệ
                      </Badge>
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
                      onClick={() => onToggleStock(product)}
                      className={`inline-block font-semibold px-2.5 py-0.5 rounded-md text-[10px] cursor-pointer ${
                        product.inStock
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      {product.inStock ? 'Còn hàng' : 'Hết hàng'}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleFeatured(product)}
                        className={`px-2 py-1 rounded-md text-xs font-semibold border cursor-pointer ${
                          product.isFeatured
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {product.isFeatured ? 'Đang nổi bật' : '+ Nổi bật'}
                      </button>
                      <Button type="button" variant="secondary" size="xs" onClick={() => onEdit(product)}>
                        Sửa
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                        onClick={() => onRequestDelete(product)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
