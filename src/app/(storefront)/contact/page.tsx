import React from 'react';
import type { Metadata } from 'next';
import { ContactView } from '@/features/contact/ContactView';

export const metadata: Metadata = {
  title: 'Liên Hệ & Đặt Hàng Sỉ Lẻ',
  description:
    'Thông tin địa chỉ kho hàng 44 Trịnh Hoài Đức Chợ Lớn, hotline báo giá Zalo và tài khoản ngân hàng chính thức của Mai Kim Tuyến.',
};

export default function ContactPage() {
  return <ContactView />;
}
