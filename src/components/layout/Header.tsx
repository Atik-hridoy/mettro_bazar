'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  MapPin,
  ChevronDown,
  Search,
  Crosshair,
  MapPinIcon,
  Bell,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { CITIES } from '@/lib/constants';
import logo from '@/assets/logo.png';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS } from '@/lib/translations';

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
  const { setAuthModalOpen, user, logoutUser, language, setLanguage } = useCartStore();
  const [selectedCity, setSelectedCity] = useState('Dhaka');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread'>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  const t = TRANSLATIONS[language];

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
                className="flex items-center gap-1 text-xs font-semibold text-[#632AAD] hover:bg-purple-50 px-2 py-1 rounded transition-colors"
              >
                {user?.isLoggedIn && (
                  <span className="text-zinc-500 font-normal mr-0.5 hidden sm:inline">{t.deliveringTo}</span>
                )}
                <MapPin className="w-3.5 h-3.5 text-[#632AAD]" />
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

          {/* Center: Search Bar */}
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
                placeholder={t.searchPlaceholder}
                className="w-full pl-3 pr-9 py-1.5 text-xs bg-zinc-50 hover:bg-white focus:bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded focus:outline-none focus:border-[#7533CB]"
              />
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400">
                <Search className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Right: Language switch & Login / User Profile */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Real Working Language switch */}
            <div className="flex items-center border border-zinc-300 rounded overflow-hidden text-xs">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 py-0.5 font-bold transition-colors cursor-pointer ${
                  language === 'EN'
                    ? 'bg-[#7533CB] text-white'
                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('BN')}
                className={`px-2 py-0.5 font-bold transition-colors cursor-pointer ${
                  language === 'BN'
                    ? 'bg-[#7533CB] text-white'
                    : 'bg-white text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                বাং
              </button>
            </div>

            {/* If Logged In: Bell & User Profile Button matching Screenshot */}
            {user?.isLoggedIn ? (
              <div className="flex items-center gap-2.5">
                {/* Notification Bell Dropdown matching Chaldal 1:1 */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsNotificationOpen(true)}
                  onMouseLeave={() => setIsNotificationOpen(false)}
                >
                  <button
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className={`p-1.5 rounded-full transition-colors relative cursor-pointer ${
                      isNotificationOpen ? 'bg-purple-100 text-[#7533CB]' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  {/* Notification Popover Box */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 top-full pt-1.5 w-80 sm:w-96 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="bg-white rounded-lg shadow-2xl border border-zinc-200 p-5">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3">
                          <h3 className="text-lg font-normal text-zinc-800">{t.notification}</h3>
                          <button className="text-xs font-semibold text-[#7533CB] hover:underline cursor-pointer">
                            {t.markRead}
                          </button>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center gap-2 pt-1 pb-3">
                          <button
                            onClick={() => setNotificationTab('all')}
                            className={`px-3.5 py-1 text-xs rounded transition-colors font-medium cursor-pointer ${
                              notificationTab === 'all'
                                ? 'border border-[#7533CB] text-[#7533CB] bg-purple-50/50 font-semibold'
                                : 'border border-zinc-300 text-zinc-600 bg-white hover:bg-zinc-50'
                            }`}
                          >
                            {t.all}
                          </button>
                          <button
                            onClick={() => setNotificationTab('unread')}
                            className={`px-3.5 py-1 text-xs rounded transition-colors font-medium cursor-pointer ${
                              notificationTab === 'unread'
                                ? 'border border-[#7533CB] text-[#7533CB] bg-purple-50/50 font-semibold'
                                : 'border border-zinc-300 text-zinc-600 bg-white hover:bg-zinc-50'
                            }`}
                          >
                            {t.unread}
                          </button>
                        </div>

                        {/* Divider Line */}
                        <div className="border-b border-zinc-300 my-2" />

                        {/* Content Area */}
                        <div className="py-16 text-center text-sm text-zinc-500 font-light select-none">
                          {t.noNotifications}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Pill */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-full transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#7533CB] text-white flex items-center justify-center text-xs font-bold">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-800">
                      {user.phone}
                    </span>
                  </button>

                  {/* User Dropdown matching Chaldal 1:1 */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-md shadow-xl border border-zinc-200 py-0 z-50 animate-in fade-in zoom-in-95 duration-150 overflow-hidden">
                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-4 py-2.5 text-xs sm:text-[13px] text-zinc-700 hover:bg-purple-50/60 hover:text-[#7533CB] border-b border-zinc-100 transition-colors text-left font-normal cursor-pointer block"
                      >
                        {t.yourProfile}
                      </Link>

                      <Link
                        href="/profile"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-4 py-2.5 text-xs sm:text-[13px] text-zinc-700 hover:bg-purple-50/60 hover:text-[#7533CB] border-b border-zinc-100 transition-colors text-left font-normal cursor-pointer block"
                      >
                        {t.yourOrders}
                      </Link>

                      <Link
                        href="/payments"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-4 py-2.5 text-xs sm:text-[13px] text-zinc-700 hover:bg-purple-50/60 hover:text-[#7533CB] border-b border-zinc-100 transition-colors text-left font-normal cursor-pointer block"
                      >
                        {t.paymentHistory}
                      </Link>

                      <Link
                        href="/payments"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-4 py-2.5 text-xs sm:text-[13px] text-zinc-700 hover:bg-purple-50/60 hover:text-[#7533CB] border-b border-zinc-100 transition-colors text-left font-normal cursor-pointer block"
                      >
                        {t.paymentMethods}
                      </Link>

                      <button
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-4 py-2.5 text-xs sm:text-[13px] text-zinc-700 hover:bg-purple-50/60 hover:text-[#7533CB] border-b border-zinc-100 transition-colors text-left font-normal cursor-pointer"
                      >
                        {t.changePassword}
                      </button>

                      <button
                        onClick={() => {
                          logoutUser();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-xs sm:text-[13px] text-zinc-700 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left font-normal cursor-pointer"
                      >
                        {t.logout}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Login Button */
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-1.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
              >
                {t.login}
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
