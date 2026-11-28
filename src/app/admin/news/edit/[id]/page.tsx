'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import BlogSectionEditor from '@/features/admin/blogs/BlogSectionEditor';
import { useAdminBlogs } from '@/features/admin/hooks/useAdminBlogs';
import { Button, Card, Loading } from '@/components/ui';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { blogs, isLoading, updateBlog } = useAdminBlogs();

  const post = blogs.find((b) => b.id === id);

  if (isLoading && !post) {
    return (
      <div className="py-16">
        <Loading size="lg" text="Đang tải bài viết..." />
      </div>
    );
  }

  if (!post) {
    return (
      <Card className="p-8 text-center space-y-3">
        <h3 className="font-bold text-slate-800 text-lg">Không tìm thấy bài viết</h3>
        <p className="text-xs text-slate-500">
          Bài viết có thể đã bị xóa hoặc đường dẫn không đúng.
        </p>
        <Button size="sm" onClick={() => router.push('/admin/news')}>
          Quay lại danh sách bài viết
        </Button>
      </Card>
    );
  }

  return (
    <main className="max-w-7xl mx-auto pb-12">
      <BlogSectionEditor
        initialPost={post}
        isEditing
        onSave={async (postPayload) => {
          await updateBlog.mutateAsync({ id, ...postPayload });
          router.push('/admin/news');
        }}
      />
    </main>
  );
}
