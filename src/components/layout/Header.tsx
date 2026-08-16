'use client';

import React, { useState } from 'react';
import {
  Menu,
  MapPin,
  Globe,
  ChevronDown,
  ShoppingBag,
} from 'lucide-react';
import { LOCATIONS } from '@/lib/constants';
import { useCartStore } from '@/store/useCartStore';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[2]); // Default Banani
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');

  const { totalItems, toggleDrawer } = useCartStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200">
      <div className="flex items-center justify-between h-14 px-4 md:px-6">
        {/* Left Side: Hamburger, Brand Logo & Location */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="p-1.5 -ml-1.5 text-zinc-700 hover:bg-zinc-100 rounded-sm transition-colors"
          >
            <Menu className="w-5 h-5 text-zinc-800" />
          </button>

          {/* Chaldal Brand Logo / Link */}
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-[#6A1B9A]">
              chaldal
            </span>
          </a>

          {/* Location Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-zinc-50 hover:bg-zinc-100 text-xs font-medium text-zinc-700 border border-zinc-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FF5252]" />
              <span className="max-w-[140px] truncate">{selectedLocation}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {isLocationOpen && (
              <div className="absolute left-0 mt-1 w-60 bg-white rounded-sm shadow-md border border-zinc-200 py-1 z-50">
                <div className="px-3 py-1 text-[11px] font-medium text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                  Select Delivery Location
                </div>
                <div className="max-h-56 overflow-y-auto custom-scrollbar">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-zinc-50 transition-colors flex items-center justify-between ${
                        selectedLocation === loc
                          ? 'bg-zinc-100 font-semibold text-[#6A1B9A]'
                          : 'text-zinc-700'
                      }`}
                    >
                      <span>{loc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Language toggle, Mobile Cart & Login */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
            className="flex items-center gap-1 px-2 py-1 text-xs text-zinc-700 hover:text-zinc-900 border border-zinc-200 rounded-sm hover:bg-zinc-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-500" />
            <span>{language === 'EN' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Mobile Cart Trigger */}
          <button
            onClick={toggleDrawer}
            className="md:hidden relative p-1.5 rounded-sm border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            aria-label="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#6A1B9A]" />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#FF5252] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {/* Slim Login Button (Chaldal Style Coral or Purple) */}
          <button
            className="px-4 py-1.5 bg-[#FF5252] hover:bg-[#E04040] text-white text-xs font-semibold rounded-sm transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};
