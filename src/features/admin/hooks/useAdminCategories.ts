'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Category } from '@/shared/types';
import { adminFetch } from './adminFetcher';

export function useAdminCategories() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const json = await adminFetch<{ data: Category[] }>('/api/admin/categories');
      return json.data || [];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });

  const createCategory = useMutation({
    mutationFn: (payload: Omit<Category, 'id'>) =>
      adminFetch('/api/admin/categories', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (_data, vars) => {
      toast.success(`Đã tạo danh mục "${vars.name}" thành công!`);
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateCategory = useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Category>) =>
      adminFetch('/api/admin/categories', { method: 'PATCH', body: JSON.stringify({ id, ...payload }) }),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công!');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteCategory = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/categories?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Đã xóa danh mục thành công!');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
