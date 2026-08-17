'use client';

import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName = 'General',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { cartItems, addItem, removeItem, setSelectedDetailProduct } = useCartStore();

  const inCartItem = cartItems.find((item) => item.id === product.id);
  const qtyInCart = inCartItem?.quantity || 0;

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      unit: product.unit,
      category: categoryName,
    });
  };

  const handleRemove = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    removeItem(product.id);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-lg p-2 sm:p-2.5 flex flex-col justify-between hover:shadow-sm transition-all duration-150 group relative select-none w-full border border-transparent hover:border-zinc-100"
    >
      {/* 1. Fixed Height Image Box - Tapping image directly adds to cart */}
      <div
        onClick={handleAdd}
        className="w-full h-36 sm:h-40 mb-3 relative flex items-center justify-center bg-white cursor-pointer overflow-hidden rounded-md"
      >
        <img
          src={product.image}
          alt={product.name}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
          onError={(e) => {
            // Fallback for broken image
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80';
          }}
        />

        {/* Not in Cart: Larger Circular Plus Button in exact bottom-right */}
        {qtyInCart === 0 && (
          <div className="absolute bottom-0 right-0 z-10">
            <button
              onClick={handleAdd}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#7533CB] text-[#7533CB] hover:bg-[#7533CB] hover:text-white flex items-center justify-center transition-all duration-150 shadow-2xs active:scale-95 cursor-pointer"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* In Cart & Hovered: Centered Quantity Controller Pill */}
        {qtyInCart > 0 && isHovered && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between w-28 sm:w-30 h-9 sm:h-10 px-3 bg-white border-2 border-[#7533CB] rounded-2xl shadow-md text-[#7533CB] select-none">
              <button
                onClick={handleRemove}
                className="text-[#7533CB] hover:opacity-75 transition-opacity flex items-center justify-center -ml-1 p-1 cursor-pointer"
                aria-label="Decrease quantity"
              >
                <span className="text-xl font-black leading-none select-none">—</span>
              </button>
              <span className="font-bold text-[#7533CB] text-base select-none">
                {qtyInCart}
              </span>
              <button
                onClick={handleAdd}
                className="text-[#7533CB] hover:opacity-75 transition-opacity flex items-center justify-center -mr-1 p-1 cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5 stroke-[2.8]" />
              </button>
            </div>
          </div>
        )}

        {/* In Cart & Unhovered: Solid Purple Circle Badge */}
        {qtyInCart > 0 && !isHovered && (
          <div className="absolute bottom-0 right-0 z-10 animate-in fade-in zoom-in-95 duration-100">
            <div
              onClick={handleAdd}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#7533CB] text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#632AAD] transition-colors"
              title={`In Cart: ${qtyInCart}`}
            >
              {qtyInCart}
            </div>
          </div>
        )}
      </div>

      {/* 2. Content Info: Price & Title on identical baselines */}
      <div className="flex flex-col flex-1 justify-between">
        <div
          onClick={() => setSelectedDetailProduct(product)}
          className="cursor-pointer group/text"
        >
          {/* Price Line matching Chaldal Colors */}
          <div className="flex items-baseline gap-1.5 h-6">
            {product.originalPrice ? (
              <>
                <span className="text-sm sm:text-base font-bold text-[#E91E63]">
                  ৳{product.price}
                </span>
                <span className="text-xs text-zinc-600 line-through font-medium">
                  ৳{product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-zinc-900">
                ৳{product.price}
              </span>
            )}
          </div>

          {/* Product Title (Strict 2-line uniform box) */}
          <h3 className="text-xs sm:text-[13px] font-normal text-zinc-800 group-hover/text:text-[#7533CB] line-clamp-2 leading-snug tracking-normal h-9 my-1 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* 3. Bottom Meta: Unit & Delivery Estimate */}
        <div className="pt-2 flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 font-light">
          <span className="truncate">{product.unit}</span>
          <span className="flex items-center gap-1 text-zinc-500 font-normal shrink-0">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>{product.deliveryTime}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
