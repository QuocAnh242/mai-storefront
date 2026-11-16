import React from 'react';
import { Loading } from '@/components/ui/Loading';

export default function StorefrontLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-16">
      <Loading
        size="lg"
        text="Đang tải trang..."
        subtext="Đang kết nối hệ thống cửa hàng Mai Kim Tuyến"
      />
    </div>
  );
}

