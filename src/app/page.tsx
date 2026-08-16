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
      {/* 1. Hero with soft lavender gradient & live photo collage */}
      <HeroSection onSearch={(query) => setSearchQuery(query)} />

      {/* 2. Exact 4 Chaldal Trust Badges */}
      <FeatureCards />

      {/* 3. Popular Categories horizontal row & Popular on Chaldal brand logos */}
      <CategoryGrid onSelectCategory={(catId) => setSelectedCategory(catId)} />

      {/* 4. Product Catalog with Chaldal circular plus buttons & instant cart sync */}
      <ProductGrid
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
