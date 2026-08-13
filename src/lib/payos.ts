import { Order } from '@/shared/types';
import { INITIAL_STORE_SETTINGS } from '@/shared/constants/initialData';

export interface PayOSPaymentLinkRequest {
  orderCode: number;
  amount: number;
  description: string;
  cancelUrl: string;
  returnUrl: string;
}

export interface PayOSPaymentResponse {
  code: string;
  desc: string;
  data?: {
    bin: string;
    accountNumber: string;
    accountName: string;
    amount: number;
    description: string;
    orderCode: number;
    currency: string;
    paymentLinkId: string;
    status: string;
    checkoutUrl: string;
    qrCode: string;
  };
}

/**
 * Generate VietQR or PayOS QR for an order
 */
export function generateOrderQrUrl(orderCode: string, totalAmount: number): {
  qrCodeUrl: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transferContent: string;
} {
  const bank = INITIAL_STORE_SETTINGS.bankName; // MBBANK
  const acc = INITIAL_STORE_SETTINGS.bankAccountNumber;
  const name = encodeURIComponent(INITIAL_STORE_SETTINGS.bankAccountName);
  const addInfo = encodeURIComponent(orderCode);
  
  // VietQR Quick Link URL standard
  const qrCodeUrl = `https://img.vietqr.io/image/${bank}-${acc}-compact2.png?amount=${totalAmount}&addInfo=${addInfo}&accountName=${name}`;

  return {
    qrCodeUrl,
    bankName: INITIAL_STORE_SETTINGS.bankName,
    accountNumber: INITIAL_STORE_SETTINGS.bankAccountNumber,
    accountName: INITIAL_STORE_SETTINGS.bankAccountName,
    transferContent: orderCode
  };
}

/**
 * Create PayOS Link (Calls PayOS API or falls back to mock/VietQR)
 */
export async function createPayOSCheckout(order: Order, baseUrl: string): Promise<{
  checkoutUrl: string;
  qrCodeUrl: string;
}> {
  const numericOrderCode = parseInt(order.orderCode.replace(/\D/g, '')) || Date.now() % 1000000;
  
  const payosClientId = process.env.NEXT_PUBLIC_PAYOS_CLIENT_ID || process.env.PAYOS_CLIENT_ID;
  const payosApiKey = process.env.NEXT_PUBLIC_PAYOS_API_KEY || process.env.PAYOS_API_KEY;

  // If real PayOS credentials exist, call PayOS endpoint via server route
  if (payosClientId && payosApiKey) {
    try {
      const res = await fetch('/api/orders/payos-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode: numericOrderCode,
          amount: order.totalAmount,
          description: `Thanh toan đơn ${order.orderCode}`.slice(0, 25),
          returnUrl: `${baseUrl}/san-pham?order_status=success&code=${order.orderCode}`,
          cancelUrl: `${baseUrl}/san-pham?order_status=cancelled&code=${order.orderCode}`,
        })
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        return {
          checkoutUrl: data.checkoutUrl,
          qrCodeUrl: data.qrCodeUrl || generateOrderQrUrl(order.orderCode, order.totalAmount).qrCodeUrl
        };
      }
    } catch (e) {
      console.warn('PayOS API call fallback to VietQR:', e);
    }
  }

  // Fallback to VietQR auto QR
  const qrData = generateOrderQrUrl(order.orderCode, order.totalAmount);
  return {
    checkoutUrl: `${baseUrl}/checkout/success?order_code=${order.orderCode}`,
    qrCodeUrl: qrData.qrCodeUrl
  };
}
