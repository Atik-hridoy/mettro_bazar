export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  image?: string;
  hasChildren?: boolean;
  children?: CategoryItem[];
}

export interface PopularCategory {
  id: string;
  name: string;
  image: string;
  slug: string;
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
  categorySlug: string;
  category?: string;
  categoryId?: number | string;
  inStock: boolean;
}

export const CATEGORY_TREE: CategoryItem[] = [];

export const POPULAR_CATEGORIES_DATA: PopularCategory[] = [];

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

export const CITIES = [
  'Rangpur',
];

export const CHALDAL_PRODUCTS: Product[] = [];

