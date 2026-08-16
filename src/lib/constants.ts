export interface Category {
  id: string;
  name: string;
  banglaName?: string;
  icon: string;
  hasSubcategories?: boolean;
}

export interface PopularCategory {
  id: string;
  name: string;
  image: string;
  itemCount?: number;
}

export interface FeatureCard {
  id: string;
  title: string;
  highlight: string;
  suffix?: string;
  iconName: string;
}

export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  deliveryTime: string;
  image: string;
  category: string;
  inStock: boolean;
}

export const CHALDAL_CATEGORIES: Category[] = [
  { id: 'popular', name: 'Popular', icon: 'Flame' },
  { id: 'flash-sales', name: 'Flash Sales', icon: 'Zap' },
  { id: 'food', name: 'Food', icon: 'Apple', hasSubcategories: true },
  { id: 'cleaning', name: 'Cleaning Supplies', icon: 'Sparkles', hasSubcategories: true },
  { id: 'home-kitchen', name: 'Home & Kitchen', icon: 'Home', hasSubcategories: true },
  { id: 'fashion', name: 'Fashion & Lifestyle', icon: 'Shirt' },
  { id: 'baby-care', name: 'Baby Care', icon: 'Baby', hasSubcategories: true },
  { id: 'personal-care', name: 'Personal Care', icon: 'HeartHandshake', hasSubcategories: true },
  { id: 'stationery', name: 'Stationery & Office', icon: 'BookOpen', hasSubcategories: true },
  { id: 'pet-care', name: 'Pet Care', icon: 'Dog', hasSubcategories: true },
  { id: 'toys-sports', name: 'Toys & Sports', icon: 'Gamepad2' },
  { id: 'beauty-makeup', name: 'Beauty & MakeUp', icon: 'Sparkle' },
  { id: 'health-wellness', name: 'Health & Wellness', icon: 'Activity', hasSubcategories: true },
];

export const POPULAR_CATEGORIES_DATA: PopularCategory[] = [
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'meat-fish',
    name: 'Meat & Fish',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cooking',
    name: 'Cooking',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'home-cleaning',
    name: 'Home & Cleaning',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Eggs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'snacks',
    name: 'Snacks & Bakery',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&auto=format&fit=crop&q=80',
  },
];

export const CHALDAL_FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'feat-1',
    highlight: '+15000 products',
    title: '',
    suffix: 'to shop from',
    iconName: 'ShoppingBag',
  },
  {
    id: 'feat-2',
    title: 'Pay ',
    highlight: 'after',
    suffix: ' receiving products',
    iconName: 'Wallet',
  },
  {
    id: 'feat-3',
    title: 'Get your delivery within ',
    highlight: '1 hour',
    suffix: '',
    iconName: 'Bike',
  },
  {
    id: 'feat-4',
    title: 'Get offers that ',
    highlight: 'Save Money',
    suffix: '',
    iconName: 'HandCoins',
  },
];

export const BRAND_PARTNERS = [
  { name: 'PRAN', color: 'bg-red-600' },
  { name: 'reckitt', color: 'bg-pink-600' },
  { name: 'Nestlé', color: 'bg-blue-700' },
  { name: 'Unilever', color: 'bg-blue-900' },
  { name: 'marico', color: 'bg-emerald-600' },
  { name: 'Godrej', color: 'bg-purple-700' },
  { name: 'Coca-Cola', color: 'bg-red-700' },
];

export const CHALDAL_PRODUCTS: Product[] = [
  {
    id: 'ch-prod-1',
    name: 'Chicken Eggs Layer (White)',
    banglaName: 'সাদা লেয়ার ডিম',
    price: 135,
    unit: '12 pcs',
    deliveryTime: '4 hrs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
  },
  {
    id: 'ch-prod-2',
    name: 'Chicken Eggs (Layer)',
    banglaName: 'লাল লেয়ার ডিম',
    price: 145,
    unit: '12 pcs',
    deliveryTime: '4 hrs',
    image: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?w=400&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
  },
  {
    id: 'ch-prod-3',
    name: 'Chicken Eggs (Deshi)',
    banglaName: 'দেশি মুরগির ডিম',
    price: 119,
    originalPrice: 125,
    unit: '6 pcs',
    deliveryTime: '4 hrs',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=400&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
  },
  {
    id: 'ch-prod-4',
    name: 'Quail Eggs',
    banglaName: 'কোয়েল পাখির ডিম',
    price: 89,
    originalPrice: 95,
    unit: '20 pcs',
    deliveryTime: '4 hrs',
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b01c9c05?w=400&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
  },
  {
    id: 'ch-prod-5',
    name: 'Duck Eggs (Hasher Dim)',
    banglaName: 'হাঁসের ডিম',
    price: 115,
    unit: '6 pcs',
    deliveryTime: '4 hrs',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
  },
  {
    id: 'ch-prod-6',
    name: 'Cocola Egg Noodles',
    banglaName: 'কোকোলা এগ নুডলস',
    price: 20,
    unit: '125 gm',
    deliveryTime: '4 hrs',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
    category: 'Food',
    inStock: true,
  },
  {
    id: 'ch-prod-7',
    name: 'Paragon Omega 3+ Eggs',
    banglaName: 'প্যারাগন ওমেগা ৩+ ডিম',
    price: 265,
    unit: '12 pcs',
    deliveryTime: '5 hrs',
    image: 'https://images.unsplash.com/photo-1598965675045-45c5e72c7d05?w=400&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
  },
  {
    id: 'ch-prod-8',
    name: 'Cocola Egg & Chicken Masala Noodles',
    banglaName: 'কোকোলা এগ চিকেন নুডলস',
    price: 25,
    unit: '150 gm',
    deliveryTime: '5 hrs',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80',
    category: 'Food',
    inStock: true,
  },
];

export const CITIES = [
  'Dhaka',
  'Chattogram',
  'Sylhet',
  'Jessore',
  'Khulna',
];
