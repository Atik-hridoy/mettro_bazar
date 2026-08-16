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
    <section className="w-full bg-white py-10 sm:py-14 px-4 sm:px-6 border-b border-zinc-200">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* Centered H1 Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
          Groceries delivered in 1 hour
        </h1>

        {/* Single Wide Search Bar with Magnifying Glass inside the left side */}
        <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl">
          <div className="relative w-full flex items-center">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for products (e.g. eggs, milk, potato)"
              className="w-full pl-11 pr-4 py-3 text-sm bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded-sm focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 transition-colors"
            />
          </div>
        </form>
      </div>
    </section>
  );
};
