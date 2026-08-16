'use client';

import React from 'react';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { FEATURED_PRODUCTS, Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

interface ProductGridProps {
  searchQuery?: string;
  selectedCategory?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  searchQuery = '',
  selectedCategory = 'popular',
}) => {
  const { cartItems, addItem, removeItem } = useCartStore();

  const filteredProducts = FEATURED_PRODUCTS.filter((prod) => {
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.banglaName && prod.banglaName.includes(searchQuery)) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Heading */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
        <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Items'}
        </h2>
        <span className="text-xs text-zinc-500 font-medium">
          {filteredProducts.length} items
        </span>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No products found for "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredProducts.map((prod: Product) => {
            const inCartItem = cartItems.find((item) => item.id === prod.id);
            const qtyInCart = inCartItem?.quantity || 0;

            return (
              <div
                key={prod.id}
                className="bg-white border border-zinc-200 rounded-sm p-2.5 flex flex-col justify-between hover:border-zinc-400 transition-colors relative"
              >
                {/* Product Image */}
                <div className="w-full aspect-square mb-2 flex items-center justify-center overflow-hidden bg-white">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Meta */}
                <div className="space-y-1 flex-1">
                  <h3 className="text-xs font-normal text-zinc-800 line-clamp-2 leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] text-zinc-500">{prod.unit}</p>
                </div>

                {/* Pricing & Add to Cart */}
                <div className="pt-2 mt-2 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs sm:text-sm font-semibold text-zinc-900">
                      ৳{prod.price}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-[10px] text-zinc-400 line-through">
                        ৳{prod.originalPrice}
                      </span>
                    )}
                  </div>

                  {qtyInCart === 0 ? (
                    <button
                      onClick={() =>
                        addItem({
                          id: prod.id,
                          name: prod.name,
                          price: prod.price,
                          originalPrice: prod.originalPrice,
                          image: prod.image,
                          unit: prod.unit,
                          category: prod.category,
                        })
                      }
                      className="px-2 py-1 bg-white hover:bg-[#FF5252] text-[#FF5252] hover:text-white border border-[#FF5252] rounded-sm text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      aria-label={`Add ${prod.name} to bag`}
                    >
                      <Plus className="w-3 h-3" />
                      <span>Bag</span>
                    </button>
                  ) : (
                    <div className="flex items-center bg-[#FF5252] text-white rounded-sm text-xs font-semibold overflow-hidden">
                      <button
                        onClick={() => removeItem(prod.id)}
                        className="px-1.5 py-1 hover:bg-[#E04040] transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1.5 text-[11px]">{qtyInCart}</span>
                      <button
                        onClick={() =>
                          addItem({
                            id: prod.id,
                            name: prod.name,
                            price: prod.price,
                            originalPrice: prod.originalPrice,
                            image: prod.image,
                            unit: prod.unit,
                            category: prod.category,
                          })
                        }
                        className="px-1.5 py-1 hover:bg-[#E04040] transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
