import { create } from 'zustand';

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office"
  fullName: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

export interface UserOrder {
  id: string;
  date: string;
  status: 'Processing' | 'In Transit' | 'Delivered' | 'Cancelled';
  items: {
    productName: string;
    weight: string;
    quantity: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
}

interface UserProfileState {
  wishlistIds: string[];
  addresses: SavedAddress[];
  orders: UserOrder[];
  userPreferences: {
    smsNotifications: boolean;
    emailOffers: boolean;
    language: 'EN' | 'BN';
  };
  toggleWishlist: (productId: string) => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  updatePreferences: (prefs: Partial<UserProfileState['userPreferences']>) => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  wishlistIds: ['prod-1', 'prod-2'], // default saved items

  addresses: [
    {
      id: 'addr-1',
      label: 'Home (Default)',
      fullName: 'Shafiqur Rahman',
      phone: '+880 1712-345678',
      address: 'House 42, Road 11, Block D, Banani',
      city: 'Dhaka',
      isDefault: true,
    },
    {
      id: 'addr-2',
      label: 'Office',
      fullName: 'Shafiqur Rahman',
      phone: '+880 1712-345678',
      address: 'Level 5, Plot 14, Gulshan 1',
      city: 'Dhaka',
      isDefault: false,
    },
  ],

  orders: [
    {
      id: 'MB-9842',
      date: 'Today, 4:15 PM',
      status: 'In Transit',
      items: [
        { productName: 'Marinated Beef Curry', weight: '500g', quantity: 1, price: 450 },
        { productName: 'Hand-stretched Frozen Paratha', weight: '10 Pieces', quantity: 1, price: 150 },
      ],
      totalPrice: 660,
      paymentMethod: 'Cash on Delivery',
    },
    {
      id: 'MB-9104',
      date: 'Yesterday',
      status: 'Delivered',
      items: [
        { productName: 'Classic Chicken Biryani Mix', weight: '800g', quantity: 1, price: 620 },
      ],
      totalPrice: 680,
      paymentMethod: 'bKash',
    },
  ],

  userPreferences: {
    smsNotifications: true,
    emailOffers: false,
    language: 'EN',
  },

  toggleWishlist: (productId) =>
    set((state) => ({
      wishlistIds: state.wishlistIds.includes(productId)
        ? state.wishlistIds.filter((id) => id !== productId)
        : [...state.wishlistIds, productId],
    })),

  addAddress: (newAddr) =>
    set((state) => ({
      addresses: [
        ...state.addresses,
        { ...newAddr, id: 'addr-' + Date.now() },
      ],
    })),

  deleteAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.filter((a) => a.id !== id),
    })),

  setDefaultAddress: (id) =>
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    })),

  updatePreferences: (prefs) =>
    set((state) => ({
      userPreferences: { ...state.userPreferences, ...prefs },
    })),
}));
