'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ProductGrid } from '@/components/home/ProductGrid';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Centered Flat Hero Section with search bar */}
      <HeroSection onSearch={(query) => setSearchQuery(query)} />

      {/* Trust Badges */}
      <FeatureCards />

      {/* Flat Full-Width Popular Categories */}
      <CategoryGrid onSelectCategory={(catId) => setSelectedCategory(catId)} />

      {/* Product Catalog */}
      <ProductGrid
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
