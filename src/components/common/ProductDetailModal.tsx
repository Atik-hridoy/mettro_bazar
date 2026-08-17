'use client';

import React, { useState } from 'react';
import { X, Heart, Plus, Minus, ChevronRight, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from './ProductCard';
import { Product } from '@/lib/constants';

// Sample related items matching Chaldal screenshots
const FREQUENTLY_BOUGHT: Product[] = [
  {
    id: 'freq-1',
    name: 'Casio Calculator 12 Digit (MJ-120 D)',
    price: 780,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'stationery-office',
    inStock: true,
  },
  {
    id: 'freq-2',
    name: 'Casio Scientific Calculator (FX 991ES...)',
    price: 1339,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'stationery-office',
    inStock: true,
  },
  {
    id: 'freq-3',
    name: 'Biomil 2 Milk (6-12 months) Tin',
    price: 1950,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'freq-4',
    name: 'Maya All Natural Spanish Rosehip See...',
    price: 850,
    unit: '30 ml',
    image: 'https://images.unsplash.com/photo-1608248597359-00984a9191d9?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'beauty-makeup',
    inStock: true,
  },
  {
    id: 'freq-5',
    name: 'Dilmah Green Tea with Camomile 30 gm',
    price: 630,
    unit: '20 pcs',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'food',
    inStock: true,
  },
];

const ALSO_CONSIDERED: Product[] = [
  {
    id: 'cons-1',
    name: 'Comfort Baby Diaper Pant M (7-12 kg)',
    price: 639,
    originalPrice: 880,
    unit: '36 pcs',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'cons-2',
    name: 'Savlon Twinkle Baby Pant Diaper M 6-12 kg',
    price: 869,
    originalPrice: 890,
    unit: '44 pcs',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
];

export const ProductDetailModal: React.FC = () => {
  const {
    selectedDetailProduct,
    setSelectedDetailProduct,
    cartItems,
    addItem,
    removeItem,
    setDrawerOpen,
  } = useCartStore();

  const [isFavorite, setIsFavorite] = useState(false);
  const [isDetailImageZoomed, setIsDetailImageZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 50, y: 50 });

  if (!selectedDetailProduct) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomCoords({ x, y });
  };

  const inCartItem = cartItems.find((item) => item.id === selectedDetailProduct.id);
  const qtyInCart = inCartItem?.quantity || 0;

  const discountPercent = selectedDetailProduct.originalPrice
    ? Math.round(
        ((selectedDetailProduct.originalPrice - selectedDetailProduct.price) /
          selectedDetailProduct.originalPrice) *
          100
      )
    : 0;

  const handleAdd = () => {
    addItem({
      id: selectedDetailProduct.id,
      name: selectedDetailProduct.name,
      price: selectedDetailProduct.price,
      originalPrice: selectedDetailProduct.originalPrice,
      image: selectedDetailProduct.image,
      unit: selectedDetailProduct.unit,
      category: selectedDetailProduct.categorySlug || 'General',
    });
  };

  const handleRemove = () => {
    removeItem(selectedDetailProduct.id);
  };

  const handleBuyNow = () => {
    if (qtyInCart === 0) {
      handleAdd();
    }
    setDrawerOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={() => setSelectedDetailProduct(null)}
      />

      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-y-auto z-10 animate-in zoom-in-95 duration-150 p-5 sm:p-7 border border-zinc-200 select-none">
        {/* Top Favorite Heart & Close Button */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
            aria-label="Add to favorites"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500'
                  : 'text-zinc-600 hover:text-rose-500'
              }`}
            />
          </button>

          <button
            onClick={() => setSelectedDetailProduct(null)}
            className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 1. Main Product Two-Column Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pb-8 border-b border-zinc-200">
          {/* Left Column: Big Product Image with Cursor-Point Zoom */}
          <div
            onMouseEnter={() => setIsDetailImageZoomed(true)}
            onMouseLeave={() => setIsDetailImageZoomed(false)}
            onMouseMove={handleMouseMove}
            className="w-full aspect-square max-w-[280px] sm:max-w-[320px] mx-auto flex items-center justify-center p-2 bg-white rounded-lg overflow-hidden cursor-crosshair"
          >
            <img
              src={selectedDetailProduct.image}
              alt={selectedDetailProduct.name}
              style={{
                transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`,
                transform: isDetailImageZoomed ? 'scale(2.5)' : 'scale(1)',
                transition: isDetailImageZoomed
                  ? 'transform 0.05s ease-out'
                  : 'transform 0.25s ease-out',
              }}
              className="max-h-full max-w-full object-contain pointer-events-none drop-shadow-sm"
            />
          </div>

          {/* Right Column: Title, Price, Stepper & Specs */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Product Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 leading-snug">
                {selectedDetailProduct.name}
              </h2>

              {/* Unit */}
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                {selectedDetailProduct.unit}
              </p>

              {/* Price & Discount Pill */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-black text-[#E91E63]">
                  ৳{selectedDetailProduct.price}
                </span>

                {selectedDetailProduct.originalPrice && (
                  <span className="text-xs text-zinc-400 font-medium line-through">
                    MRP ৳{selectedDetailProduct.originalPrice}
                  </span>
                )}

                {discountPercent > 0 && (
                  <span className="bg-[#7533CB] text-white text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-2xs">
                    <span>✦</span>
                    <span>{discountPercent}% OFF</span>
                  </span>
                )}
              </div>
            </div>

            {/* Stepper + Buy Now Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {/* In Bag Stepper Box */}
              <div className="flex items-center border border-zinc-300 rounded-md bg-white text-zinc-700 h-10 px-1">
                <button
                  onClick={handleRemove}
                  disabled={qtyInCart === 0}
                  className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded text-zinc-500 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="px-3 text-center">
                  <span className="font-bold text-sm text-zinc-900 block leading-none">
                    {qtyInCart}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-normal">in bag</span>
                </div>
                <button
                  onClick={handleAdd}
                  className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 rounded text-zinc-500 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Buy Now Button */}
              <button
                onClick={handleBuyNow}
                className="flex-1 h-10 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded-md shadow-xs transition-colors cursor-pointer"
              >
                Buy Now
              </button>
            </div>

            {/* Product of Bangladesh Badge */}
            <div className="inline-flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-700 w-fit">
              <span>Product of Bangladesh</span>
              <span className="w-4 h-3 bg-emerald-700 inline-block relative rounded-xs overflow-hidden">
                <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute inset-0 m-auto" />
              </span>
            </div>

            {/* Product Specifications / Description matching Screenshot */}
            <div className="text-xs text-zinc-600 space-y-1 pt-1 leading-relaxed bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
              <p><strong>Name:</strong> {selectedDetailProduct.name}</p>
              <p><strong>Category:</strong> {selectedDetailProduct.categorySlug || 'Grocery'}</p>
              <p><strong>Delivery Time:</strong> Within {selectedDetailProduct.deliveryTime || '3 hrs'}</p>
              <p><strong>Specification:</strong> 100% Genuine, Fresh & Quality Assured</p>
              <p className="text-zinc-500 pt-0.5">Super Absorbent, Comfortable, Easy to Wear & Convenient</p>
            </div>
          </div>
        </div>

        {/* 2. Frequently Bought Together Section */}
        <div className="py-6 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900">
              Frequently Bought Together
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {FREQUENTLY_BOUGHT.map((prod) => (
              <ProductCard key={prod.id} product={prod} categoryName="Frequently Bought" />
            ))}
          </div>
        </div>

        {/* 3. Customers Also Considered Section */}
        <div className="pt-6 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base sm:text-lg font-bold text-zinc-900">
              Customers Also Considered
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ALSO_CONSIDERED.map((prod) => (
              <ProductCard key={prod.id} product={prod} categoryName="Considered" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
