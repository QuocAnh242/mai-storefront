-- SQL Seed Data for MAI KIM TUYẾN Store
-- Copy & Run this script in Supabase SQL Editor (https://supabase.com/dashboard/project/gldbmrulhwavehuvxubo/sql/new)

-- 1. Enable Public Insert & Update & Delete Policies for Categories, Products & Blogs
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Mẹo hay';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]'::jsonb;

DROP POLICY IF EXISTS "Public Insert Categories" ON categories;
CREATE POLICY "Public Insert Categories" ON categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Categories" ON categories;
CREATE POLICY "Public Update Categories" ON categories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Insert Products" ON products;
CREATE POLICY "Public Insert Products" ON products FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Products" ON products;
CREATE POLICY "Public Update Products" ON products FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Products" ON products;
CREATE POLICY "Public Delete Products" ON products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public Insert Blogs" ON blogs;
CREATE POLICY "Public Insert Blogs" ON blogs FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Blogs" ON blogs;
CREATE POLICY "Public Update Blogs" ON blogs FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Delete Blogs" ON blogs;
CREATE POLICY "Public Delete Blogs" ON blogs FOR DELETE USING (true);

-- 2. Insert Initial Categories
INSERT INTO categories (id, name, slug, description) VALUES
('cat-kim-tuyen', 'Bột Kim Tuyến', 'bot-kim-tuyen', 'Đầy đủ màu sắc, nhũ ánh hạt kim tuyến thủ công & công nghiệp'),
('cat-camay', 'Bột Camay', 'bot-camay', 'Bột ngọc trai camay ánh kim cao cấp chuyên sơn phủ'),
('cat-da-quang', 'Bột Dạ Quang', 'bot-da-quang', 'Bột tự phát sáng trong đêm cho mỹ thuật & thi công'),
('cat-phan-quang', 'Bột Phản Quang', 'bot-phan-quang', 'Bột dán & sơn phản quang cảnh báo an toàn'),
('cat-bot-mau', 'Bột Màu', 'bot-mau', 'Bột màu công nghiệp, xây dựng và mỹ thuật'),
('cat-bang-keo', 'Băng Keo', 'bang-keo', 'Băng keo dán thùng, siêu dính, văn phòng & xây dựng'),
('cat-son-xit', 'Sơn Xịt', 'son-xit', 'Chai sơn xịt các thương hiệu lớn & sơn chuyên dụng'),
('cat-keo-dan', 'Keo Dán', 'keo-dan', 'Keo 502, keo sữa, keo silicon, keo con chó'),
('cat-xi-giay', 'Xi Đánh Giày', 'xi-danh-giay', 'Xi bóng bảo vệ giày da & đồ da các loại'),
('cat-khac', 'Vật Tư Khác', 'vat-tu-khac', 'Dụng cụ hỗ trợ đóng gói, dán nhãn & phụ kiện')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description;

-- 3. Insert Initial Real Products
INSERT INTO products (id, title, slug, price, original_price, unit, description, category_id, category_name, subcategory_id, subcategory_name, images, is_featured, display_order, in_stock) VALUES
('p-1', 'Bột Màu Ba Biển Vật Liệu Xây Dựng (Bao 5kg)', 'bot-mau-ba-bien-vat-lieu-xay-dung-bao-5kg', 150000, 180000, 'Bao 5kg', 'Bột màu Ba Biển chuyên làm đá hoa, gạch bông, chậu cảnh, phối màu bê tông, sản xuất phân bón cây trồng & mỹ thuật.', 'cat-bot-mau', 'Bột Màu', 'sub-bm-ba-bien', 'Bột màu Ba biển', ARRAY['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'], true, 1, true),
('p-2', 'Bột Màu Vàng Oxide Sắt 313 (Bột Màu Vàng Đất 3 Đồng Tiền) - Bao 25kg', 'bot-mau-vang-oxide-sat-313-bao-25kg', 640000, 700000, 'Bao 25kg', 'Bột màu vàng 313 Oxide sắt loại I nhập khẩu cao cấp (Loại 3 đồng tiền) chuyên dùng cho gạch terrazzo, gạch vỉa hè, chậu cảnh.', 'cat-bot-mau', 'Bột Màu', 'sub-bm-xay-dung', 'Bột màu Xây dựng', ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'], true, 2, true),
('p-3', 'Bột Màu Đen Công Nghiệp Pigment Black 722 (RANE ONE) - Bao 25kg', 'bot-mau-den-pigment-black-722-25kg', 680000, 750000, 'Bao 25kg', 'Bột màu đen RANE ONE Pigment Black 722 nhập khẩu chuyên dụng cho ngành sản xuất gạch, bê tông, phân bón & công nghiệp.', 'cat-bot-mau', 'Bột Màu', 'sub-bm-xay-dung', 'Bột màu Xây dựng', ARRAY['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&q=80'], true, 3, true),
('p-4', 'Bột Màu Đỏ Oxide Sắt Y101 (Hunan Three-Ring) - Bao 25kg', 'bot-mau-do-oxide-sat-y101-bao-25kg', 650000, 700000, 'Bao 25kg', 'Bột màu đỏ Oxide sắt Y101 chất lượng cao nhập khẩu Hunan Three-Ring Pigments. Độ bền màu cao, phân tán đều.', 'cat-bot-mau', 'Bột Màu', 'sub-bm-xay-dung', 'Bột màu Xây dựng', ARRAY['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80'], true, 4, true),
('p-5', 'Bột Kim Tuyến Màu Đỏ Ánh Kim Cao Cấp', 'bot-kim-tuyen-mau-do-anh-kim', 120000, 150000, 'Kg', 'Bột kim tuyến đỏ nhũ lấp lánh làm đồ thủ công mỹ nghệ, in lụa, sơn trang trí.', 'cat-kim-tuyen', 'Bột Kim Tuyến', 'sub-kt-mau', 'Kim tuyến Màu', ARRAY['https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80'], true, 5, true),
('p-6', 'Bột Camay Vàng Ngọc Trai Ánh Kim 24K', 'bot-camay-vang-ngoc-trai-24k', 250000, 280000, 'Hũ 500g', 'Bột ngọc trai camay vàng tạo hiệu ứng nhũ ánh kim cho sơn xe, tượng Phật, đồ gỗ.', 'cat-camay', 'Bột Camay', NULL, NULL, ARRAY['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80'], false, 6, true),
('p-7', 'Bột Dạ Quang Phát Sáng Xanh Ngọc Trong Đêm', 'bot-da-quang-phat-sang-xanh-ngoc', 320000, 380000, 'Kg', 'Hấp thụ ánh sáng và tự phát sáng rực rỡ suốt 6-8 tiếng trong bóng tối.', 'cat-da-quang', 'Bột Dạ Quang', NULL, NULL, ARRAY['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80'], false, 7, true),
('p-8', 'Băng Keo Trong Dán Thùng 50Mic (Lốc 6 cuộn)', 'bang-keo-trong-dan-thung-50mic', 85000, 100000, 'Lốc 6 cuộn', 'Băng keo trong siêu dính, không đứt đoạn, bám dính chắc chắn trên bề mặt thùng carton.', 'cat-bang-keo', 'Băng Keo', 'sub-bk-duc-trong', 'Đục / Trong', ARRAY['https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80'], false, 8, true),
('p-9', 'Sơn Xịt ATM A200 Màu Đỏ Rực (Chai 400ml)', 'son-xit-atm-a200-mau-do', 38000, 45000, 'Chai 400ml', 'Sơn xịt ATM Thái Lan chính hãng, màng sơn mau khô, bám chặt trên kim loại, gỗ, nhựa.', 'cat-son-xit', 'Sơn Xịt', 'sub-sx-atm', 'ATM', ARRAY['https://images.unsplash.com/photo-1615529182904-14819c35db37?w=800&q=80'], false, 9, true),
('p-10', 'Keo Con Chó Dog X66 Dán Da & Gỗ (Lon 100ml)', 'keo-con-cho-dog-x66-lon-100ml', 32000, 40000, 'Lon 100ml', 'Keo dán thảm, giày dép, gỗ, da bám dính cực bền chịu độ đàn hồi cao.', 'cat-keo-dan', 'Keo Dán', 'sub-kd-con-cho', 'Keo con chó (Dog X66)', ARRAY['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80'], false, 10, true),
('p-11', 'Xi Đánh Giày Thái Kleen Đen Bóng (Hộp 50g)', 'xi-danh-giay-thai-kleen-den-bong', 35000, 42000, 'Hộp 50g', 'Xi đánh giày da nhập khẩu Thái Lan giúp phục hồi da, chống nước và làm sáng bóng da.', 'cat-xi-giay', 'Xi Đánh Giày', 'sub-xi-kleen', 'Xi thái Kleen', ARRAY['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80'], false, 11, true),
('p-12', 'Dụng Cụ Cắt Băng Keo Cầm Tay 5F Kim Loại', 'dung-cu-cat-bang-keo-cam-tay-5f', 45000, 55000, 'Cái', 'Dụng cụ cắt băng dính đóng thùng lưỡi răng cưa kim loại sắc bén, tay cầm trợ lực nhanh chóng.', 'cat-khac', 'Vật Tư Khác', 'sub-vt-cat-bk', 'Cắt băng keo cầm tay', ARRAY['https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&q=80'], false, 12, true)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  unit = EXCLUDED.unit,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  category_name = EXCLUDED.category_name,
  subcategory_id = EXCLUDED.subcategory_id,
  subcategory_name = EXCLUDED.subcategory_name,
  images = EXCLUDED.images,
  is_featured = EXCLUDED.is_featured,
  display_order = EXCLUDED.display_order,
  in_stock = EXCLUDED.in_stock;
