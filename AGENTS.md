<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Agent Operational Directives — MAI KIM TUYẾN Store

This project is maintained and scaled primarily with AI engineering agents. Every agent operating in this codebase MUST adhere strictly to the rules, permissions, clean code practices, and UI design standards documented below.

---

## 1. Agent Permissions & Operational Guardrails

### Granted Capabilities (Auto-Approved)
- **Code Authoring & Refactoring**: Full permission to read, create, and refactor files inside `src/`, `tests/`, `scripts/`, `supabase/migrations/`, and `docs/`.
- **Verification Commands**: Authorized to run `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run harness`, `npm run db:diff`.
- **Package Management**: Authorized to add production or development dependencies with explicit justification and clean peer dependency alignment.

### Strict Prohibitions
- **Secrets & Keys**: NEVER commit `.env.local` or hardcode API keys, service role keys, or database credentials.
- **Next.js Marker**: NEVER delete or omit the `<!-- BEGIN:nextjs-agent-rules -->` block from `AGENTS.md`.
- **Raw SQL Execution**: NEVER execute unversioned SQL directly in production or Supabase console. ALL schema modifications MUST be authored as versioned files in `supabase/migrations/`.
- **RLS Bypassing**: NEVER write open RLS policies (e.g. `WITH CHECK (true)` for UPDATE/DELETE on sensitive tables like `orders` or `manual_revenues`).
- **Unpublic Storefront Checkout**: Online cart & self-checkout (`src/features/cart/`, `src/features/checkout/`) are **intentionally unpublic/disabled** on the storefront. Customers must contact directly via Zalo, Hotline, or Messenger. NEVER expose "Thêm vào giỏ" / "Mua ngay" / Cart Drawer / online payment triggers on the public storefront unless explicitly requested by the owner.

---

## 2. UI/UX Design System: Crafted Navy Glassmorphism & Crisp Content

CRITICAL DIRECTIVE: The UI balances **tactile, translucent Glassmorphism** on floating/overlay/sticky surfaces with **crisp, high-readability white/slate surfaces** on dense content cards and admin tables.

### Intentional Glassmorphism Rules
- **USE Glassmorphism** via standardized classes in `src/app/globals.css`:
  - `.glass-nav` / `.glass-nav-light`: Sticky headers, top dropdowns, mobile sticky bars.
  - `.glass-surface` / `.glass-surface-dark`: Hero overlays/buttons, image counter badges, floating action dock.
  - `.glass-modal-backdrop` + `.glass-modal-panel`: All modals, drawers, and lightboxes.
- **DO NOT** stack two nested `backdrop-blur-*` layers on top of each other (causes visual muddiness and mobile GPU lag).
- **DO NOT** apply translucent glass to dense admin tables, long article text, or form inputs — keep reading surfaces crisp (`bg-white`, `border-slate-200`).
- **DO NOT** use tacky AI aesthetics: neon rainbow gradients (`from-purple-500 via-pink-500 to-indigo-500`), cheesy AI emojis (`✨`, `🚀`, `🤖`), or arbitrary wavy SVG paths.

### Standard Iconography & Media
- **UI Icons**: Use `lucide-react` exclusively (`w-4 h-4`, `w-5 h-5`, `w-6 h-6` with consistent `strokeWidth={1.75}` or `2`). Official third-party brand marks (e.g. Zalo/Facebook in footer) or decorative structural waves must stay isolated in dedicated components.
- **Images & Fonts**: Use `next/image` (`<Image>`) with explicit dimensions/aspect ratios and descriptive Vietnamese `alt` text; use `Be_Vietnam_Pro` via `next/font/google`.

### Color, Radius & UI Kit Contract
- **Palette**:
  - Brand Primary: Navy `sky-950` (`#082f49`) & `sky-700` (`#0369a1`)
  - Craft Accent: Warm Amber `amber-600` (`#d97706`) for glitter/featured badges
  - Semantic: Emerald `emerald-600` (in-stock / paid), Rose `rose-600` (discount / delete)
  - Text: `text-slate-900` (headings), `text-slate-600` (body), `text-slate-400`/`500` (meta)
- **Radius Scale**:
  - Controls, inputs, buttons: `rounded-lg` (8px)
  - Cards, dropdowns, product tiles: `rounded-xl` (12px)
  - Modals, hero sections: `rounded-2xl` (16px)
  - Status tags & chips: `rounded-full`
