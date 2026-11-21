---
name: harness-engineering
description: >-
  Standard engineering harness and test-driven development workflow for authoring,
  refactoring, and verifying code in the MAI KIM TUYẾN store. Use whenever implementing
  new features, modifying API routes, altering database queries, or verifying clean code.
---

# Harness Engineering & Verification Workflow

This skill defines the rigorous, test-backed execution harness for all AI engineering tasks in this repository.

## The 5-Stage Harness Loop

Every code change must cycle through these 5 stages deterministically:

```
[1. Contract] ---> [2. Test Spec] ---> [3. Implementation] ---> [4. Harness Run] ---> [5. Security Audit]
```

---

### Stage 1: Contract & Specification
1. Inspect the target module or route.
2. Determine input schema constraints (Zod) and expected output statuses.
3. Identify sensitive boundaries:
   - Does this endpoint require rate limiting? (`enforceRateLimit`)
   - Does this endpoint require admin privileges? (`verifyAdminAuth` / `withAdminRoute`)
   - Does this query respect Row-Level Security? (Never bypass RLS with open policies)

---

### Stage 2: Test Specification (TDD First)
Before writing or refactoring functional logic, create or update a test in `tests/`:
- Unit logic: `tests/unit/<module>.test.ts`
- API / Webhook integration: `tests/integration/<flow>.test.ts`

Define test cases covering:
- Happy path (valid input, expected success status)
- Boundary violations (tampered data, oversized inputs, bad signatures)
- Idempotency & fail-open resilience (repeat executions must not corrupt state)

---

### Stage 3: Clean Implementation
Implement the minimal code required to satisfy the contract:
- Keep Server Components as the default. Add `'use client'` only on interactive leaf components.
- Validate incoming data with Zod schemas from `src/lib/validation/schemas.ts`.
- Wrap administrative handlers with `withAdminRoute` to guarantee standardized error handling and session continuity.

---

### Stage 4: Harness Verification Loop
Execute the verification harness. All checks must pass with zero warnings or errors:

```bash
# Quick validation during development:
npm run harness:quick

# Full production harness before concluding task:
npm run harness
```

The harness enforces:
1. `vitest run` — 100% test cases pass.
2. `npx tsc --noEmit` — 0 TypeScript compilation errors.
3. `next build` — Clean Turbopack production compilation without hydration mismatches or missing exports.

---

### Stage 5: Security & Anti-Regression Audit
Verify before finishing:
- No `.env.local` or raw secret strings committed.
- No public write RLS policies created.
- No untested or unverified branches left in code.
