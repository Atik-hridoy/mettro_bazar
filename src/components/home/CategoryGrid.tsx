'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Folder } from 'lucide-react';
import { BRAND_PARTNERS, CategoryItem, CATEGORY_TREE } from '@/lib/constants';
import { fetchCategoriesFromBackend } from '@/lib/api';

interface CategoryGridProps {
  onSelectCategory?: (id: string) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory }) => {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const foodRoot = CATEGORY_TREE.find((c) => c.slug === 'food');
    return foodRoot?.children && foodRoot.children.length > 0 ? foodRoot.children : CATEGORY_TREE;
  });

  useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      const fetched = await fetchCategoriesFromBackend();
      if (isMounted && fetched && fetched.length > 0) {
        setCategories(fetched);
      }
    }
    loadCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (cat: CategoryItem) => {
    if (onSelectCategory) {
      onSelectCategory(cat.id);
    }
    router.push(`/category/${cat.slug}`);
  };

  return (
    <div className="w-full space-y-8">
      {/* 1. Popular Categories */}
      <section className="w-full py-4 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="w-16" /> {/* spacer for center alignment */}
          <h2 className="text-xl font-semibold text-zinc-900 text-center flex-1">
            Popular Categories
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="#categories"
              className="text-xs font-semibold text-[#7533CB] hover:underline"
            >
              View All
            </a>
            <div className="flex gap-1 ml-1">
              <button
                onClick={() => scroll('left')}
                className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Scroll Left"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-6 h-6 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Scroll Right"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Categories Row */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 scroll-smooth"
        >
          {categories.map((cat: CategoryItem) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="shrink-0 w-36 sm:w-40 bg-white border border-zinc-200 rounded-xl p-3 flex flex-col items-center justify-between hover:shadow-xs transition-shadow cursor-pointer group"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-2 overflow-hidden bg-zinc-50 rounded-lg">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Folder className="w-10 h-10 text-purple-400 opacity-60" />
                )}
              </div>

              <span className="text-xs font-medium text-zinc-800 text-center line-clamp-2 leading-tight group-hover:text-[#7533CB] transition-colors">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Popular on METRO BAZAR (Brand Logos) */}
      <section className="w-full py-4 px-4 sm:px-6 max-w-7xl mx-auto border-t border-zinc-100">
        <h3 className="text-base font-semibold text-zinc-900 text-center mb-6">
          Popular on METRO BAZAR
        </h3>

        <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap opacity-80">
          {BRAND_PARTNERS.map((brand) => (
            <div
              key={brand.name}
              className="px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors flex items-center justify-center min-w-[90px]"
            >
              <span className="text-xs font-black tracking-wider text-zinc-700 uppercase">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
