-- Fix: Allow anon key to update order payment_status
-- (needed for admin panel updateOrderStatus to work without auth session)
-- Run this in Supabase SQL Editor

-- Allow public update on orders (for admin panel using anon key)
CREATE POLICY "Public Update Orders" ON orders
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow deleting pending orders from admin panel (anon key)
CREATE POLICY "Public Delete Orders" ON orders
  FOR DELETE USING (true);
