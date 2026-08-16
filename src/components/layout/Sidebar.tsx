'use client';

import React from 'react';
import {
  Flame,
  Apple,
  Fish,
  Utensils,
  Egg,
  Coffee,
  Cookie,
  Sparkles,
  HeartHandshake,
  Baby,
  Dog,
  BookOpen,
  X,
  Layers,
} from 'lucide-react';
import { CATEGORIES, Category } from '@/lib/constants';

const ICON_MAP: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-4 h-4 text-zinc-500" />,
  Apple: <Apple className="w-4 h-4 text-zinc-500" />,
  Fish: <Fish className="w-4 h-4 text-zinc-500" />,
  Utensils: <Utensils className="w-4 h-4 text-zinc-500" />,
  Egg: <Egg className="w-4 h-4 text-zinc-500" />,
  Coffee: <Coffee className="w-4 h-4 text-zinc-500" />,
  Cookie: <Cookie className="w-4 h-4 text-zinc-500" />,
  Sparkles: <Sparkles className="w-4 h-4 text-zinc-500" />,
  HeartHandshake: <HeartHandshake className="w-4 h-4 text-zinc-500" />,
  Baby: <Baby className="w-4 h-4 text-zinc-500" />,
  Dog: <Dog className="w-4 h-4 text-zinc-500" />,
  BookOpen: <BookOpen className="w-4 h-4 text-zinc-500" />,
};

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
      {/* Egg Club & Quick Links Section: Plain text on white background */}
      <div className="p-3 border-b border-zinc-200 space-y-2 bg-white">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-zinc-900">Egg Club</span>
          <span className="text-[11px] text-zinc-500">0 Points</span>
        </div>
        <div className="flex flex-col space-y-1.5 pt-1 text-[11px] text-zinc-600">
          <a href="#coupons" className="hover:text-[#6A1B9A] hover:underline">
            Coupons
          </a>
          <a href="#offers" className="hover:text-[#6A1B9A] hover:underline">
            Offers
          </a>
          <a href="#favourites" className="hover:text-[#6A1B9A] hover:underline">
            Favourites
          </a>
        </div>
      </div>

      {/* Flat Categories List: Plain vertical text list */}
      <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar divide-y divide-zinc-100">
        {CATEGORIES.map((cat: Category) => {
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left ${
                isSelected
                  ? 'text-[#6A1B9A] font-semibold'
                  : 'text-zinc-700 hover:text-[#6A1B9A]'
              }`}
            >
              <span className="shrink-0 opacity-80">
                {ICON_MAP[cat.icon] || <Layers className="w-4 h-4 text-zinc-400" />}
              </span>
              <span className="truncate flex-1">{cat.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Simple Footer Links */}
      <div className="p-3 border-t border-zinc-200 text-[11px] text-zinc-500 space-y-1 bg-white">
        <div className="flex gap-2">
          <a href="#help" className="hover:underline">Help & FAQ</a>
          <span>•</span>
          <a href="#terms" className="hover:underline">Terms</a>
        </div>
        <p className="text-[10px] text-zinc-400">Chaldal Grocery Express</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block fixed left-0 top-14 bottom-0 w-60 border-r border-zinc-200 bg-white z-30 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/30 transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 bg-white h-full shadow-md flex flex-col z-10 border-r border-zinc-200">
            <div className="p-3 border-b border-zinc-200 flex items-center justify-between">
              <span className="font-semibold text-sm text-[#6A1B9A]">Categories</span>
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
