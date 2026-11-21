-- ==============================================================================
-- PRODUCT REVIEWS TABLE & ADMIN MANAGEMENT - MAI KIM TUYEN
-- ==============================================================================

-- 1. Create reviews table if missing
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  reply_content TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add columns for pre-existing tables
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS reply_content TEXT;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS replied_at TIMESTAMPTZ;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT TRUE;

-- 2. Query optimization indexes
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.product_reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.product_reviews (rating);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Public read access for approved reviews
DROP POLICY IF EXISTS "Public Read Product Reviews" ON public.product_reviews;
CREATE POLICY "Public Read Product Reviews"
  ON public.product_reviews FOR SELECT
  USING (is_approved = true);

-- Allow visitors to submit new reviews from the website
DROP POLICY IF EXISTS "Public Insert Product Reviews" ON public.product_reviews;
CREATE POLICY "Public Insert Product Reviews"
  ON public.product_reviews FOR INSERT
  WITH CHECK (true);

-- Admin full access to all reviews
DROP POLICY IF EXISTS "Admin Manage Product Reviews" ON public.product_reviews;
CREATE POLICY "Admin Manage Product Reviews"
  ON public.product_reviews FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 4. Seed sample reviews (with shop replies)
INSERT INTO public.product_reviews (product_id, author_name, rating, content, is_approved, reply_content, replied_at)
VALUES
  ('bot-kim-tuyen-vang-dong-sieu-min', 'Anh Hoàng', 5, 'Chất lượng sản phẩm rất tốt, đúng như mô tả. Đóng gói cẩn thận và giao hàng nhanh.', true, 'Dạ Mai Kim Tuyến cảm ơn anh Hoàng đã tin tưởng ủng hộ shop! Cần thêm màu nào anh cứ nhắn shop nhé ạ.', NOW()),
  ('bot-kim-tuyen-vang-dong-sieu-min', 'Chị Ngọc Mai', 5, 'Hàng đẹp, đóng gói chắc chắn. Shop hỗ trợ nhiệt tình, giao hàng nhanh.', true, 'Dạ cảm ơn chị Mai nhiều ạ! Chúc chị có những sản phẩm thủ công thật ưng ý ạ.', NOW()),
  ('bang-keo-trong-50-mic-cuon-lon', 'Minh Phát', 5, 'Băng keo dính tốt, cuộn dày và chắc chắn. Giao hàng đúng hẹn, sẽ tiếp tục ủng hộ shop.', true, 'Dạ cảm ơn công ty Minh Phát đã tin tưởng đặt số lượng lớn tại xưởng Mai Kim Tuyến ạ.', NOW())
ON CONFLICT DO NOTHING;
