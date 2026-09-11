'use client';

import React from 'react';
import { ProductCard } from '@/components/common/ProductCard';
import { CHALDAL_PRODUCTS, Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

const POPULAR_PAGE_PRODUCTS: Product[] = [
  {
    id: 'pop-1',
    name: 'Ispahani Mirzapore Tea Premium Bag',
    price: 210,
    unit: '400 gm',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  {
    id: 'pop-2',
    name: 'Teer Pure White Refined Sugar',
    price: 140,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  {
    id: 'pop-3',
    name: 'Aarong Dairy Pure Premium Ghee',
    price: 480,
    unit: '200 gm',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'dairy',
    inStock: true,
  },
  {
    id: 'pop-4',
    name: 'Bashundhara Facial Tissue Box (2 Ply)',
    price: 75,
    unit: '120 pcs',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'pop-5',
    name: 'Vim Dishwash Liquid Lemon Fresh',
    price: 135,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'pop-6',
    name: 'ACI Pure Salt Vacuum Evaporated',
    price: 42,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  {
    id: 'pop-7',
    name: 'Radhuni Pure Mustard Oil Bottle',
    price: 360,
    unit: '1 L',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  ...CHALDAL_PRODUCTS.slice(4, 18),
];

export default function PopularPage() {
  const [products, setProducts] = React.useState<Product[]>(POPULAR_PAGE_PRODUCTS);
  const { language } = useCartStore();
  const isBN = language === 'BN';

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const { fetchProductsFromBackend } = await import('@/lib/api');
        const prods = await fetchProductsFromBackend();
        if (Array.isArray(prods) && prods.length > 0) {
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
