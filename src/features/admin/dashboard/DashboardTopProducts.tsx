'use client';

import React from 'react';
import Link from 'next/link';

interface TopProductItem {
  rank: number;
  id: string;
  title: string;
  categoryName: string;
  price: number;
  image: string;
  views: number;
  url: string;
}

interface DashboardTopProductsProps {
  topProducts: TopProductItem[];
  loading: boolean;
  totalProductsCount: number;
}

export function DashboardTopProducts({
  topProducts,
  loading,
  totalProductsCount,
}: DashboardTopProductsProps) {
  const formatVND = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-4">
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
          Xem tất cả kho ({totalProductsCount})
        </Link>
      </div>

      {loading ? (
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
          {topProducts.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 transition-colors"
            >
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
  );
}
