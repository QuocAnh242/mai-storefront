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
- **Verification Commands**: Authorized to run `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run db:diff`.
- **Package Management**: Authorized to add production or development dependencies with explicit justification and clean peer dependency alignment.

### Strict Prohibitions
- **Secrets & Keys**: NEVER commit `.env.local` or hardcode API keys, service role keys, or database credentials.
- **Next.js Marker**: NEVER delete or omit the `<!-- BEGIN:nextjs-agent-rules -->` block from `AGENTS.md`.
- **Raw SQL Execution**: NEVER execute unversioned SQL directly in production or Supabase console. ALL schema modifications MUST be authored as versioned files in `supabase/migrations/`.
- **RLS Bypassing**: NEVER write open RLS policies (e.g. `WITH CHECK (true)` for UPDATE/DELETE on sensitive tables like `orders` or `manual_revenues`).

---

## 2. UI/UX Design System: Natural, Flat, Modern & Anti-AI-Slop

CRITICAL DIRECTIVE: The UI of this store must look human-crafted, tactile, and natural. Reject artificial, over-decorated "AI slop" aesthetics.

### Strict Ban on "AI Slop"
1. **NO Gratuitous Glowing Gradients**: Strictly ban purple/pink/cyan radial glows, neon ambient lighting, or oversaturated gradient buttons (`bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500`).
2. **NO Glassmorphism Abuse**: Do NOT use multi-layer blur stacks (`backdrop-blur-xl bg-white/20 border-white/30`) that look like generic AI demo templates.
3. **NO Cheesy AI Emojis or Badges**: Never add sparkle emojis, rocket ships, robots, or AI badges to UI headers, product cards, or feature lists.
4. **NO AI-Generated Raw SVGs**: NEVER generate arbitrary, weird, or complex custom SVG paths with wavy curves. They look sloppy, break responsive scaling, and degrade visual consistency.

### Standard Iconography: Lucide React Only
- **Exclusivity**: Use only icons imported from `lucide-react` (e.g., `import { ShoppingBag, Search, ChevronRight } from 'lucide-react'`).
- **Standard Sizing Scale**:
  - `w-4 h-4` (16px): Micro badges, inline status indicators, table actions.
  - `w-5 h-5` (20px): Navigation items, standard buttons, input adornments.
  - `w-6 h-6` (24px): Feature card headers, hero highlights, modal titles.
- **Stroke Width**: Maintain consistent `strokeWidth={1.5}` or `strokeWidth={2}` across the entire app. Never mix random stroke widths.

### Flat, Clean & Modern Design Tokens
- **Design Philosophy**: Minimalist, flat, modern Scandinavian / Linear-inspired e-commerce. High readability, clear visual hierarchy, crisp 1px borders, and intentional whitespace.
- **Surfaces & Backgrounds**:
  - App Canvas: `#f8fafc` (slate-50) or pure `#ffffff`.
  - Card & Container Surface: Flat `#ffffff` with crisp border `border-slate-200`.
  - Subtle Hover Surface: `hover:bg-slate-50` or `hover:bg-slate-100/60`.
- **Elevation & Depth**:
  - Favor crisp 1px borders over fuzzy box-shadows.
  - When shadows are needed, use micro-shadows: `shadow-xs` (`0 1px 2px 0 rgb(0 0 0 / 0.05)`) or `shadow-sm`.
  - Hover states should slightly darken the border (`hover:border-slate-300`) rather than floating high with colorful colored glows.
- **Typography & Color Hierarchy**:
  - Primary text: `text-slate-900` (high contrast, crisp).
  - Secondary text: `text-slate-600` (readable body copy, descriptions).
  - Subdued / Meta text: `text-slate-400` or `text-slate-500` (timestamps, tags, hints).
  - Brand Accent: Warm amber/gold (`amber-600` / `#d97706` for glitter/art branding), emerald (`emerald-600`) for in-stock and payment confirmation, rose (`rose-600`) for sales/destructive actions.

---

## 3. Clean Code & Architecture Rules

