'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  MapPin,
  ChevronDown,
  Search,
  Crosshair,
  MapPinIcon,
  Bell,
  User as UserIcon,
  X,
  Plus,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { CITIES, Product, CHALDAL_PRODUCTS } from '@/lib/constants';
import logo from '@/assets/logo.png';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS } from '@/lib/translations';
import { fetchProductsFromBackend } from '@/lib/api';

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
  const router = useRouter();
  const {
    setAuthModalOpen,
    user,
    logoutUser,
    language,
    setLanguage,
    guestId,
    addItem,
    setSelectedDetailProduct,
  } = useCartStore();

  const [selectedCity, setSelectedCity] = useState('Rangpur');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState<'all' | 'unread'>('all');
  const [isScrolled, setIsScrolled] = useState(false);

  // Search API States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];

  // Load Backend Products for Live API Search
  useEffect(() => {
    let isMounted = true;
    const loadProducts = async () => {
      try {
        setIsLoadingSearch(true);
        const backendProducts = await fetchProductsFromBackend();
        if (isMounted) {
          if (backendProducts && backendProducts.length > 0) {
            setApiProducts(backendProducts);
          } else {
            setApiProducts(CHALDAL_PRODUCTS);
          }
        }
      } catch (err) {
        if (isMounted) setApiProducts(CHALDAL_PRODUCTS);
      } finally {
        if (isMounted) setIsLoadingSearch(false);
      }
    };
    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle click outside to close live search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  // Filter Matching Products
  const q = searchQuery.trim().toLowerCase();
  const allProductsList = apiProducts.length > 0 ? apiProducts : CHALDAL_PRODUCTS;

  const matchedProducts = q
    ? allProductsList.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.banglaName?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.unit?.toLowerCase().includes(q)
      )
    : [];

  return (
    <>
      <header
        style={{ background: 'linear-gradient(90deg, #F5EFFC 0%, #E9DCF8 50%, #F5EFFC 100%)' }}
        className="fixed top-0 left-0 right-0 z-40 w-full h-14 border-b border-[#DBC7F4] shadow-xs backdrop-blur-md"
      >
        <div className="flex items-center justify-between h-14 px-3.5 sm:px-4 md:px-6 gap-3 sm:gap-4">
          {/* Left: Hamburger, Site Logo & Location */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Hamburger Button */}
            <button
              onClick={onToggleMobileSidebar}
              aria-label="Toggle navigation menu"
              className="p-1.5 -ml-1 text-zinc-800 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-zinc-900" />
            </button>

            {/* Custom Brand Logo & METRO BAZAR Title */}
            <a href="/" className="hidden sm:flex items-center gap-2 group select-none py-1">
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
                className="flex items-center gap-1 text-xs sm:text-xs font-semibold text-[#632AAD] hover:bg-purple-50 px-2 py-1 rounded transition-colors cursor-pointer"
              >
                {user?.isLoggedIn && (
                  <span className="text-zinc-500 font-normal mr-0.5 hidden sm:inline">{t.deliveringTo}</span>
                )}
                <MapPin className="w-3.5 h-3.5 text-[#632AAD]" />
                <span className="font-bold text-xs text-[#632AAD]">{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-[#632AAD] hidden sm:inline" />
              </button>

              {/* Location Dropdown Modal */}
              {isLocationOpen && (
                <div className="absolute left-0 mt-1.5 w-60 bg-white rounded-lg shadow-lg border border-zinc-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button
                    onClick={() => {
                      setSelectedCity('Rangpur');
                      setIsLocationOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 flex items-center gap-2.5 transition-colors cursor-pointer"
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
                      className={`w-full px-3.5 py-1.5 text-xs hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer ${
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

          {/* Center: Live API Search Bar & Overlay */}
          <div className="flex-1 max-w-xl min-w-0" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-3 pr-8 py-1.5 text-xs bg-zinc-50 hover:bg-white focus:bg-white text-zinc-900 placeholder:text-zinc-400 border border-zinc-300 rounded focus:outline-none focus:border-[#7533CB] transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    if (onSearchChange) onSearchChange('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5 rounded-full hover:bg-zinc-200 transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-zinc-400">
                  <Search className="w-4 h-4" />
                </div>
              )}

              {/* Live Search Results Dropdown Overlay */}
              {isSearchOpen && q.length > 0 && (
                <div className="absolute left-0 top-10 w-full min-w-[300px] sm:min-w-[440px] bg-white rounded-xl shadow-2xl border border-purple-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[75vh] flex flex-col overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-zinc-100 flex items-center justify-between bg-purple-50/50">
                    <span className="text-xs font-bold text-[#4A235A] flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-[#7533CB]" /> Live Search Results ({matchedProducts.length})
                    </span>
                    <button
                      onClick={() => setIsSearchOpen(false)}
                      className="text-[11px] text-zinc-400 hover:text-zinc-600 font-semibold cursor-pointer"
                    >
                      Close [ESC]
                    </button>
                  </div>

                  <div className="overflow-y-auto divide-y divide-zinc-100 p-1.5 max-h-80">
                    {matchedProducts.length === 0 ? (
                      <div className="py-8 text-center text-xs text-zinc-400 font-medium">
                        No items matched &quot;{searchQuery}&quot;. Try searching for &quot;Rice&quot;, &quot;Mango&quot; or &quot;Oil&quot;.
                      </div>
                    ) : (
                      matchedProducts.slice(0, 8).map((prod) => (
                        <div
                          key={prod.id}
                          className="p-2 hover:bg-purple-50/50 rounded-lg transition flex items-center justify-between gap-3 group"
                        >
                          <div
                            onClick={() => {
                              setSelectedDetailProduct(prod);
                              setIsSearchOpen(false);
                            }}
                            className="flex items-center space-x-3 min-w-0 flex-1 cursor-pointer"
                          >
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 object-cover rounded-md border border-zinc-200 shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-zinc-900 group-hover:text-[#7533CB] truncate transition-colors">
                                {prod.name} {prod.banglaName ? `(${prod.banglaName})` : ''}
                              </div>
                              <div className="text-[11px] text-zinc-500 truncate">
                                {prod.unit} • <span className="text-[#7533CB] font-extrabold">৳{prod.price}</span>
                                {prod.originalPrice && (
                                  <span className="line-through text-zinc-400 ml-1">৳{prod.originalPrice}</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              addItem({
                                id: prod.id,
                                name: prod.name,
                                price: prod.price,
                                originalPrice: prod.originalPrice,
                                image: prod.image,
                                unit: prod.unit,
                                category: prod.category,
                              });
                            }}
                            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-zinc-900 text-xs font-black rounded-md transition cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {matchedProducts.length > 8 && (
                    <div className="p-2 border-t border-zinc-100 bg-zinc-50 text-center">
                      <span className="text-[11px] text-zinc-500 font-semibold">
                        + {matchedProducts.length - 8} more items available
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Language switch & Login / User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Language switch */}
            <div className="hidden sm:flex items-center border border-zinc-300 rounded overflow-hidden text-xs">
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

            {/* User Login / Profile menu */}
            {user?.isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Notification Bell Dropdown */}
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
                        <div className="flex items-center justify-between pb-3">
                          <h3 className="text-lg font-normal text-zinc-800">{t.notification}</h3>
                          <button className="text-xs font-semibold text-[#7533CB] hover:underline cursor-pointer">
                            {t.markRead}
                          </button>
                        </div>

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

                        <div className="border-b border-zinc-300 my-2" />

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
                    className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-2 sm:pr-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded-full transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#7533CB] text-white flex items-center justify-center text-xs font-bold">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-800 hidden sm:inline">
                      {`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.name || user.phone || user.email || 'Profile'}
                    </span>
                  </button>

                  {/* User Dropdown */}
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
                        href="/orders"
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
                          router.push('/');
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
              <div className="flex items-center gap-2">
                <span
                  className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-purple-100/80 text-[#7533CB] border border-purple-200"
                  title={`Guest ID: ${guestId}`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                  Guest #{guestId ? guestId.slice(-6) : 'ID'}
                </span>
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 sm:px-5 py-1.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold rounded shadow-xs transition-colors cursor-pointer"
                >
                  {t.login}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

