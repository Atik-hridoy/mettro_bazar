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
  const { cartItems, addItem, removeItem } = useCartStore();

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
      className="bg-white border border-zinc-200/90 rounded-lg p-2.5 sm:p-3 flex flex-col justify-between hover:shadow-md transition-all duration-200 group relative select-none h-full"
    >
      {/* 1. Product Image & Floating Add / Counter Button */}
      <div className="w-full aspect-square mb-2 relative flex items-center justify-center p-2 bg-white rounded-md">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
        />

        {/* Not in Cart: Larger Circular Plus Button */}
        {qtyInCart === 0 && (
          <div className="absolute bottom-1 right-1 z-10">
            <button
              onClick={handleAdd}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-[#7533CB] text-[#7533CB] hover:bg-[#7533CB] hover:text-white flex items-center justify-center transition-all duration-150 shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
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
          <div className="absolute bottom-1 right-1 z-10 animate-in fade-in zoom-in-95 duration-100">
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

      {/* 2. Content Info: Price & Title perfectly aligned */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          {/* Price Line */}
          <div className="flex items-baseline gap-1.5 min-h-[22px]">
            {product.originalPrice ? (
              <>
                <span className="text-sm sm:text-base font-bold text-rose-600">
                  ৳{product.price}
                </span>
                <span className="text-xs text-zinc-400 line-through">
                  ৳{product.originalPrice}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-zinc-900">
                ৳{product.price}
              </span>
            )}
          </div>

          {/* Product Title (Consistent 2-line height) */}
          <h3 className="text-xs sm:text-[13px] font-normal text-zinc-800 line-clamp-2 leading-snug tracking-normal min-h-[36px] my-1">
            {product.name}
          </h3>
        </div>

        {/* 3. Bottom Meta: Unit & Delivery Estimate */}
        <div className="pt-2 mt-2 flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 border-t border-zinc-100">
          <span className="truncate">{product.unit}</span>
          <span className="flex items-center gap-1 text-zinc-500 font-medium shrink-0">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            <span>{product.deliveryTime}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
