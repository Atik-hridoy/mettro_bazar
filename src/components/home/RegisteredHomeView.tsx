'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, X, Search } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS } from '@/lib/translations';

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

export const RegisteredHomeView: React.FC = () => {
  const router = useRouter();
  const { language } = useCartStore();
  const t = TRANSLATIONS[language];
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<BannerStory | null>(null);
  const [backendProducts, setBackendProducts] = useState<Product[]>([]);

  React.useEffect(() => {
    async function loadProducts() {
      try {
        const { fetchProductsFromBackend } = await import('@/lib/api');
        const prods = await fetchProductsFromBackend();
        if (Array.isArray(prods)) {
          setBackendProducts(prods);
        }
      } catch (err) {
        console.error('Failed to fetch backend products for Registered Home:', err);
      }
    }
    loadProducts();
  }, []);

  // Smart Cold-Start & Popularity Algorithm for New Fresh Users:
  // 1. Popular: Everyday essential staple necessities (Oil, Rice, Salt, Sugar, Eggs, Tea, Milk, Dal, Dishwash)
  const popularKeywords = ['oil', 'rice', 'salt', 'sugar', 'egg', 'tea', 'milk', 'dal', 'potato', 'onion', 'dishwash', 'চাল', 'তেল', 'ডিম', 'পেঁয়াজ', 'আলু', 'চা', 'দুধ'];
  const popularItems = backendProducts.filter((p) => {
    const nameLower = (p.name + ' ' + (p.banglaName || '')).toLowerCase();
    return popularKeywords.some((kw) => nameLower.includes(kw));
  });

  const displayPopular = popularItems.length > 0 ? popularItems.slice(0, 8) : (backendProducts.length > 0 ? backendProducts.slice(0, 8) : []);

  // 2. Recommended: Diverse products across multiple categories
  const recommendedItems = backendProducts.filter((p) => !displayPopular.some((pop) => pop.id === p.id));
  const displayRecommended = recommendedItems.length > 0 ? recommendedItems.slice(0, 8) : (backendProducts.length > 0 ? backendProducts.slice(0, 8) : []);

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

  const filteredRecommended = mobileSearchQuery
    ? displayRecommended.filter((p) =>
        p.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
        (p.banglaName && p.banglaName.includes(mobileSearchQuery))
      )
    : displayRecommended;

  const filteredPopular = mobileSearchQuery
    ? displayPopular.filter((p) =>
        p.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
        (p.banglaName && p.banglaName.includes(mobileSearchQuery))
      )
    : displayPopular;

  return (
    <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4 space-y-5 sm:space-y-8 pb-16">
      {/* Mobile Only: Constant Search Bar directly under Navbar */}
      <div className="md:hidden w-full sticky top-14 z-20 bg-white/95 backdrop-blur-xs py-2 -mx-3 px-3 border-b border-zinc-100 shadow-2xs">
        <div className="relative w-full">
          <input
            type="text"
            value={mobileSearchQuery}
            onChange={(e) => setMobileSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-zinc-50 focus:bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded-lg shadow-2xs focus:outline-none focus:border-[#7533CB]"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 1. Top Portrait Promo Banners Row matching Screenshot 1:1 */}
      <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 select-none custom-scrollbar">
        {PROMO_BANNERS.map((banner) => (
          <div
            key={banner.id}
            onClick={() => handleOpenStory(banner)}
            className="group relative w-28 sm:w-36 md:w-40 h-44 sm:h-60 md:h-64 shrink-0 rounded-xl overflow-hidden shadow-2xs cursor-pointer select-none transition-all hover:-translate-y-1 hover:shadow-sm border border-zinc-200/80"
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-2 sm:p-2.5 text-white">
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-amber-300 mb-0.5">
                {banner.badge}
              </span>
              <h3 className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-2">
                {banner.title}
              </h3>
              <p className="text-[9px] sm:text-[10px] text-zinc-200 line-clamp-1 mt-0.5 font-normal">
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
            {t.recommendedForYou}
          </h2>
          <Link
            href="/recommended"
            className="text-xs font-semibold text-[#7533CB] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewMore}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2 cols on mobile, 3-7 cols on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2.5 sm:gap-4">
          {filteredRecommended.map((prod) => (
            <ProductCard key={prod.id} product={prod} categoryName="Recommended" />
          ))}
        </div>
      </div>

      {/* 3. Section: Popular */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-zinc-900">
            {t.popular}
          </h2>
          <Link
            href="/popular"
            className="text-xs font-semibold text-[#7533CB] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.viewMore}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2 cols on mobile, 3-7 cols on larger screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2.5 sm:gap-4">
          {filteredPopular.map((prod) => (
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
          <div className="relative w-full max-w-sm sm:max-w-md h-[560px] sm:h-[620px] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col justify-between animate-in zoom-in-95 duration-200 border border-zinc-100">
            {/* Top Story Progress Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 px-3 pt-2">
              <div className="w-full h-1 bg-zinc-200/60 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-full animate-in fade-in" />
              </div>
            </div>

            {/* Top Right Close Button */}
            <button
              onClick={() => setActiveStory(null)}
              className="absolute top-4 right-4 z-30 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-zinc-700 transition-colors cursor-pointer"
              aria-label="Close story"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Story Content Area */}
            <div className="relative flex-1 flex flex-col items-center justify-between p-5 sm:p-6 pt-10 text-center select-none">
              {/* Top Bengali Headline */}
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
              <div className="w-56 h-56 sm:w-72 sm:h-72 my-auto relative flex items-center justify-center">
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
