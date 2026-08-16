'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, X } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/lib/constants';

interface BannerStory {
  id: string;
  title: string;
  subtitle: string;
  modalTitle: string;
  modalSubtitle?: string;
  bgGradient: string;
  image: string;
  modalImage: string;
  badge: string;
  categoryLink: string;
}

// Portrait Banner Cards matching Chaldal 1:1
const PROMO_BANNERS: BannerStory[] = [
  {
    id: 'promo-1',
    title: 'প্রিমিয়াম কেয়ার',
    subtitle: 'মেট্রো বাজার প্রিমিয়াম কেয়ার মেম্বারশিপ',
    modalTitle: 'মেট্রো বাজার প্রিমিয়াম কেয়ারে বিশেষ ছাড় ও ক্যাশব্যাক',
    modalSubtitle: 'আজই জয়েন করুন এবং পান ফ্রি ডেলিভারি ও এক্সক্লুসিভ অফার',
    bgGradient: 'from-amber-400 to-yellow-500',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80',
    modalImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
    badge: 'PREMIUM',
    categoryLink: '/category/food',
  },
  {
    id: 'promo-2',
    title: 'সকল ধরণের ডায়াপার',
    subtitle: 'কিনুন মেট্রো বাজার থেকে',
    modalTitle: 'সকল ধরণের ডায়াপার কিনুন মেট্রো বাজার থেকে',
    modalSubtitle: 'সেরা ব্র্যান্ডের বেবি ডায়াপারে আকর্ষণীয় ডিসকাউন্ট',
    bgGradient: 'from-sky-400 to-blue-600',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80',
    modalImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&q=80',
    badge: 'OFFERS',
    categoryLink: '/category/baby-care',
  },
  {
    id: 'promo-3',
    title: 'Cat Litter & Food',
    subtitle: 'পোষা প্রাণীর সেরা খাবার ও যত্ন',
    modalTitle: 'পোষা প্রাণীর প্রয়োজনীয় খাবার ও লিটার কিনুন',
    modalSubtitle: 'আপনার প্রিয় বিড়ালের জন্য স্বাস্থ্যকর প্রিমিয়াম ফুড',
    bgGradient: 'from-orange-400 to-amber-600',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&q=80',
    modalImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    badge: 'PET CARE',
    categoryLink: '/category/pet-care',
  },
  {
    id: 'promo-4',
    title: 'Corporate Solution',
    subtitle: 'অফিস ও বাল্ক অর্ডারের বিশেষ সুবিধা',
    modalTitle: 'অফিস সাপ্লাই ও করপোরেট বাল্ক অর্ডার সমাধান',
    modalSubtitle: 'কোম্পানি ও প্রতিষ্ঠানের জন্য বিশেষ ভ্যাট চালান ও ডিসকাউন্ট',
    bgGradient: 'from-amber-500 to-yellow-600',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=500&q=80',
    modalImage: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80',
    badge: 'B2B',
    categoryLink: '/category/stationery-office',
  },
  {
    id: 'promo-5',
    title: 'Insect & Pest Control',
    subtitle: 'বাসাবাড়ির সুরক্ষিত স্বাস্থ্যকর পরিবেশ',
    modalTitle: 'বাসাবাড়ি কীটমুক্ত রাখুন সুরক্ষিত উপায়ে',
    modalSubtitle: 'মশা, মাছি ও পোকামাকড় তাড়ানোর কার্যকারী সমাধান',
    bgGradient: 'from-teal-500 to-emerald-700',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    modalImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    badge: 'HYGIENE',
    categoryLink: '/category/cleaning-supplies',
  },
];

