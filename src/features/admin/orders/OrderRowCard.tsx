'use client';

import React from 'react';
import { CheckCircle, Clock, Phone, MapPin, QrCode, Trash2 } from 'lucide-react';
import { Order } from '@/shared/types';
import { formatDateVN, formatVND } from '@/lib/format';
import { Badge, Button, Card } from '@/components/ui';

interface OrderRowCardProps {
  order: Order;
  isDeleting: boolean;
  onUpdateStatus: (orderCode: string, status: Order['paymentStatus']) => void;
  onRequestDelete: (orderCode: string) => void;
}

export function OrderRowCard({
  order,
  isDeleting,
  onUpdateStatus,
  onRequestDelete,
}: OrderRowCardProps) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-slate-900 text-sm">{order.orderCode}</span>
          {order.createdAt && (
            <span className="text-[10px] text-slate-400 font-medium">
              {formatDateVN(order.createdAt)}
            </span>
          )}
        </div>
        {order.paymentStatus === 'paid' ? (
          <Badge variant="emerald" size="sm">
            <CheckCircle className="w-3 h-3" />
            Đã thanh toán
          </Badge>
        ) : (
          <Badge variant="amber" size="sm">
            <Clock className="w-3 h-3" />
            Chờ thanh toán
          </Badge>
        )}
      </div>

      <div className="space-y-1 text-xs">
        <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${order.customerPhone}`}
            className="inline-flex items-center gap-1.5 text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md font-bold text-xs border border-sky-200"
          >
            <Phone className="w-3 h-3" />
            <span>{order.customerPhone}</span>
          </a>
          <Badge size="sm">
            {order.paymentMethod === 'payos_qr' ? (
              <>
                <QrCode className="w-3 h-3 text-sky-600" /> PayOS QR
              </>
            ) : (
              <>
                <Phone className="w-3 h-3 text-emerald-600" /> Zalo
              </>
            )}
          </Badge>
        </div>
        {order.customerAddress && (
          <div className="flex items-start gap-1 text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
            <span className="line-clamp-2">{order.customerAddress}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-lg p-2.5 space-y-1 text-xs border border-slate-100">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-slate-800">
            <span className="font-medium truncate pr-2">• {item.productTitle}</span>
            <span className="text-slate-500 font-semibold shrink-0">x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 block">Tổng tiền</span>
          <span className="font-black text-sky-900 text-base">{formatVND(order.totalAmount)}</span>
        </div>

        <div className="flex items-center gap-2">
          {order.paymentStatus === 'pending' ? (
            <>
              <Button
                type="button"
                size="xs"
                className="bg-emerald-600 hover:bg-emerald-700 h-9"
                onClick={() => onUpdateStatus(order.orderCode, 'paid')}
              >
                Xác nhận nhận tiền
              </Button>
              <button
                type="button"
                onClick={() => onRequestDelete(order.orderCode)}
                disabled={isDeleting}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg border border-slate-200 cursor-pointer"
                title="Xóa đơn"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Badge variant="emerald" size="md">
              Hoàn tất
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
