'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Product } from '@/shared/types';
import { adminFetch, DbProductRow, mapAdminProduct } from './adminFetcher';

export interface AdminProductsParams {
  page?: number;
  pageSize?: number | 'all';
  q?: string;
  categoryId?: string;
  status?: 'all' | 'featured' | 'in_stock' | 'out_of_stock';
}

export function useAdminProducts(params: AdminProductsParams = {}) {
  const queryClient = useQueryClient();
  const { page = 1, pageSize = 10, q = '', categoryId = 'all', status = 'all' } = params;

  const listQuery = useQuery({
    queryKey: ['admin', 'products', { page, pageSize, q, categoryId, status }],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (pageSize === 'all') {
        sp.set('pageSize', 'all');
      } else {
        sp.set('page', String(page));
        sp.set('pageSize', String(pageSize));
      }
      if (q.trim()) sp.set('q', q.trim());
      if (categoryId && categoryId !== 'all') sp.set('categoryId', categoryId);
      if (status && status !== 'all') sp.set('status', status);

      const json = await adminFetch<{ data: DbProductRow[]; total: number; totalPages: number }>(
        `/api/admin/products?${sp.toString()}`,
      );
      return {
        products: (json.data || []).map(mapAdminProduct),
        total: json.total || 0,
        totalPages: json.totalPages || 1,
      };
    },
  });

  const featuredQuery = useQuery({
    queryKey: ['admin', 'products', 'featured'],
    queryFn: async () => {
      const json = await adminFetch<{ data: DbProductRow[] }>(
        '/api/admin/products?page=1&pageSize=100&status=featured',
      );
      return (json.data || [])
        .map(mapAdminProduct)
        .sort((a, b) => a.displayOrder - b.displayOrder);
    },
  });

  const invalidateAll = () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });

  const createProduct = useMutation({
    mutationFn: (payload: Omit<Product, 'id' | 'createdAt'> & { createdAt?: string }) =>
      adminFetch('/api/admin/products', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: (_data, vars) => {
      toast.success(`Đã thêm sản phẩm "${vars.title}" thành công!`);
      invalidateAll();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, ...fields }: { id: string } & Partial<Product>) =>
      adminFetch('/api/admin/products', { method: 'PATCH', body: JSON.stringify({ id, ...fields }) }),
    onSuccess: () => {
      toast.success('Cập nhật sản phẩm thành công!');
      invalidateAll();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/products?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm thành công!');
      invalidateAll();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const reorderFeatured = useMutation({
    mutationFn: (productIds: string[]) =>
      adminFetch('/api/admin/products', {
        method: 'PUT',
        body: JSON.stringify({ action: 'reorder', productIds }),
      }),
    onSuccess: () => {
      toast.success('Đã cập nhật thứ tự sản phẩm nổi bật');
      invalidateAll();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    products: listQuery.data?.products || [],
    total: listQuery.data?.total || 0,
    totalPages: listQuery.data?.totalPages || 1,
    featuredProducts: featuredQuery.data || [],
    isLoading: listQuery.isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    reorderFeatured,
  };
}
