'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { FeatureCards } from '@/components/home/FeatureCards';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { GuestBottomSection } from '@/components/home/GuestBottomSection';
import { RegisteredHomeView } from '@/components/home/RegisteredHomeView';
import { useCartStore } from '@/store/useCartStore';

export default function HomePage() {
  const { user } = useCartStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('popular');

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {user?.isLoggedIn ? (
        /* Personalized Logged-in Home View matching Chaldal 1:1 */
        <RegisteredHomeView />
      ) : (
        /* Guest Home View */
        <>
          {/* 1. Hero with soft lavender gradient & photo collage */}
          <HeroSection onSearch={(query) => setSearchQuery(query)} />

          {/* 2. Exact 4 Trust Badges */}
          <FeatureCards />

          {/* 3. Popular Categories horizontal row & Brand logos */}
          <CategoryGrid onSelectCategory={(catId) => setSelectedCategory(catId)} />

          {/* 4. Bottom Section: Currently Delivering In & Common Questions FAQ matching Screenshot 1:1 */}
          <GuestBottomSection />
        </>
      )}
    </div>
  );
}
