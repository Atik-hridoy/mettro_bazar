'use client';

import React from 'react';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

export default function PopularPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const { language } = useCartStore();
  const isBN = language === 'BN';

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const { fetchProductsFromBackend } = await import('@/lib/api');
        const prods = await fetchProductsFromBackend();
        if (Array.isArray(prods)) {
          const popularKeywords = ['oil', 'rice', 'salt', 'sugar', 'egg', 'tea', 'milk', 'dal', 'potato', 'onion', 'dishwash'];
          const pops = prods.filter((p) => {
            const nameLower = (p.name + ' ' + (p.banglaName || '')).toLowerCase();
            return popularKeywords.some((kw) => nameLower.includes(kw));
          });
          setProducts(pops.length > 0 ? pops : prods);
        }
      } catch (err) {
        console.error('Failed to fetch backend products for Popular page:', err);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-6 py-6 pb-20">
      {/* 1. Large Title with Bilingual Support */}
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 tracking-tight mb-4">
        {isBN ? 'জনপ্রিয় পণ্যসমূহ' : 'Popular'}
      </h1>

      {/* 2. Thin Horizontal Divider Line */}
      <div className="w-full border-b border-zinc-200 mb-6" />

      {/* 3. Products Grid matching 1:1 format */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            categoryName={isBN ? 'জনপ্রিয়' : 'Popular'}
          />
        ))}
      </div>
    </div>
  );
}
