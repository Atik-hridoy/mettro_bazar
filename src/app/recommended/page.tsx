'use client';

import React from 'react';
import { ProductCard } from '@/components/common/ProductCard';
import { EmptyState } from '@/components/common/EmptyState';
import { Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

export default function RecommendedPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const { language } = useCartStore();
  const isBN = language === 'BN';

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const { fetchProductsFromBackend } = await import('@/lib/api');
        const prods = await fetchProductsFromBackend();
        if (Array.isArray(prods)) {
          // Exclude popular staples for cold-start diversity
          const popularKeywords = ['oil', 'rice', 'salt', 'sugar', 'egg', 'tea', 'milk', 'dal', 'potato', 'onion', 'dishwash'];
          const recs = prods.filter((p) => {
            const nameLower = (p.name + ' ' + (p.banglaName || '')).toLowerCase();
            return !popularKeywords.some((kw) => nameLower.includes(kw));
          });
          setProducts(recs.length > 0 ? recs : prods);
        }
      } catch (err) {
        console.error('Failed to fetch backend products for Recommended page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-6 py-6 pb-20">
      {/* 1. Large Title with Bilingual Support */}
      <h1 className="text-2xl sm:text-3xl font-bold text-zinc-800 tracking-tight mb-4">
        {isBN ? 'আপনার জন্য সুপারিশকৃত' : 'Recommended For You'}
      </h1>

      {/* 2. Thin Horizontal Divider Line */}
      <div className="w-full border-b border-zinc-200 mb-6" />

      {/* 3. Products Grid or Professional Empty State */}
      {loading ? (
        <div className="py-12 text-center text-xs text-zinc-400 font-medium animate-pulse">
          {isBN ? 'সুপারিশকৃত পণ্যসমূহ লোড হচ্ছে...' : 'Loading recommended products...'}
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          title="কোনো সুপারিশকৃত পণ্য পাওয়া যায়নি"
          titleBn="কোনো সুপারিশকৃত পণ্য পাওয়া যায়নি"
          description="বর্তমানে ক্যাটালগে কোনো পণ্য যুক্ত নেই। অনুগ্রহ করে এডমিন প্যানেল থেকে নতুন পণ্য যুক্ত করুন।"
          descriptionBn="বর্তমানে ক্যাটালগে কোনো পণ্য যুক্ত নেই। অনুগ্রহ করে এডমিন প্যানেল থেকে নতুন পণ্য যুক্ত করুন।"
          actionHref="/"
          actionText="হোম পেজে যান"
          actionTextBn="হোম পেজে যান"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
          {products.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              categoryName={isBN ? 'সুপারিশকৃত' : 'Recommended'}
            />
          ))}
        </div>
      )}
    </div>
  );
}
