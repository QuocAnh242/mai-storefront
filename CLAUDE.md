# Claude Code Guidelines — MAI KIM TUYẾN Store

This project uses an agentic development workflow. Read and obey **[AGENTS.md](./AGENTS.md)** for full project architecture, permissions, clean code standards, and UI guidelines.

---

## Quick Start & Commands

```bash
# Run automated test suite
npm test

# Type-check without emitting JS
npx tsc --noEmit

# Production build check
npm run build

# Database schema diff & migration
npm run db:diff
npm run db:migrate
```

---

## UI Design Standard: Flat, Natural, Modern (Strict Anti-AI-Slop)

1. **No AI Slop**: Never inject purple/blue glowing neon backgrounds, artificial glassmorphism blurs, or cheesy emojis (sparkles, rockets, robots).
2. **No AI-Generated SVG Icons**: Strictly use **lucide-react** only. Standard sizes: 16px (`w-4 h-4`), 20px (`w-5 h-5`), 24px (`w-6 h-6`). Consistent `strokeWidth={1.5}` or `2`.
3. **Flat Design Tokens**:
   - Canvas: `#f8fafc` / `#ffffff`
   - Borders: Crisp 1px `border-slate-200`, hover `hover:border-slate-300`
   - Shadows: Subtle `shadow-xs` or `shadow-sm`. No oversized colorful drop-shadows.
   - Text: `text-slate-900` (titles), `text-slate-600` (body), `text-slate-400` (muted).

---

## Architecture & Clean Code Rules

- **Next.js 16 (App Router) + React 19**: RSC by default. Only use `'use client'` on interactive leaves.
- **Validation**: All incoming API requests must be validated using Zod schemas in `src/lib/validation/schemas.ts`.
- **Security**: Rate limiting via `enforceRateLimit()` and admin authentication via `verifyAdminAuth()`.
- **Migrations**: Always write versioned SQL files in `supabase/migrations/` (`0003_*.sql`).
- **Workspace Skills**: See `.agents/skills/` for `harness-engineering`, `natural-ui-craft`, `ecommerce-ux-design`, `storefront-seo-craft`, and `db-migration-workflow`.
- **Verification**: ALWAYS run `npm run harness` before concluding work.
