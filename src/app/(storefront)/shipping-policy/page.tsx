import React from 'react';
import type { Metadata } from 'next';
import { ShippingPolicyView } from '@/features/policies/ShippingPolicyView';

export const metadata: Metadata = {
  title: 'Cách Thức Giao Hàng',
  description:
    'Thông tin giao nhanh nội thành TP.HCM, gửi chành xe đi tỉnh và chuyển phát toàn quốc từ cửa hàng Mai Kim Tuyến Chợ Lớn.',
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyView />;
}
