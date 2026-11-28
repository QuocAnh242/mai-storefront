import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/queries';
import { buildProductJsonLd, buildProductMetadata } from '@/lib/seo/structuredData';
import { ProductDetailView } from '@/features/products/ProductDetailView';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return buildProductMetadata(product, slug);
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, 4);
  const jsonLd = buildProductJsonLd(product, slug);

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
