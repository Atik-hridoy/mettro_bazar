'use client';

import React from 'react';
import { CHALDAL_PRODUCTS, Product } from '@/lib/constants';
import { ProductCard } from '@/components/common/ProductCard';

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery = '',
  selectedCategory = 'popular',
}) => {
  const filteredProducts = CHALDAL_PRODUCTS.filter((prod) => {
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.banglaName && prod.banglaName.includes(searchQuery)) ||
      (prod.category && prod.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.categorySlug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        {searchQuery ? (
          <h2 className="text-sm font-medium text-zinc-600">
            Search result for: <strong className="font-bold text-zinc-900">{searchQuery}</strong>
          </h2>
        ) : (
          <h2 className="text-base font-semibold text-zinc-900">
            Daily Essentials & Grocery
          </h2>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No products found for "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((prod: Product) => (
            <ProductCard
              key={prod.id}
              product={prod}
              categoryName={prod.category || prod.categorySlug}
            />
          ))}
        </div>
      )}
    </section>
  );
};
