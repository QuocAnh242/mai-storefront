import React from 'react';
import { HeroSlider } from '@/features/storefront/HeroSlider';
import { FeaturedProductsSection } from '@/features/storefront/FeaturedProductsSection';
import { getCategories, getFeaturedProducts, getProducts } from '@/lib/queries';

export const revalidate = 60;

export default async function HomePage() {
  const [featuredProducts, allProductsRes, categories] = await Promise.all([
    getFeaturedProducts(12),
    getProducts({ limit: 150 }),
    getCategories(),
  ]);

  return (
    <div className="space-y-8">
      <HeroSlider />
      <FeaturedProductsSection
        products={allProductsRes.products}
        featuredProducts={featuredProducts}
        categories={categories}
      />
    </div>
  );
}
