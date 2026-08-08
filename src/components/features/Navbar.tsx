import { useState } from 'react';
import { ShoppingBag, User as UserIcon, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onOpenAuth?: () => void;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  searchQuery,
  onSearchChange,
}) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 w-full z-50 bg-[#00422f] text-white shadow-md border-b border-emerald-800/80">
      {/* Full Width Top Header Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
        {/* Brand Logo with Official Image */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/images/logo.png"
            alt="মেট্রো বাজার"
            className="h-10 sm:h-12 w-auto object-contain rounded-lg drop-shadow-sm group-hover:scale-105 transition-transform"
          />
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight hidden sm:inline-block">
            Mettro Bazar
          </span>
        </Link>

        {/* Desktop Search Input */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ready-to-cook items..."
            className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 text-white shrink-0">
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="p-2 rounded-full hover:bg-white/10 md:hidden transition-colors"
            aria-label="Toggle Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCart}
            aria-label="View Shopping Cart"
            className="p-2.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 relative transition-colors flex items-center justify-center shadow-xs"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-slate-900 text-xs font-black rounded-full flex items-center justify-center shadow-sm">
                {totalItems}
              </span>
            )}
          </button>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className="p-2.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 transition-colors flex items-center justify-center"
              aria-label="User Profile"
            >
              <UserIcon className="w-5 h-5 text-amber-300" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="p-2.5 rounded-full bg-emerald-700/80 hover:bg-emerald-600 transition-colors flex items-center justify-center"
              aria-label="Log in / Sign up"
            >
              <UserIcon className="w-5 h-5 text-white" />
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Field */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3">
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#003324] border-t border-emerald-700 px-4 py-4 space-y-3">
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

      {/* Full Width Secondary Desktop Nav Bar */}
      <nav className="hidden md:flex bg-[#003324] border-t border-emerald-700/60 w-full justify-center">
        <div className="w-full px-8 py-2 flex gap-8 text-xs font-bold uppercase tracking-wider">
          <Link to="/" className="text-amber-300 border-b-2 border-amber-300 pb-0.5">
            Home
          </Link>
          <a href="#products" className="text-emerald-100 hover:text-white transition-colors">
            All Products
          </a>
          <a href="#categories" className="text-emerald-100 hover:text-white transition-colors">
            Categories
          </a>
          <a href="#" className="text-emerald-100 hover:text-white transition-colors">
            Offers
          </a>
          <a href="#" className="text-emerald-100 hover:text-white transition-colors">
            Track Order
          </a>
        </div>
      </nav>
    </header>
  );
};
