---
name: harness-engineering
description: >-
  Standard engineering harness and verification workflow for authoring, refactoring, and
  verifying code and UI in the MAI KIM TUYẾN store. Use whenever implementing features,
  modifying UI, altering API routes, or validating code quality.
---

# Harness Engineering & Full-Stack Verification Workflow

This skill enforces deterministic quality gates across backend contracts, architecture rules, dead code, TypeScript, and real browser UI/UX.

## The 5-Stage Harness Loop

```
[1. Spec & Contract] ──▶ [2. Test Spec] ──▶ [3. Assemble & Implement] ──▶ [4. Automated Harness] ──▶ [5. Visual & Security Audit]
```

---

### Stage 1: Spec & Contract
1. Identify whether the change belongs on Server (RSC / `src/lib/queries/` with `import 'server-only'`) or interactive Client leaf.
2. For UI tasks, specify upfront:
   - Which `@/components/ui/*` primitives and `.glass-*` tokens from `globals.css` will be reused.
   - How all 5 UI states behave: `default`, `loading`, `empty`, `error`, and `mobile 375px`.
3. For API routes: determine Zod schema (`src/lib/validation/schemas.ts`), `enforceRateLimit`, and `withAdminRoute`.

---

### Stage 2: Test Spec (TDD First)
Create or update tests in `tests/` before finalizing implementation:
- Unit & UI logic: `tests/unit/<module>.test.ts(x)` (Node or jsdom via `@testing-library/react`).
- API / Webhook integration: `tests/integration/<flow>.test.ts`.
- Visual / Route E2E smoke tests: `tests/e2e/<flow>.spec.ts` (Playwright).

---

### Stage 3: Clean Assembly
- Reuse `@/components/ui/*`, `@/lib/cn`, `@/lib/format`, and `react-hook-form` + Zod resolvers.
- Respect file budgets: Components/hooks `< 250` lines; `src/app/**/page.tsx` `< 80` lines.
- Never use `window.confirm()` / `window.alert()`; use `<ConfirmDialog />` and `sonner` `toast`.

---

### Stage 4: Automated Verification Harness
Run quick checks during iteration and the full harness before concluding:

```bash
# Quick check during coding:
npm run harness:quick

# Full production harness:
npm run harness
```

`npm run harness` verifies:
1. `npm run check:arch` — File line-count budgets (`< 250` / `< 80`), bans `alert()`/`confirm()`, checks internal links.
2. `npx knip` — Detects unused files, exports, and dependencies.
3. `npm run lint` — ESLint & Next.js rules.
4. `vitest run` — All unit, UI component, and integration tests pass.
5. `npx tsc --noEmit` — Zero TypeScript errors.
6. `next build` — Clean production compilation.

---

### Stage 5: Browser Visual & Security Audit
For any UI change, run `npm run test:e2e` (or verify via `/browser` at **`375×812`** mobile and **`1280×800`** desktop):
- Zero console errors or uncaught page errors.
- Zero horizontal overflow (`scrollWidth <= innerWidth`).
- Legible text contrast on glass surfaces, non-overlapping sticky bars, zero 404 internal links.
- Security: No committed `.env.local`, no raw secrets, no open write RLS policies.
