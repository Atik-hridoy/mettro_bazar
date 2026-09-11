import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/lib/constants';
import { syncGuestCartToBackend, convertGuestCartOnBackend, fetchGuestCartFromBackend } from '@/lib/api';
import { getCookie, setCookie } from '@/lib/deviceInfo';


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

export interface User {
  phone: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  isLoggedIn: boolean;
  guestId?: string;
}

export interface Address {
  id: string;
  label: string;
  details: string;
  city: string;
  phone: string;
}

/**
 * Helper to get or generate a Globally Unique Guest ID stored persistently in HTTP Cookies & localStorage
 */
export function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'guest_ssr_temp';
  try {
    // 1. Check Cookie first
    let guestId = getCookie('mb_guest_id');
    
    // 2. Check localStorage if not in cookie
    if (!guestId) {
      guestId = localStorage.getItem('mb_guest_id');
    }

    // 3. Generate new unique ID if not found anywhere
    if (!guestId) {
      const randomSegment = Math.random().toString(36).substring(2, 9);
      const timeSegment = Date.now().toString(36);
      guestId = `guest_${randomSegment}_${timeSegment}`;
    }

    // 4. Save back to both Cookie (expires 365 days) and localStorage
    setCookie('mb_guest_id', guestId, 365);
    localStorage.setItem('mb_guest_id', guestId);

    return guestId;
  } catch {
    return 'guest_fallback_id';
  }
}

/**
 * Helper to force-generate a FRESH unique Guest ID in Cookies & localStorage
 */
export function generateNewGuestId(): string {
  if (typeof window === 'undefined') return 'guest_ssr_temp';
  try {
    const randomSegment = Math.random().toString(36).substring(2, 9);
    const timeSegment = Date.now().toString(36);
    const newGuestId = `guest_${randomSegment}_${timeSegment}`;

    setCookie('mb_guest_id', newGuestId, 365);
    localStorage.setItem('mb_guest_id', newGuestId);

    return newGuestId;
  } catch {
    return 'guest_fallback_id';
  }
}

interface CartState {
  guestId: string;
  isGuest: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
  isDrawerOpen: boolean;
  isAuthModalOpen: boolean;
  selectedDetailProduct: Product | null;
  language: 'EN' | 'BN';
  user: User | null;
  selectedAddress: Address | null;
  savedAddresses: Address[];
  
  // Actions
  initGuestSession: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  setDrawerOpen: (isOpen: boolean) => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  setSelectedDetailProduct: (product: Product | null) => void;
  setLanguage: (lang: 'EN' | 'BN') => void;
  loginUser: (phone: string, name?: string, extraData?: { firstName?: string; lastName?: string; email?: string; phone?: string }) => void;
  logoutUser: () => void;
  setSelectedAddress: (address: Address | null) => void;
  addAddress: (address: Address) => void;
}

