import React, { useState } from 'react';
import type { Product, WeightVariant } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobileProductCardProps {
  product: Product;
}

export const MobileProductCard: React.FC<MobileProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant: WeightVariant =
    product.weightVariants[selectedVariantIndex] || product.weightVariants[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedVariant) {
      addItem(product, selectedVariant, 1);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-3 gap-2.5 active:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
          {product.badgeText && (
            <span className="absolute top-1 left-1 bg-[#00694c] text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded z-10">
              {product.badgeText}
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-slate-800 truncate leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-tight">
            {product.description}
          </p>
        </div>
      </div>

      {/* Portion Weight Selection Buttons on Mobile */}
      <div
        className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {product.weightVariants.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setSelectedVariantIndex(i)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                selectedVariantIndex === i
                  ? 'bg-[#00694c] text-white border-[#00694c]'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {v.weight}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-extrabold text-[#00694c]">
            ৳ {selectedVariant?.price}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-[#00694c] text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 active:scale-95 shadow-xs"
          >
            <ShoppingCart className="w-3 h-3" /> Add
          </button>
        </div>
      </div>
    </div>
  );
};
