'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/lib/constants';
import { fetchProductsFromBackend } from '@/lib/api';
import { ProductCard } from '@/components/common/ProductCard';
import { Pagination } from '@/components/common/Pagination';

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
}

const ITEMS_PER_PAGE = 12;

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery = '',
  selectedCategory = 'popular',
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function loadProducts() {
      setIsLoading(true);
      const data = await fetchProductsFromBackend();
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    }
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const filteredProducts = products.filter((prod) => {
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.banglaName && prod.banglaName.includes(searchQuery)) ||
      (prod.category && prod.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.categorySlug.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        {searchQuery ? (
          <h2 className="text-sm font-medium text-zinc-600">
            Search result for: <strong className="font-bold text-zinc-900">{searchQuery}</strong>
          </h2>
        ) : (
          <h2 className="text-base font-semibold text-zinc-900">
            Daily Essentials & Grocery
          </h2>
        )}
        <span className="text-xs text-zinc-400 font-mono">
          {filteredProducts.length} Products
        </span>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-zinc-400 text-sm animate-pulse">
          Loading products from store...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          {searchQuery ? `No products found for "${searchQuery}"` : 'No products available.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {paginatedProducts.map((prod: Product) => (
              <ProductCard
                key={prod.id}
                product={prod}
                categoryName={prod.category || prod.categorySlug}
              />
            ))}
          </div>

          {/* Standard Pagination Controls */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </section>
  );
};
