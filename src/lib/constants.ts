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

export const CATEGORY_TREE: CategoryItem[] = [
  {
    id: 'popular',
    name: 'Popular',
    slug: 'popular',
    hasChildren: false,
  },
  {
    id: 'flash-sales',
    name: 'Flash Sales',
    slug: 'flash-sales',
    hasChildren: false,
  },
  {
    id: 'food',
    name: 'Food',
    slug: 'food',
    hasChildren: true,
    children: [
      {
        id: 'fruits-veg',
        name: 'Fruits & Vegetables',
        slug: 'fruits-and-vegetables',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'fresh-vegetables',
            name: 'Fresh Vegetables',
            slug: 'fresh-vegetables',
            image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'fresh-fruits',
            name: 'Fresh Fruits',
            slug: 'fresh-fruits',
            image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'meat-fish',
        name: 'Meat & Fish',
        slug: 'meat-and-fish',
        image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'chicken-poultry',
            name: 'Chicken & Poultry',
            slug: 'chicken-and-poultry',
            image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'premium-perishables',
            name: 'Premium Perishables',
            slug: 'premium-perishables',
            image: 'https://images.unsplash.com/photo-1588347818036-558601350bc4?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'frozen-fish',
            name: 'Frozen Fish',
            slug: 'frozen-fish',
            image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'meat',
            name: 'Meat',
            slug: 'meat',
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'tofu-alternatives',
            name: 'Tofu & Meat Alternatives',
            slug: 'tofu-and-meat-alternatives',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'dried-fish',
            name: 'Dried Fish',
            slug: 'dried-fish',
            image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'cooking',
        name: 'Cooking',
        slug: 'cooking',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'oil-ghee',
            name: 'Oil & Ghee',
            slug: 'oil-and-ghee',
            image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'rice-lentils',
            name: 'Rice & Lentils',
            slug: 'rice-and-lentils',
            image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'spices',
            name: 'Spices & Masala',
            slug: 'spices-and-masala',
            image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'salt-sugar',
            name: 'Salt & Sugar',
            slug: 'salt-and-sugar',
            image: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'sauces-pickles',
        name: 'Sauces & Pickles',
        slug: 'sauces-and-pickles',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'tomato-sauce',
            name: 'Tomato Sauce & Ketchup',
            slug: 'tomato-sauce',
            image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'pickles',
            name: 'Pickles & Chutney',
            slug: 'pickles',
            image: 'https://images.unsplash.com/photo-1589135233689-d56d354e3d37?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'dairy-eggs',
        name: 'Dairy & Eggs',
        slug: 'dairy-and-eggs',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'eggs',
            name: 'Farm & Layer Eggs',
            slug: 'eggs',
            image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'liquid-milk',
            name: 'Liquid & Powder Milk',
            slug: 'liquid-milk',
            image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'butter-ghee',
            name: 'Butter & Cheese',
            slug: 'butter-and-ghee',
            image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'breakfast',
        name: 'Breakfast',
        slug: 'breakfast',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'breads-bakery',
            name: 'Breads & Bakery',
            slug: 'breads-and-bakery',
            image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'cereals-oats',
            name: 'Cereals & Oats',
            slug: 'cereals-and-oats',
            image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'tea-coffee',
            name: 'Tea & Coffee',
            slug: 'tea-and-coffee',
            image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'candy-chocolate',
        name: 'Candy & Chocolate',
        slug: 'candy-and-chocolate',
        image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'chocolates',
            name: 'Chocolates',
            slug: 'chocolates',
            image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'candies-gums',
            name: 'Candies & Gums',
            slug: 'candies-and-gums',
            image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
      {
        id: 'snacks',
        name: 'Snacks',
        slug: 'snacks',
        image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
        hasChildren: true,
        children: [
          {
            id: 'biscuits-cookies',
            name: 'Biscuits & Cookies',
            slug: 'biscuits-and-cookies',
            image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'chips-pretzels',
            name: 'Chips & Pretzels',
            slug: 'chips-and-pretzels',
            image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80',
          },
          {
            id: 'noodles-pasta',
            name: 'Noodles & Pasta',
            slug: 'noodles-and-pasta',
            image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
          },
        ],
      },
    ],
  },
  {
    id: 'cleaning',
    name: 'Cleaning Supplies',
    slug: 'cleaning-supplies',
    hasChildren: true,
    children: [
      {
        id: 'dishwashing',
        name: 'Dishwashing Supplies',
        slug: 'dishwashing-supplies',
        image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'laundry',
        name: 'Laundry & Detergents',
        slug: 'laundry',
        image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'toilet-cleaners',
        name: 'Toilet Cleaners',
        slug: 'toilet-cleaners',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'home-kitchen',
    name: 'Home & Kitchen',
    slug: 'home-and-kitchen',
    hasChildren: true,
    children: [
      {
        id: 'kitchen-accessories',
        name: 'Kitchen Accessories',
        slug: 'kitchen-accessories',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'storage-organization',
        name: 'Storage & Organization',
        slug: 'storage-and-organization',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion & Lifestyle',
    slug: 'fashion-and-lifestyle',
    hasChildren: false,
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    slug: 'baby-care',
    hasChildren: true,
    children: [
      {
        id: 'diapers-wipes',
        name: 'Diapers & Wipes',
        slug: 'diapers-and-wipes',
        image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'baby-food',
        name: 'Baby Food',
        slug: 'baby-food',
        image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    hasChildren: true,
    children: [
      {
        id: 'hair-care',
        name: 'Hair Care',
        slug: 'hair-care',
        image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'skin-care',
        name: 'Skin Care',
        slug: 'skin-care',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'oral-care',
        name: 'Oral Care',
        slug: 'oral-care',
        image: 'https://images.unsplash.com/photo-1559591937-e10b1464bdfd?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'stationery',
    name: 'Stationery & Office',
    slug: 'stationery-and-office',
    hasChildren: true,
    children: [
      {
        id: 'pens-paper',
        name: 'Pens & Notebooks',
        slug: 'pens-and-notebooks',
        image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'pet-care',
    name: 'Pet Care',
    slug: 'pet-care',
    hasChildren: true,
    children: [
      {
        id: 'cat-food',
        name: 'Cat Food',
        slug: 'cat-food',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80',
      },
      {
        id: 'dog-food',
        name: 'Dog Food',
        slug: 'dog-food',
        image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'toys-sports',
    name: 'Toys & Sports',
    slug: 'toys-and-sports',
    hasChildren: false,
  },
  {
    id: 'beauty-makeup',
    name: 'Beauty & MakeUp',
    slug: 'beauty-and-makeup',
    hasChildren: false,
  },
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    slug: 'health-and-wellness',
    hasChildren: true,
    children: [
      {
        id: 'first-aid',
        name: 'First Aid & Antiseptics',
        slug: 'first-aid',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'vehicle-essentials',
    name: 'Vehicle Essentials',
    slug: 'vehicle-essentials',
    hasChildren: false,
  },
  {
    id: 'new-arrival',
    name: 'New Arrival',
    slug: 'new-arrival',
    hasChildren: false,
  },
];

export const POPULAR_CATEGORIES_DATA: PopularCategory[] = [
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    slug: 'fruits-and-vegetables',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'meat-fish',
    name: 'Meat & Fish',
    slug: 'meat-and-fish',
    image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'cooking',
    name: 'Cooking',
    slug: 'cooking',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'beverages',
    name: 'Beverages',
    slug: 'beverages',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'home-cleaning',
    name: 'Home & Cleaning',
    slug: 'cleaning-supplies',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'pest-control',
    name: 'Pest Control',
    slug: 'cleaning-supplies',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Eggs',
    slug: 'dairy-and-eggs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'snacks',
    name: 'Snacks & Bakery',
    slug: 'snacks',
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

export const CITIES = [
  'Rangpur',
];

// Rich product catalog covering all categories & subcategories
export const CHALDAL_PRODUCTS: Product[] = [
  // --- MEAT & POULTRY ---
  {
    id: 'meat-1',
    name: 'Broiler Whole Chicken Leg Skin On (± 50 gm)',
    price: 519,
    unit: '1 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'meat',
    inStock: true,
  },
  {
    id: 'meat-2',
    name: 'Whole Deshi Chicken Skin Off ± 25 gm',
    price: 639,
    unit: '500 gm',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'meat',
    inStock: true,
  },
  {
    id: 'meat-3',
    name: 'Beef Boneless Premium ± 50 gm',
    price: 799,
    unit: '1 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'meat',
    inStock: true,
  },
  {
    id: 'chick-1',
    name: 'Whole Broiler Chicken (Cleaned)',
    price: 320,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'chicken-and-poultry',
    inStock: true,
  },
  {
    id: 'chick-2',
    name: 'Chicken Drumstick Pack',
    price: 360,
    unit: '500 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1588347818036-558601350bc4?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'chicken-and-poultry',
    inStock: true,
  },
  {
    id: 'prem-per-1',
    name: 'Bengal Meat Mutton Boneless Cut',
    price: 1150,
    unit: '1 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'premium-perishables',
    inStock: true,
  },
  {
    id: 'froz-fish-1',
    name: 'Rui Fish Cleaned Cut (Frozen)',
    price: 450,
    unit: '1 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'frozen-fish',
    inStock: true,
  },
  {
    id: 'froz-fish-2',
    name: 'Prawn Large Cleaned (Frozen)',
    price: 890,
    unit: '500 gm',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'frozen-fish',
    inStock: true,
  },
  {
    id: 'tofu-1',
    name: 'Fresh Tofu Organic Block',
    price: 180,
    unit: '300 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'tofu-and-meat-alternatives',
    inStock: true,
  },
  {
    id: 'dried-fish-1',
    name: 'Loitta Shutki (Dried Loitta Fish)',
    price: 250,
    unit: '250 gm',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'dried-fish',
    inStock: true,
  },

  // --- FRUITS & VEGETABLES ---
  {
    id: 'veg-1',
    name: 'Potato Regular (Alu)',
    price: 45,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'fresh-vegetables',
    inStock: true,
  },
  {
    id: 'veg-2',
    name: 'Onion Local (Deshi Peyaj)',
    price: 110,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'fresh-vegetables',
    inStock: true,
  },
  {
    id: 'veg-3',
    name: 'Tomato (Ripe)',
    price: 65,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'fresh-vegetables',
    inStock: true,
  },
  {
    id: 'fruit-1',
    name: 'Green Apple (Imported)',
    price: 290,
    unit: '1 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'fresh-fruits',
    inStock: true,
  },
  {
    id: 'fruit-2',
    name: 'Banana Sagar (Kolom)',
    price: 90,
    unit: '12 pcs',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'fresh-fruits',
    inStock: true,
  },

  // --- COOKING (Oil, Rice, Spices, Salt) ---
  {
    id: 'oil-1',
    name: 'Rupchanda Soyabean Oil Bottle',
    price: 815,
    unit: '5 L',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'oil-and-ghee',
    inStock: true,
  },
  {
    id: 'oil-2',
    name: 'Radhuni Pure Mustard Oil',
    price: 360,
    unit: '1 L',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'oil-and-ghee',
    inStock: true,
  },
  {
    id: 'rice-1',
    name: 'Miniket Premium Rice',
    price: 385,
    unit: '5 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'rice-and-lentils',
    inStock: true,
  },
  {
    id: 'rice-2',
    name: 'Deshi Red Lentils (Deshi Masoor Dal)',
    price: 140,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'rice-and-lentils',
    inStock: true,
  },
  {
    id: 'spices-1',
    name: 'Radhuni Turmeric Powder (Holud)',
    price: 120,
    unit: '200 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'spices-and-masala',
    inStock: true,
  },
  {
    id: 'spices-2',
    name: 'Radhuni Chilli Powder (Morich)',
    price: 135,
    unit: '200 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'spices-and-masala',
    inStock: true,
  },
  {
    id: 'salt-1',
    name: 'ACI Pure Salt Vacuum Evaporated',
    price: 42,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'salt-and-sugar',
    inStock: true,
  },
  {
    id: 'salt-2',
    name: 'Teer Pure White Refined Sugar',
    price: 140,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'salt-and-sugar',
    inStock: true,
  },

  // --- SAUCES & PICKLES ---
  {
    id: 'sauce-1',
    name: 'Pran Tomato Ketchup Glass Bottle',
    price: 120,
    unit: '350 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'tomato-sauce',
    inStock: true,
  },
  {
    id: 'pickle-1',
    name: 'Radhuni Mango Pickle Jar (Aam Achar)',
    price: 165,
    unit: '400 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1589135233689-d56d354e3d37?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'pickles',
    inStock: true,
  },

  // --- DAIRY & EGGS ---
  {
    id: 'egg-1',
    name: 'Chicken Eggs Layer (White)',
    price: 135,
    unit: '12 pcs',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'eggs',
    inStock: true,
  },
  {
    id: 'milk-1',
    name: 'Aarong Dairy Pasteurized Liquid Milk',
    price: 90,
    unit: '1 L',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'liquid-milk',
    inStock: true,
  },
  {
    id: 'butter-1',
    name: 'Aarong Pure Dairy Ghee',
    price: 480,
    unit: '200 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'butter-and-ghee',
    inStock: true,
  },

  // --- BREAKFAST & BAKERY ---
  {
    id: 'bread-1',
    name: 'Wonder White Bread Family Pack',
    price: 75,
    unit: '400 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'breads-and-bakery',
    inStock: true,
  },
  {
    id: 'cereal-1',
    name: 'Quaker Instant Oatmeal Box',
    price: 340,
    unit: '500 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'cereals-and-oats',
    inStock: true,
  },
  {
    id: 'tea-1',
    name: 'Ispahani Mirzapore Premium Black Tea',
    price: 210,
    unit: '400 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'tea-and-coffee',
    inStock: true,
  },

  // --- CANDY & CHOCOLATE ---
  {
    id: 'choc-1',
    name: 'Cadbury Dairy Milk Silk Chocolate',
    price: 220,
    unit: '150 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'chocolates',
    inStock: true,
  },
  {
    id: 'candy-1',
    name: 'Mentos Fruit Chewy Candies Roll',
    price: 35,
    unit: '1 pack',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'candies-and-gums',
    inStock: true,
  },

  // --- SNACKS (Biscuits, Chips, Noodles) ---
  {
    id: 'bisc-1',
    name: 'Lexus Vegetable Biscuit Family Pack',
    price: 95,
    unit: '250 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'biscuits-and-cookies',
    inStock: true,
  },
  {
    id: 'chips-1',
    name: 'Lays Potato Chips American Style Cream & Onion',
    price: 65,
    unit: '50 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'chips-and-pretzels',
    inStock: true,
  },
  {
    id: 'nood-1',
    name: 'Maggi 2-Minute Masala Noodles Pack of 8',
    price: 180,
    unit: '8 pcs',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'noodles-and-pasta',
    inStock: true,
  },

  // --- CLEANING SUPPLIES ---
  {
    id: 'clean-1',
    name: 'Vim Dishwash Liquid Lemon Bottle',
    price: 135,
    unit: '500 ml',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'dishwashing-supplies',
    inStock: true,
  },
  {
    id: 'clean-2',
    name: 'Rin Washing Powder Detergent',
    price: 195,
    unit: '1 kg',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'laundry',
    inStock: true,
  },
  {
    id: 'clean-3',
    name: 'Harpic Toilet Cleaner Power Plus Original',
    price: 160,
    unit: '750 ml',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'toilet-cleaners',
    inStock: true,
  },

  // --- HOME & KITCHEN ---
  {
    id: 'home-1',
    name: 'Stainless Steel Kitchen Knife Set',
    price: 450,
    unit: '3 pcs',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'kitchen-accessories',
    inStock: true,
  },
  {
    id: 'home-2',
    name: 'Airtight Plastic Food Container Set',
    price: 380,
    unit: '4 pcs',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'storage-and-organization',
    inStock: true,
  },

  // --- BABY CARE ---
  {
    id: 'baby-1',
    name: 'Huggies Wonder Pants Baby Diaper M',
    price: 850,
    unit: '44 pcs',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'diapers-and-wipes',
    inStock: true,
  },
  {
    id: 'baby-2',
    name: 'Cerelac Wheat & Milk Baby Cereal Stage 1',
    price: 420,
    unit: '400 gm',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'baby-food',
    inStock: true,
  },

  // --- PERSONAL CARE ---
  {
    id: 'pers-1',
    name: 'Sunsilk Black Shine Shampoo',
    price: 360,
    unit: '375 ml',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'hair-care',
    inStock: true,
  },
  {
    id: 'pers-2',
    name: 'Nivea Soft Refreshingly Soft Moisturizing Cream',
    price: 280,
    unit: '200 ml',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'skin-care',
    inStock: true,
  },
  {
    id: 'pers-3',
    name: 'Colgate Strong Teeth Fluoride Toothpaste',
    price: 130,
    unit: '200 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1559591937-e10b1464bdfd?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'oral-care',
    inStock: true,
  },

  // --- STATIONERY ---
  {
    id: 'stat-1',
    name: 'Matador Hi-School Ballpoint Pen Box',
    price: 120,
    unit: '12 pcs',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'pens-and-notebooks',
    inStock: true,
  },

  // --- PET CARE ---
  {
    id: 'pet-1',
    name: 'Whiskas Adult Cat Food Ocean Fish',
    price: 490,
    unit: '1.2 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'cat-food',
    inStock: true,
  },
  {
    id: 'pet-2',
    name: 'Pedigree Adult Dry Dog Food Chicken & Vegetables',
    price: 650,
    unit: '1.5 kg',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'dog-food',
    inStock: true,
  },

  // --- HEALTH & WELLNESS ---
  {
    id: 'health-1',
    name: 'Savlon Antiseptic Liquid Bottle',
    price: 175,
    unit: '500 ml',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'first-aid',
    inStock: true,
  },

  // --- FASHION & LIFESTYLE ---
  {
    id: 'fash-1',
    name: 'Men Cotton Casual T-Shirt Premium',
    price: 450,
    unit: '1 pc',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'fashion-and-lifestyle',
    inStock: true,
  },

  // --- TOYS & SPORTS ---
  {
    id: 'toy-1',
    name: 'Educational Building Blocks Toy Set',
    price: 550,
    unit: '1 box',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1587654562363-6054a493e3e6?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'toys-and-sports',
    inStock: true,
  },

  // --- BEAUTY & MAKEUP ---
  {
    id: 'beaut-1',
    name: 'Maybelline New York Matte Lipstick',
    price: 680,
    unit: '1 pc',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'beauty-and-makeup',
    inStock: true,
  },

  // --- VEHICLE ESSENTIALS ---
  {
    id: 'veh-1',
    name: 'Car Windshield Washer Fluid Liquid',
    price: 250,
    unit: '1 L',
    deliveryTime: '3 hrs',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'vehicle-essentials',
    inStock: true,
  },

  // --- NEW ARRIVALS ---
  {
    id: 'new-1',
    name: 'Organic Honey Nuts Glass Jar',
    price: 590,
    unit: '500 gm',
    deliveryTime: '2 hrs',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&auto=format&fit=crop&q=80',
    categorySlug: 'new-arrival',
    inStock: true,
  },
];
