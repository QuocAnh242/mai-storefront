'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/shared/types';

interface DashboardRecentOrdersProps {
  orders: Order[];
}

export function DashboardRecentOrders({ orders }: DashboardRecentOrdersProps) {
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
  );
}
