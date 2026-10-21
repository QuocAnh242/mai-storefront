-- 1. Đảm bảo tất cả các bảng đều tồn tại trước khi thao tác policy
CREATE TABLE IF NOT EXISTS public.manual_revenues (
  id TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bật Row Level Security (RLS) trên toàn bộ các bảng
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- 3. Enterprise RBAC Security Definer Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Từ chối ngay nếu không có phiên đăng nhập (anon)
  IF auth.role() != 'authenticated' THEN
    RETURN FALSE;
  END IF;

  -- Nếu bảng admin_roles đã có bản ghi, kiểm tra quyền admin của user
  IF EXISTS (SELECT 1 FROM public.admin_roles) THEN
    RETURN EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE (admin_roles.user_id = auth.uid() OR lower(admin_roles.email) = lower(auth.jwt() ->> 'email'))
        AND admin_roles.role IN ('super_admin', 'admin')
    ) OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'admin');
  END IF;

  -- Mặc định khởi tạo: Người dùng đã xác thực qua Supabase Auth đều được xem là Admin
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Xóa sạch tất cả các policy cũ để làm mới
DROP POLICY IF EXISTS "Public Read Categories" ON categories;
DROP POLICY IF EXISTS "Public Insert Categories" ON categories;
DROP POLICY IF EXISTS "Public Update Categories" ON categories;
DROP POLICY IF EXISTS "Public Delete Categories" ON categories;
DROP POLICY IF EXISTS "Admin All Categories" ON categories;

DROP POLICY IF EXISTS "Public Read Products" ON products;
DROP POLICY IF EXISTS "Public Insert Products" ON products;
DROP POLICY IF EXISTS "Public Update Products" ON products;
DROP POLICY IF EXISTS "Public Delete Products" ON products;
DROP POLICY IF EXISTS "Admin All Products" ON products;

DROP POLICY IF EXISTS "Public Read Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Insert Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Update Blogs" ON blogs;
DROP POLICY IF EXISTS "Public Delete Blogs" ON blogs;
DROP POLICY IF EXISTS "Admin All Blogs" ON blogs;

DROP POLICY IF EXISTS "Public Read Orders" ON orders;
DROP POLICY IF EXISTS "Public Insert Orders" ON orders;
DROP POLICY IF EXISTS "Public Update Orders" ON orders;
DROP POLICY IF EXISTS "Public Delete Orders" ON orders;
DROP POLICY IF EXISTS "Admin All Orders" ON orders;

DROP POLICY IF EXISTS "Public Read Manual Revenues" ON manual_revenues;
DROP POLICY IF EXISTS "Public Insert Manual Revenues" ON manual_revenues;
DROP POLICY IF EXISTS "Public Delete Manual Revenues" ON manual_revenues;
DROP POLICY IF EXISTS "Admin All Revenues" ON manual_revenues;

DROP POLICY IF EXISTS "Admin Manage Roles" ON public.admin_roles;

-- 5. Áp dụng chính sách Enterprise RBAC chuẩn bảo mật:

-- CATEGORIES: Khách xem, Admin quản lý
CREATE POLICY "Public Read Categories" ON categories
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Admin All Categories" ON categories
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- PRODUCTS: Khách xem, Admin quản lý
CREATE POLICY "Public Read Products" ON products
  FOR SELECT TO public
  USING (true);

CREATE POLICY "Admin All Products" ON products
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- BLOGS: Khách xem bài đã xuất bản, Admin quản lý
CREATE POLICY "Public Read Blogs" ON blogs
  FOR SELECT TO public
  USING (is_published = true);

CREATE POLICY "Admin All Blogs" ON blogs
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ORDERS: Khách chỉ được tạo đơn hàng mới (INSERT). Không được đọc hay sửa xóa đơn của người khác!
CREATE POLICY "Public Insert Orders" ON orders
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admin All Orders" ON orders
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- MANUAL REVENUES: Chỉ Admin mới được truy cập dữ liệu tài chính
CREATE POLICY "Admin All Revenues" ON manual_revenues
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ADMIN ROLES: Chỉ Admin mới được xem/gán quyền
CREATE POLICY "Admin Manage Roles" ON public.admin_roles
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
