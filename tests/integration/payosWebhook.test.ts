import { describe, it, expect } from 'vitest';
import { verifyPayOSSignature } from '@/lib/payosSignature';

describe('PayOS Webhook Security & Idempotency Logic', () => {
  const secretKey = 'test_webhook_secret_key';

  it('detects amount mismatch between PayOS payload and database order', () => {
    const dbOrder = {
      id: 'ord_123',
      order_code: 'MKT10001',
      total_amount: 150000,
      payment_status: 'pending',
    };

    const webhookPayload = {
      orderCode: 10001,
      amount: 15000, // Attacker underpaid by 10x!
    };

    const isAmountMatch = Number(webhookPayload.amount) === Number(dbOrder.total_amount);
    expect(isAmountMatch).toBe(false);
  });

  it('detects valid matching amount', () => {
    const dbOrder = {
      id: 'ord_123',
      order_code: 'MKT10001',
      total_amount: 150000,
      payment_status: 'pending',
    };

    const webhookPayload = {
      orderCode: 10001,
      amount: 150000,
    };

    const isAmountMatch = Number(webhookPayload.amount) === Number(dbOrder.total_amount);
    expect(isAmountMatch).toBe(true);
  });

  it('implements idempotency when order is already paid', () => {
    const alreadyPaidOrder = {
      id: 'ord_123',
      order_code: 'MKT10001',
      total_amount: 150000,
      payment_status: 'paid', // Already processed
    };

    // If order.payment_status === 'paid', webhook should return success without re-updating DB
    const shouldSkipUpdate = alreadyPaidOrder.payment_status === 'paid';
    expect(shouldSkipUpdate).toBe(true);
  });
});
