'use client';

import React from 'react';
import { StatCardSkeleton } from '@/components/ui/Loading';
import { AnalyticsData } from './types';

interface DashboardStatsCardsProps {
  analytics: AnalyticsData | null;
  loading: boolean;
  productCount: number;
  featuredCount: number;
  totalOrderRevenue: number;
  paidOrderCount: number;
}

export function DashboardStatsCards({
  analytics,
  loading,
  productCount,
  featuredCount,
  totalOrderRevenue,
  paidOrderCount,
}: DashboardStatsCardsProps) {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Today Visitors */}
      {loading && !analytics ? (
        <StatCardSkeleton title="Khách hôm nay" />
      ) : (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Khách hôm nay
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {analytics?.todayVisitors || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {analytics?.todayViews || 0} lượt xem trang
          </div>
        </div>
      )}

      {/* 2. Total Website Views */}
      {loading && !analytics ? (
        <StatCardSkeleton title="Tổng lượt xem website" />
      ) : (
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Tổng lượt xem website
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {analytics?.totalTrackedViews || 0}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Cập nhật theo thời gian thực
          </div>
        </div>
      )}

      {/* 3. Product Inventory */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Kho sản phẩm
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-1">
          {productCount}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {featuredCount} mặt hàng nổi bật
        </div>
      </div>

      {/* 4. Total Revenue */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Doanh thu đơn hàng
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-1">
          {formatVND(totalOrderRevenue)}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {paidOrderCount} đơn đã thanh toán
        </div>
      </div>
    </div>
  );
}
