-- Add manual_revenues table for persistent revenue tracking (tax reporting)
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS manual_revenues (
  id TEXT PRIMARY KEY,
  amount NUMERIC NOT NULL,
  date TEXT NOT NULL,
  source TEXT NOT NULL,
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE manual_revenues ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read, insert, update, delete (admin panel uses anon key)
CREATE POLICY "Public Read Manual Revenues" ON manual_revenues FOR SELECT USING (true);
CREATE POLICY "Public Insert Manual Revenues" ON manual_revenues FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Manual Revenues" ON manual_revenues FOR DELETE USING (true);
