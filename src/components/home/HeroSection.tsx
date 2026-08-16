'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

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
    <section className="w-full bg-gradient-to-b from-[#EBE1FB] via-[#EFE9FB] to-[#F5F1FD] py-10 px-4 sm:px-6 lg:px-8 border-b border-purple-100 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Headline & Wide Search Input */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-zinc-900 leading-[1.15]">
            Grocery Delivered at your Doorstep
          </h1>

          {/* Authentic Chaldal Search Input with Right Search Icon */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for products (e.g. eggs, milk, potato)"
                className="w-full pl-4 pr-11 py-3 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded-sm focus:outline-none focus:border-[#7533CB] shadow-2xs"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-[#7533CB]"
                aria-label="Submit search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* Right: Exact Chaldal Photo Collage */}
        <div className="lg:col-span-6 xl:col-span-5 flex items-center gap-2.5 overflow-hidden">
          {/* Card 1: Delivery Hero with Blue Crate */}
          <div className="w-40 sm:w-48 h-56 sm:h-64 rounded-xl overflow-hidden shadow-sm bg-white shrink-0">
            <img
              src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=500&auto=format&fit=crop&q=80"
              alt="Chaldal Delivery Associate"
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
                alt="Chaldal Grocery Aisle"
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
