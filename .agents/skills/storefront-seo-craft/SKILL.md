---
name: storefront-seo-craft
description: >-
  End-to-end technical and on-page SEO guide for ranking the MAI KIM TUYẾN store on Google
  search. Use whenever modifying page metadata, creating sitemaps, optimizing product detail
  pages, writing blog articles, adding structured data (JSON-LD), or auditing Core Web Vitals.
---

# Storefront SEO & Organic Search Optimization

This skill provides the comprehensive strategy, technical guidelines, and keyword architecture to maximize the search visibility of the MAI KIM TUYẾN store.

## 1. Domain & Keyword Architecture

### Core Brand & Entity
- **Brand Name**: Xưởng Bột Kim Tuyến & Phụ Liệu Mai Kim Tuyến
- **Primary Domain**: https://www.maikimtuyen.io.vn
- **Core Entity Types**: Cửa hàng bán bột kim tuyến sỉ lẻ, xưởng cung cấp băng keo đóng hàng, phụ liệu làm đồ thủ công handmade.

### High-Intent Keyword Clusters
1. **Bột Kim Tuyến (Glitter Powders)**:
   - "bột kim tuyến", "kim tuyến siêu mịn 0.2mm", "bột kim tuyến vàng đồng", "kim tuyến nhiều màu giá rẻ", "mua bột kim tuyến làm nail", "bột kim tuyến làm hoa sáp", "xưởng cung cấp kim tuyến sỉ tphcm".
2. **Băng Keo & Đóng Gói (Packaging Materials)**:
   - "băng keo trong 50 mic cuộn lớn", "băng dính dán thùng giá sỉ", "xưởng sản xuất băng keo tphcm".
3. **Nội dung Chia Sẻ (Knowledge / Blog)**:
   - "cách pha keo rắc kim tuyến không bị rơi", "hướng dẫn bảo quản bột kim tuyến", "ý tưởng trang trí quà handmade với kim tuyến".

---

## 2. Next.js 16 Dynamic Metadata Standard

Every route file (`page.tsx`) must export or generate comprehensive metadata:

```typescript
import type { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';
  const pageUrl = `${siteUrl}/products/${product.slug}`;

  return {
    title: `${product.title} - Bột Kim Tuyến Mai Kim Tuyến`,
    description: product.description.slice(0, 160),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      url: pageUrl,
      siteName: 'Mai Kim Tuyến Store',
      images: [
        {
          url: product.images[0] || `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description.slice(0, 160),
    },
  };
}
```

---

## 3. Structured Data (Schema.org JSON-LD)

Inject schema markup using `<script type="application/ld+json">` to qualify for Google Rich Snippets:

### Product Schema (Product Detail Pages)
```json
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "Bột Kim Tuyến Vàng Đồng Siêu Mịn",
  "image": ["https://www.maikimtuyen.io.vn/images/gold-glitter.jpg"],
  "description": "Bột kim tuyến hạt siêu mịn 0.2mm nhập khẩu, màu sắc lấp lánh bền đẹp.",
  "sku": "BKT-VD-02",
  "brand": {
    "@type": "Brand",
    "name": "Mai Kim Tuyến"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.maikimtuyen.io.vn/products/bot-kim-tuyen-vang-dong",
    "priceCurrency": "VND",
    "price": "45000",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Mai Kim Tuyến Store"
    }
  }
}
```

### LocalBusiness / Store Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Store",
  "name": "Xưởng Bột Kim Tuyến Mai Kim Tuyến",
  "url": "https://www.maikimtuyen.io.vn",
  "telephone": "+84-90-XXX-XXXX",
  "priceRange": "15,000đ - 500,000đ",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Hồ Chí Minh",
    "addressCountry": "VN"
  }
}
```

---

## 4. On-Page SEO & Content Best Practices

1. **Semantic Heading Hierarchy**:
   - Exactly one `<h1>` per page reflecting primary keyword intent.
   - Logical subheadings `<h2>` for specs/reviews, and `<h3>` for cards.
2. **Image SEO**:
   - Every `<img>` or Next.js `<Image>` MUST include a descriptive Vietnamese `alt` attribute (e.g. `alt="Hũ bột kim tuyến vàng đồng hạt siêu mịn 100g làm đồ thủ công"`).
   - Use Cloudinary auto-format (`f_auto,q_auto`) for modern WebP/AVIF delivery.
3. **Internal Linking**:
   - Cross-link related products (e.g. glitter powder pages link to adhesive tape / packaging supplies).
   - Blog articles link to relevant products mentioned in tutorial steps.
4. **Core Web Vitals**:
   - Zero Cumulative Layout Shift (CLS): Explicit width/height on all images.
   - Fast Largest Contentful Paint (LCP): Add `priority` to above-the-fold hero and product images.
