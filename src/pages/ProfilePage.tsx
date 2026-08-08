import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/features/ProductCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  ListOrdered,
  Heart,
  MapPin,
  Settings,
  LogOut,
  CheckCircle,
  Leaf,
  Plus,
  Trash2,
  Package,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { products } = useProducts();

  const {
    wishlistIds,
    addresses,
    orders,
    userPreferences,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    updatePreferences,
  } = useUserProfileStore();

  const [activeTab, setActiveTab] = useState<'wishlist' | 'orders' | 'addresses' | 'settings'>('wishlist');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // New Address Form State
  const [showAddAddrForm, setShowAddAddrForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddrText, setNewAddrText] = useState('');

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddrText) return;
    addAddress({
      label: newLabel,
      fullName: newFullName || user?.name || 'Shafiqur Rahman',
      phone: newPhone || user?.phone || '+880 1712-345678',
      address: newAddrText,
      city: 'Dhaka',
      isDefault: addresses.length === 0,
    });
    setNewLabel('');
    setNewAddrText('');
    setShowAddAddrForm(false);
  };

  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 flex-grow">
        {/* Left Column: Profile Sidebar */}
        <div className="w-full md:w-72 shrink-0 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 text-center space-y-3">
            <div className="w-20 h-20 bg-[#00694c] text-white rounded-full mx-auto flex items-center justify-center text-2xl font-black shadow-md">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SR'}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {user?.name || 'Shafiqur Rahman'}
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-[#00694c]" />
                {user?.phone || '+880 1712-345678'}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'bg-emerald-50 text-[#00694c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ListOrdered className="w-4 h-4" /> Orders
              </div>
              <span className="text-xs font-black bg-emerald-100 text-[#00694c] px-2 py-0.5 rounded-full">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-emerald-50 text-[#00694c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 fill-[#00694c] text-[#00694c]" /> Wishlist
              </div>
              <span className="text-xs font-black bg-emerald-100 text-[#00694c] px-2 py-0.5 rounded-full">
                {wishlistedProducts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-emerald-50 text-[#00694c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" /> Addresses
              </div>
              <span className="text-xs font-black bg-emerald-100 text-[#00694c] px-2 py-0.5 rounded-full">
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'bg-emerald-50 text-[#00694c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Settings className="w-4 h-4" /> Settings
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </nav>
        </div>

        {/* Right Column: Dynamic Section Views */}
        <div className="flex-1 space-y-6">
          {/* Section 1: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Your Wishlist</h2>
                <span className="text-xs font-semibold text-slate-500">
                  {wishlistedProducts.length} Saved Items
                </span>
              </div>

              {wishlistedProducts.length === 0 ? (
                <EmptyState
                  title="Your wishlist is empty"
                  description="Explore ready-to-cook items and save your favorite meals."
                  actionText="Browse Menu"
                  onAction={() => navigate('/')}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Order History</h2>
                <span className="text-xs font-semibold text-slate-500">
                  {orders.length} Orders
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-[#00694c]" />
                        <div>
                          <span className="text-sm font-bold text-slate-800 block">
                            Order #{ord.id}
                          </span>
                          <span className="text-xs text-slate-400">{ord.date}</span>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                          ord.status === 'In Transit'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs sm:text-sm text-slate-700">
                          <span>
                            {item.productName} ({item.weight}) x{item.quantity}
                          </span>
                          <span className="font-bold">৳{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-500">Payment: {ord.paymentMethod}</span>
                      <span className="text-base font-black text-[#00694c]">
                        Total: ৳{ord.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Saved Addresses</h2>
                <Button size="sm" onClick={() => setShowAddAddrForm(!showAddAddrForm)}>
                  <Plus className="w-4 h-4 mr-1" /> Add Address
                </Button>
              </div>

              {showAddAddrForm && (
                <form
                  onSubmit={handleCreateAddress}
                  className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 space-y-4"
                >
                  <h4 className="text-sm font-bold text-slate-800">Add New Delivery Address</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Label (e.g. Home, Office) *"
                      placeholder="Home"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      required
                    />
                    <Input
                      label="Full Name"
                      placeholder="Shafiqur Rahman"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                    />
                    <Input
                      label="Phone Number"
                      placeholder="+880 1712-345678"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                  </div>
                  <Input
                    label="Street Address *"
                    placeholder="House 42, Road 11, Banani"
                    value={newAddrText}
                    onChange={(e) => setNewAddrText(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm">
                      Save Address
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddAddrForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white p-5 rounded-2xl border transition-all space-y-3 relative ${
                      addr.isDefault
                        ? 'border-[#00694c] shadow-md ring-2 ring-[#00694c]/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-black text-[#00694c] bg-emerald-100 px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{addr.fullName}</p>
                      <p className="text-xs text-slate-500">{addr.phone}</p>
                      <p className="text-xs text-slate-600 mt-1">{addr.address}, {addr.city}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[#00694c] font-bold hover:underline"
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-slate-400 hover:text-rose-500 ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Account Preferences</h2>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">SMS Notifications</h4>
                    <p className="text-xs text-slate-500">Receive order delivery updates via SMS</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userPreferences.smsNotifications}
                    onChange={(e) => updatePreferences({ smsNotifications: e.target.checked })}
                    className="w-5 h-5 accent-[#00694c] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Promotional Emails</h4>
                    <p className="text-xs text-slate-500">Get discount offers and new menu updates</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={userPreferences.emailOffers}
                    onChange={(e) => updatePreferences({ emailOffers: e.target.checked })}
                    className="w-5 h-5 accent-[#00694c] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Preferred Language</h4>
                    <p className="text-xs text-slate-500">Select app interface language</p>
                  </div>
                  <select
                    value={userPreferences.language}
                    onChange={(e) => updatePreferences({ language: e.target.value as 'EN' | 'BN' })}
                    className="border border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 bg-white text-slate-800"
                  >
                    <option value="EN">English</option>
                    <option value="BN">বাংলা</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Shared Footer */}
      <footer className="bg-[#003b29] text-white rounded-3xl p-8 sm:p-12 space-y-8 mt-12 shadow-2xl border border-emerald-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="মেট্রো বাজার" className="h-10 w-auto rounded-lg" />
              <span className="text-2xl font-black text-white">Metro Bazar</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed opacity-90">
              Delivering premium, hygienic, ready-to-cook food right to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-amber-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>100% Halal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4" />
                <span>Fresh Guarantee</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">About Us</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100 opacity-90">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="font-bold underline text-white">Fresh Guarantee</a></li>
              <li><a href="#" className="hover:text-white">Hygienic Packaging</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Support</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-100 opacity-90">
              <li><a href="#" className="hover:text-white">Track Order</a></li>
              <li><a href="#" className="hover:text-white">Delivery Information</a></li>
              <li><a href="#" className="hover:text-white">Returns & Refunds</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Payments</h4>
            <div className="space-y-1.5 text-xs sm:text-sm text-emerald-100 opacity-90">
              <p>💳 bKash / Nagad / Rocket</p>
              <p>🚚 Cash on Delivery</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-emerald-800 text-center text-xs text-emerald-200/60">
          © 2026 Metro Bazar. All Rights Reserved.
        </div>
      </footer>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Log out of Metro Bazar?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You will need to log back in to access your saved wishlist and active orders.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 px-4 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 px-4 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
