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
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [language, setLanguage] = useState<'EN' | 'BN'>('EN');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
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
              onClick={() => setIsLoginModalOpen(true)}
              className="px-4 py-1.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-semibold rounded shadow-xs transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsLoginModalOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white rounded-lg shadow-xl p-6 z-10 animate-in zoom-in-95 duration-150">
            {/* Modal Title & Close */}
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-base font-semibold text-zinc-800">Login</h3>
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2">
              {/* Facebook Button */}
              <button className="w-full py-2 px-3 bg-[#4267B2] hover:bg-[#365899] text-white text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors">
                <span className="font-black text-sm">f</span>
                <span>Sign Up or Login with <strong>Facebook</strong></span>
              </button>

              {/* Email Button */}
              <button className="w-full py-2 px-3 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded border border-zinc-300 flex items-center justify-center gap-2 transition-colors">
                <Mail className="w-4 h-4 text-amber-500" />
                <span>Login with <strong>Email</strong></span>
              </button>

              {/* Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-200" />
                </div>
                <span className="relative bg-white px-2 text-[10px] uppercase text-zinc-400 font-semibold tracking-wider">
                  or
                </span>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  Please enter your mobile phone number
                </label>
                <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1.5">
                  <div className="flex items-center gap-1 pr-2 text-xs font-medium text-zinc-700">
                    <span className="w-4 h-3 bg-emerald-700 inline-block relative rounded-xs overflow-hidden">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute inset-0 m-auto" />
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400" />
                    <span className="text-zinc-800 font-bold ml-1">+88</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-2 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setIsLoginModalOpen(false)}
                className="w-full py-2.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors mt-2"
              >
                Sign Up / Login
              </button>

              <p className="text-[10px] text-zinc-400 text-center pt-2 leading-relaxed">
                This site is protected by reCAPTCHA and the Google{' '}
                <a href="#" className="underline">Privacy Policy</a> and{' '}
                <a href="#" className="underline">Terms of Service</a> apply.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
