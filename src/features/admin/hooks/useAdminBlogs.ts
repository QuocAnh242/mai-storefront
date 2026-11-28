'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { BlogPost } from '@/shared/types';
import { adminFetch, DbBlogRow, mapAdminBlog } from './adminFetcher';

export function useAdminBlogs(page = 1, pageSize: number | 'all' = 'all') {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'blogs', { page, pageSize }],
    queryFn: async () => {
      const qs = pageSize === 'all' ? 'pageSize=all' : `page=${page}&pageSize=${pageSize}`;
      const json = await adminFetch<{ data: DbBlogRow[]; total: number; totalPages: number }>(
        `/api/admin/blogs?${qs}`,
      );
      return {
        blogs: (json.data || []).map(mapAdminBlog),
        total: json.total || 0,
        totalPages: json.totalPages || 1,
      };
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'blogs'] });

  const createBlog = useMutation({
    mutationFn: (payload: Omit<BlogPost, 'id' | 'createdAt'>) =>
      adminFetch('/api/admin/blogs', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (_d, vars) => {
      toast.success(`Đã tạo bài viết "${vars.title}" thành công!`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<BlogPost>) =>
      adminFetch('/api/admin/blogs', { method: 'PATCH', body: JSON.stringify({ id, ...payload }) }),
    onSuccess: () => {
      toast.success('Cập nhật bài viết thành công!');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteBlog = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/blogs?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Đã xóa bài viết thành công!');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    blogs: query.data?.blogs || [],
    total: query.data?.total || 0,
    totalPages: query.data?.totalPages || 1,
    isLoading: query.isLoading,
    createBlog,
    updateBlog,
    deleteBlog,
  };
}
