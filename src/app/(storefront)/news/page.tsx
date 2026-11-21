import React from 'react';
import type { Metadata } from 'next';
import { getBlogs } from '@/lib/queries';
import { BlogListView } from '@/features/blogs/BlogListView';

export const revalidate = 60; // ISR: 60s

export const metadata: Metadata = {
  title: 'Cẩm Nang & Tin Tức - Mẹo Hay Thủ Công & Pha Màu',
  description:
    'Góc chia sẻ cẩm nang, mẹo hay thực tế về chọn nhũ, pha màu kim tuyến, kỹ thuật dính keo & băng keo và bí quyết gia công thủ công chuyên nghiệp từ Mai Kim Tuyến.',
  alternates: {
    canonical: 'https://www.maikimtuyen.io.vn/news',
  },
  openGraph: {
    title: 'Cẩm Nang & Tin Tức - Mai Kim Tuyến',
    description: 'Kinh nghiệm chọn nhũ kim tuyến, pha bột màu, kỹ thuật dán keo và băng keo chuyên nghiệp.',
    url: 'https://www.maikimtuyen.io.vn/news',
    siteName: 'Mai Kim Tuyến Store',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default async function BlogListPage() {
  const { blogs } = await getBlogs({ limit: 50 });

  return <BlogListView initialBlogs={blogs} />;
}
