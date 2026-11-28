'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAdminProducts } from '@/features/admin/hooks/useAdminProducts';
import { useAdminCategories } from '@/features/admin/hooks/useAdminCategories';
import { useOrders } from '@/features/admin/orders/useOrders';
import { getProductUrl } from '@/lib/productUrl';
import { AnalyticsData } from './types';
import { DashboardStatsCards } from './DashboardStatsCards';
import { DashboardRevenueChart } from './DashboardRevenueChart';
import { DashboardTopProducts } from './DashboardTopProducts';
import { DashboardRecentOrders } from './DashboardRecentOrders';
import { DashboardQuickAddModal } from './DashboardQuickAddModal';
import { Button, buttonVariants } from '@/components/ui';

export function AdminDashboardView() {
  const { products, createProduct } = useAdminProducts({ pageSize: 'all' });
  const { categories } = useAdminCategories();
  const { orders } = useOrders();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/analytics');
        if (res.ok) {
          const json = await res.json();
          if (json.success) setAnalytics(json.data);
        }
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalOrderRevenue = paidOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  const topProducts = (
    analytics?.topProducts && analytics.topProducts.length > 0
      ? analytics.topProducts
      : products.slice(0, 4).map((p) => ({ id: p.id, title: p.title, views: 0 }))
  )
    .slice(0, 4)
    .map((tp, idx) => {
      const matched = products.find((p) => p.id === tp.id || p.slug === tp.id);
      const productObj = matched || { id: tp.id, slug: tp.id };
      return {
        rank: idx + 1,
        id: tp.id,
        title: matched?.title || tp.title || 'Sản phẩm',
        categoryName: matched?.categoryName || 'Vật tư',
        price: matched?.price || 0,
        image:
          matched?.images?.[0] ||
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300',
        views: tp.views,
        url: getProductUrl(productObj),
      };
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Tổng quan quản trị</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi lưu lượng khách truy cập, doanh thu và mặt hàng bán chạy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsQuickAddOpen(true)}>
            + Tạo nhanh sản phẩm
          </Button>
          <Link
            href="/"
            target="_blank"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Xem cửa hàng
          </Link>
        </div>
      </div>

      {analytics?.requiresTableSetup && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-amber-950">Chưa tạo bảng thống kê trên Supabase</div>
            <div className="text-xs text-amber-800 mt-0.5">
              Vui lòng chạy migration thống kê trong <code className="font-mono bg-amber-100 px-1 rounded">supabase/migrations/</code>.
            </div>
          </div>
        </div>
      )}

      <DashboardStatsCards
        analytics={analytics}
        loading={loading}
        productCount={products.length}
        featuredCount={products.filter((p) => p.isFeatured).length}
        totalOrderRevenue={totalOrderRevenue}
        paidOrderCount={paidOrders.length}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <DashboardRevenueChart analytics={analytics} loading={loading} />
        </div>
        <div className="lg:col-span-6">
          <DashboardTopProducts
            topProducts={topProducts}
            loading={loading && !analytics}
            totalProductsCount={products.length}
          />
        </div>
      </div>

      <DashboardRecentOrders orders={orders} />

      <DashboardQuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        categories={categories}
        onAddProduct={async (product) => {
          try {
            await createProduct.mutateAsync(product);
            return { success: true };
          } catch {
            return { success: false };
          }
        }}
      />
    </div>
  );
}
