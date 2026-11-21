-- Migration 0001: Baseline Schema
-- Description: Consolidated baseline schema containing tables, initial RLS, indexes, and views.
-- Tables: categories, products, orders, blogs, manual_revenues, admin_roles, product_reviews, site_pageviews, product_views

-- 1. Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  unit TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE RESTRICT,
  category_name TEXT,
  subcategory_id TEXT,
  subcategory_name TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  in_stock BOOLEAN DEFAULT TRUE,
  specs JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);

-- 3. Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT,
  customer_note TEXT,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  items JSONB NOT NULL,
  payos_checkout_url TEXT,
  payos_qr_code_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_orders_order_code ON public.orders(order_code);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 4. Blogs
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'Mẹo hay',
  thumbnail TEXT,
  summary TEXT,
  content TEXT,
  sections JSONB DEFAULT '[]'::jsonb,
  author TEXT DEFAULT 'Chị Mai Kim Tuyến',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);

-- 5. Manual Revenues (Accounting/Tax)
CREATE TABLE IF NOT EXISTS public.manual_revenues (
  id TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Admin Roles (RBAC)
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Product Reviews
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

CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.product_reviews (product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.product_reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.product_reviews (rating);

-- 8. Analytics (Pageviews & Product views)
CREATE TABLE IF NOT EXISTS public.site_pageviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  visitor_id TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pageviews_created_at ON public.site_pageviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pageviews_path ON public.site_pageviews (path);

CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  product_title TEXT,
  visitor_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_views_product_id ON public.product_views (product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_created_at ON public.product_views (created_at DESC);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- Initial is_admin() function definition (superseded by 0002)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.role() != 'authenticated' THEN
    RETURN FALSE;
  END IF;

  IF EXISTS (SELECT 1 FROM public.admin_roles) THEN
    RETURN EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE (admin_roles.user_id = auth.uid() OR lower(admin_roles.email) = lower(auth.jwt() ->> 'email'))
        AND admin_roles.role IN ('super_admin', 'admin')
    ) OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'admin');
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
