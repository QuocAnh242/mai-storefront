---
name: ecommerce-ux-design
description: >-
  Complete UX/UI and shopper ergonomics guide for the MAI KIM TUYẾN store. Use whenever
  designing, refactoring, or building storefront layouts, cart workflows, checkout funnels,
  product display cards, mobile interactions, and trust signals.
---

# E-Commerce UX & Customer Experience Design

This skill defines user-centered design patterns and conversion-rate optimization (CRO) best practices for the MAI KIM TUYẾN store.

## Shopper Profile & Context

- **Audience**: Vietnamese handicraft makers, school teachers, event planners, packaging businesses, and DIY enthusiasts.
- **Device Profile**: 75%+ of traffic originates from mobile devices (via Zalo, Facebook, and mobile search).
- **Payment Culture**: Heavy preference for quick VietQR bank transfer (PayOS) and Cash on Delivery (COD).
- **Primary Objections**: Product authenticity, exact glitter grain size, true color under light, delivery speed, and wholesale pricing transparency.

---

## 1. Mobile-First Ergonomics

1. **Touch Target Size**:
   - All interactive controls (buttons, quantity pickers, variant selectors) must have a minimum touch area of `44x44px`.
2. **Sticky Mobile Action Bar**:
   - On product detail pages (`/products/[...slug]`), provide a fixed bottom bar on mobile (`sm:hidden`) with:
     - Clear unit price display.
     - Primary button: "Thêm vào giỏ" / "Mua ngay".
     - Quick hotline/Zalo consultation link.
3. **Zero Horizontal Overflow**:
   - Every table, grid, and image gallery must adapt responsively (`overflow-x-auto` with clean scroll indicators if tables are required).
4. **Form Inputs**:
   - Explicit `inputMode` attributes (`numeric` for phone numbers and quantities).
   - Instant inline error messages below the field rather than alert modals.

---

## 2. Product Detail Page (PDP) Architecture

Organize product information to resolve purchasing friction in seconds:

1. **Visual Proof**:
   - Image carousel with thumbnail navigation.
   - High-resolution close-ups highlighting grain texture and real light reflection.
2. **Pricing & Unit Transparency**:
   - High-contrast price (`text-slate-900 font-bold text-xl`).
   - Clearly state the unit: "hũ 100g", "bịch 500g", "kg", "cuộn".
   - Original crossed-out price (`line-through text-slate-400 text-sm`) only when a genuine discount exists.
3. **Specifications Table**:
   - Clean 1px border grid detailing:
     - Kích thước hạt (Grain size): 0.2mm (siêu mịn), 0.4mm, 1mm (hạt to).
     - Chất liệu (Material): PET chịu nhiệt, không phai màu.
     - Ứng dụng (Application): Làm slime, tranh cát, trang trí nail, làm hoa sáp.
4. **Real Customer Reviews**:
   - Average rating breakdown, verified purchase badges, customer photos, and shop responses.

---

## 3. Frictionless Checkout Funnel

1. **Single-Page Checkout**:
   - Avoid multi-step wizard traps. Combine Customer Info, Shipping Address, and Payment Method on a single readable view.
2. **VietQR Payment Flow**:
   - Generate instant VietQR using PayOS.
   - Display order code, exact amount, and real-time polling or webhook status listener.
   - Prominently show download QR button and bank details for manual copy-pasting.
3. **Cart Drawer / Mini-Cart**:
   - Slide-over cart preview with instant quantity adjustment (`+` / `-`).
   - Clear subtotal calculation with no hidden fees.

---

## 4. Trust Signals & Reassurance

- Highlight official hotline & Zalo directly in the navigation and footer.
- Clearly present shop guarantees: "Kiểm tra hàng trước khi thanh toán", "Đổi trả trong 7 ngày nếu lỗi xưởng".
- Professional shop replies on product reviews to demonstrate active customer support.
