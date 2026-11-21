-- ==============================================================================
-- Migration 0003: Reorder products atomic RPC and performance indexes
-- ==============================================================================

-- 1. Atomic reorder function for products
CREATE OR REPLACE FUNCTION reorder_products(product_ids TEXT[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  idx INT;
BEGIN
  IF product_ids IS NULL OR array_length(product_ids, 1) IS NULL THEN
    RETURN;
  END IF;

  FOR idx IN 1..array_length(product_ids, 1) LOOP
    UPDATE products
    SET display_order = idx
    WHERE id = product_ids[idx];
  END LOOP;
END;
$$;

-- 2. Performance Indexes for high-volume admin queries & storefront filters
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_order_code ON orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs(is_published);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_reviews_is_approved ON product_reviews(is_approved);
