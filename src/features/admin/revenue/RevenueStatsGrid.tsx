'use client';

import React from 'react';
import { DollarSign, ShoppingBag, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { formatVND } from '@/lib/format';
import { Card, StatCardSkeleton } from '@/components/ui';

interface RevenueStatsGridProps {
  loading: boolean;
  selectedMonth: string;
  totalMonthlyRevenue: number;
  onlineRevenue: number;
  paidOrdersCount: number;
  manualRevenueTotal: number;
  manualEntriesCount: number;
  totalTransactionsCount: number;
}

export function RevenueStatsGrid({
  loading,
  selectedMonth,
  totalMonthlyRevenue,
  onlineRevenue,
  paidOrdersCount,
  manualRevenueTotal,
  manualEntriesCount,
  totalTransactionsCount,
}: RevenueStatsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton title={`Tổng Doanh Thu (${selectedMonth})`} />
        <StatCardSkeleton title="Doanh Thu Đơn Web" />
        <StatCardSkeleton title="Doanh Thu Bán Tại Kho" />
        <StatCardSkeleton title="Tổng Số Giao Dịch" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-sky-950 text-white p-5 rounded-xl border border-sky-900 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
            Tổng Doanh Thu ({selectedMonth})
          </span>
          <div className="w-9 h-9 rounded-lg bg-sky-800 text-amber-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-black text-white block tracking-tight">
            {formatVND(totalMonthlyRevenue)}
          </span>
          <span className="text-[11px] text-sky-300 mt-1 block">
            Bao gồm Web online + Thu tiền tại kho
          </span>
        </div>
      </div>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Doanh Thu Đơn Web
          </span>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-black text-emerald-600 block tracking-tight">
            {formatVND(onlineRevenue)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {paidOrdersCount} đơn đã xác nhận thanh toán
          </span>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Thu Tay / Kho Hàng
          </span>
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-black text-sky-950 block tracking-tight">
            {formatVND(manualRevenueTotal)}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {manualEntriesCount} giao dịch nhập tay
          </span>
        </div>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tổng Số Giao Dịch
          </span>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
        </div>
        <div>
          <span className="text-2xl font-black text-slate-900 block tracking-tight">
            {totalTransactionsCount}{' '}
            <span className="text-sm font-normal text-slate-500">lượt</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">Tháng {selectedMonth}</span>
        </div>
      </Card>
    </div>
  );
}
