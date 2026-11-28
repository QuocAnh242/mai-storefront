---
name: ecommerce-ux-design
description: >-
  Complete UX/UI and shopper ergonomics guide for the MAI KIM TUYẾN store. Use whenever
  designing, refactoring, or building storefront layouts, product discovery, product detail
  pages, mobile interactions, and trust signals.
---

# E-Commerce UX & Wholesale/Retail Lead Design

This skill defines user-centered UX patterns and conversion optimization for the MAI KIM TUYẾN storefront.

## Shopper Profile & Business Model

- **Audience**: Vietnamese handicraft makers, school teachers, event planners, construction/terrazzo workshops, packaging businesses, and retail DIY buyers.
- **Device Profile**: 75%+ of traffic originates from mobile devices (via Zalo, Facebook, and mobile search).
- **Buying Channel (IMPORTANT)**:
  - The public storefront operates on a **Direct Contact / Quote Model (Zalo, Hotline, Messenger)** — customers contact directly for wholesale/retail pricing, grain sizing, color charts, and shipping.
  - **Online Cart / Self-Checkout / PayOS on the storefront is UNPUBLIC/DISABLED.** Do NOT add "Thêm vào giỏ", "Mua ngay", Cart Drawer triggers, or public payment forms to storefront pages unless explicitly requested by the owner.
- **Primary Shopper Objections**: True color under light, exact glitter grain size (`0.2mm`, `0.4mm`, `1mm`, `1/128`, `1/96`...), stock availability, and chành xe / nationwide delivery transparency.

---

## 1. Mobile-First Ergonomics (`375px` Baseline)

1. **Touch Target Size**: All interactive controls (buttons, pills, gallery arrows) must have a comfortable touch area (`>= 40-44px` height on primary CTAs).
2. **Sticky Mobile Action Bar (PDP)**:
   - Fixed bottom bar on mobile (`sm:hidden`) using `.glass-nav-light`.
   - Must check `isContactProduct(product)` (`isContactPrice || price <= 1`): show `"Liên hệ báo giá"` instead of `"0 ₫"` or `"1 ₫"`.
   - Actions: Quick Call button + prominent `"Zalo Báo Giá Sỉ"` CTA.
3. **Coordinated Floating Dock**:
   - Combine `FloatingChatWidget` and `ScrollToTop` inside a single `FloatingActionDock` so spacing adjusts cleanly when a mobile sticky bar is present — never hardcode magic pixel offsets across separate files.
4. **Zero Horizontal Overflow**: Every grid, category scroll bar, and specs table must fit `375px` cleanly without page-level horizontal scrolling.

---

## 2. Unified Product Discovery & Filtering

1. **Single URL Source of Truth (`/products`)**:
   - Filters (`category`, `sub`, `q`, `price`, `sort`, `page`) must live in URL search params via `nuqs`.
   - Clicking a category or subcategory in Header MegaMenu, CategoryTabs, Homepage CategoryScrollBar, or Footer must navigate cleanly and preserve shareable URLs.
2. **Accent-Insensitive Vietnamese Search**:
   - Always use `filterProductsBySearch()` / `normalizeSearchQuery()` from `src/lib/searchUtils.ts`.

---

## 3. Product Detail Page (PDP) Architecture

1. **Visual Proof**: Swipeable image carousel (`next/image` with crisp sizing) + fullscreen lightbox zoom.
2. **Stock & Pricing Transparency**:
   - Reflect real `product.inStock` status (`Sẵn kho TP.HCM` vs `Tạm hết hàng / Liên hệ đặt trước`).
   - Display `formatVND(product.price)` or `"Liên hệ báo giá"` via `isContactProduct()`, plus genuine `originalPrice` strikethrough and savings badge.
3. **Specifications Table (`product.specs`)**:
   - Render `product.specs` cleanly (e.g. Kích thước hạt, Chất liệu, Quy cách đóng gói, Ứng dụng) whenever present.
4. **Real Customer Reviews & Trust Signals**:
   - Verified review summary, customer feedback, shop replies, and trust guarantees ("Hỗ trợ gửi chành xe toàn quốc", "Đổi trả nếu sai quy cách").
5. **No Broken Links**: All footer policy/support links (e.g. `/privacy-policy`, `/return-policy`, `/contact`) must resolve to real pages.
