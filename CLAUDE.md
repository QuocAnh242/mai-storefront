# Claude Code Guidelines — MAI KIM TUYẾN Store

This project uses an agentic development workflow. Read and obey **[AGENTS.md](./AGENTS.md)** for full project architecture, permissions, clean code standards, and UI guidelines.

---

## Quick Start & Commands

```bash
# Run full automated harness (architecture + dead-code + lint + test + tsc + build)
npm run harness

# Quick iteration check (test + type-check)
npm run harness:quick

# Run automated unit/UI test suite
npm test

# Visual E2E smoke tests (Mobile 375px & Desktop 1280px)
npm run test:e2e

# Database schema diff, migration & TypeScript types
npm run db:diff
npm run db:migrate
npm run db:types
```

---

## UI Design Standard: Crafted Navy Glassmorphism

1. **Disciplined Glassmorphism**: Use standardized `.glass-nav`, `.glass-surface`, and `.glass-modal-*` tokens from `src/app/globals.css` for sticky headers, floating widgets, hero overlays, and modals. Keep dense reading surfaces and admin tables crisp white (`bg-white border-slate-200`). Never nest two `backdrop-blur` layers.
2. **Icons & Media**: UI icons strictly via `lucide-react` (`w-4 h-4`, `w-5 h-5`, `w-6 h-6`). Use `next/image` (`<Image>`) and `Be_Vietnam_Pro` via `next/font/google`.
3. **Palette & Primitives**:
   - Primary Navy: `sky-950` / `sky-700`, Craft Accent: `amber-600`, Success: `emerald-600`, Danger: `rose-600`.
   - ALWAYS import `Button`, `Modal`, `ConfirmDialog`, `FormField`, `Badge`, `Card`, `Pagination`, `EmptyState` from `@/components/ui/*`, `cn()` from `@/lib/cn`, and `formatVND()` from `@/lib/format`. Never use `window.confirm` or `window.alert`.
4. **Unpublic Checkout Rule**: Public storefront is strictly **Direct Contact / Zalo & Hotline Quote**. Do NOT render online cart/checkout buttons on storefront pages.

---

## Architecture & Clean Code Rules

- **Next.js 16 (App Router) + React 19**: Server Components first (`import 'server-only'` on `src/lib/queries/*`). Use `'use client'` only on interactive leaf components.
- **State**: URL search params via `nuqs` for storefront filtering; `@tanstack/react-query` + `react-hook-form` + `zod` for admin CRUD. No global `StoreContext`.
- **File Limits**: Components/hooks `< 250` lines; `page.tsx` `< 80` lines.
- **Security**: Zod validation (`src/lib/validation/schemas.ts`), `enforceRateLimit()`, `withAdminRoute()`, versioned SQL migrations in `supabase/migrations/`.
- **Verification**: ALWAYS run `npm run harness` (and browser check for UI tasks) before concluding.
