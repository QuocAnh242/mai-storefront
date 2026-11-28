'use client';

import React from 'react';
import { CheckCircle, Clock, Phone, QrCode, Trash2 } from 'lucide-react';
import { Order } from '@/shared/types';
import { formatDateVN, formatVND } from '@/lib/format';
import { Badge, Button, Card } from '@/components/ui';

interface OrdersDesktopTableProps {
  orders: Order[];
  deletingCode: string | null;
  onUpdateStatus: (orderCode: string, status: Order['paymentStatus']) => void;
  onRequestDelete: (orderCode: string) => void;
}

export function OrdersDesktopTable({
  orders,
  deletingCode,
  onUpdateStatus,
  onRequestDelete,
}: OrdersDesktopTableProps) {
  return (
    <Card className="hidden sm:block overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-900 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="p-3.5">Mã đơn</th>
              <th className="p-3.5">Khách hàng</th>
              <th className="p-3.5">Sản phẩm</th>
              <th className="p-3.5">Tổng tiền</th>
              <th className="p-3.5">Hình thức</th>
              <th className="p-3.5">Trạng thái</th>
              <th className="p-3.5 text-right">Đổi trạng thái</th>
              <th className="p-3.5 text-center">Xóa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-mono font-bold text-slate-900">
                  {order.orderCode}
                  {order.createdAt && (
                    <span className="block text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                      {formatDateVN(order.createdAt)}
                    </span>
                  )}
                </td>
                <td className="p-3.5">
                  <strong className="block text-slate-900">{order.customerName}</strong>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="inline-flex items-center gap-1 mt-0.5 hover:underline text-sky-700 font-semibold"
                  >
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </a>
                </td>
                <td className="p-3.5">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-xs">
                      <span className="font-semibold text-slate-800">{item.productTitle}</span>
                      <span className="text-slate-400"> (x{item.quantity})</span>
                    </div>
                  ))}
                </td>
                <td className="p-3.5 font-black text-sky-800 text-sm">
                  {formatVND(order.totalAmount)}
                </td>
                <td className="p-3.5">
                  {order.paymentMethod === 'payos_qr' ? (
                    <Badge variant="navy" size="sm">
                      <QrCode className="w-3 h-3" /> PayOS QR
                    </Badge>
                  ) : (
                    <Badge variant="emerald" size="sm">
                      <Phone className="w-3 h-3" /> Zalo / SĐT
                    </Badge>
                  )}
                </td>
                <td className="p-3.5">
                  {order.paymentStatus === 'paid' ? (
                    <Badge variant="emerald" size="md">
                      <CheckCircle className="w-3.5 h-3.5" /> Đã thanh toán
                    </Badge>
                  ) : (
                    <Badge variant="amber" size="md">
                      <Clock className="w-3.5 h-3.5" /> Chờ thanh toán
                    </Badge>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  {order.paymentStatus === 'pending' ? (
                    <Button
                      type="button"
                      size="xs"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => onUpdateStatus(order.orderCode, 'paid')}
                    >
                      Xác nhận đã nhận tiền
                    </Button>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Hoàn tất</span>
                  )}
                </td>
                <td className="p-3.5 text-center">
                  {order.paymentStatus === 'pending' ? (
                    <button
                      type="button"
                      onClick={() => onRequestDelete(order.orderCode)}
                      disabled={deletingCode === order.orderCode}
                      title="Xóa đơn hàng chưa thanh toán"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="text-slate-200 inline-block p-1.5" title="Không thể xóa đơn đã thanh toán">
                      <Trash2 className="w-4 h-4" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
