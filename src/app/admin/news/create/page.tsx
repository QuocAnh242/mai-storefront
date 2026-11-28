'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import BlogSectionEditor from '@/features/admin/blogs/BlogSectionEditor';
import { useAdminBlogs } from '@/features/admin/hooks/useAdminBlogs';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { createBlog } = useAdminBlogs();

  return (
    <main className="max-w-7xl mx-auto pb-12">
      <BlogSectionEditor
        isEditing={false}
        onSave={async (postPayload) => {
          await createBlog.mutateAsync(postPayload);
          router.push('/admin/news');
        }}
      />
    </main>
  );
}
