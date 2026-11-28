'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminFetch, DbOrderRow, mapAdminOrder } from './adminFetcher';

export interface ManualRevenue {
  id: string;
  amount: number;
  date: string;
  source: string;
  note: string;
  createdAt: string;
}

export function useAdminRevenue() {
  const queryClient = useQueryClient();

  const revenuesQuery = useQuery({
    queryKey: ['admin', 'revenues'],
    queryFn: async () => {
      const json = await adminFetch<{ data: ManualRevenue[] }>('/api/admin/revenue');
      return json.data || [];
    },
  });

  const ordersQuery = useQuery({
    queryKey: ['admin', 'orders', 'revenue-summary'],
    queryFn: async () => {
      const json = await adminFetch<{ data: DbOrderRow[] }>('/api/admin/orders?pageSize=all');
      return (json.data || []).map(mapAdminOrder);
    },
  });

  const createRevenue = useMutation({
    mutationFn: (payload: { amount: number; date: string; source: string; note: string }) =>
      adminFetch('/api/admin/revenue', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success('Đã ghi nhận doanh thu thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'revenues'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteRevenue = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/revenue?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Đã xóa bản ghi doanh thu thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'revenues'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    manualRevenues: revenuesQuery.data || [],
    orders: ordersQuery.data || [],
    isLoading: revenuesQuery.isLoading || ordersQuery.isLoading,
    createRevenue,
    deleteRevenue,
  };
}
