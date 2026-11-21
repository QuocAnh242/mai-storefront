'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/shared/context/StoreContext';
import { useToast } from '@/shared/context/ToastContext';
import { slugify } from '@/lib/slugify';
import { getProductUrl } from '@/lib/productUrl';
import { Loading, StatCardSkeleton, ChartSkeleton } from '@/components/ui/Loading';

interface AnalyticsData {
  todayViews: number;
  todayVisitors: number;
  totalTrackedViews: number;
  trends: { date: string; label: string; views: number; visitors: number }[];
  topProducts: { id: string; title: string; views: number }[];
  requiresTableSetup?: boolean;
}

export default function AdminDashboardPage() {
  const { products, categories, orders, addProduct } = useStore();
  const { showToast } = useToast();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Quick Add Product Modal state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPrice, setQuickPrice] = useState<number>(0);
  const [quickCategory, setQuickCategory] = useState(categories[0]?.id || '');
  const [quickUnit, setQuickUnit] = useState('Kg');
  const [quickImage, setQuickImage] = useState('');

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setAnalytics(json.data);
        }
      }
    } catch (err) {
      console.warn('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
  const totalOrderRevenue = paidOrders.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

  // Focus on top 4 products only for clarity and clean design
  const mergedTopProducts = (analytics?.topProducts && analytics.topProducts.length > 0
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
        image: matched?.images?.[0] || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=300',
        views: tp.views,
        url: getProductUrl(productObj),
      };
    });

  // Chart data calculations
  const trends = analytics?.trends && analytics.trends.length > 0
    ? analytics.trends
    : [
        { label: '09/11', date: '', views: 0, visitors: 0 },
        { label: '10/11', date: '', views: 0, visitors: 0 },
        { label: '11/11', date: '', views: 0, visitors: 0 },
        { label: '12/11', date: '', views: 0, visitors: 0 },
        { label: '13/11', date: '', views: 0, visitors: 0 },
        { label: '14/11', date: '', views: 0, visitors: 0 },
        { label: '15/11', date: '', views: 0, visitors: 0 },
      ];

  const rawMax = Math.max(1, ...trends.map((t) => Math.max(t.views, t.visitors)));
  // Round max up to friendly interval
  const chartMax = rawMax <= 5 ? 5 : rawMax <= 10 ? 10 : Math.ceil(rawMax / 10) * 10;

  // SVG Chart Dimensions
  const svgWidth = 560;
  const svgHeight = 200;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;
  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  const points = trends.map((t, idx) => {
    const x = padLeft + (idx / Math.max(1, trends.length - 1)) * chartWidth;
    const yViews = padTop + chartHeight - (t.views / chartMax) * chartHeight;
    const yVisitors = padTop + chartHeight - (t.visitors / chartMax) * chartHeight;
    return { x, yViews, yVisitors, ...t };
  });

  const viewsPath = points
    .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.yViews}` : `L ${p.x} ${p.yViews}`))
    .join(' ');

  const viewsAreaPath = points.length > 0
    ? `${viewsPath} L ${points[points.length - 1].x} ${padTop + chartHeight} L ${points[0].x} ${padTop + chartHeight} Z`
    : '';

  const visitorsPath = points
    .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.yVisitors}` : `L ${p.x} ${p.yVisitors}`))
    .join(' ');

  const handleCreateQuickProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || quickPrice <= 0) {
      showToast('Vui lòng nhập tên và giá bán hợp lệ', 'error');
      return;
    }

    const selectedCatObj = categories.find((c) => c.id === quickCategory) || categories[0];
    const finalImage = quickImage.trim() || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80';

    setIsQuickAdding(true);
    const res = await addProduct({
      title: quickTitle.trim(),
      slug: slugify(quickTitle.trim()),
      price: Number(quickPrice),
      unit: quickUnit.trim() || 'Kg',
      description: '',
      categoryId: selectedCatObj ? selectedCatObj.id : 'cat-khac',
      categoryName: selectedCatObj ? selectedCatObj.name : 'Vật tư khác',
      images: [finalImage],
      isFeatured: false,
      displayOrder: 99,
      inStock: true,
    });
    setIsQuickAdding(false);

    if (res.success) {
      setQuickTitle('');
      setQuickPrice(0);
      setQuickUnit('Kg');
      setQuickImage('');
      setIsQuickAddOpen(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Header - Clean, Flat, Zero Icons */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Thống kê lưu lượng truy cập và mức độ quan tâm của khách hàng
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAnalytics}
            disabled={loading}
            className="px-3.5 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Đang tải...</span>
              </>
            ) : (
              'Làm mới'
            )}
          </button>

          <button
            onClick={() => setIsQuickAddOpen(true)}
            className="px-3.5 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            + Tạo nhanh sản phẩm
          </button>

          <Link
            href="/"
            target="_blank"
            className="px-3.5 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
          >
            Xem cửa hàng
          </Link>
        </div>
      </div>

      {analytics?.requiresTableSetup && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="font-semibold text-amber-950">Chưa tạo bảng thống kê trên Supabase</div>
            <div className="text-xs text-amber-800 mt-0.5">
              Để lưu trữ lượt xem vĩnh viễn trên Supabase thay vì bộ nhớ tạm thời, vui lòng mở <strong>Supabase Dashboard &gt; SQL Editor</strong> và chạy tệp <code className="font-mono bg-amber-100 text-amber-900 px-1 py-0.5 rounded">supabase/setup_analytics.sql</code>.
            </div>
          </div>
          <div className="flex-shrink-0">
            <span className="inline-block text-[11px] font-semibold bg-amber-200 text-amber-900 px-2.5 py-1 rounded">
              supabase/setup_analytics.sql
            </span>
          </div>
        </div>
      )}

      {/* 2. KPI Cards - Clean & Flat Numbers, Zero Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Kho sản phẩm
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {products.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {products.filter((p) => p.isFeatured).length} mặt hàng nổi bật
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Doanh thu đơn hàng
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {formatVND(totalOrderRevenue)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {paidOrders.length} đơn đã thanh toán
          </div>
        </div>
      </div>

      {/* 3. Main Analytics Section: Modern Visual Area Chart & Clean Top 4 Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Intuitive SVG Visitor Area Chart (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                  Lưu lượng truy cập 7 ngày
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Biểu đồ lượt xem trang và số khách theo ngày</p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-sky-600 rounded-full inline-block" />
                  <span className="text-slate-600 font-medium">Lượt xem</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-slate-800 rounded-full inline-block" />
                  <span className="text-slate-600 font-medium">Khách</span>
                </div>
              </div>
            </div>

            {loading && !analytics ? (
              <div className="pt-4">
                <ChartSkeleton />
              </div>
            ) : (
              /* SVG Visual Chart */
              <div className="pt-4 relative">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-48 overflow-visible"
              >
                <defs>
                  {/* Sky blue soft gradient for views */}
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Lines */}
                <line
                  x1={padLeft}
                  y1={padTop}
                  x2={svgWidth - padRight}
                  y2={padTop}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 8}
                  y={padTop + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {chartMax}
                </text>

                <line
                  x1={padLeft}
                  y1={padTop + chartHeight / 2}
                  x2={svgWidth - padRight}
                  y2={padTop + chartHeight / 2}
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 8}
                  y={padTop + chartHeight / 2 + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  {Math.round(chartMax / 2)}
                </text>

                <line
                  x1={padLeft}
                  y1={padTop + chartHeight}
                  x2={svgWidth - padRight}
                  y2={padTop + chartHeight}
                  stroke="#cbd5e1"
                />
                <text
                  x={padLeft - 8}
                  y={padTop + chartHeight + 4}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono"
                >
                  0
                </text>

                {/* Area Fill for Views */}
                {viewsAreaPath && (
                  <path d={viewsAreaPath} fill="url(#viewsGradient)" />
                )}

                {/* Line Path for Views (Sky Blue) */}
                <path
                  d={viewsPath}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Line Path for Visitors (Slate Dark) */}
                <path
                  d={visitorsPath}
                  fill="none"
                  stroke="#0f172a"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points & X-Labels */}
                {points.map((p, idx) => {
                  const isHovered = hoveredPoint === idx;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(idx)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      {/* Interactive hit area */}
                      <rect
                        x={p.x - 18}
                        y={padTop}
                        width={36}
                        height={chartHeight}
                        fill="transparent"
                      />

                      {/* Views dot */}
                      <circle
                        cx={p.x}
                        cy={p.yViews}
                        r={isHovered ? 5 : 3.5}
                        fill="#0284c7"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                      />

                      {/* Visitors dot */}
                      <circle
                        cx={p.x}
                        cy={p.yVisitors}
                        r={isHovered ? 4.5 : 3}
                        fill="#0f172a"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        className="transition-all"
                      />

                      {/* X-Axis Day Label */}
                      <text
                        x={p.x}
                        y={svgHeight - 8}
                        textAnchor="middle"
                        className={`text-[11px] font-medium transition-colors ${
                          isHovered ? 'fill-sky-800 font-bold' : 'fill-slate-500'
                        }`}
                      >
                        {p.label}
                      </text>

                      {/* Hover Tooltip */}
                      {isHovered && (
                        <g>
                          <rect
                            x={Math.min(Math.max(padLeft, p.x - 55), svgWidth - padRight - 110)}
                            y={Math.max(5, p.yViews - 45)}
                            width={110}
                            height={34}
                            rx={4}
                            fill="#0f172a"
                            className="shadow-md"
                          />
                          <text
                            x={Math.min(Math.max(padLeft, p.x - 55), svgWidth - padRight - 110) + 55}
                            y={Math.max(5, p.yViews - 45) + 14}
                            textAnchor="middle"
                            fill="#ffffff"
                            className="text-[10px] font-bold"
                          >
                            {p.label}: {p.views} lượt xem
                          </text>
                          <text
                            x={Math.min(Math.max(padLeft, p.x - 55), svgWidth - padRight - 110) + 55}
                            y={Math.max(5, p.yViews - 45) + 27}
                            textAnchor="middle"
                            fill="#94a3b8"
                            className="text-[9px]"
                          >
                            {p.visitors} khách truy cập
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 text-xs border-t border-slate-100 mt-2">
            <div>
              <span className="text-slate-500 block">Lượt xem hôm nay:</span>
              <strong className="text-slate-900 font-bold text-sm">
                {analytics?.todayViews || 0} lượt
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block">Khách hôm nay:</span>
              <strong className="text-slate-900 font-bold text-sm">
                {analytics?.todayVisitors || 0} người
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Top 4 Products - Focused, Clean, Beautiful (6 cols) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-lg border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Top 4 sản phẩm xem nhiều nhất
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Mặt hàng được khách hàng quan tâm hàng đầu</p>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-sky-700 hover:underline"
            >
              Xem tất cả kho ({products.length})
            </Link>
          </div>

          {/* 4 Focused Clean Cards */}
          {loading && !analytics ? (
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 animate-pulse"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-300 w-5 text-center shrink-0">
                      0{idx + 1}
                    </span>
                    <div className="w-11 h-11 bg-slate-200 rounded-md shrink-0" />
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-6 bg-slate-200 rounded w-12 shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {mergedTopProducts.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 transition-colors"
                >
                  {/* Left: Rank + Image + Title */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-400 w-5 text-center shrink-0">
                      0{item.rank}
                    </span>

                    <img
                      src={item.image}
                      alt=""
                      className="w-11 h-11 object-cover rounded-md border border-slate-200 shrink-0 bg-white"
                    />

                    <div className="min-w-0">
                      <Link
                        href={item.url}
                        target="_blank"
                        className="font-bold text-slate-900 text-xs sm:text-sm hover:text-sky-700 block truncate"
                      >
                        {item.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] text-slate-600 font-medium">
                          {item.categoryName}
                        </span>
                        <span className="font-bold text-sky-900 text-xs">
                          {item.price > 0 ? formatVND(item.price) : 'Liên hệ'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: View count + View link */}
                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <div>
                      <span className="text-sm sm:text-base font-black text-slate-900 block leading-tight">
                        {item.views}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                        Lượt xem
                      </span>
                    </div>

                    <Link
                      href={item.url}
                      target="_blank"
                      className="text-xs text-sky-700 hover:text-sky-900 font-semibold px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-300 transition-colors"
                    >
                      Xem
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4. Bottom Section: Đơn hàng ở dưới cùng */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Đơn hàng gần đây
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Danh sách đơn hàng phát sinh từ cửa hàng</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-sky-700 hover:underline"
          >
            Quản lý tất cả đơn hàng ({orders.length})
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            Chưa có đơn hàng nào được ghi nhận.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Mã đơn</th>
                  <th className="p-2.5">Khách hàng</th>
                  <th className="p-2.5">Số điện thoại</th>
                  <th className="p-2.5">Số tiền</th>
                  <th className="p-2.5">Trạng thái</th>
                  <th className="p-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold font-mono text-slate-800">
                      {order.orderCode}
                    </td>
                    <td className="p-2.5 font-medium text-slate-800">
                      {order.customerName || 'Khách vãng lai'}
                    </td>
                    <td className="p-2.5 text-slate-600">
                      {order.customerPhone || '-'}
                    </td>
                    <td className="p-2.5 font-bold text-slate-900">
                      {formatVND(order.totalAmount)}
                    </td>
                    <td className="p-2.5">
                      {order.paymentStatus === 'paid' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-800">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                          Chờ thanh toán
                        </span>
                      )}
                    </td>
                    <td className="p-2.5 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-sky-700 hover:underline font-semibold"
                      >
                        Chi tiết
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Quick Add Product Modal */}
      {isQuickAddOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
          onClick={() => setIsQuickAddOpen(false)}
        >
          <div
            className="bg-white rounded-lg max-w-md w-full overflow-hidden border border-slate-300 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">
                Tạo nhanh sản phẩm
              </h3>
              <button
                type="button"
                onClick={() => setIsQuickAddOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-sm px-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuickProduct} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Ví dụ: Bột Kim Tuyến Vàng 0.2mm"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Giá bán (VNĐ) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="150000"
                    value={quickPrice || ''}
                    onChange={(e) => setQuickPrice(Number(e.target.value))}
                    className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quy cách *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Kg / Hũ / Bao"
                    value={quickUnit}
                    onChange={(e) => setQuickUnit(e.target.value)}
                    className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Danh mục chính *
                </label>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Link ảnh sản phẩm (Tùy chọn)
                </label>
                <input
                  type="text"
                  placeholder="https://... hoặc để trống dùng ảnh mẫu"
                  value={quickImage}
                  onChange={(e) => setQuickImage(e.target.value)}
                  className="w-full border border-slate-300 text-slate-900 text-xs rounded p-2 outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  disabled={isQuickAdding}
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100 disabled:opacity-50 text-xs font-medium cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isQuickAdding}
                  className="px-4 py-1.5 rounded bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white text-xs font-semibold cursor-pointer"
                >
                  {isQuickAdding ? 'Đang lưu...' : 'Lưu sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
