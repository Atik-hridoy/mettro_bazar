import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

interface MobileNavbarProps {
  onOpenAuth?: () => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 bg-[#00422f] text-white shadow-md border-b border-emerald-800">
      {/* Mobile Header Bar */}
      <div className="w-full px-4 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/logo.png"
            alt="মেট্রো বাজার"
            className="h-9 w-auto object-contain rounded"
          />
          <span className="text-lg font-black text-white">Mettro Bazar</span>
        </Link>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 text-white shrink-0">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 rounded-full hover:bg-white/10"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label="Cart"
            className="p-2 rounded-full bg-emerald-700/80 relative flex items-center justify-center"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Link to="/profile" className="p-2 rounded-full hover:bg-white/10" aria-label="User Profile">
              <UserIcon className="w-5 h-5 text-amber-300" />
            </Link>
          ) : (
            <Link to="/auth" className="p-2 rounded-full hover:bg-white/10" aria-label="Log in / Sign up">
              <UserIcon className="w-5 h-5 text-white" />
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-white/10"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {mobileSearchOpen && (
        <div className="px-4 pb-3">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search ready-to-cook items..."
              className="w-full bg-white text-slate-800 rounded-full pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>
      )}

      {/* Mobile Full Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="bg-[#003324] border-t border-emerald-700 px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-3 font-bold text-sm text-white">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="py-1.5 text-amber-300 border-l-4 border-amber-300 pl-2">
              Home
            </Link>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-amber-300 pl-2">
              All Products
            </a>
            <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-amber-300 pl-2">
              Categories
            </a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-amber-300 pl-2">
              Offers
            </a>
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="py-1.5 hover:text-amber-300 pl-2">
              Track Order
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
