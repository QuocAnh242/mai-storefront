-- ==============================================================================
-- ANALYTICS RETENTION & ARCHIVE
-- ==============================================================================

-- 1. Archive table for cumulative view totals retained after 30-day cleanup
-- Keeps the all-time shop traffic total intact when old data is purged
CREATE TABLE IF NOT EXISTS public.analytics_archive (
  id TEXT PRIMARY KEY DEFAULT 'global',
  archived_pageviews BIGINT DEFAULT 0,
  archived_product_views BIGINT DEFAULT 0,
  last_cleaned_at TIMESTAMPTZ,
  last_notified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the default record if missing
INSERT INTO public.analytics_archive (id, archived_pageviews, archived_product_views)
VALUES ('global', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.analytics_archive ENABLE ROW LEVEL SECURITY;

-- Allow admin and Service Role read/write
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