const calculateTotals = (items: CartItem[]) => {
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return { totalPrice, totalItems };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      guestId: typeof window !== 'undefined' ? getOrCreateGuestId() : 'guest_init',
      isGuest: true,
      cartItems: [],
      totalPrice: 0,
      totalItems: 0,
      isDrawerOpen: false,
      isAuthModalOpen: false,
      selectedDetailProduct: null,
      language: 'EN',
      user: null,
      selectedAddress: null,
      savedAddresses: [
        {
          id: 'addr-1',
          label: 'Home',
          details: 'House 24, Road 5, Block B, Banani, Dhaka',
          city: 'Dhaka',
          phone: '01333410106',
        },
      ],

      initGuestSession: async () => {
        const guestId = getOrCreateGuestId();
        const currentUser = get().user;
        set({
          guestId,
          isGuest: !currentUser?.isLoggedIn,
        });

        const currentItems = get().cartItems;
        const userInfo = currentUser?.isLoggedIn ? { email: currentUser.email, phone: currentUser.phone } : undefined;

        if (currentItems.length > 0) {
          syncGuestCartToBackend(guestId, currentItems, 'Dhaka', userInfo);
        } else {
          // Ensure backend sync recovery: if local cart is empty but server has saved items, restore them
          try {
            const serverCart = await fetchGuestCartFromBackend(guestId);
            if (serverCart && Array.isArray(serverCart.items) && serverCart.items.length > 0) {
              const restoredItems: CartItem[] = serverCart.items.map((item: any) => ({
                id: item.product_id || item.id,
                name: item.product_name,
                price: Number(item.unit_price),
                quantity: item.quantity,
                image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
                unit: '1 pc',
              }));
              const { totalPrice, totalItems } = calculateTotals(restoredItems);
              set({
                cartItems: restoredItems,
                totalPrice,
                totalItems,
              });
            }
          } catch (err) {
            console.error('Failed to sync guest session with server:', err);
          }
        }
      },

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
          if (state.guestId) {
            const userInfo = state.user?.isLoggedIn ? { email: state.user.email, phone: state.user.phone } : undefined;
            syncGuestCartToBackend(state.guestId, updatedItems, 'Dhaka', userInfo);
          }
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
          if (state.guestId) {
            const userInfo = state.user?.isLoggedIn ? { email: state.user.email, phone: state.user.phone } : undefined;
            syncGuestCartToBackend(state.guestId, updatedItems, 'Dhaka', userInfo);
          }
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
          if (state.guestId) {
            const userInfo = state.user?.isLoggedIn ? { email: state.user.email, phone: state.user.phone } : undefined;
            syncGuestCartToBackend(state.guestId, updatedItems, 'Dhaka', userInfo);
          }
          return {
            cartItems: updatedItems,
            totalPrice,
            totalItems,
          };
        }),

      clearCart: () =>
        set((state) => {
          if (state.guestId) {
            const userInfo = state.user?.isLoggedIn ? { email: state.user.email, phone: state.user.phone } : undefined;
            syncGuestCartToBackend(state.guestId, [], 'Dhaka', userInfo);
          }
          return {
            cartItems: [],
            totalPrice: 0,
            totalItems: 0,
          };
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

      setSelectedDetailProduct: (product) =>
        set({
          selectedDetailProduct: product,
        }),

      setLanguage: (lang) =>
        set({
          language: lang,
        }),

      loginUser: (identity, name, extraData) =>
        set((state) => {
          if (state.guestId) {
            convertGuestCartOnBackend(state.guestId, identity);
          }
          const freshGuestId = generateNewGuestId();
          const isEmail = identity && identity.includes('@');
          const phoneVal = extraData?.phone || (!isEmail ? identity : '');
          const emailVal = extraData?.email || (isEmail ? identity : '');

          const userInfo = { email: emailVal, phone: phoneVal };
          if (state.cartItems.length > 0) {
            syncGuestCartToBackend(freshGuestId, state.cartItems, 'Dhaka', userInfo);
          }

          return {
            isGuest: false,
            guestId: freshGuestId,
            user: {
              phone: phoneVal || '',
              name: name || `${extraData?.firstName || ''} ${extraData?.lastName || ''}`.trim() || 'Registered Customer',
              firstName: extraData?.firstName || '',
              lastName: extraData?.lastName || '',
              email: emailVal || '',
              isLoggedIn: true,
              guestId: state.guestId,
            },
            isAuthModalOpen: false,
          };
        }),

      logoutUser: () =>
        set(() => {
          const freshGuestId = generateNewGuestId();
          return {
            user: null,
            isGuest: true,
            guestId: freshGuestId,
            cartItems: [],
            totalPrice: 0,
            totalItems: 0,
          };
        }),

      setSelectedAddress: (address) =>
        set({
          selectedAddress: address,
        }),

      addAddress: (address) =>
        set((state) => ({
          savedAddresses: [...state.savedAddresses, address],
          selectedAddress: address,
        })),
    }),
    {
      name: 'metro_bazar_session_v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        guestId: state.guestId,
        isGuest: state.isGuest,
        cartItems: state.cartItems,
        totalPrice: state.totalPrice,
        totalItems: state.totalItems,
        user: state.user,
        savedAddresses: state.savedAddresses,
        selectedAddress: state.selectedAddress,
        language: state.language,
      }),
    }
  )
);
