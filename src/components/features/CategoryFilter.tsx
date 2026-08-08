import React from 'react';
import type { Category } from '../../types/category';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
