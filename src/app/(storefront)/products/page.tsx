import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { getCategories, getProducts } from '@/lib/queries';
import { ProductCatalogView } from '@/features/catalog/ProductCatalogView';
import { Loading } from '@/components/ui/Loading';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Tất Cả Sản Phẩm - Bột Kim Tuyến, Bột Màu, Băng Keo Sỉ Lẻ',
  description:
    'Danh mục đầy đủ sản phẩm hạt nhũ Kim Tuyến, Bột Màu xây dựng & công nghiệp, Băng Keo dán thùng, Sơn Xịt, Keo Dán giá sỉ lẻ tốt nhất tại Chợ Lớn TP.HCM.',
  alternates: {
    canonical: 'https://www.maikimtuyen.io.vn/products',
  },
  openGraph: {
    title: 'Tất Cả Sản Phẩm - Mai Kim Tuyến',
    description: 'Kho sỉ lẻ Bột Kim Tuyến, Bột Màu, Băng Keo, Sơn Xịt, Keo Dán tại Chợ Lớn TP.HCM',
    url: 'https://www.maikimtuyen.io.vn/products',
    siteName: 'Mai Kim Tuyến Store',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function ProductsPage() {
  const [productsRes, categories] = await Promise.all([
    getProducts({ limit: 300 }),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="py-16 flex justify-center">
          <Loading
            size="lg"
            text="Đang tải danh mục sản phẩm..."
            subtext="Đang kết nối kho hàng và đồng bộ bảng giá mới nhất"
          />
        </div>
      }
    >
      <ProductCatalogView
        initialProducts={productsRes.products}
        initialCategories={categories}
      />
    </Suspense>
  );
}
