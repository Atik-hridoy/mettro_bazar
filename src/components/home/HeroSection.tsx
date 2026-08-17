'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBasket, Pill, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS } from '@/lib/translations';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { language } = useCartStore();
  const t = TRANSLATIONS[language];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <section
      style={{
        background: 'linear-gradient(180deg, #E2D3F7 0%, #EDE3FB 45%, #F7F2FD 80%, #FFFFFF 100%)',
      }}
      className="w-full py-10 sm:py-14 px-4 sm:px-6 lg:px-8 border-b border-purple-100/60 overflow-hidden select-none"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        {/* Left: Headline & Search Input (Plus Mobile Service Buttons) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-5 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 leading-tight">
            {language === 'BN'
              ? 'আপনার প্রয়োজনীয় বাজার সরাসরি দরজায়'
              : 'Grocery Delivered at your Doorstep'}
          </h1>

          {/* Authentic Chaldal Search Input with Right Search Icon */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={t.searchPlaceholder}
                className="w-full pl-4 pr-11 py-3 text-xs sm:text-sm bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded-sm focus:outline-none focus:border-[#7533CB] shadow-2xs"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-[#7533CB] cursor-pointer"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* Mobile Only: 3 Colorful Service Cards (Hidden on Web Desktop) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-md pt-1 lg:hidden">
            {/* 1. Grocery (Yellow) */}
            <Link
              href="/category/food"
              className="flex flex-col items-center justify-center py-3.5 px-2 bg-[#FEE589] hover:bg-[#FDD835] rounded-xl shadow-xs hover:shadow-sm transition-all text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-amber-700 shadow-2xs mb-1.5 group-hover:scale-110 transition-transform">
                <ShoppingBasket className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                {language === 'BN' ? 'গ্রোসারি' : 'Grocery'}
              </span>
            </Link>

            {/* 2. Pharmacy (Cyan) */}
            <Link
              href="/category/health-wellness"
              className="flex flex-col items-center justify-center py-3.5 px-2 bg-[#79D4E2] hover:bg-[#4DD0E1] rounded-xl shadow-xs hover:shadow-sm transition-all text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-cyan-700 shadow-2xs mb-1.5 group-hover:scale-110 transition-transform">
                <Pill className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                {language === 'BN' ? 'ফার্মেসি' : 'Pharmacy'}
              </span>
            </Link>

            {/* 3. Cookups (Green) */}
            <Link
              href="/category/food"
              className="flex flex-col items-center justify-center py-3.5 px-2 bg-[#9DE0A0] hover:bg-[#81C784] rounded-xl shadow-xs hover:shadow-sm transition-all text-center group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-emerald-700 shadow-2xs mb-1.5 group-hover:scale-110 transition-transform">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-zinc-900">
                {language === 'BN' ? 'কুকআপস' : 'Cookups'}
              </span>
            </Link>
          </div>
        </div>

        {/* Desktop Only: Exact Chaldal Photo Collage (Visible on Web Desktop, hidden on Mobile Phone) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-5 items-center gap-2.5 overflow-hidden">
          {/* Card 1: Delivery Hero with Blue Crate */}
          <div className="w-40 sm:w-48 h-56 sm:h-64 rounded-xl overflow-hidden shadow-sm bg-white shrink-0">
            <img
              src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=500&auto=format&fit=crop&q=80"
              alt="Metro Bazar Delivery Associate"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Column 2: Garlic/Potatoes (Top) + Supermarket Aisle (Bottom) */}
          <div className="flex flex-col gap-2.5 w-32 sm:w-36 shrink-0">
            <div className="h-26 sm:h-30 rounded-xl overflow-hidden shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80"
                alt="Fresh produce"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-26 sm:h-30 rounded-xl overflow-hidden shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80"
                alt="Metro Bazar Grocery Aisle"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Column 3: Customer Handover (Top) + Express Bike Rider (Bottom) */}
          <div className="flex flex-col gap-2.5 w-36 sm:w-40 shrink-0">
            <div className="h-32 sm:h-36 rounded-xl overflow-hidden shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80"
                alt="Customer delivery handover"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-20 sm:h-24 rounded-xl overflow-hidden shadow-sm bg-white">
              <img
                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&auto=format&fit=crop&q=80"
                alt="Delivery Rider on Bike"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
