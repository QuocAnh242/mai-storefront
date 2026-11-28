---
name: natural-ui-craft
description: >-
  Definitive runbook and design token reference for crafting Navy Glassmorphism &
  crisp e-commerce UI in this repository. Use whenever creating or modifying UI
  components, pages, modals, cards, or styling.
---

# Crafted Navy Glassmorphism — Design System & UI Kit Guide

This skill enforces a refined, high-contrast **Navy + Crafted Glassmorphism** aesthetic tailored for the MAI KIM TUYẾN storefront and admin panel.

## 1. Glassmorphism & Surface Tokens (`src/app/globals.css`)

Glassmorphism IS welcomed and encouraged on **elevated, sticky, and overlay surfaces**, while dense reading cards and data tables stay crisp white.

### Standardized Glass Classes
- **`.glass-nav`** (Dark Navy translucent header/sticky bar): `bg-sky-950/90 backdrop-blur-md border-b border-white/15`
- **`.glass-nav-light`** (Light sticky bar / mobile bottom bar): `bg-white/85 backdrop-blur-md border-t border-slate-200/80`
- **`.glass-surface`** (Light translucent badge / floating dock / hero pill): `bg-white/80 backdrop-blur-md border border-white/60 shadow-sm`
- **`.glass-surface-dark`** (Glass button/card over dark photography): `bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white`
- **`.glass-modal-backdrop`** & **`.glass-modal-panel`**:
  - Backdrop: `bg-slate-950/60 backdrop-blur-xs`
  - Panel: `bg-white/95 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl`

### Practical Glass Rules (Prevent UX & GPU Issues)
1. Never stack two `backdrop-blur-*` layers directly inside one another.
2. Never put translucent glass on multi-column admin tables or long-form blog text.
3. Always verify text contrast: `text-white` / `text-sky-100` on dark glass; `text-slate-900` / `text-slate-700` on light glass.
4. No neon rainbow gradients (`from-purple-500 via-pink-500 to-indigo-500`), no cheesy AI emojis (`✨`, `🚀`, `🤖`).

---

## 2. Color & Radius Tokens

- **Brand Primary**: Navy `sky-950` (`#082f49`) & `sky-700` (`#0369a1`)
- **Craft Accent**: Warm Amber `amber-600` (`#d97706`) for glitter highlights & featured tags
- **Semantic Accents**: Emerald `emerald-600` (in-stock, paid), Rose `rose-600` (discount, destructive)
- **Content Surfaces**: Canvas `bg-slate-50` (`#f8fafc`) / `bg-white`; cards `bg-white border border-slate-200 rounded-xl`
- **Unified Radius Scale**:
  - Inputs, buttons, small controls: `rounded-lg`
  - Product cards, dropdowns, filter panels: `rounded-xl`
  - Modals, hero containers, banners: `rounded-2xl`
  - Badges & filter pills: `rounded-full`

---

## 3. Mandatory UI Kit Primitives & Utilities

Never hand-roll repeated modal portals, confirm dialogs, buttons, or price formatters:
- **Components (`@/components/ui/`)**: `Button`, `Badge`, `Card`, `Modal`, `ConfirmDialog`, `FormField` (`Input`, `Select`, `Textarea`), `Pagination`, `EmptyState`, `Loading`.
- **Class Merging**: Always use `cn()` from `@/lib/cn`.
- **Formatting**: Always use `formatVND()`, `isContactProduct()`, and `formatDateVN()` from `@/lib/format`.
- **Notifications**: Use `toast` from `sonner` (never `window.alert` or `window.confirm`).
- **Animations**: Powered by `tw-animate-css` (`animate-in fade-in zoom-in-95`).
- **Icons**: Strictly `lucide-react` (`w-4 h-4`, `w-5 h-5`, `w-6 h-6`) with uniform `strokeWidth={1.75}` or `2`.
