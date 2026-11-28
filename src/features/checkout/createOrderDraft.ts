// UNPUBLIC FEATURE — Reserved helper for future online cart/checkout rollout.
// Decoupled from StoreContext so storefront never loads global store state.
import { Order } from '@/shared/types';
import { generateEntityId, generateOrderCode } from '@/lib/ids';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export async function createOrderDraft(
  orderInput: Omit<Order, 'id' | 'createdAt' | 'orderCode'>,
): Promise<Order> {
  const newOrder: Order = {
    ...orderInput,
    id: generateEntityId('ord'),
    orderCode: generateOrderCode(),
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured()) {
    await supabase.from('orders').insert([
      {
        id: newOrder.id,
        order_code: newOrder.orderCode,
        customer_name: newOrder.customerName,
        customer_phone: newOrder.customerPhone,
        customer_address: newOrder.customerAddress,
        customer_note: newOrder.customerNote,
        total_amount: newOrder.totalAmount,
        payment_method: newOrder.paymentMethod,
        payment_status: newOrder.paymentStatus,
        items: newOrder.items,
      },
    ]);
  }

  return newOrder;
}
