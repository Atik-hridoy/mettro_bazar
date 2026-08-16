'use client';

import React from 'react';
import { POPULAR_CATEGORIES, PopularCategory } from '@/lib/constants';

interface CategoryGridProps {
  onSelectCategory?: (id: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Category Section Title */}
      <div className="mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
          Popular Categories
        </h2>
      </div>

      {/* Horizontal Full-Width Grid of Flat Category Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {POPULAR_CATEGORIES.map((cat: PopularCategory) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            className="flex flex-col items-center text-center p-2.5 bg-white border border-zinc-200 rounded-sm hover:border-zinc-400 transition-colors cursor-pointer group"
          >
            {/* Category Image */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2 flex items-center justify-center overflow-hidden">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Category Name */}
            <span className="text-xs font-medium text-zinc-800 group-hover:text-[#6A1B9A] line-clamp-2 leading-tight">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
