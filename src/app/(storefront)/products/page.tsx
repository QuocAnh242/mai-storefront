'use client';

import React from 'react';
import { FeaturedProductsSection } from '@/features/storefront/FeaturedProductsSection';

export default function SanPhamPage() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-sky-950 via-sky-900 to-sky-800 text-white p-8 rounded-3xl shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black">Tất Cả Sản Phẩm Mai Store</h1>
        <p className="text-xs sm:text-sm text-sky-100/90 mt-1">
          Khám phá trọn bộ hạt nhũ Kim Tuyến, Bột Màu, Băng Keo, Sơn Xịt và Keo Dán thủ công chất lượng cao.
        </p>
      </div>
      <FeaturedProductsSection />
    </div>
  );
}
