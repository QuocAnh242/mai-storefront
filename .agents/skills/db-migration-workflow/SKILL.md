---
name: db-migration-workflow
description: >-
  Standard operating procedure for creating, testing, and applying Supabase PostgreSQL
  migrations. Use whenever modifying database schema, creating tables, adding columns,
  or updating Row-Level Security (RLS) policies.
---

# Supabase Database Migration Workflow

This skill guides the creation and validation of version-controlled database migrations.

## Migration Rules

1. **Single Source of Truth**:
   - All schema changes must be authored inside `supabase/migrations/`.
   - Never execute manual SQL in the Supabase Cloud dashboard.

2. **Sequential Versioning**:
   - Files follow the format `000X_<descriptive_name>.sql`.
   - Never alter previously applied migrations once deployed.

3. **Mandatory Row-Level Security (RLS)**:
   - Every new table MUST have `ALTER TABLE <table_name> ENABLE ROW LEVEL SECURITY;`.
   - Anonymous write access is strictly forbidden on orders, revenues, and role tables.
   - Administrative policies must check `public.is_admin()`.

---

## Workflow Steps

### Step 1: Author Migration File
Create `supabase/migrations/000X_<feature>.sql`:
```sql
-- Migration 000X: Describe intent
CREATE TABLE IF NOT EXISTS public.example_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.example_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Example" ON public.example_table
  FOR SELECT USING (true);

CREATE POLICY "Admin All Example" ON public.example_table
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
```

### Step 2: Validate Schema Diff
```bash
npm run db:diff
```

### Step 3: Deploy Migration
```bash
npm run db:migrate
```

### Step 4: Verification
Confirm table access via unit tests or PostgREST probe with both anon key and authenticated session.
