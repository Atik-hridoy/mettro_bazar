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

  return (
    <>
      {/* Mobile Backdrop Overlay (only on small screens when open) */}
      <div
        className={`fixed inset-0 top-14 bg-black/40 backdrop-blur-2xs z-30 md:hidden transition-opacity duration-300 ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Left Sidebar Navigation (Open by default, can be toggled by user) */}
      <aside
        className={`fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-zinc-200 z-30 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Close / Brand Bar (Visible on mobile) */}
        <div className="p-3 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/80 md:hidden">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="METRO BAZAR"
              className="h-7 w-auto object-contain"
            />
            <span className="font-bold text-xs text-[#4A235A] font-serif italic">
              METRO BAZAR
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-800 rounded hover:bg-zinc-200/60 transition-colors"
            title="Close Menu"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Egg Club Banner (Authentic Tan/Gold) */}
        <div className="p-3 bg-[#E5C384] text-zinc-900 border-b border-[#D4AE6E] shrink-0">
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
        <div className="py-2 border-b border-zinc-200 divide-y divide-zinc-100 shrink-0">
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

        {/* 3. Hierarchical Category Tree */}
        <nav className="flex-1 overflow-y-auto py-1 custom-scrollbar">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer group ${
                    isActive
                      ? 'text-[#7533CB] font-bold bg-purple-50/50'
                      : 'text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {hasChildren && (
                    <button
                      onClick={(e) => toggleExpand(cat.id, e)}
                      className="p-0.5 text-zinc-400 hover:text-[#7533CB]"
                      aria-label="Toggle Subcategories"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3 text-[#7533CB]" />
                      ) : (
                        <ChevronRight className="w-3 h-3 group-hover:text-[#7533CB]" />
                      )}
                    </button>
                  )}
                </div>

                {/* Level 2 Subcategories (Nested) */}
                {hasChildren && isExpanded && (
                  <div className="pl-3 py-0.5 space-y-0.5 bg-zinc-50/30 border-l border-zinc-100 ml-2">
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
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] transition-colors cursor-pointer group ${
                              isSubActive
                                ? 'text-[#7533CB] font-bold bg-purple-50'
                                : 'text-zinc-600 hover:text-[#7533CB] hover:bg-zinc-50'
                            }`}
                          >
                            <span className="truncate">{sub.name}</span>
                            {subHasChildren && (
                              <button
                                onClick={(e) => toggleExpand(sub.id, e)}
                                className="p-0.5 text-zinc-400 hover:text-[#7533CB]"
                              >
                                {subExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-[#7533CB]" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 group-hover:text-[#7533CB]" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Level 3 Children (Nested) */}
                          {subHasChildren && subExpanded && (
                            <div className="pl-3 py-0.5 space-y-0.5">
                              {sub.children!.map((child) => {
                                const childPath = `/category/${cat.slug}/${sub.slug}/${child.slug}`;
                                const isChildActive = pathname === childPath;

                                return (
                                  <div
                                    key={child.id}
                                    onClick={() => handleNavigate(childPath)}
                                    className={`w-full px-2 py-1 text-[11px] cursor-pointer transition-colors ${
                                      isChildActive
                                        ? 'text-[#7533CB] font-semibold bg-purple-50/70'
                                        : 'text-zinc-500 hover:text-[#7533CB] hover:bg-zinc-50'
                                    }`}
                                  >
                                    <span className="truncate">{child.name}</span>
                                  </div>
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

          {/* Special Feature Links */}
          <div className="pt-2 mt-2 border-t border-zinc-100 space-y-0.5">
            <a
              href="#safety-center"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-800 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-[#8E44AD] text-white flex items-center justify-center shadow-2xs shrink-0">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <span className="font-medium">Safety Center</span>
            </a>

            <a
              href="#premium-care"
              className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-800 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 fill-amber-500" viewBox="0 0 24 24">
                  <path d="M12 2l2.4 5.5L20 8.2l-4 4.1 1 6-5-2.8-5 2.8 1-6-4-4.1 5.6-.7L12 2z" />
                </svg>
              </div>
              <span className="font-medium">Premium Care</span>
            </a>

            <a
              href="#help"
              className="w-full flex items-center px-3.5 py-2 text-xs text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors font-normal"
            >
              Help
            </a>

            <a
              href="#complaint"
              className="w-full flex items-center px-3.5 py-2 text-xs text-zinc-700 hover:text-[#7533CB] hover:bg-zinc-50 transition-colors font-normal"
            >
              File a complaint
            </a>
          </div>
        </nav>
      </aside>
    </>
  );
};
