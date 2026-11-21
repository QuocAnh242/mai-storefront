import React from 'react';
import { HeroSlider } from '@/features/storefront/HeroSlider';
import { FeaturedProductsSection } from '@/features/storefront/FeaturedProductsSection';

export const revalidate = 60; // ISR: 60s

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSlider />
      <FeaturedProductsSection />
    </div>
  );
}
