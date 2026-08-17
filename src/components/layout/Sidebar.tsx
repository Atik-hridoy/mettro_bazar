'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Ticket,
  Zap,
  Heart,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react';
import { CATEGORY_TREE, CategoryItem } from '@/lib/constants';
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

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    food: true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
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

      {/* Left Sidebar Navigation (Expanded Width w-64 with clear typography) */}
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

        {/* 1. Egg Club Banner (Authentic Tan/Gold) */}
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

        {/* 3. Hierarchical Category Tree */}
        <nav className="flex-1 overflow-y-auto py-1.5 custom-scrollbar">
          {CATEGORY_TREE.map((cat: CategoryItem) => {
            const hasChildren = cat.children && cat.children.length > 0;
            const isExpanded = !!expandedCategories[cat.id];
            const catPath = `/category/${cat.slug}`;
            const isActive = pathname === catPath || pathname.startsWith(`${catPath}/`);

            return (
              <div key={cat.id} className="w-full">
                {/* Level 1 Category Item */}
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
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13px] sm:text-sm transition-colors cursor-pointer group ${
                    isActive
                      ? 'text-[#7533CB] font-bold bg-purple-50/60'
                      : 'text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50'
                  }`}
                >
                  <span className="truncate">{getCategoryName(cat.name)}</span>
                  {hasChildren && (
                    <button
                      onClick={(e) => toggleExpand(cat.id, e)}
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

                {/* Level 2 Subcategories (Nested) */}
                {hasChildren && isExpanded && (
                  <div className="pl-3 py-1 space-y-0.5 bg-zinc-50/40 border-l border-zinc-200/80 ml-3">
                    {cat.children!.map((sub) => {
                      const subHasChildren = sub.children && sub.children.length > 0;
                      const subExpanded = !!expandedCategories[sub.id];
                      const subPath = `/category/${cat.slug}/${sub.slug}`;
                      const isSubActive =
                        pathname === subPath || pathname.startsWith(`${subPath}/`);

                      return (
                        <div key={sub.id} className="w-full">
                          <div
                            onClick={() => {
                              if (subHasChildren) {
                                setExpandedCategories((prev) => ({
                                  ...prev,
                                  [sub.id]: !prev[sub.id],
                                }));
                              }
                              handleNavigate(subPath);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-1.5 text-xs sm:text-[13px] rounded transition-colors cursor-pointer group ${
                              isSubActive
                                ? 'text-[#7533CB] font-bold bg-purple-50'
                                : 'text-zinc-600 hover:text-[#7533CB] hover:bg-zinc-100/60'
                            }`}
                          >
                            <span className="truncate">{getCategoryName(sub.name)}</span>
                            {subHasChildren && (
                              <button
                                onClick={(e) => toggleExpand(sub.id, e)}
                                className="p-0.5 text-zinc-400 hover:text-[#7533CB] cursor-pointer"
                                aria-label="Toggle Nested Subcategories"
                              >
                                {subExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-[#7533CB]" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 group-hover:text-[#7533CB]" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Level 3 Subcategories */}
                          {subHasChildren && subExpanded && (
                            <div className="pl-3 py-0.5 space-y-0.5 bg-white border-l border-zinc-200/70 ml-2">
                              {sub.children!.map((nested) => {
                                const nestedPath = `/category/${cat.slug}/${sub.slug}/${nested.slug}`;
                                const isNestedActive = pathname === nestedPath;

                                return (
                                  <Link
                                    key={nested.id}
                                    href={nestedPath}
                                    className={`block px-3 py-1.5 text-xs rounded transition-colors ${
                                      isNestedActive
                                        ? 'text-[#7533CB] font-bold bg-purple-50'
                                        : 'text-zinc-500 hover:text-[#7533CB] hover:bg-zinc-50'
                                    }`}
                                  >
                                    <span className="truncate">{getCategoryName(nested.name)}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
