'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search } from 'lucide-react';
import { useOrders } from './useOrders';
import { OrderRowCard } from './OrderRowCard';
import { OrdersDesktopTable } from './OrdersDesktopTable';
import { Badge, Card, ConfirmDialog, EmptyState, Input, Loading, Pagination, TableRowsSkeleton } from '@/components/ui';

export function OrdersTable() {
  const {
    orders,
    loading,
    page,
    setPage,
    totalPages,
    total,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    updateStatus,
    removeOrder,
  } = useOrders();

  const [deletingTarget, setDeletingTarget] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const paidCount = orders.filter((o) => o.paymentStatus === 'paid').length;
  const pendingCount = orders.filter((o) => o.paymentStatus === 'pending').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-sky-700" />
            <span>Quản Lý Đơn Hàng &amp; PayOS QR</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem lịch sử đơn hàng đặt mua qua mã QR hoặc chốt đơn trực tiếp.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="navy" size="md">
            Tổng {total} đơn
          </Badge>
          <Badge variant="emerald" size="md">
            {paidCount} đã thanh toán (trang này)
          </Badge>
          {pendingCount > 0 && (
            <Badge variant="amber" size="md">
              {pendingCount} chờ xử lý
            </Badge>
          )}
        </div>
      </Card>

      <Card className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo mã đơn, khách hàng, SĐT..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'paid', label: 'Đã thanh toán' },
            { id: 'pending', label: 'Chờ thanh toán' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id as 'all' | 'paid' | 'pending');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === tab.id
                  ? 'bg-sky-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {loading && orders.length === 0 ? (
        <Card className="p-8 space-y-6">
          <Loading
            size="md"
            text="Đang tải danh sách đơn hàng..."
            subtext="Đang kết nối dữ liệu đơn hàng và trạng thái thanh toán"
          />
          <TableRowsSkeleton rows={5} />
        </Card>
      ) : orders.length > 0 ? (
        <>
          <div className="sm:hidden space-y-3.5">
            {orders.map((order) => (
              <OrderRowCard
                key={order.id}
                order={order}
                isDeleting={isDeleting && deletingTarget === order.orderCode}
                onUpdateStatus={updateStatus}
                onRequestDelete={setDeletingTarget}
              />
            ))}
          </div>

          <OrdersDesktopTable
            orders={orders}
            deletingCode={isDeleting ? deletingTarget : null}
            onUpdateStatus={updateStatus}
            onRequestDelete={setDeletingTarget}
          />

          <Pagination page={page} totalPages={totalPages} totalItems={total} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState
          icon={ShoppingBag}
          title={
            searchQuery || statusFilter !== 'all'
              ? 'Không tìm thấy đơn hàng nào phù hợp'
              : 'Chưa có đơn hàng nào được khởi tạo'
          }
          description={
            searchQuery || statusFilter !== 'all'
              ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc trạng thái.'
              : 'Khi khách hàng đặt hàng qua QR PayOS hoặc Zalo, đơn hàng sẽ hiển thị ở đây.'
          }
        />
      )}

      <ConfirmDialog
        open={Boolean(deletingTarget)}
        onOpenChange={(open) => !open && setDeletingTarget(null)}
        title={`Xóa đơn hàng ${deletingTarget || ''}?`}
        description="Hành động này không thể hoàn tác. Chỉ xóa được các đơn chưa thanh toán."
        confirmLabel="Xóa đơn hàng"
        isLoading={isDeleting}
        onConfirm={async () => {
          if (!deletingTarget) return;
          setIsDeleting(true);
          try {
            await removeOrder(deletingTarget);
            setDeletingTarget(null);
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </div>
  );
}
