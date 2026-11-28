'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Order } from '@/shared/types';
import { adminFetch, DbOrderRow, mapAdminOrder } from '@/features/admin/hooks/adminFetcher';

export function useOrders() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const query = useQuery({
    queryKey: ['admin', 'orders', { page, pageSize, searchQuery, statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const json = await adminFetch<{ data: DbOrderRow[]; total: number; totalPages: number }>(
        `/api/admin/orders?${params.toString()}`,
      );
      return {
        orders: (json.data || []).map(mapAdminOrder),
        total: json.total || 0,
        totalPages: json.totalPages || 1,
      };
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderCode, status }: { orderCode: string; status: Order['paymentStatus'] }) =>
      adminFetch('/api/admin/orders', {
        method: 'PATCH',
        body: JSON.stringify({ orderCode, status }),
      }),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (orderCode: string) =>
      adminFetch(`/api/admin/orders?orderCode=${encodeURIComponent(orderCode)}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      toast.success('Đã xóa đơn hàng');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    orders: query.data?.orders || [],
    loading: query.isLoading,
    page,
    setPage,
    totalPages: query.data?.totalPages || 1,
    total: query.data?.total || 0,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus: (orderCode: string, status: Order['paymentStatus']) =>
      updateMutation.mutate({ orderCode, status }),
    removeOrder: async (orderCode: string) => {
      try {
        await deleteMutation.mutateAsync(orderCode);
        return { success: true, message: 'Đã xóa đơn hàng' };
      } catch (err) {
        return { success: false, message: (err as Error).message };
      }
    },
    refetch: query.refetch,
  };
}
