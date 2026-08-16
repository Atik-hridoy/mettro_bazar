'use client';

import React, { useState, useEffect } from 'react';
import {
  Menu,
  MapPin,
  ChevronDown,
  Search,
  Crosshair,
  MapPinIcon,
  X,
  Mail,
} from 'lucide-react';
import { CITIES } from '@/lib/constants';
import logo from '@/assets/logo.png';
import { useCartStore } from '@/store/useCartStore';

interface HeaderProps {
  onToggleMobileSidebar?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileSidebar,
  searchQuery = '',
  onSearchChange,
}) => {
  const { setAuthModalOpen } = useCartStore();
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200">
        <div className="flex items-center justify-between h-14 px-4 md:px-6 gap-4">
          {/* Left: Hamburger, Site Logo & Location */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation menu"
              className="p-1 -ml-1 text-zinc-700 hover:bg-zinc-100 rounded transition-colors"
            >
              <Menu className="w-5 h-5 text-zinc-800" />
            </button>

            {/* Custom Brand Logo & METRO BAZAR Brand Title */}
            <a href="/" className="flex items-center gap-2 group select-none py-1">
              <img
                src={typeof logo === 'string' ? logo : logo.src || '/logo.png'}
                alt="METRO BAZAR Logo"
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#4A235A] font-serif italic whitespace-nowrap">
                METRO BAZAR
              </span>
            </a>

            {/* Location Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#632AAD] hover:bg-purple-50 px-2 py-1 rounded transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#632AAD]" />
              </button>

              {/* Location Dropdown Modal */}
              {isLocationOpen && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-lg shadow-lg border border-zinc-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => {
                      setSelectedCity('Dhaka');
                      setIsLocationOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 transition-colors"
                  >
                    <Crosshair className="w-4 h-4 text-[#7533CB]" />
                    <span>Use my current Location</span>
                  </button>

                  <div className="border-t border-zinc-100 my-1" />

                  <div className="px-3.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Select City
                  </div>

                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSelectedCity(city);
                        setIsLocationOpen(false);
                      }}
                      className={`w-full px-3.5 py-1.5 text-xs hover:bg-purple-50 flex items-center gap-2 transition-colors ${
                        selectedCity === city
                          ? 'text-[#7533CB] font-bold bg-purple-50/60'
                          : 'text-zinc-700'
                      }`}
                    >
                      <MapPinIcon className="w-3.5 h-3.5 text-amber-500" />
                      <span>{city}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar (Shows on Scroll or Active) */}
          <div
            className={`flex-1 max-w-xl transition-all duration-200 ${
              isScrolled || searchQuery
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none hidden md:block'
            }`}
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search for products (e.g. eggs, milk, potato)"
                className="w-full pl-3 pr-9 py-1.5 text-xs bg-zinc-50 hover:bg-white focus:bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded focus:outline-none focus:border-[#7533CB]"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right: Language switch & Login */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language switch */}
            <div className="flex items-center border border-zinc-300 rounded overflow-hidden text-xs">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 py-0.5 font-bold transition-colors ${
                  language === 'EN'
                    ? 'bg-[#7533CB] text-white'
                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('BN')}
                className={`px-2 py-0.5 font-bold transition-colors ${
                  language === 'BN'
                    ? 'bg-[#7533CB] text-white'
                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Login Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="px-4 py-1.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-semibold rounded shadow-xs transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
