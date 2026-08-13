'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import BlogSectionEditor from '@/features/admin/components/BlogSectionEditor';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { addBlogPost } = useStore();

  const handleSave = (postPayload: any) => {
    addBlogPost(postPayload);
    router.push('/admin/tin-tuc');
  };

  return (
    <main className="max-w-7xl mx-auto pb-12">
      <BlogSectionEditor onSave={handleSave} isEditing={false} />
    </main>
  );
}
