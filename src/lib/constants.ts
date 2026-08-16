export interface Category {
  id: string;
  name: string;
  banglaName?: string;
  icon: string;
  subcategories?: string[];
  itemCount?: number;
  featured?: boolean;
}

export interface PopularCategory {
  id: string;
  name: string;
  banglaName: string;
  image: string;
  itemCount: number;
  bgColor: string;
}

export interface FeatureCard {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  badge?: string;
}

export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  discountPercentage?: number;
  isExpress?: boolean;
}

export const CATEGORIES: Category[] = [
  {
    id: 'popular',
    name: 'Popular Items',
    banglaName: 'জনপ্রিয় পণ্য',
    icon: 'Flame',
    itemCount: 420,
    featured: true,
  },
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    banglaName: 'ফল ও শাকসবজি',
    icon: 'Apple',
    subcategories: ['Fresh Vegetables', 'Fresh Fruits', 'Exotic Fruits', 'Herbs & Seasonings', 'Cut & Sprouts'],
    itemCount: 350,
  },
  {
    id: 'meat-fish',
    name: 'Meat & Fish',
    banglaName: 'মাংস ও মাছ',
    icon: 'Fish',
    subcategories: ['Chicken & Poultry', 'Beef & Mutton', 'Freshwater Fish', 'Sea Fish', 'Frozen Fish & Meat'],
    itemCount: 180,
  },
  {
    id: 'cooking',
    name: 'Cooking & Spices',
    banglaName: 'রান্নার সামগ্রী ও মশলা',
    icon: 'Utensils',
    subcategories: ['Oil & Ghee', 'Rice', 'Lentils & Pulses', 'Salt & Sugar', 'Whole Spices', 'Ground Spices'],
    itemCount: 620,
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Eggs',
    banglaName: 'দুধ ও ডিম',
    icon: 'Egg',
    subcategories: ['Farm Eggs', 'Liquid Milk', 'Powder Milk', 'Butter & Cheese', 'Yogurt & Curd'],
    itemCount: 140,
  },
  {
    id: 'beverages',
    name: 'Beverages',
    banglaName: 'পানীয়',
    icon: 'Coffee',
    subcategories: ['Tea & Coffee', 'Juices & Soft Drinks', 'Syrup & Powder Drink', 'Water'],
    itemCount: 290,
  },
  {
    id: 'snacks',
    name: 'Snacks & Bakery',
    banglaName: 'নাস্তা ও বেকারি',
    icon: 'Cookie',
    subcategories: ['Biscuits & Cookies', 'Chips & Crisps', 'Bread & Bakery', 'Chocolates & Candies', 'Noodles & Pasta'],
    itemCount: 510,
  },
  {
    id: 'cleaning',
    name: 'Cleaning & Household',
    banglaName: 'পরিষ্কার ও গৃহস্থালী',
    icon: 'Sparkles',
    subcategories: ['Laundry Detergent', 'Dishwashers', 'Toilet Cleaners', 'Air Fresheners', 'Trash Bags'],
    itemCount: 320,
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    banglaName: 'ব্যক্তিগত যত্ন',
    icon: 'HeartHandshake',
    subcategories: ['Hair Care', 'Skin Care', 'Oral Care', 'Men\'s Grooming', 'Women\'s Hygiene'],
    itemCount: 450,
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    banglaName: 'শিশুর যত্ন',
    icon: 'Baby',
    subcategories: ['Diapers & Wipes', 'Baby Food & Formula', 'Baby Bath & Hygiene', 'Feeding & Accessories'],
    itemCount: 210,
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    banglaName: 'পোষা প্রাণীর খাবার',
    icon: 'Dog',
    subcategories: ['Cat Food', 'Dog Food', 'Pet Accessories'],
    itemCount: 95,
  },
  {
    id: 'stationery',
    name: 'Stationery & Office',
    banglaName: 'স্টেশনারি ও অফিস',
    icon: 'BookOpen',
    subcategories: ['Pens & Pencils', 'Notebooks & Paper', 'Adhesives & Tapes', 'Office Supplies'],
    itemCount: 160,
  },
];

export const POPULAR_CATEGORIES: PopularCategory[] = [
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    banglaName: 'ফল ও শাকসবজি',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80',
    itemCount: 350,
    bgColor: 'bg-emerald-50 text-emerald-900 border-emerald-100',
  },
  {
    id: 'meat-fish',
    name: 'Meat & Fish',
    banglaName: 'মাংস ও মাছ',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&auto=format&fit=crop&q=80',
    itemCount: 180,
    bgColor: 'bg-rose-50 text-rose-900 border-rose-100',
  },
  {
    id: 'cooking',
    name: 'Cooking Essentials',
    banglaName: 'রান্নার সামগ্রী',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    itemCount: 620,
    bgColor: 'bg-amber-50 text-amber-900 border-amber-100',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Farm Eggs',
    banglaName: 'দুধ ও ডিম',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    itemCount: 140,
    bgColor: 'bg-yellow-50 text-yellow-900 border-yellow-100',
  },
  {
    id: 'snacks',
    name: 'Snacks & Bakery',
    banglaName: 'নাস্তা ও বেকারি',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    itemCount: 510,
    bgColor: 'bg-purple-50 text-purple-900 border-purple-100',
  },
  {
    id: 'beverages',
    name: 'Beverages & Juices',
    banglaName: 'পানীয় ও জুস',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&auto=format&fit=crop&q=80',
    itemCount: 290,
    bgColor: 'bg-cyan-50 text-cyan-900 border-cyan-100',
  },
  {
    id: 'cleaning',
    name: 'Cleaning Supplies',
    banglaName: 'পরিষ্কারক সামগ্রী',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    itemCount: 320,
    bgColor: 'bg-blue-50 text-blue-900 border-blue-100',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    banglaName: 'ব্যক্তিগত যত্ন',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    itemCount: 450,
    bgColor: 'bg-pink-50 text-pink-900 border-pink-100',
  },
];

