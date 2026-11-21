# Supabase Database Migrations — MAI KIM TUYẾN Store

This directory manages all versioned database migrations for the project.

## Directory Structure

```
supabase/
├── migrations/
│   ├── 0001_baseline_schema.sql           # Baseline schema: tables, indexes, initial RLS, functions
│   └── 0002_fix_orders_rls_and_is_admin.sql # Security hardening: drops public write orders, locks admin fallback
├── legacy/                                # Archived manual SQL scripts (for historical reference only; DO NOT run)
└── README.md
```

## Migration Rules & Conventions

1. **Immutable Migrations**: Never modify an existing migration file once it has been applied to staging or production.
2. **Sequential Versioning**: Every new schema change requires a new migration file following numerical ordering:
   `0003_<feature_or_intent>.sql`.
3. **Audit Before Apply**: Always review schema diffs before committing or deploying:
   ```bash
   npm run db:diff     # Inspect diff between local migrations and remote schema
   npm run db:migrate  # Push new migrations to Supabase
   ```
4. **Row Level Security (RLS)**: Every new table created MUST have RLS enabled with explicit SELECT/INSERT/UPDATE/DELETE policies. Public write permissions on transactional data (like orders or revenues) are strictly prohibited.