### Layered Directory Structure
Keep concerns strictly separated:
- `src/app/`: Routing layer only (thin controllers, layout wrappers, metadata generation).
- `src/features/[domain]/`: Feature domain modules (e.g. `features/admin/`, `features/storefront/`, `features/products/`). Group components, domain hooks, and local UI logic together.
- `src/lib/`: Reusable infrastructure, external SDK clients, API wrappers (`withAdminRoute`), Zod validation schemas, and security helpers.
- `src/shared/`: Cross-cutting TypeScript types, shared contexts, and global utility constants.
- `src/components/`: Universal primitive UI components (buttons, dialogs, loading skeletons).

### React 19 & Next.js 16 Rules
- **Server Components First**: Keep components as Server Components by default. Add `'use client'` only to leaf components that require hooks (`useState`, `useEffect`, event listeners).
- **Zod Validation**: Validate all incoming API request payloads with schemas defined in `src/lib/validation/schemas.ts`.
- **Rate Limiting**: Protect all public write and authentication endpoints with `enforceRateLimit()` from `src/lib/rateLimit.ts`.
- **Admin Authentication**: All `/api/admin/*` endpoints must be guarded with `verifyAdminAuth()` or wrapped with `withAdminRoute()`.

### Anti-Technical-Debt & Modular Architecture Rules (STRICT MANDATE)
1. **Max Component File Limit (< 250 Lines)**:
   - NO component file may exceed **250 lines of code**.
   - When a component grows beyond 200 lines, agents MUST decompose it into single-responsibility subcomponents inside a dedicated folder (e.g. `src/features/[domain]/components/` or `src/components/[module]/`).
2. **Thin Page Controllers (< 80 Lines)**:
   - Files under `src/app/**/page.tsx` are strictly thin layout/controller wrappers (< 80 lines). They fetch data, generate SEO metadata, and delegate all UI to the feature domain layer (`src/features/[domain]/`). Never write inline dashboards, forms, or tables directly in `page.tsx`.
3. **Folder-per-Module Organization**:
   - Compound sections composed of multiple visual blocks (such as Footer, Header/Navigation, Product Detail View, Admin Dashboard) MUST be organized in dedicated subfolders with an `index.tsx` or re-export file to prevent breaking imports.
4. **State Decoupling & Zero Context Pollution**:
   - NEVER inject volatile form search inputs (`searchQuery`), active filter selections, or UI modal toggles into global `StoreContext`.
   - Storefront catalog filters and search queries MUST use **URL Search Params** (`useSearchParams()`, `useRouter()`) as the Single Source of Truth to prevent full-application re-renders on keystroke.
5. **Standardized Vietnamese Search**:
   - ALL text searches MUST use `normalizeSearchQuery()` from `src/lib/searchUtils.ts` to guarantee accent-insensitive Vietnamese search (`kim tuyen` matches `Bột Kim Tuyến`).

---

## 4. Verification & Testing Workflow

Every agent turn that modifies logic, schema, or UI must verify changes before completion:
```bash
# 1. Run unit and integration tests (must be 100% green)
npm test

# 2. Strict TypeScript type-check
npx tsc --noEmit

# 3. Next.js production build verification
npm run build
```

---

## 5. Workspace Skills & Harness Engine

Project-specific skills are located in `.agents/skills/` and are automatically discovered on project boot:

- `harness-engineering` (`.agents/skills/harness-engineering/SKILL.md`): End-to-end TDD harness loop (`npm run harness`).
- `natural-ui-craft` (`.agents/skills/natural-ui-craft/SKILL.md`): Design tokens, Lucide icon standards, anti-AI-slop rules.
- `ecommerce-ux-design` (`.agents/skills/ecommerce-ux-design/SKILL.md`): Conversion-focused shopper UX, mobile ergonomics, checkout flows.
- `storefront-seo-craft` (`.agents/skills/storefront-seo-craft/SKILL.md`): Technical SEO, keyword clusters for kim tuyến, JSON-LD structured data.
- `db-migration-workflow` (`.agents/skills/db-migration-workflow/SKILL.md`): Supabase migration rules and RLS validation.

When initiating a coding task:
1. **Next.js 16 Guidance**: Reference `node_modules/next/dist/docs/` for any Next.js breaking changes.
2. **Testing**: Add or update test cases in `tests/unit/` or `tests/integration/` whenever adding or changing functionality.
3. **Database**: Always read `supabase/README.md` and check `supabase/migrations/` before making any schema assumptions.
4. **Harness Execution**: Run `npm run harness:quick` during iteration and `npm run harness` before concluding.
