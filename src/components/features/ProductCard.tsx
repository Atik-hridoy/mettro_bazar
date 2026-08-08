import React, { useState } from 'react';
import type { Product, WeightVariant } from '../../types/product';
import { useCartStore } from '../../store/useCartStore';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
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

  const handleVariantSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setSelectedVariantIndex(Number(e.target.value));
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-2xl border border-emerald-100/80 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer h-full overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full bg-slate-100 p-3 overflow-hidden">
        {product.badgeText && (
          <span className="absolute top-3 left-3 bg-[#00694c] text-white font-extrabold text-[10px] sm:text-xs px-2.5 py-1 rounded-lg z-10 shadow-sm">
            {product.badgeText}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-4 sm:p-5 flex-grow flex flex-col justify-between gap-3 bg-white">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 mb-1.5 leading-snug group-hover:text-[#00694c] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Portion Weight Selection Dropdown */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {product.weightVariants.length > 1 ? (
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                Portion Weight
              </label>
              <div className="relative">
                <select
                  value={selectedVariantIndex}
                  onChange={handleVariantSelect}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold py-1.5 pl-3 pr-8 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#00694c] cursor-pointer"
                >
                  {product.weightVariants.map((v, i) => (
                    <option key={v.id} value={i}>
                      {v.weight} — ৳{v.price}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500 font-semibold block">
              Weight: {selectedVariant?.weight}
            </span>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Price</span>
              <p className="text-base sm:text-xl text-[#00694c] font-black">
                ৳ {selectedVariant?.price}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-[#00694c] hover:bg-[#004d37] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-emerald-900/10"
            >
              <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
