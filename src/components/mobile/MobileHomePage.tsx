import React, { useState, useEffect } from 'react';
import { useProducts } from '../../hooks/useProducts';
import { MobileProductCard } from './MobileProductCard';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { EmptyState } from '../ui/EmptyState';
import { ArrowRight, CheckCircle, Leaf } from 'lucide-react';
import { bannerService } from '../../services/bannerService';
import type { Banner } from '../../types/banner';
import { HeroBannerSlider } from '../features/HeroBannerSlider';

interface MobileHomePageProps {
  searchQuery: string;
}

export const MobileHomePage: React.FC<MobileHomePageProps> = ({ searchQuery }) => {
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
    <div className="w-full px-3 py-4 space-y-6">
      {/* Mobile Dynamic Hero Banner */}
      <HeroBannerSlider banners={banners} />

      {/* Mobile Scrollable Categories */}
      <section className="space-y-2">
        <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Categories</h3>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-[#00694c] text-white border-[#00694c] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mobile Product List View */}
      <section id="mobile-products" className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 className="text-base font-black text-slate-800">
            Featured Meals
          </h2>
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-[#00694c] font-bold text-xs hover:underline flex items-center gap-0.5"
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-center text-xs font-medium border border-rose-200">
            {error}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No meals found"
            description="Try choosing another category."
            actionText="Clear"
            onAction={() => setSelectedCategory('all')}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <MobileProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Mobile Footer */}
      <footer className="bg-[#003b29] text-white rounded-2xl p-5 space-y-6 mt-8">
        <div className="flex items-center gap-2">
          <img src="/images/logo.png" alt="মেট্রো বাজার" className="h-8 w-auto rounded" />
          <span className="text-lg font-black">Mettro Bazar</span>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed opacity-90">
          Delivering premium, hygienic, ready-to-cook food right to your doorstep.
        </p>
        <div className="flex gap-4 text-[11px] text-amber-300 font-semibold">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> 100% Halal
          </div>
          <div className="flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" /> Fresh Guarantee
          </div>
        </div>
        <div className="pt-3 border-t border-emerald-800 text-center text-[10px] text-emerald-200/60">
          © 2026 Mettro Bazar
        </div>
      </footer>
    </div>
  );
};