export const FEATURE_CARDS: FeatureCard[] = [
  {
    id: 'delivery',
    title: '1-Hour Express Delivery',
    subtitle: 'Lightning fast doorstep delivery across Dhaka',
    iconName: 'Zap',
    badge: 'Fastest',
  },
  {
    id: 'variety',
    title: '15,000+ Products',
    subtitle: 'Everything from fresh greens to household staples',
    iconName: 'ShoppingBag',
    badge: 'Wide Range',
  },
  {
    id: 'prices',
    title: 'Best Prices & Daily Deals',
    subtitle: 'Unbeatable price guarantee with cashback',
    iconName: 'Percent',
    badge: 'Save Big',
  },
  {
    id: 'support',
    title: 'Easy Returns & Support',
    subtitle: 'Hassle-free return policy with 24/7 care',
    iconName: 'ShieldCheck',
    badge: 'Trusted',
  },
];

export const FEATURED_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Fresh Farm Layer Eggs (Brown)',
    banglaName: 'ফার্মের লাল ডিম',
    price: 145,
    originalPrice: 160,
    unit: '12 pcs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
    rating: 4.9,
    discountPercentage: 9,
    isExpress: true,
  },
  {
    id: 'prod-2',
    name: 'Aarong Dairy Pasteurized Liquid Milk',
    banglaName: 'আড়ং তরল দুধ',
    price: 90,
    originalPrice: 95,
    unit: '1 Liter',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    category: 'Dairy & Eggs',
    inStock: true,
    rating: 4.8,
    discountPercentage: 5,
    isExpress: true,
  },
  {
    id: 'prod-3',
    name: 'Deshi Red Onion (Deshi Piaj)',
    banglaName: 'দেশি পেঁয়াজ',
    price: 110,
    originalPrice: 130,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80',
    category: 'Fruits & Vegetables',
    inStock: true,
    rating: 4.7,
    discountPercentage: 15,
    isExpress: true,
  },
  {
    id: 'prod-4',
    name: 'Fresh Farm Potatoes (Alu)',
    banglaName: 'নতুন আলু',
    price: 55,
    originalPrice: 65,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80',
    category: 'Fruits & Vegetables',
    inStock: true,
    rating: 4.8,
    discountPercentage: 15,
    isExpress: true,
  },
  {
    id: 'prod-5',
    name: 'Rupchanda Fortified Soybean Oil',
    banglaName: 'রূপচাঁদা সয়াবিন তেল',
    price: 810,
    originalPrice: 850,
    unit: '5 Liter',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
    category: 'Cooking & Spices',
    inStock: true,
    rating: 4.9,
    discountPercentage: 5,
    isExpress: true,
  },
  {
    id: 'prod-6',
    name: 'Miniket Premium Rice',
    banglaName: 'মিনিকেট চাল প্রিমিয়াম',
    price: 365,
    originalPrice: 390,
    unit: '5 kg',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
    category: 'Cooking & Spices',
    inStock: true,
    rating: 4.9,
    discountPercentage: 6,
    isExpress: true,
  },
  {
    id: 'prod-7',
    name: 'Fresh Ripe Bananas (Sagor Kola)',
    banglaName: 'সাগর কলা',
    price: 65,
    originalPrice: 75,
    unit: '4 pcs',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    category: 'Fruits & Vegetables',
    inStock: true,
    rating: 4.6,
    discountPercentage: 13,
    isExpress: true,
  },
  {
    id: 'prod-8',
    name: 'Broiler Chicken Skinless Cut',
    banglaName: 'ব্রয়লার মুরগির মাংস',
    price: 260,
    originalPrice: 285,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=80',
    category: 'Meat & Fish',
    inStock: true,
    rating: 4.8,
    discountPercentage: 9,
    isExpress: true,
  },
];

export const LOCATIONS = [
  'Dhaka • Dhanmondi',
  'Dhaka • Gulshan 1 & 2',
  'Dhaka • Banani',
  'Dhaka • Uttara',
  'Dhaka • Mirpur',
  'Dhaka • Mohammadpur',
  'Dhaka • Bashundhara R/A',
  'Chittagong • GEC Circle',
  'Sylhet • Zindabazar',
  'Jessore • Kotwali',
];

export const HERO_COLLAGE_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
    alt: 'Fresh Organic Produce',
    span: 'col-span-2 row-span-2',
    label: 'Fresh Produce',
  },
  {
    url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    alt: 'Farm Fresh Eggs',
    span: 'col-span-1 row-span-1',
    label: 'Farm Eggs',
  },
  {
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    alt: 'Dairy Products',
    span: 'col-span-1 row-span-1',
    label: 'Fresh Dairy',
  },
  {
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    alt: 'Artisan Bakery Bread',
    span: 'col-span-2 row-span-1',
    label: 'Bakery Specials',
  },
];