// Recommended For You items matching screenshot 1:1
const RECOMMENDED_PRODUCTS: Product[] = [
  {
    id: 'rec-1',
    name: 'NeoCare Premium Baby Diaper Belt S (3-6 kg)',
    price: 939,
    originalPrice: 1200,
    unit: '50 pcs',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'rec-2',
    name: 'BBQ Coal Bag Premium',
    price: 149,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'rec-3',
    name: "Mother's Smile Prima 1 Milk Tin (0-6 months)",
    price: 850,
    unit: '400 gm',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'rec-4',
    name: 'Bosny Non Poisonous Rat Glue Tray',
    price: 570,
    unit: '400 ml',
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'rec-5',
    name: 'Nestle Nescafe 3 in 1 Iced Frappe Cold Coffee',
    price: 50,
    unit: '30 gm',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'dairy',
    inStock: true,
  },
  {
    id: 'rec-6',
    name: 'Tibet Pumpkin Hair Oil Pure Herbal',
    price: 240,
    unit: '200 ml',
    image: 'https://images.unsplash.com/photo-1608248597359-00984a9191d9?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'beauty-makeup',
    inStock: true,
  },
  {
    id: 'rec-7',
    name: 'Comfort Baby Diaper Pant S (3-8 kg)',
    price: 699,
    originalPrice: 880,
    unit: '42 pcs',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
];

// Popular items matching screenshot 1:1
const POPULAR_PRODUCTS: Product[] = [
  {
    id: 'pop-1',
    name: 'Ispahani Mirzapore Tea Premium Bag',
    price: 210,
    unit: '400 gm',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  {
    id: 'pop-2',
    name: 'Teer Pure White Refined Sugar',
    price: 140,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  {
    id: 'pop-3',
    name: 'Aarong Dairy Pure Premium Ghee',
    price: 480,
    unit: '200 gm',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'dairy',
    inStock: true,
  },
  {
    id: 'pop-4',
    name: 'Bashundhara Facial Tissue Box (2 Ply)',
    price: 75,
    unit: '120 pcs',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'pop-5',
    name: 'Vim Dishwash Liquid Lemon Fresh',
    price: 135,
    unit: '500 ml',
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'cleaning-supplies',
    inStock: true,
  },
  {
    id: 'pop-6',
    name: 'ACI Pure Salt Vacuum Evaporated',
    price: 42,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
  {
    id: 'pop-7',
    name: 'Radhuni Pure Mustard Oil Bottle',
    price: 360,
    unit: '1 L',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
    deliveryTime: '2 hrs',
    categorySlug: 'food',
    inStock: true,
  },
];

export const RegisteredHomeView: React.FC = () => {
  const router = useRouter();
  const [activeStory, setActiveStory] = useState<BannerStory | null>(null);

  const handleOpenStory = (banner: BannerStory) => {
    setActiveStory(banner);
  };

  const handleVisitNow = () => {
    if (activeStory) {
      const link = activeStory.categoryLink;
      setActiveStory(null);
      router.push(link);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 py-4 space-y-8 pb-16">
      {/* 1. Top Portrait Promo Banners Row matching Screenshot 1:1 */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 select-none">
        {PROMO_BANNERS.map((banner) => (
          <div
            key={banner.id}
            onClick={() => handleOpenStory(banner)}
            className="group relative w-32 sm:w-36 md:w-40 h-52 sm:h-60 md:h-64 shrink-0 rounded-xl overflow-hidden shadow-2xs cursor-pointer select-none transition-all hover:-translate-y-1 hover:shadow-sm border border-zinc-200/80"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2.5 text-white">
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 mb-0.5">
                {banner.badge}
              </span>
              <h3 className="text-xs font-bold leading-tight line-clamp-2">
                {banner.title}
              </h3>
              <p className="text-[10px] text-zinc-200 line-clamp-1 mt-0.5 font-normal">
                {banner.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Section: Recommended For You */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900">
            Recommended For You
          </h2>
          <Link
            href="/recommended"
            className="text-xs font-semibold text-[#7533CB] hover:underline flex items-center gap-0.5"
          >
            <span>View more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
          {RECOMMENDED_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} categoryName="Recommended" />
          ))}
        </div>
      </div>

      {/* 3. Section: Popular */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900">
            Popular
          </h2>
          <Link
            href="/popular"
            className="text-xs font-semibold text-[#7533CB] hover:underline flex items-center gap-0.5"
          >
            <span>View more</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3 sm:gap-4">
          {POPULAR_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} categoryName="Popular" />
          ))}
        </div>
      </div>

      {/* 4. Banner Modal / Story Viewer matching Chaldal Screenshot 1:1 */}
      {activeStory && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
            onClick={() => setActiveStory(null)}
          />

          {/* Tall Story Card Box */}
          <div className="relative w-full max-w-sm sm:max-w-md h-[580px] sm:h-[620px] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col justify-between animate-in zoom-in-95 duration-200 border border-zinc-100">
            {/* Top Story Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-2">
              <div className="w-full h-1 bg-zinc-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-in fade-in" />
              </div>
            </div>

            {/* Top Right Close Button */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-zinc-700 transition-colors"
              aria-label="Close story"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Story Content Area */}
            <div className="relative flex-1 flex flex-col items-center justify-between p-6 pt-10 text-center select-none">
              {/* Top Bengali Headline matching Screenshot */}
              <div className="z-10 max-w-xs space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-[#4A235A] tracking-tight leading-snug">
                  {activeStory.modalTitle}
                </h2>
                {activeStory.modalSubtitle && (
                  <p className="text-xs text-zinc-500 font-medium">
                    {activeStory.modalSubtitle}
                  </p>
                )}
              </div>

              {/* Center Character / Illustration Graphic */}
              <div className="w-64 h-64 sm:w-72 sm:h-72 my-auto relative flex items-center justify-center">
                <img
                  src={activeStory.modalImage}
                  alt={activeStory.title}
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Bottom "Visit Now" Action Button matching Screenshot 1:1 */}
              <div className="w-full z-10 pt-4">
                <button
                  onClick={handleVisitNow}
                  className="w-full max-w-[200px] mx-auto py-2.5 px-6 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Visit Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
