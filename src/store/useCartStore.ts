import { create } from 'zustand';
import type { CartItem } from '../types/cart';
import type { Product, WeightVariant } from '../types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, variant: WeightVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, variant, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id && item.selectedVariant.id === variant.id
      );

      if (existingIndex > -1) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += quantity;
        return { items: newItems };
      }

      return {
        items: [...state.items, { product, selectedVariant: variant, quantity }],
      };
    });
  },

  removeItem: (productId, variantId) => {
    set((state) => ({
      items: state.items.filter(
        (item) =>
          !(item.product.id === productId && item.selectedVariant.id === variantId)
      ),
    }));
  },

  updateQuantity: (productId, variantId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId, variantId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedVariant.id === variantId
        ) {
          return { ...item, quantity };
        }
        return item;
      }),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () => {
    return get().items.reduce(
      (sum, item) => sum + item.selectedVariant.price * item.quantity,
      0
    );
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));
