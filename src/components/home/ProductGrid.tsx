'use client';

import React from 'react';
import { Plus, Minus, Clock } from 'lucide-react';
import { CHALDAL_PRODUCTS, Product } from '@/lib/constants';
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

  const filteredProducts = CHALDAL_PRODUCTS.filter((prod) => {
    const matchesSearch =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.banglaName && prod.banglaName.includes(searchQuery)) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <section className="w-full py-8 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4">
        {searchQuery ? (
          <h2 className="text-sm font-medium text-zinc-600">
            Search result for: <strong className="font-bold text-zinc-900">{searchQuery}</strong>
          </h2>
        ) : (
          <h2 className="text-base font-semibold text-zinc-900">
            Daily Essentials & Grocery
          </h2>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 text-sm">
          No products found for "{searchQuery}"
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredProducts.map((prod: Product) => {
            const inCartItem = cartItems.find((item) => item.id === prod.id);
            const qtyInCart = inCartItem?.quantity || 0;

            return (
              <div
                key={prod.id}
                className="bg-white border border-zinc-200/90 rounded-lg p-3 flex flex-col justify-between hover:shadow-sm transition-all group relative"
              >
                {/* Product Image & Floating Add Button */}
                <div className="w-full aspect-square mb-2 relative flex items-center justify-center overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain"
                  />

                  {/* Circular Plus Button / Quantity Pill matching Chaldal */}
                  <div className="absolute bottom-1 right-1 z-10">
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
                        className="w-8 h-8 rounded-full bg-white border border-[#7533CB] text-[#7533CB] hover:bg-[#7533CB] hover:text-white flex items-center justify-center transition-colors shadow-2xs"
                        aria-label={`Add ${prod.name} to cart`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    ) : (
                      <div className="flex items-center bg-white border border-[#7533CB] rounded-full text-xs text-[#7533CB] shadow-2xs overflow-hidden">
                        <button
                          onClick={() => removeItem(prod.id)}
                          className="w-6 h-7 flex items-center justify-center hover:bg-purple-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 font-bold text-zinc-900 text-xs">
                          {qtyInCart}
                        </span>
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
                          className="w-6 h-7 flex items-center justify-center hover:bg-purple-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Name */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5">
                    {prod.originalPrice ? (
                      <>
                        <span className="text-sm font-bold text-rose-600">
                          ৳{prod.price}
                        </span>
                        <span className="text-xs text-zinc-400 line-through">
                          ৳{prod.originalPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-bold text-zinc-900">
                        ৳{prod.price}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-normal text-zinc-800 line-clamp-2 leading-snug">
                    {prod.name}
                  </h3>
                </div>

                {/* Bottom Meta: Unit & Delivery Estimate */}
                <div className="pt-2 mt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span>{prod.unit}</span>
                  <span className="flex items-center gap-0.5 text-zinc-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{prod.deliveryTime}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
