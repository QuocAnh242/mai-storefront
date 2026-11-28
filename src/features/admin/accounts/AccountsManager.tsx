'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { formatDateVN } from '@/lib/format';
import { normalizeSearchQuery } from '@/lib/searchUtils';
import { Badge, Button, Card, ConfirmDialog, Input, Loading, TableRowsSkeleton } from '@/components/ui';
import { AdminAccount, useAdminAccounts } from '../hooks/useAdminAccounts';
import { AccountCreateModal, AccountPasswordModal } from './AccountModals';

export function AccountsManager() {
  const {
    accounts,
    requiresServiceRole,
    isLoading,
    refetch,
    createAccount,
    changePassword,
    deleteAccount,
  } = useAdminAccounts();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState<AdminAccount | null>(null);
  const [deletingTarget, setDeletingTarget] = useState<AdminAccount | null>(null);

  const qNorm = normalizeSearchQuery(searchQuery);
  const filteredAccounts = accounts.filter(
    (a) =>
      !qNorm ||
      normalizeSearchQuery(a.email).includes(qNorm) ||
      normalizeSearchQuery(a.fullName).includes(qNorm),
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Quản lý tài khoản</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem danh sách tài khoản, tạo tài khoản và đổi mật khẩu
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => refetch()}>
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang tải...</span>
              </>
            ) : (
              'Làm mới'
            )}
          </Button>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            + Thêm tài khoản mới
          </Button>
        </div>
      </Card>

      {requiresServiceRole && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
          <div className="font-bold text-sm text-amber-950">
            Cần bổ sung biến môi trường SUPABASE_SERVICE_ROLE_KEY
          </div>
          <p>
            Để gọi trực tiếp <strong>Supabase Auth Admin API</strong>, vui lòng thêm{' '}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> vào <code>.env.local</code>.
          </p>
        </div>
      )}

      <Card className="p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <Input
            type="text"
            placeholder="Tìm kiếm email, họ tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-80 py-2 text-xs"
          />
          <span className="text-xs text-slate-500">
            Hiển thị <strong>{filteredAccounts.length}</strong> tài khoản
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Email đăng nhập</th>
                <th className="p-3">Tên quản trị viên</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">Ngày tạo</th>
                <th className="p-3">Lần đăng nhập cuối</th>
                <th className="p-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8">
                    <Loading
                      size="md"
                      text="Đang tải danh sách tài khoản..."
                      subtext="Đang kết nối Supabase Auth Admin"
                    />
                    <div className="mt-4">
                      <TableRowsSkeleton rows={3} />
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    {requiresServiceRole
                      ? 'Chưa thể tải danh sách do chưa có SUPABASE_SERVICE_ROLE_KEY.'
                      : 'Không tìm thấy tài khoản nào.'}
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((acc) => (
                  <tr key={acc.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{acc.email}</td>
                    <td className="p-3 font-medium text-slate-800">{acc.fullName}</td>
                    <td className="p-3">
                      <Badge variant="navy" size="sm">
                        Super Admin
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-500">
                      {acc.createdAt ? formatDateVN(acc.createdAt, false) : '-'}
                    </td>
                    <td className="p-3 text-slate-500">
                      {acc.lastLoginAt ? (
                        formatDateVN(acc.lastLoginAt)
                      ) : (
                        <span className="text-slate-400">Chưa ghi nhận</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant="secondary"
                          size="xs"
                          onClick={() => setPasswordTarget(acc)}
                        >
                          Đổi mật khẩu
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="xs"
                          className="text-rose-600 hover:bg-rose-50 hover:border-rose-200"
                          onClick={() => setDeletingTarget(acc)}
                        >
                          Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <AccountCreateModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isSubmitting={createAccount.isPending}
        onCreate={async (payload) => {
          await createAccount.mutateAsync(payload);
        }}
      />

      <AccountPasswordModal
        account={passwordTarget}
        onClose={() => setPasswordTarget(null)}
        isSubmitting={changePassword.isPending}
        onSavePassword={async (accountId, newPassword) => {
          await changePassword.mutateAsync({ accountId, newPassword });
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingTarget)}
        onOpenChange={(open) => !open && setDeletingTarget(null)}
        title={`Xóa tài khoản "${deletingTarget?.email || ''}"?`}
        description="Tài khoản này sẽ bị xóa vĩnh viễn khỏi Supabase Auth và mất quyền quản trị."
        confirmLabel="Xóa tài khoản"
        isLoading={deleteAccount.isPending}
        onConfirm={async () => {
          if (!deletingTarget) return;
          await deleteAccount.mutateAsync(deletingTarget.id);
          setDeletingTarget(null);
        }}
      />
    </div>
  );
}
