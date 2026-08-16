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
      className="bg-white border border-zinc-200/90 rounded-lg p-2.5 flex flex-col justify-between hover:shadow-sm transition-all group relative select-none"
    >
      {/* Product Image & Dynamic Quantity Controller */}
      <div className="w-full aspect-square mb-2.5 relative flex items-center justify-center">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
        />

        {/* 1. When NOT in cart: Standard Plus Button */}
        {qtyInCart === 0 && (
          <div className="absolute bottom-0 right-0 z-10">
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-white border-2 border-[#7533CB] text-[#7533CB] hover:bg-[#7533CB] hover:text-white flex items-center justify-center transition-colors shadow-xs"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* 2. When in cart & HOVERED: Wide Centered Quantity Pill */}
        {qtyInCart > 0 && isHovered && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 z-20 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between w-28 h-9 px-3 bg-white border-2 border-[#7533CB] rounded-2xl shadow-sm text-[#7533CB] select-none">
              <button
                onClick={handleRemove}
                className="text-[#7533CB] hover:opacity-75 transition-opacity flex items-center justify-center -ml-1 p-1"
                aria-label="Decrease quantity"
              >
                <span className="text-lg font-black leading-none select-none">—</span>
              </button>
              <span className="font-bold text-[#7533CB] text-base select-none">
                {qtyInCart}
              </span>
              <button
                onClick={handleAdd}
                className="text-[#7533CB] hover:opacity-75 transition-opacity flex items-center justify-center -mr-1 p-1"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5 stroke-[2.8]" />
              </button>
            </div>
          </div>
        )}

        {/* 3. When in cart & CURSOR MOVES AWAY (Unhovered): Solid Purple Circle Badge */}
        {qtyInCart > 0 && !isHovered && (
          <div className="absolute bottom-0 right-0 z-10 animate-in fade-in zoom-in-95 duration-100">
            <div
              onClick={handleAdd}
              className="w-8 h-8 rounded-full bg-[#7533CB] text-white font-bold text-sm flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#632AAD] transition-colors"
              title={`In Cart: ${qtyInCart}`}
            >
              {qtyInCart}
            </div>
          </div>
        )}
      </div>

      {/* Price & Name */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-1.5">
          {product.originalPrice ? (
            <>
              <span className="text-sm font-bold text-rose-600">
                ৳{product.price}
              </span>
              <span className="text-xs text-zinc-400 line-through">
                ৳{product.originalPrice}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-zinc-900">
              ৳{product.price}
            </span>
          )}
        </div>

        <h3 className="text-xs font-normal text-zinc-800 line-clamp-2 leading-snug">
          {product.name}
        </h3>
      </div>

      {/* Bottom Meta: Unit & Delivery Estimate */}
      <div className="pt-2 mt-2 flex items-center justify-between text-[11px] text-zinc-400">
        <span>{product.unit}</span>
        <span className="flex items-center gap-0.5 text-zinc-500 font-medium">
          <Clock className="w-3 h-3 text-zinc-400" />
          <span>{product.deliveryTime}</span>
        </span>
      </div>
    </div>
  );
};
