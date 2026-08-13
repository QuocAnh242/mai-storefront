'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/shared/context/StoreContext';
import BlogSectionEditor from '@/features/admin/components/BlogSectionEditor';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { blogs, updateBlogPost } = useStore();

  const post = blogs.find((b) => b.id === id);

  if (!post) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg">Không tìm thấy bài viết</h3>
        <p className="text-xs text-slate-500 mt-1">Bài viết có thể đã bị xóa hoặc đường dẫn không đúng.</p>
        <button
          onClick={() => router.push('/admin/tin-tuc')}
          className="mt-4 bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl"
        >
          Quay lại danh sách bài viết
        </button>
      </div>
    );
  }

  const handleSave = (postPayload: any) => {
    updateBlogPost(id, postPayload);
    router.push('/admin/tin-tuc');
  };

  return (
    <main className="max-w-7xl mx-auto pb-12">
      <BlogSectionEditor initialPost={post} onSave={handleSave} isEditing={true} />
    </main>
  );
}
