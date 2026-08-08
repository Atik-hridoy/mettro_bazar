import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/features/ProductCard';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { EmptyState } from '../components/ui/EmptyState';
import { ArrowRight, CheckCircle, Leaf } from 'lucide-react';
import { bannerService } from '../services/bannerService';
import type { Banner } from '../types/banner';

import { HeroBannerSlider } from '../components/features/HeroBannerSlider';

interface HomePageProps {
  searchQuery: string;
}

export const HomePage: React.FC<HomePageProps> = ({ searchQuery }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [banners, setBanners] = useState<Banner[]>([]);

  const { products, categories, isLoading, error } = useProducts(
    selectedCategory,
    searchQuery
  );

  useEffect(() => {
    async function loadBanners() {
      const bannerData = await bannerService.getBanners();
      setBanners(bannerData);
    }
    loadBanners();
  }, []);

  return (
    <div className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* Dynamic Full Width Hero Banner Carousel */}
      <HeroBannerSlider banners={banners} />

      {/* Category Chips Bar */}
      <section id="categories" className="space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Categories</h3>
        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 px-6 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#00694c] text-white border-[#00694c] shadow-md shadow-emerald-900/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-[#00694c] hover:text-[#00694c]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Responsive Full Width Product Grid */}
      <section id="products" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <h2 className="text-xl sm:text-3xl font-black text-slate-800">
            Featured Ready-to-Cook
          </h2>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-[#00694c] font-extrabold text-xs sm:text-sm hover:underline flex items-center gap-1 self-start sm:self-auto"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="p-6 bg-rose-50 text-rose-600 rounded-2xl text-center font-medium text-sm border border-rose-200">
            {error}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No ready-to-cook items found"
            description="Try selecting a different category or adjusting your search keyword."
            actionText="Clear Filters"
            onAction={() => setSelectedCategory('all')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Full Width Footer */}
      <footer className="bg-[#003b29] text-white rounded-3xl p-8 sm:p-12 space-y-8 mt-12 shadow-2xl border border-emerald-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="মেট্রো বাজার"
                className="h-10 w-auto object-contain rounded-lg"
              />
              <span className="text-2xl font-black text-white">Mettro Bazar</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed opacity-90">
              Delivering premium, hygienic, ready-to-cook food right to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-amber-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>100% Halal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Fresh Guarantee</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">About Us</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100 opacity-90">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="font-bold underline text-white">Fresh Guarantee</a></li>
              <li><a href="#" className="hover:text-white">Hygienic Packaging</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100 opacity-90">
              <li><a href="#" className="hover:text-white">Track Order</a></li>
              <li><a href="#" className="hover:text-white">Delivery Information</a></li>
              <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Payments</h4>
            <div className="space-y-1.5 text-xs sm:text-sm text-emerald-100 opacity-90">
              <p>💳 bKash / Nagad / Rocket</p>
              <p>🚚 Cash on Delivery</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-800 text-center text-xs text-emerald-200/60">
          © 2026 Mettro Bazar. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
