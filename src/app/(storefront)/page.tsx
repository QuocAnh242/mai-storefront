'use client';

import React from 'react';
import { HeroSlider } from '@/features/storefront/HeroSlider';
import { FeaturedProductsSection } from '@/features/storefront/FeaturedProductsSection';
import { PartnersSection } from '@/features/storefront/PartnersSection';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSlider />
      <FeaturedProductsSection />
      <PartnersSection />
    </div>
  );
}
