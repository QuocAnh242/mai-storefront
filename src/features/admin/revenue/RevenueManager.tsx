'use client';

import React, { useState } from 'react';
import { TrendingUp, Plus, Calendar, DollarSign, ShoppingBag, Trash2, CheckCircle, Clock } from 'lucide-react';
import { formatVND } from '@/lib/format';
import { Button, Card, ConfirmDialog, Loading, TableRowsSkeleton } from '@/components/ui';
import { useAdminRevenue } from '../hooks/useAdminRevenue';
import { RevenueStatsGrid } from './RevenueStatsGrid';
import { RevenueManualModal } from './RevenueManualModal';

export function RevenueManager() {
  const { manualRevenues, orders, isLoading, createRevenue, deleteRevenue } = useAdminRevenue();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const monthOrders = orders.filter((o) => o.createdAt?.startsWith(selectedMonth));
  const paidOrders = monthOrders.filter((o) => o.paymentStatus === 'paid');
  const onlineRevenue = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const monthManualRevenues = manualRevenues.filter((r) => r.date.startsWith(selectedMonth));
  const manualRevenueTotal = monthManualRevenues.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 uppercase flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-sky-700" />
            <span>Báo Cáo &amp; Thống Kê Doanh Thu</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý doanh thu tự động từ website &amp; thu tiền trực tiếp tại cửa hàng
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            <Calendar className="w-4 h-4 text-sky-700" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
            />
          </div>

          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span>Ghi Nhận Doanh Thu</span>
          </Button>
        </div>
      </Card>

      <RevenueStatsGrid
        loading={isLoading}
        selectedMonth={selectedMonth}
        totalMonthlyRevenue={onlineRevenue + manualRevenueTotal}
        onlineRevenue={onlineRevenue}
        paidOrdersCount={paidOrders.length}
        manualRevenueTotal={manualRevenueTotal}
        manualEntriesCount={monthManualRevenues.length}
        totalTransactionsCount={monthOrders.length + monthManualRevenues.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-sky-700" />
              <span>Nhật Ký Thu Tiền Tại Kho</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-bold text-sky-700 hover:underline cursor-pointer"
            >
              + Thêm mới
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4 py-4">
              <Loading size="sm" text="Đang tải nhật ký thu tiền..." />
              <TableRowsSkeleton rows={4} />
            </div>
          ) : monthManualRevenues.length > 0 ? (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {monthManualRevenues.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <span className="font-bold text-slate-900 text-sm block truncate">
                      {rev.source}
                    </span>
                    {rev.note && <p className="text-xs text-slate-500">{rev.note}</p>}
                    <span className="text-[11px] font-medium text-slate-400 block">
                      Ngày: {rev.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-black text-sky-950 text-sm">{formatVND(rev.amount)}</span>
                    <button
                      type="button"
                      onClick={() => setDeletingId(rev.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Xóa bản ghi này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">
                Chưa có thu tiền trực tiếp nào trong tháng {selectedMonth}.
              </p>
            </div>
          )}
        </Card>

        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-slate-900 text-sm uppercase flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Đơn Hàng Website (Tháng {selectedMonth})</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">{monthOrders.length} đơn</span>
          </div>

          {monthOrders.length > 0 ? (
            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
              {monthOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {order.customerName}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        #{order.orderCode}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 block">{order.customerPhone}</span>
                    <span className="text-[11px] text-slate-400 block">
                      Ngày đặt: {order.createdAt?.split('T')[0]}
                    </span>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <span className="font-black text-emerald-700 text-sm block">
                      {formatVND(order.totalAmount)}
                    </span>
                    {order.paymentStatus === 'paid' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Đã thanh toán</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        <Clock className="w-3 h-3" />
                        <span>Chờ thanh toán</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-xs text-slate-400">
                Chưa có đơn hàng website nào trong tháng {selectedMonth}.
              </p>
            </div>
          )}
        </Card>
      </div>

      <RevenueManualModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        isSubmitting={createRevenue.isPending}
        onSubmitRevenue={async (payload) => {
          await createRevenue.mutateAsync(payload);
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingId)}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Xóa bản ghi doanh thu?"
        description="Hành động này sẽ xóa vĩnh viễn khoản thu nhập tay khỏi báo cáo tháng."
        confirmLabel="Xóa bản ghi"
        isLoading={deleteRevenue.isPending}
        onConfirm={async () => {
          if (!deletingId) return;
          await deleteRevenue.mutateAsync(deletingId);
          setDeletingId(null);
        }}
      />
    </div>
  );
}
