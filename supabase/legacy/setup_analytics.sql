-- 1. Pageviews & visitors table
CREATE TABLE IF NOT EXISTS site_pageviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  visitor_id text,
  user_agent text,
  referrer text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for 7-day chart queries and per-path stats
CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON site_pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON site_pageviews (path);
CREATE INDEX IF NOT EXISTS idx_pageviews_visitor_id ON site_pageviews (visitor_id);

-- 2. Product views table
CREATE TABLE IF NOT EXISTS product_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id text NOT NULL,
  product_title text,
  visitor_id text,
  created_at timestamptz DEFAULT now()
);

-- Indexes for top-viewed product queries
CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON product_views (product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON product_views (created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE site_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;

-- Allow server and public visitors to record views (INSERT)
CREATE POLICY "Cho phép ghi nhận pageview"
  ON site_pageviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Cho phép ghi nhận product view"
  ON product_views FOR INSERT
  WITH CHECK (true);

-- Allow admins to read analytics data (SELECT)
CREATE POLICY "Cho phép đọc thống kê pageview"
  ON site_pageviews FOR SELECT
  USING (true);

CREATE POLICY "Cho phép đọc thống kê product view"
  ON product_views FOR SELECT
  USING (true);
