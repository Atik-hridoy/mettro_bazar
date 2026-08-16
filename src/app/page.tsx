'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { CategoryGrid } from '@/components/home/CategoryGrid';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. Hero with soft lavender gradient & photo collage */}
      <HeroSection onSearch={(query) => setSearchQuery(query)} />

      {/* 2. Exact 4 Trust Badges */}
      <FeatureCards />

      {/* 3. Popular Categories horizontal row & Brand logos */}
      <CategoryGrid onSelectCategory={(catId) => setSelectedCategory(catId)} />
    </div>
  );
}