- **Mandatory UI Primitives (`@/components/ui/*`)**:
  - ALWAYS compose buttons, modals, confirm dialogs, inputs, badges, pagination, and empty states using `@/components/ui/*` + `cn()` from `@/lib/cn` + formatters from `@/lib/format` (`formatVND`, `isContactProduct`, `formatDateVN`).
  - NEVER write raw `<div className="fixed inset-0 ...">` modal overlays, duplicate `formatVND()`, or native `window.confirm()` / `window.alert()`.
  - Use `toast` from `sonner` for user feedback notifications.

---

## 3. Clean Code & Architecture Rules

### Layered Directory Structure
- `src/app/`: Thin routing controllers, layouts, SEO metadata (`page.tsx` **< 80 lines**).
- `src/features/[domain]/`: Feature modules (`storefront/`, `catalog/`, `products/`, `blogs/`, `admin/`). Group components, domain hooks, and schemas together.
- `src/components/ui/`: Reusable UI primitives (`Button`, `Modal`, `ConfirmDialog`, `FormField`, `Badge`, `Card`, `Pagination`, `EmptyState`, `Loading`).
- `src/components/`: Cross-route layout shells (`navigation/`, `footer/`, `FloatingActionDock.tsx`, `AnalyticsTracker.tsx`).
- `src/lib/`: Infrastructure, DB queries (`server-only`), Zod schemas, API wrappers (`withAdminRoute`), formatters (`format.ts`), `cn.ts`, `searchUtils.ts`.
- `src/shared/`: Shared TypeScript interfaces (`types/`) and seed/store metadata (`constants/`).

### React 19 & Next.js 16 Rules
- **Server-First Storefront**: Keep storefront routes as Server Components with ISR (`revalidate = 60`), fetching via `src/lib/queries/*` (protected with `import 'server-only'`). Never mount global store/auth fetchers in Root `src/app/layout.tsx`.
- **URL Search Params**: Storefront catalog filtering, subcategory selection, sorting, and search MUST use URL Search Params via `nuqs` (`/products?category=...&sub=...&q=...&price=...&sort=...`) — never global React Context.
- **Admin Data & Forms**: Admin screens use `@tanstack/react-query` hooks calling paginated `/api/admin/*` routes, and forms use `react-hook-form` + `@hookform/resolvers/zod` bound to `src/lib/validation/schemas.ts`.
- **Security**: Validate all API payloads with Zod; enforce `enforceRateLimit()` on public writes/auth; wrap `/api/admin/*` with `withAdminRoute()`.
- **Standardized Vietnamese Search**: ALL text searches MUST use `normalizeSearchQuery()` / `filterProductsBySearch()` from `src/lib/searchUtils.ts`.

### Modular File Limits (STRICT MANDATE)
1. **Components & Hooks (< 250 Lines)**: NO `.tsx` component or hook file may exceed **250 lines**. Decompose proactively into subcomponents.
2. **Thin Page Controllers (< 80 Lines)**: Files under `src/app/**/page.tsx` must stay **< 80 lines**.
3. **Zero Dead Code**: Unused components, routes, or dependencies must be cleaned up or explicitly fenced and verified with `knip`.

---

## 4. Verification & Testing Workflow

Every UI or logic change must satisfy ALL automated gates + visual verification before completion:
```bash
# Quick check during iteration:
npm run harness:quick

# Full automated verification harness (architecture, knip, lint, vitest, tsc, next build):
npm run harness
```
- **Visual & Responsive Gate**: For any UI change, verify the rendered page in a real headless/DevTools browser at **Mobile (`375×812`)** and **Desktop (`1280×800`)** — checking zero horizontal overflow, legible text contrast on glass surfaces, non-overlapping sticky bars, zero console errors, and working links.

---

## 5. Workspace Skills & Harness Engine

Project-specific skills live in `.agents/skills/`:
- `harness-engineering` (`.agents/skills/harness-engineering/SKILL.md`): End-to-end TDD, architecture, dead-code & visual harness loop.
- `natural-ui-craft` (`.agents/skills/natural-ui-craft/SKILL.md`): Crafted Navy Glassmorphism tokens, Lucide icon standards, UI Kit primitives.
- `ecommerce-ux-design` (`.agents/skills/ecommerce-ux-design/SKILL.md`): Wholesale/retail Zalo-quote UX, mobile ergonomics, PDP architecture.
- `storefront-seo-craft` (`.agents/skills/storefront-seo-craft/SKILL.md`): Technical SEO, metadata, JSON-LD structured data, Core Web Vitals.
- `db-migration-workflow` (`.agents/skills/db-migration-workflow/SKILL.md`): Supabase migration rules, typegen, and RLS validation.
