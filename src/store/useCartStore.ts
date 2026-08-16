import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  unit: string;
  category?: string;
}

interface CartState {
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  isDrawerOpen: boolean;
  isAuthModalOpen: boolean;
  
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
}

const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalPrice, totalItems };
};

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  totalPrice: 0,
  totalItems: 0,
  isDrawerOpen: false,
  isAuthModalOpen: false,

  addItem: (product) =>
    set((state) => {
      const existingIndex = state.cartItems.findIndex((item) => item.id === product.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        updatedItems = state.cartItems.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: product.quantity || 1,
          image: product.image,
          unit: product.unit,
          category: product.category,
        };
        updatedItems = [...state.cartItems, newItem];
      }

      const { totalPrice, totalItems } = calculateTotals(updatedItems);
      return {
        cartItems: updatedItems,
        totalPrice,
        totalItems,
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const existing = state.cartItems.find((item) => item.id === id);
      if (!existing) return state;

      let updatedItems: CartItem[];
      if (existing.quantity <= 1) {
        updatedItems = state.cartItems.filter((item) => item.id !== id);
      } else {
        updatedItems = state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }

      const { totalPrice, totalItems } = calculateTotals(updatedItems);
      return {
        cartItems: updatedItems,
        totalPrice,
        totalItems,
      };
    }),

  deleteItem: (id) =>
    set((state) => {
      const updatedItems = state.cartItems.filter((item) => item.id !== id);
      const { totalPrice, totalItems } = calculateTotals(updatedItems);
      return {
        cartItems: updatedItems,
        totalPrice,
        totalItems,
      };
    }),

  clearCart: () =>
    set({
      cartItems: [],
      totalPrice: 0,
      totalItems: 0,
    }),

  toggleDrawer: () =>
    set((state) => ({
      isDrawerOpen: !state.isDrawerOpen,
    })),

  setDrawerOpen: (isOpen) =>
    set({
      isDrawerOpen: isOpen,
    }),

  setAuthModalOpen: (isOpen) =>
    set({
      isAuthModalOpen: isOpen,
    }),
}));
