'use client';

import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/shared/types';
import { useToast } from '@/shared/context/ToastContext';

export function useOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(20);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending'>('all');

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (!res.ok) {
        showToast('Không thể tải danh sách đơn hàng', 'error');
        return;
      }
      const json = await res.json();
      if (json.success) {
        // Map DB snake_case to Order model if necessary
        const mapped: Order[] = (json.data || []).map((o: any) => ({
          id: o.id,
          orderCode: o.order_code || o.orderCode,
          customerName: o.customer_name || o.customerName,
          customerPhone: o.customer_phone || o.customerPhone,
          customerAddress: o.customer_address || o.customerAddress,
          notes: o.notes,
          totalAmount: Number(o.total_amount || o.totalAmount) || 0,
          paymentStatus: o.payment_status || o.paymentStatus,
          paymentMethod: o.payment_method || o.paymentMethod,
          shippingMethod: o.shipping_method || o.shippingMethod,
          items: Array.isArray(o.items) ? o.items : [],
          createdAt: o.created_at || o.createdAt,
          paidAt: o.paid_at || o.paidAt,
        }));
        setOrders(mapped);
        setTotal(json.total || mapped.length);
        setTotalPages(json.totalPages || 1);
      }
    } catch (err: any) {
      console.warn('[useOrders error]:', err);
      showToast(err.message || 'Lỗi kết nối tải đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, searchQuery, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderCode: string, status: Order['paymentStatus']) => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, status }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast('Cập nhật trạng thái thành công', 'success');
        setOrders((prev) =>
          prev.map((o) => (o.orderCode === orderCode ? { ...o, paymentStatus: status } : o)),
        );
      } else {
        showToast(json.message || 'Lỗi cập nhật trạng thái', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Lỗi kết nối', 'error');
    }
  };

  const removeOrder = async (orderCode: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/admin/orders?orderCode=${encodeURIComponent(orderCode)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setOrders((prev) => prev.filter((o) => o.orderCode !== orderCode));
        setTotal((prev) => Math.max(0, prev - 1));
        return { success: true, message: json.message || 'Đã xóa đơn hàng' };
      }
      return { success: false, message: json.message || 'Không thể xóa đơn hàng' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Lỗi kết nối' };
    }
  };

  return {
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
    refetch: fetchOrders,
  };
}
