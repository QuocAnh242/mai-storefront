'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminFetch } from './adminFetcher';

export interface AdminAccount {
  id: string;
  email: string;
  fullName: string;
  role: 'super_admin';
  createdAt: string;
  lastLoginAt?: string;
}

export function useAdminAccounts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin', 'accounts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/accounts');
      const json = await res.json();
      if (json.requiresServiceRole) {
        return { accounts: [] as AdminAccount[], requiresServiceRole: true };
      }
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Không thể tải danh sách tài khoản');
      }
      return { accounts: (json.data || []) as AdminAccount[], requiresServiceRole: false };
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'accounts'] });

  const createAccount = useMutation({
    mutationFn: (payload: { email: string; fullName: string; password: string }) =>
      adminFetch('/api/admin/accounts', { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: () => {
      toast.success('Đã tạo tài khoản quản trị thành công trên Supabase Auth!');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const changePassword = useMutation({
    mutationFn: ({ accountId, newPassword }: { accountId: string; newPassword: string }) =>
      adminFetch('/api/admin/accounts', {
        method: 'PATCH',
        body: JSON.stringify({ action: 'change_password', accountId, newPassword }),
      }),
    onSuccess: () => {
      toast.success('Đã đổi mật khẩu thành công!');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteAccount = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/admin/accounts?id=${encodeURIComponent(id)}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Đã xóa tài khoản thành công');
      invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return {
    accounts: query.data?.accounts || [],
    requiresServiceRole: query.data?.requiresServiceRole || false,
    isLoading: query.isLoading,
    refetch: query.refetch,
    createAccount,
    changePassword,
    deleteAccount,
  };
}
