'use client';

import React from 'react';
import {
  Ticket,
  Zap,
  Heart,
  ChevronRight,
  X,
} from 'lucide-react';
import { CHALDAL_CATEGORIES, Category } from '@/lib/constants';

interface SidebarProps {
  selectedCategory?: string;
  onSelectCategory?: (id: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedCategory = 'popular',
  onSelectCategory,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) {
      onSelectCategory(catId);
    }
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white text-zinc-800 text-xs select-none">
      {/* 1. Egg Club Banner (Authentic Tan/Gold) */}
      <div className="p-3 bg-[#E5C384] text-zinc-900 border-b border-[#D4AE6E]">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-zinc-700 font-medium">Egg Club</div>
            <div className="text-xs font-bold text-zinc-900">0 Points</div>
          </div>
          <button className="text-[10px] font-semibold bg-white/80 hover:bg-white text-zinc-800 px-2 py-0.5 rounded-full transition-colors shadow-2xs">
            Get Discounts
          </button>
        </div>
      </div>

      {/* 2. Quick Links: Coupons, Offers, Favourites */}
      <div className="py-2 border-b border-zinc-200 divide-y divide-zinc-100">
        <a
          href="#coupons"
          className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors"
        >
          <div className="p-0.5 bg-emerald-100 text-emerald-700 rounded-xs">
            <Ticket className="w-3.5 h-3.5" />
          </div>
          <span className="font-medium text-xs">Coupons</span>
        </a>

        <a
          href="#offers"
          className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors"
        >
          <div className="p-0.5 bg-blue-100 text-blue-600 rounded-xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-medium text-xs">Offers</span>
        </a>

        <a
          href="#favourites"
          className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors"
        >
          <div className="p-0.5 text-rose-600">
            <Heart className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-medium text-xs">Favourites</span>
        </a>
      </div>

      {/* 3. Chaldal Category Vertical List */}
      <nav className="flex-1 overflow-y-auto py-1 custom-scrollbar">
        {CHALDAL_CATEGORIES.map((cat: Category) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors text-left group ${
                isSelected
                  ? 'text-[#7533CB] font-bold bg-purple-50/50'
                  : 'text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50'
              }`}
            >
              <span className="truncate">{cat.name}</span>
              {cat.hasSubcategories && (
                <ChevronRight className="w-3 h-3 text-zinc-400 group-hover:text-[#7533CB] shrink-0" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed left-0 top-14 bottom-0 w-56 border-r border-zinc-200 bg-white z-30 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 bg-white h-full shadow-2xl flex flex-col z-10 border-r border-zinc-200">
            <div className="p-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <span className="font-bold text-sm text-[#7533CB]">Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1 text-zinc-500 hover:text-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{sidebarContent}</div>
          </div>
        </div>
      )}
    </>
  );
};
