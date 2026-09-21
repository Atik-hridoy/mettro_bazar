'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, Plus, Minus, ChevronRight, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from './ProductCard';
import { EmptyState } from './EmptyState';
import { Product } from '@/lib/constants';
import { fetchProductsFromBackend } from '@/lib/api';

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
  const [allBackendProducts, setAllBackendProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadCatalog() {
      try {
        const prods = await fetchProductsFromBackend();
        if (isMounted && Array.isArray(prods)) {
          setAllBackendProducts(prods);
        }
      } catch (err) {
        console.error('Failed to load related products for modal:', err);
      }
    }
    loadCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Filter real related items dynamically from backend products
  const otherProducts = allBackendProducts.filter(
    (p) => String(p.id) !== String(selectedDetailProduct.id)
  );

  const sameCategoryProducts = otherProducts.filter(
    (p) => p.categorySlug === selectedDetailProduct.categorySlug || p.category === selectedDetailProduct.category
  );

  const frequentlyBoughtTogether = (
    sameCategoryProducts.length >= 4 ? sameCategoryProducts : otherProducts
  ).slice(0, 5);

  const customersAlsoConsidered = (
    sameCategoryProducts.length >= 6
      ? sameCategoryProducts.slice(4, 8)
      : otherProducts.slice(5, 9)
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={() => setSelectedDetailProduct(null)}
      />

      {/* Main Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto z-10 border border-zinc-200 p-4 sm:p-6 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setSelectedDetailProduct(null)}
          className="absolute right-4 top-4 z-20 p-2 text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Top Hero Section: Product Image + Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: Product Main Image with Smooth Zoom */}
          <div className="relative w-full aspect-square bg-zinc-50 rounded-xl border border-zinc-200/80 overflow-hidden flex items-center justify-center group select-none">
            {discountPercent > 0 && (
              <span className="absolute left-3 top-3 z-10 bg-rose-500 text-white font-black text-xs px-2.5 py-1 rounded-md shadow-xs">
                -{discountPercent}% OFF
              </span>
            )}

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute right-3 top-3 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-zinc-400 hover:text-rose-500 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
              aria-label="Add to wishlist"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
              />
            </button>

            <div
              className="w-full h-full relative cursor-zoom-in"
              onMouseEnter={() => setIsDetailImageZoomed(true)}
              onMouseLeave={() => setIsDetailImageZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={selectedDetailProduct.image}
                alt={selectedDetailProduct.name}
                className="w-full h-full object-contain p-4 transition-transform duration-200"
              />

              {isDetailImageZoomed && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none bg-no-repeat rounded-xl shadow-inner border border-purple-200"
                  style={{
                    backgroundImage: `url(${selectedDetailProduct.image})`,
                    backgroundPosition: `${zoomCoords.x}% ${zoomCoords.y}%`,
                    backgroundSize: '220%',
                  }}
                />
              )}
            </div>
          </div>

          {/* Right Column: Title, Prices, Actions & Specs */}
          <div className="space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 leading-tight">
                {selectedDetailProduct.name}
              </h1>
              {selectedDetailProduct.banglaName && (
                <p className="text-sm font-semibold text-zinc-500 mt-0.5">
                  {selectedDetailProduct.banglaName}
                </p>
              )}
              <p className="text-xs text-zinc-500 mt-1">
                Unit: <span className="font-semibold text-zinc-700">{selectedDetailProduct.unit}</span>
              </p>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-black text-[#7533CB]">
                ৳{selectedDetailProduct.price}
              </span>
              {selectedDetailProduct.originalPrice && (
                <span className="text-sm text-zinc-400 line-through font-medium">
                  ৳{selectedDetailProduct.originalPrice}
                </span>
              )}
            </div>

            {/* Add to Bag & Buy Now Controls */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-zinc-300 rounded-md bg-zinc-50 p-1 shadow-2xs">
                <button
                  onClick={handleRemove}
                  disabled={qtyInCart === 0}
                  className="w-8 h-8 flex items-center justify-center hover:bg-zinc-200 rounded text-zinc-600 disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="px-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-zinc-900 leading-none">
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

            {/* Product Specifications */}
            <div className="text-xs text-zinc-600 space-y-1 pt-1 leading-relaxed bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
              <p><strong>Name:</strong> {selectedDetailProduct.name}</p>
              <p><strong>Category:</strong> {selectedDetailProduct.categorySlug || 'Grocery'}</p>
              <p><strong>Delivery Time:</strong> Within {selectedDetailProduct.deliveryTime || '2 hrs'}</p>
              <p><strong>Specification:</strong> 100% Genuine, Fresh & Quality Assured</p>
            </div>
          </div>
        </div>

        {/* 2. Frequently Bought Together Section */}
        {frequentlyBoughtTogether.length > 0 && (
          <div className="py-6 border-b border-zinc-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                Frequently Bought Together
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {frequentlyBoughtTogether.map((prod) => (
                <ProductCard key={prod.id} product={prod} categoryName="Frequently Bought" />
              ))}
            </div>
          </div>
        )}

        {/* 3. Customers Also Considered Section */}
        {customersAlsoConsidered.length > 0 && (
          <div className="pt-6 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                Customers Also Considered
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {customersAlsoConsidered.map((prod) => (
                <ProductCard key={prod.id} product={prod} categoryName="Considered" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
