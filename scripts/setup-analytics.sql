-- ==============================================================================
-- MAI KIM TUYẾN - ANALYTICS & VISITOR TRACKING TABLES
-- Chạy đoạn script này trong Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Bảng lưu lượt xem trang (Pageviews & Visitors)
CREATE TABLE IF NOT EXISTS site_pageviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  visitor_id text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Index tăng tốc truy vấn theo ngày và đường dẫn
CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON site_pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON site_pageviews (path);

-- 2. Bảng lưu lượt xem sản phẩm (Product Views)
CREATE TABLE IF NOT EXISTS product_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  product_title text,
  visitor_id text,
  created_at timestamptz DEFAULT now()
);

-- Index tăng tốc truy vấn theo mã sản phẩm và ngày
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views (product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views (created_at DESC);

-- 3. Cấu hình bảo mật RLS (Row Level Security)
ALTER TABLE site_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Cho phép Server & Anon API gửi lượt xem (INSERT)
CREATE POLICY "Cho phép ghi nhận pageview"
  ON site_pageviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cho phép ghi nhận product view"
  ON product_views FOR INSERT
  WITH CHECK (true);

-- Cho phép đọc thống kê (SELECT)
CREATE POLICY "Cho phép đọc thống kê pageview"
  ON site_pageviews FOR SELECT
  USING (true);

CREATE POLICY "Cho phép đọc thống kê product view"
  ON product_views FOR SELECT
  USING (true);

