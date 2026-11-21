import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { ProductDetailView } from '@/features/products/ProductDetailView';

export const revalidate = 60; // ISR: 60 seconds

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Không tìm thấy sản phẩm - Mai Kim Tuyến',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';
  const pageUrl = `${siteUrl}/products/${Array.isArray(slug) ? slug.join('/') : slug}`;
  const thumbnail = product.images?.[0] || `${siteUrl}/hero.jpg`;

  return {
    title: `${product.title} - Mai Kim Tuyến`,
    description:
      product.description ||
      `Sản phẩm ${product.title} chất lượng cao, cung cấp sỉ lẻ tại Chợ Lớn TP.HCM bởi Mai Kim Tuyến.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${product.title} - Mai Kim Tuyến`,
      description: product.description || `Cung cấp sỉ lẻ ${product.title} tại Chợ Lớn TP.HCM`,
      url: pageUrl,
      siteName: 'Mai Kim Tuyến Store',
      images: [
        {
          url: thumbnail,
          width: 800,
          height: 800,
          alt: product.title,
        },
      ],
      locale: 'vi_VN',
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 4);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maikimtuyen.io.vn';
  const productUrl = `${siteUrl}/products/${Array.isArray(slug) ? slug.join('/') : slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.images && product.images.length > 0 ? product.images : [`${siteUrl}/hero.jpg`],
    description: product.description || product.title,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'Mai Kim Tuyến',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'VND',
      price: product.price > 1 ? product.price : 0,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Mai Kim Tuyến Store',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailView initialProduct={product} initialRelatedProducts={relatedProducts} />
    </>
  );
}
