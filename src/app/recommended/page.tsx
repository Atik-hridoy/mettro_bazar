'use client';

import React from 'react';
import { ProductCard } from '@/components/common/ProductCard';
import { CHALDAL_PRODUCTS, Product } from '@/lib/constants';

// Recommended Collection matching Chaldal 1:1
const RECOMMENDED_PAGE_PRODUCTS: Product[] = [
  {
    id: 'rec-1',
    name: 'NeoCare Premium Baby Diaper Belt S (3-6 kg)',
    price: 939,
    originalPrice: 1200,
    unit: '50 pcs',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'rec-2',
    name: 'BBQ Coal Bag Premium',
    price: 149,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'rec-3',
    name: "Mother's Smile Prima 1 Milk Tin (0-6 months)",
    price: 850,
    unit: '400 gm',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'rec-4',
    name: 'Bosny Non Poisonous Rat Glue Tray',
    price: 570,
    unit: '400 ml',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'rec-5',
    name: 'Nestle Nescafe 3 in 1 Iced Frappe Cold Coffee',
    price: 50,
    unit: '30 gm',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'dairy',
    inStock: true,
  },
  {
    id: 'rec-6',
    name: 'Tibet Pumpkin Hair Oil Pure Herbal',
    price: 240,
    unit: '200 ml',
    image: 'https://images.unsplash.com/photo-1608248597359-00984a9191d9?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'beauty-makeup',
    inStock: true,
  },
  {
    id: 'rec-7',
    name: 'Comfort Baby Diaper Pant S (3-8 kg)',
    price: 699,
    originalPrice: 880,
    unit: '42 pcs',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  ...CHALDAL_PRODUCTS.slice(0, 14),
];

export default function RecommendedPage() {
  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-6 py-6 pb-20">
      {/* 1. Large Light-Gray Title matching Screenshot */}
      <h1 className="text-2xl sm:text-3xl font-light text-zinc-500 tracking-tight mb-4">
        Recommended For You
      </h1>

      {/* 2. Thin Horizontal Divider Line */}
      <div className="w-full border-b border-zinc-200 mb-6" />

      {/* 3. Products Grid matching 1:1 format */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
        {RECOMMENDED_PAGE_PRODUCTS.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            categoryName="Recommended"
          />
        ))}
      </div>
    </div>
  );
}
