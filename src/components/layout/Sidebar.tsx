'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Ticket,
  Zap,
  Heart,
  ChevronRight,
  ChevronDown,
  X,
  Utensils,
} from 'lucide-react';
import { CategoryItem } from '@/lib/constants';
import { fetchCategoriesFromBackend } from '@/lib/api';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS, CATEGORY_TRANSLATIONS } from '@/lib/translations';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useCartStore();
  const t = TRANSLATIONS[language];

  // Dynamic Category Tree state (Fetched from Django backend API)
  const [categoriesTree, setCategoriesTree] = useState<CategoryItem[]>([]);
  const [isFoodExpanded, setIsFoodExpanded] = useState<boolean>(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadBackendCategories() {
      const fetched = await fetchCategoriesFromBackend();
      if (isMounted && fetched && fetched.length > 0) {
        setCategoriesTree(fetched);

        // Auto expand categories that have children
        const initialExpandState: Record<string, boolean> = {};
        fetched.forEach((cat) => {
          if (cat.children && cat.children.length > 0) {
            initialExpandState[cat.id] = true;
          }
        });
        setExpandedCategories((prev) => ({ ...initialExpandState, ...prev }));
      }
    }

    loadBackendCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleExpandCategory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const getCategoryName = (name: string) => {
    if (language === 'BN' && CATEGORY_TRANSLATIONS[name]) {
      return CATEGORY_TRANSLATIONS[name];
    }
    return name;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 top-14 bg-black/40 backdrop-blur-2xs z-30 md:hidden transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-14 bottom-0 w-64 bg-white border-r border-zinc-200 z-30 flex flex-col transition-transform duration-300 ease-in-out select-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Close / Brand Bar (Visible on mobile) */}
        <div className="p-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80 md:hidden">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="METRO BAZAR"
              className="h-7 w-auto object-contain"
            />
            <span className="font-bold text-sm text-[#4A235A] font-serif italic">
              METRO BAZAR
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-800 rounded hover:bg-zinc-200/60 transition-colors cursor-pointer"
            title="Close Menu"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Egg Club Banner */}
        <div className="p-3.5 bg-[#E5C384] text-zinc-900 border-b border-[#D4AE6E] shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-700 font-semibold">{t.eggClub}</div>
              <div className="text-sm font-black text-zinc-900">{t.points}</div>
            </div>
            <button className="text-xs font-bold bg-white/90 hover:bg-white text-zinc-800 px-3 py-1 rounded-full transition-colors shadow-2xs cursor-pointer">
              {t.getDiscounts}
            </button>
          </div>
        </div>

        {/* 2. Quick Links: Coupons, Offers, Favourites */}
        <div className="py-2 border-b border-zinc-200 divide-y divide-zinc-100 shrink-0">
          <a
            href="#coupons"
            className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:text-[#7533CB] hover:bg-purple-50/40 transition-colors"
          >
            <div className="p-1 bg-emerald-100 text-emerald-700 rounded-xs">
              <Ticket className="w-4 h-4" />
            </div>
            <span className="font-medium text-[13px] sm:text-sm">{t.coupons}</span>
          </a>

          <a
            href="#offers"
            className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:text-[#7533CB] hover:bg-purple-50/40 transition-colors"
          >
            <div className="p-1 bg-blue-100 text-blue-600 rounded-xs">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-medium text-[13px] sm:text-sm">{t.offers}</span>
          </a>

          <a
            href="#favourites"
            className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 hover:text-[#7533CB] hover:bg-purple-50/40 transition-colors"
          >
            <div className="p-1 text-rose-600">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <span className="font-medium text-[13px] sm:text-sm">{t.favourites}</span>
          </a>
        </div>

        {/* 3. Dropdown Section: FOOD -> Categories -> Sub-Categories */}
        <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
          {/* Main "Food" Dropdown Accordion Header */}
          <div className="w-full">
            <button
              onClick={() => setIsFoodExpanded(!isFoodExpanded)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-extrabold text-[#7533CB] bg-purple-50/80 hover:bg-purple-100/70 border-y border-purple-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Utensils className="w-4 h-4 text-[#7533CB]" />
                <span className="tracking-wide">Food</span>
              </div>
              {isFoodExpanded ? (
                <ChevronDown className="w-4 h-4 text-[#7533CB]" />
              ) : (
                <ChevronRight className="w-4 h-4 text-purple-400" />
              )}
            </button>

            {/* Expanded List of Categories under Food */}
            {isFoodExpanded && (
              <div className="py-1 bg-zinc-50/30">
                {categoriesTree.length === 0 ? (
                  <div className="px-6 py-2.5 text-xs text-zinc-400 italic">
                    No categories found
                  </div>
                ) : (
                  categoriesTree.map((cat: CategoryItem) => {
                    const hasChildren = cat.children && cat.children.length > 0;
                    const isExpanded = !!expandedCategories[cat.id];
                    const catPath = `/category/${cat.slug}`;
                    const isActive =
                      pathname === catPath || pathname.startsWith(`${catPath}/`);

                    return (
                      <div key={cat.id} className="w-full">
                        {/* Category Row */}
                        <div
                          onClick={() => {
                            if (hasChildren) {
                              setExpandedCategories((prev) => ({
                                ...prev,
                                [cat.id]: !prev[cat.id],
                              }));
                            }
                            handleNavigate(catPath);
                          }}
                          className={`w-full flex items-center justify-between pl-7 pr-4 py-2 text-[13px] sm:text-sm transition-colors cursor-pointer group ${
                            isActive
                              ? 'text-[#7533CB] font-bold bg-purple-50/80'
                              : 'text-zinc-800 hover:text-[#7533CB] hover:bg-zinc-100/70'
                          }`}
                        >
                          <span className="truncate">{getCategoryName(cat.name)}</span>
                          {hasChildren && (
                            <button
                              onClick={(e) => toggleExpandCategory(cat.id, e)}
                              className="p-1 text-zinc-400 hover:text-[#7533CB] cursor-pointer"
                              aria-label="Toggle Subcategories"
                            >
                              {isExpanded ? (
                                <ChevronDown className="w-3.5 h-3.5 text-[#7533CB]" />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 group-hover:text-[#7533CB]" />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Sub-Categories under this Category */}
                        {hasChildren && isExpanded && (
                          <div className="pl-10 pr-3 py-1 space-y-0.5 border-l-2 border-purple-300/60 ml-8 my-0.5">
                            {cat.children!.map((sub) => {
                              const subPath = `/category/${cat.slug}/${sub.slug}`;
                              const isSubActive =
                                pathname === subPath || pathname.startsWith(`${subPath}/`);

                              return (
                                <div
                                  key={sub.id}
                                  onClick={() => handleNavigate(subPath)}
                                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition-colors cursor-pointer ${
                                    isSubActive
                                      ? 'text-[#7533CB] font-bold bg-purple-100/60'
                                      : 'text-zinc-600 hover:text-[#7533CB] hover:bg-zinc-100'
                                  }`}
                                >
                                  <span className="truncate">{getCategoryName(sub.name)}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </nav>
      </aside>
    </>
  );
};
