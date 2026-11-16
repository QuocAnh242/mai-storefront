import React from 'react';
import { Loading } from '@/components/ui/Loading';

export default function AdminLoading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center py-16">
      <Loading
        size="lg"
        text="Đang tải trang quản trị..."
        subtext="Đang tải dữ liệu cửa hàng từ hệ thống"
      />
    </div>
  );
}
