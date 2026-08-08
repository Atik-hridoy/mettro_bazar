import React, { useState, useEffect, useRef } from 'react';
import type { Banner } from '../../types/banner';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroBannerSliderProps {
  banners: Banner[];
  autoSlideInterval?: number;
}

export const HeroBannerSlider: React.FC<HeroBannerSliderProps> = ({
  banners,
  autoSlideInterval = 4000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const heroBanners = banners.filter((b) => b.bannerType === 'hero' || !b.bannerType);
  const activeBanners = heroBanners.length > 0 ? heroBanners : banners;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentIndex, isHovered, activeBanners.length, autoSlideInterval]);

  if (!activeBanners || activeBanners.length === 0) return null;

  return (
    <div
      className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-800/80 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out w-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner, index) => (
          <div
            key={banner.id || index}
            className="w-full shrink-0 relative bg-gradient-to-r from-[#003d2b] via-[#00694c] to-emerald-800 text-white min-h-[300px] sm:min-h-[380px] flex items-center"
          >
            {/* Background Image Layer with Overlay */}
            <div className="absolute inset-0 z-0">
              <div
                className="bg-cover bg-center w-full h-full opacity-30 mix-blend-overlay transition-transform duration-1000 scale-105"
                style={{
                  backgroundImage: `url('${banner.image || '/images/hero.jpg'}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#002d20] via-[#004d37]/80 to-transparent" />
            </div>

            {/* Banner Content */}
            <div className="relative z-10 p-6 sm:p-12 md:p-14 max-w-3xl space-y-3.5 sm:space-y-4">
              {banner.badgeText && (
                <span className="inline-block bg-amber-400 text-slate-950 font-extrabold text-[11px] sm:text-xs px-3.5 py-1 rounded-full shadow-md transform transition-all duration-300">
                  {banner.badgeText}
                </span>
              )}
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                {banner.title}
              </h1>
              <p className="text-xs sm:text-base md:text-lg text-emerald-100 leading-relaxed max-w-xl opacity-95">
                {banner.subtitle}
              </p>
              <div className="pt-2">
                <a
                  href={banner.buttonLink || '#products'}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-base py-3 px-6 sm:py-3.5 sm:px-8 rounded-xl transition-all inline-flex items-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 hover:gap-3"
                >
                  {banner.buttonText || 'Shop Now'} <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Prev / Next Arrows (Visible on Hover or Desktop) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/40 hover:bg-[#00694c] text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 active:scale-90 shadow-md border border-white/10"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-slate-950/40 hover:bg-[#00694c] text-white p-2.5 rounded-full backdrop-blur-md transition-all opacity-80 sm:opacity-0 group-hover:opacity-100 active:scale-90 shadow-md border border-white/10"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Pagination Indicator Dots */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-7 bg-amber-400 shadow-sm'
                  : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
