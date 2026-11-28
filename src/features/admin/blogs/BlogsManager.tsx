'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Newspaper, Plus, Trash2, Edit, Tag, Layers, ExternalLink } from 'lucide-react';
import { BlogPost } from '@/shared/types';
import { getSafeImageUrl } from '@/lib/format';
import { Badge, buttonVariants, Card, ConfirmDialog, EmptyState, Loading } from '@/components/ui';
import { useAdminBlogs } from '../hooks/useAdminBlogs';

export function BlogsManager() {
  const { blogs, isLoading, deleteBlog } = useAdminBlogs();
  const [deletingBlog, setDeletingBlog] = useState<BlogPost | null>(null);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Bài Viết &amp; Tin Tức Shop</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Trình soạn thảo theo Section hỗ trợ xem trước thời gian thực.
          </p>
        </div>

        <Link href="/admin/news/create" className={buttonVariants({ size: 'md' })}>
          <Plus className="w-4 h-4" />
          <span>Tạo Bài Viết Mới</span>
        </Link>
      </Card>

      {isLoading && blogs.length === 0 ? (
        <Card className="p-12">
          <Loading
            size="lg"
            text="Đang tải danh sách bài viết..."
            subtext="Đang kết nối thư viện tin tức và cẩm nang"
          />
        </Card>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((post) => {
            const sectionCount = post.sections?.length || 0;
            return (
              <Card key={post.id} variant="lift" className="p-5 flex flex-col justify-between">
                <div className="flex gap-4">
                  <Image
                    src={getSafeImageUrl(post.thumbnail)}
                    alt={post.title}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-cover rounded-xl border border-slate-200 shrink-0 bg-slate-100"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="navy" size="sm">
                        <Tag className="w-2.5 h-2.5" />
                        {post.category || 'Mẹo hay'}
                      </Badge>
                      {sectionCount > 0 && (
                        <Badge size="sm">
                          <Layers className="w-2.5 h-2.5 text-slate-500" />
                          {sectionCount} Sections
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{post.summary}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-400 text-[11px] flex items-center gap-2">
                    <span>Tác giả: {post.author}</span>
                    <span>·</span>
                    <span>{post.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/news/${post.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      title="Xem bài viết trên storefront"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/news/edit/${post.id}`}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50"
                      title="Sửa bài viết"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeletingBlog(post)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                      title="Xóa bài viết"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Newspaper}
          title="Chưa có bài viết nào"
          description="Bấm vào nút bên dưới để tạo bài viết đầu tiên."
          action={
            <Link href="/admin/news/create" className={buttonVariants({ size: 'md' })}>
              <Plus className="w-4 h-4" />
              <span>Tạo Bài Viết Mới Đầu Tiên</span>
            </Link>
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingBlog)}
        onOpenChange={(open) => !open && setDeletingBlog(null)}
        title={`Xóa bài viết "${deletingBlog?.title || ''}"?`}
        description="Bài viết sẽ bị xóa vĩnh viễn khỏi hệ thống và không thể khôi phục."
        confirmLabel="Xóa bài viết"
        isLoading={deleteBlog.isPending}
        onConfirm={async () => {
          if (!deletingBlog) return;
          await deleteBlog.mutateAsync(deletingBlog.id);
          setDeletingBlog(null);
        }}
      />
    </div>
  );
}
