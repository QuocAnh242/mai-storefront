---
name: natural-ui-craft
description: >-
  Definitive runbook and design token reference for crafting flat, modern, natural UI
  without artificial AI aesthetics. Use whenever creating or modifying UI components,
  pages, modals, cards, or styling in this repository.
---

# Natural UI Craft — Anti-AI-Slop Design System

This skill enforces human-crafted, tactile, and natural e-commerce aesthetics, strictly preventing generic "AI slop" in this codebase.

## Core Rules

### 1. Absolute Bans
- No glowing gradients (e.g. `bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500`).
- No heavy glassmorphism blur stacks (`backdrop-blur-xl bg-white/20`).
- No tacky AI emojis or badges (`✨`, `🚀`, `🤖`, `AI-Powered`).
- No AI-generated arbitrary SVGs with weird bezier curves.

---

### 2. Standardized Iconography: Lucide React Only
Every icon in the UI must be imported from `lucide-react`.

Standard Sizing Scale:
- `w-4 h-4` (16px): Inline status indicators, badges, table actions.
- `w-5 h-5` (20px): Form inputs, standard buttons, navigation items.
- `w-6 h-6` (24px): Page headers, feature highlights, modal titles.

Stroke Width:
- Maintain uniform `strokeWidth={1.5}` or `strokeWidth={2}` across the component. Never mix random stroke widths.

---

### 3. Design Tokens & Styling Primitives

Use standard Tailwind v4 classes and design tokens defined in `src/app/globals.css`:

#### Surfaces & Borders
- Canvas Background: `bg-slate-50` (`#f8fafc`) or pure `bg-white` (`#ffffff`).
- Flat Card Surface: `bg-white border border-slate-200 rounded-lg`.
- Hover Interaction: `hover:border-slate-300 hover:bg-slate-50/50`.
- Shadows: Use micro-shadows `shadow-xs` or `shadow-sm`. Never use fuzzy glowing drop-shadows.

#### Typography & Text Hierarchy
- Headings: `text-slate-900 font-semibold tracking-tight`.
- Body Copy: `text-slate-600 text-sm leading-relaxed`.
- Subdued / Meta: `text-slate-400 text-xs`.
- Primary Accent: Amber `amber-600` (`#d97706`) for craft & glitter branding.
- Success Accent: Emerald `emerald-600` (`#059669`) for stock & payment status.
- Destructive Accent: Rose `rose-600` (`#e11d48`) for delete & alerts.

---

### 4. Component Structure Best Practices
- Keep components small and focused in `src/features/[domain]/`.
- Prefer flat layout with crisp 1px borders over nested card cards.
- Ensure all interactive elements have accessible focus rings (`focus-visible:ring-2 focus-visible:ring-slate-900/10`).
