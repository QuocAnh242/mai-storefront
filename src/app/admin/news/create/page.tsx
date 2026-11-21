'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import BlogSectionEditor from '@/features/admin/components/BlogSectionEditor';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { addBlogPost } = useStore();

  const handleSave = async (postPayload: any) => {
    const res = await addBlogPost(postPayload);
    if (res.success) {
      router.push('/admin/news');
    }
  };

  return (
    <main className="max-w-7xl mx-auto pb-12">
      <BlogSectionEditor onSave={handleSave} isEditing={false} />
    </main>
  );
}
