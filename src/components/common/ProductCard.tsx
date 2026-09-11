'use client';

import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

// Helpers for Bangla formatting
function toBanglaNumerals(str: string | number): string {
  const bnNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(str).replace(/\d/g, (d) => bnNums[parseInt(d)]);
}

function formatPrice(price: number, isBN: boolean): string {
  if (!isBN) return `৳${price}`;
  return `৳${toBanglaNumerals(price)}`;
}

function formatDeliveryTime(timeStr: string | undefined, isBN: boolean): string {
  if (!timeStr) return isBN ? '২ ঘণ্টা' : '2 hrs';
  if (!isBN) return timeStr;
  return toBanglaNumerals(timeStr)
    .replace(/hrs?/i, isBN ? 'ঘণ্টা' : 'hrs')
    .replace(/mins?/i, isBN ? 'মিনিট' : 'min');
}

function formatUnit(unitStr: string | undefined, isBN: boolean): string {
  if (!unitStr) return '';
  if (!isBN) return unitStr;
  return toBanglaNumerals(unitStr)
    .replace(/kg/i, 'কেজি')
    .replace(/gm/i, 'গ্রাম')
    .replace(/pcs/i, 'টি')
    .replace(/ml/i, 'মিলি')
    .replace(/L/i, 'লিটার');
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  categoryName = 'General',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { cartItems, addItem, removeItem, setSelectedDetailProduct, language } = useCartStore();
  const isBN = language === 'BN';

  const inCartItem = cartItems.find((item) => item.id === product.id);
  const qtyInCart = inCartItem?.quantity || 0;

  const displayName = isBN ? (product.banglaName || product.name) : product.name;

  const handleAdd = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem({
      id: product.id,
      name: displayName,
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
      className="bg-white rounded-xl p-2.5 sm:p-3 flex flex-col justify-between hover:shadow-md transition-all duration-200 group relative select-none w-full border border-zinc-100/90 hover:border-purple-200"
    >
      {/* 1. UNIFORM ASPECT-SQUARE IMAGE BOX - Standard scale for all photos regardless of uploaded aspect ratio */}
      <div
        onClick={handleAdd}
        className="w-full aspect-square relative flex items-center justify-center bg-gradient-to-b from-zinc-50/90 to-zinc-100/50 hover:from-purple-50/40 hover:to-purple-50/10 border border-zinc-100/80 rounded-xl p-2.5 cursor-pointer overflow-hidden mb-2.5 transition-colors group/img"
      >
        <img
          src={product.image}
          alt={displayName}
          className="w-full h-full object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300 drop-shadow-2xs"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&q=80';
          }}
        />

        {/* Not in Cart: Circular Plus Button in bottom-right */}
        {qtyInCart === 0 && (
          <div className="absolute bottom-1.5 right-1.5 z-10">
            <button
              onClick={handleAdd}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#7533CB] text-[#7533CB] hover:bg-[#7533CB] hover:text-white flex items-center justify-center transition-all duration-150 shadow-2xs active:scale-95 cursor-pointer"
              aria-label={isBN ? `${displayName} কার্টে যোগ করুন` : `Add ${product.name} to cart`}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* In Cart & Hovered: Centered Quantity Controller Pill */}
        {qtyInCart > 0 && isHovered && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between w-26 sm:w-28 h-8 sm:h-9 px-2.5 bg-white border-2 border-[#7533CB] rounded-2xl shadow-md text-[#7533CB] select-none">
              <button
                onClick={handleRemove}
                className="text-[#7533CB] hover:opacity-75 transition-opacity flex items-center justify-center -ml-1 p-1 cursor-pointer"
                aria-label={isBN ? "পরিমাণ কমান" : "Decrease quantity"}
              >
                <span className="text-lg font-black leading-none select-none">—</span>
              </button>
              <span className="font-bold text-[#7533CB] text-sm sm:text-base select-none">
                {isBN ? toBanglaNumerals(qtyInCart) : qtyInCart}
              </span>
              <button
                onClick={handleAdd}
                className="text-[#7533CB] hover:opacity-75 transition-opacity flex items-center justify-center -mr-1 p-1 cursor-pointer"
                aria-label={isBN ? "পরিমাণ বাড়ান" : "Increase quantity"}
              >
                <Plus className="w-4 h-4 stroke-[2.8]" />
              </button>
            </div>
          </div>
        )}

        {/* In Cart & Unhovered: Solid Purple Circle Badge */}
        {qtyInCart > 0 && !isHovered && (
          <div className="absolute bottom-1.5 right-1.5 z-10 animate-in fade-in zoom-in-95 duration-100">
            <div
              onClick={handleAdd}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#7533CB] text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs cursor-pointer hover:bg-[#632AAD] transition-colors"
              title={isBN ? `কার্টে আছে: ${toBanglaNumerals(qtyInCart)}` : `In Cart: ${qtyInCart}`}
            >
              {isBN ? toBanglaNumerals(qtyInCart) : qtyInCart}
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
          {/* Price Line */}
          <div className="flex items-baseline gap-1.5 h-6">
            {product.originalPrice && product.originalPrice > product.price ? (
              <>
                <span className="text-sm sm:text-base font-bold text-[#E91E63]">
                  {formatPrice(product.price, isBN)}
                </span>
                <span className="text-xs text-zinc-500 line-through font-medium">
                  {formatPrice(product.originalPrice, isBN)}
                </span>
              </>
            ) : (
              <span className="text-sm sm:text-base font-bold text-zinc-900">
                {formatPrice(product.price, isBN)}
              </span>
            )}
          </div>

          {/* Product Title (Strict 2-line uniform box) */}
          <h3 className="text-xs sm:text-[13px] font-medium text-zinc-800 group-hover/text:text-[#7533CB] line-clamp-2 leading-snug tracking-normal h-9 my-1 transition-colors">
            {displayName}
          </h3>
        </div>

        {/* 3. Bottom Meta: Unit & Delivery Estimate */}
        <div className="pt-2 flex items-center justify-between text-[11px] sm:text-xs text-zinc-400 font-light border-t border-zinc-100/60 mt-1">
          <span className="truncate">{formatUnit(product.unit, isBN)}</span>
          <span className="flex items-center gap-1 text-zinc-500 font-normal shrink-0">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>{formatDeliveryTime(product.deliveryTime, isBN)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
