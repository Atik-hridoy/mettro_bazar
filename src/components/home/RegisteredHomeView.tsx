'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS } from '@/lib/translations';

interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  bgGradient: string;
  image: string;
  link: string;
  ctaText: string;
}

const HERO_CAROUSEL_BANNERS: PromoBanner[] = [
  {
    id: 'banner-1',
    title: 'মেট্রো বাজার ডেইলি সুপার সেভিংস!',
    subtitle: 'নিত্যপ্রয়োজনীয় গ্রোসারি ও সেরা পণ্যে ৪০% পর্যন্ত বিশেষ ছাড়',
    badge: 'SUPER SAVINGS',
    bgGradient: 'from-[#7533CB] via-[#5C23A6] to-[#3B1273]',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
    link: '/category/food',
    ctaText: 'এখনই কেনাকাটা করুন',
  },
  {
    id: 'banner-2',
    title: 'প্রিমিয়াম বেবি কেয়ার ও ডায়াপার মেলা',
    subtitle: 'সেরা ব্র্যান্ডের ডায়াপার ও বেবি ফুডে বিশেষ মূল্যছাড়',
    badge: 'BABY CARE',
    bgGradient: 'from-blue-600 via-indigo-600 to-purple-700',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1000&auto=format&fit=crop&q=80',
    link: '/category/baby-care',
    ctaText: 'অফার দেখুন',
  },
  {
    id: 'banner-3',
    title: 'খামার থেকে তাজা শাক-সবজি ও ফলমূল',
    subtitle: '১০০% তাজা ও অর্গানিক গ্রোসারি সরাসরি আপনার দরজায়',
    badge: 'FRESH PRODUCE',
    bgGradient: 'from-emerald-700 via-teal-700 to-green-900',
    image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=1000&auto=format&fit=crop&q=80',
    link: '/category/food',
    ctaText: 'তাজা বাজার করুন',
  },
  {
    id: 'banner-4',
    title: 'অফিস ও করপোরেট বাল্ক অর্ডার সলিউশন',
    subtitle: 'প্রতিষ্ঠানের কেনাকাটায় বিশেষ মূল্যছাড় ও ভ্যাট চালান সুবিধা',
    badge: 'B2B CORPORATE',
    bgGradient: 'from-amber-600 via-orange-600 to-amber-800',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1000&auto=format&fit=crop&q=80',
    link: '/category/stationery-office',
    ctaText: 'বিস্তারিত জানুন',
  },
];

const GRADIENT_LIST = [
  'from-[#7533CB] via-[#5C23A6] to-[#3B1273]',
  'from-blue-600 via-indigo-600 to-purple-700',
  'from-emerald-700 via-teal-700 to-green-900',
  'from-amber-600 via-orange-600 to-amber-800',
];

export const RegisteredHomeView: React.FC = () => {
  const router = useRouter();
  const { language } = useCartStore();
  const t = TRANSLATIONS[language];
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [backendProducts, setBackendProducts] = useState<Product[]>([]);
  const [carouselBanners, setCarouselBanners] = useState<PromoBanner[]>(HERO_CAROUSEL_BANNERS);

  // Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Auto slide every 4 seconds
  useEffect(() => {
    if (isPaused || carouselBanners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, carouselBanners.length]);

  const handleNext = () => {
    if (carouselBanners.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % carouselBanners.length);
  };

  const handlePrev = () => {
    if (carouselBanners.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      handleNext();
    } else if (distance < -50) {
      handlePrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    async function loadBannersAndProducts() {
      try {
        const { fetchProductsFromBackend, fetchBannersFromBackend } = await import('@/lib/api');
        
        // Load products
        const prods = await fetchProductsFromBackend();
        if (Array.isArray(prods)) {
          setBackendProducts(prods);
        }

        // Load active banners from backend
        const apiBanners = await fetchBannersFromBackend(false);
        if (Array.isArray(apiBanners) && apiBanners.length > 0) {
          const mapped: PromoBanner[] = apiBanners.map((b, idx) => {
            let targetLink = '/category/food';
            if (b.target_type === 'category') {
              targetLink = `/category/${b.target_id || 'food'}`;
            } else if (b.target_type === 'product') {
              targetLink = `/product/${b.target_id}`;
            } else if (b.target_type === 'external') {
              targetLink = b.target_id || '#';
            }

            return {
              id: b.id,
              title: b.title,
              subtitle: b.subtitle || 'মেট্রো বাজারে নিত্যপ্রয়োজনীয় অফার ও বিশেষ ছাড়!',
              badge: b.target_type ? b.target_type.toUpperCase().replace('_', ' ') : 'PROMOTION',
              bgGradient: GRADIENT_LIST[idx % GRADIENT_LIST.length],
              image: b.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1000&auto=format&fit=crop&q=80',
              link: targetLink,
              ctaText: 'এখনই কেনাকাটা করুন',
            };
          });
          setCarouselBanners(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch backend data for Registered Home:', err);
      }
    }
    loadBannersAndProducts();
  }, []);

  // Smart Cold-Start & Popularity Algorithm for New Fresh Users:
  const popularKeywords = ['oil', 'rice', 'salt', 'sugar', 'egg', 'tea', 'milk', 'dal', 'potato', 'onion', 'dishwash', 'চাল', 'তেল', 'ডিম', 'পেঁয়াজ', 'আলু', 'চা', 'দুধ'];
  const popularItems = backendProducts.filter((p) => {
    const nameLower = (p.name + ' ' + (p.banglaName || '')).toLowerCase();
    return popularKeywords.some((kw) => nameLower.includes(kw));
  });

  const displayPopular = popularItems.length > 0 ? popularItems.slice(0, 8) : (backendProducts.length > 0 ? backendProducts.slice(0, 8) : []);

  // Recommended: Diverse products across multiple categories
  const recommendedItems = backendProducts.filter((p) => !displayPopular.some((pop) => pop.id === p.id));
  const displayRecommended = recommendedItems.length > 0 ? recommendedItems.slice(0, 8) : (backendProducts.length > 0 ? backendProducts.slice(0, 8) : []);

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

      {/* 1. Auto-Changing & Swappable Hero Banner Slider */}
      <div
        className="relative w-full h-44 sm:h-56 md:h-64 lg:h-72 rounded-2xl overflow-hidden shadow-sm border border-zinc-200/80 group select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {carouselBanners.map((banner, index) => {
          const isActive = index === currentSlide;

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out flex items-center ${
                isActive
                  ? 'opacity-100 translate-x-0 z-10 pointer-events-auto'
                  : 'opacity-0 translate-x-4 z-0 pointer-events-none'
              }`}
            >
              {/* Pure Clean Banner Image Without Any Color or Shade Overlay */}
              <Link href={banner.link} className="relative w-full h-full block group/banner">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/banner:scale-[1.01]"
                />
              </Link>
            </div>
          );
        })}

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Bottom Pagination Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {carouselBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                i === currentSlide ? 'w-7 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
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
    </div>
  );
};

