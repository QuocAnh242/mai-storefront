-- Migration 0002 (P1.1): Fix orders RLS — remove public write policies
-- Project: gldbmrulhwavehuvxubo (MAI KIM TUYEN)
-- Date: 2026-11-21
-- Source: docs/audit-db.md — confirmed both policies below are live and allow
--         anyone with the anon key to update/delete any order.

-- 1. Drop public write policies on orders (from legacy fix_orders_rls.sql)
DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Delete Orders" ON public.orders;

-- 2. Drop any public read policy on orders (in case it survives in any environment)
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;

-- 3. Recreate the correct policy set for orders:
--    - Public can only INSERT new orders (checkout)
--    - Admins (via is_admin()) have full access
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;

CREATE POLICY "Public Insert Orders" ON public.orders
  FOR INSERT TO public
  WITH CHECK (true);

CREATE POLICY "Admin All Orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 4. (P1.2) is_admin(): close the default-open branch — an empty admin_roles table
--    means NO ONE is an admin, instead of every authenticated user being one.
--    Safe to apply: admin_roles currently has 3 super_admin rows.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.role() != 'authenticated' THEN
    RETURN FALSE;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles
    WHERE (admin_roles.user_id = auth.uid() OR lower(admin_roles.email) = lower(auth.jwt() ->> 'email'))
      AND admin_roles.role IN ('super_admin', 'admin')
  ) OR (auth.jwt() -> 'app_metadata' ->> 'role') IN ('super_admin', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

