-- ==============================================================================
-- BẢNG LƯU TRỮ VÀ DỌN DẸP LƯỢNG TRUY CẬP (ANALYTICS RETENTION & ARCHIVE)
-- ==============================================================================

-- 1. Bảng lưu trữ tổng lượt xem tích lũy khi dọn dẹp sau 30 ngày
-- Giúp tổng lượt truy cập toàn thời gian của shop KHÔNG bị giảm khi xóa dữ liệu cũ
CREATE TABLE IF NOT EXISTS public.analytics_archive (
  id TEXT PRIMARY KEY DEFAULT 'global',
  archived_pageviews BIGINT DEFAULT 0,
  archived_product_views BIGINT DEFAULT 0,
  last_cleaned_at TIMESTAMPTZ,
  last_notified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Khởi tạo bản ghi mặc định nếu chưa có
INSERT INTO public.analytics_archive (id, archived_pageviews, archived_product_views)
VALUES ('global', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Bật RLS
ALTER TABLE public.analytics_archive ENABLE ROW LEVEL SECURITY;

-- Cho phép Admin và hệ thống Service Role đọc/ghi
DROP POLICY IF EXISTS "Admin Manage Analytics Archive" ON public.analytics_archive;
CREATE POLICY "Admin Manage Analytics Archive"
  ON public.analytics_archive FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Analytics Archive" ON public.analytics_archive;
CREATE POLICY "Public Read Analytics Archive"
  ON public.analytics_archive FOR SELECT
  USING (true);
