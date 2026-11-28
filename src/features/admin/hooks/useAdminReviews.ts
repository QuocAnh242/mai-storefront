'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ProductReview } from '@/shared/types';
import { adminFetch } from './adminFetcher';

export interface ReviewStats {
  total: number;
  avg: number;
  replied: number;
  unreplied: number;
}

export function useAdminReviews() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: async () => {
      const json = await adminFetch<{ data: ProductReview[]; stats?: ReviewStats }>(
        '/api/admin/reviews',
      );
      return {
        reviews: json.data || [],
        stats: json.stats || { total: 0, avg: 5.0, replied: 0, unreplied: 0 },
      };
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'reviews'] });

  const replyReview = useMutation({
    mutationFn: ({ id, replyContent }: { id: string; replyContent: string }) =>
      adminFetch('/api/admin/reviews', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'reply', id, replyContent }),
      }),
    onSuccess: () => {
      toast.success('Đã gửi phản hồi đến khách hàng thành công!');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const editReview = useMutation({
    mutationFn: (payload: { id: string; authorName: string; rating: number; content: string }) =>
      adminFetch('/api/admin/reviews', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'edit', ...payload }),
      }),
    onSuccess: () => {
      toast.success('Đã cập nhật đánh giá thành công');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleApprove = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      adminFetch('/api/admin/reviews', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'toggle_approve', id, isApproved }),
      }),
    onSuccess: (_d, vars) => {
      toast.success(
        vars.isApproved ? 'Đã hiển thị đánh giá' : 'Đã ẩn đánh giá khỏi trang sản phẩm',
      );
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Đã xóa đánh giá thành công');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    reviews: query.data?.reviews || [],
    stats: query.data?.stats || { total: 0, avg: 5.0, replied: 0, unreplied: 0 },
    isLoading: query.isLoading,
    refetch: query.refetch,
    replyReview,
    editReview,
    toggleApprove,
    deleteReview,
  };
}
