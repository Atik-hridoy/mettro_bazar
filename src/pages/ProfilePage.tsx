import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUserProfileStore } from '../store/useUserProfileStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { useNavigate } from 'react-router-dom';
import { authService, type UserAddressItem } from '../services/authService';
import {
  Phone,
  ListOrdered,
  MapPin,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Camera,
  Check,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuthStore();

  const { orders } = useUserProfileStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'settings'>('orders');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<UserAddressItem[]>([]);
  const [showAddAddrForm, setShowAddAddrForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddrText, setNewAddrText] = useState('');

  // Edit Settings Form State
  const [editName, setEditName] = useState(user?.name || '');
  const [editAddress, setEditAddress] = useState(user?.address || '');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [updateSuccessMsg, setUpdateSuccessMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const liveProfile = await authService.getProfile();
        setUser({
          id: liveProfile.id,
          phone: liveProfile.phone,
          name: liveProfile.name,
          address: liveProfile.address,
        });
        setEditName(liveProfile.name || '');
        setEditAddress(liveProfile.address || '');
        if ((liveProfile as any).avatar_url) {
          setAvatarPreview((liveProfile as any).avatar_url);
        }

        const savedAddrs = await authService.getAddresses();
        setAddresses(savedAddrs);
      } catch (err) {
        console.warn('Backend profile offline, using local state:', err);
      }
    }

    if (user) {
      loadData();
    }
  }, []);

  const handleLogout = () => {
    authService.logout();
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload to backend
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      setLoading(true);
      const updated = await authService.updateProfile(formData);
      if ((updated as any).avatar_url) {
        setAvatarPreview((updated as any).avatar_url);
      }
      setUpdateSuccessMsg('Profile photo updated successfully!');
      setTimeout(() => setUpdateSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUpdateSuccessMsg('');

    try {
      const updated = await authService.updateProfile({
        name: editName,
        address: editAddress,
      });

      setUser({
        id: updated.id,
        phone: updated.phone,
        name: updated.name,
        address: updated.address,
      });

      setUpdateSuccessMsg('Profile settings updated successfully!');
      setTimeout(() => setUpdateSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newAddrText) return;

    try {
      const created = await authService.addAddress({
        label: newLabel,
        fullName: newFullName || user?.name || 'Shafiqur Rahman',
        phone: newPhone || user?.phone || '01711112222',
        address: newAddrText,
        city: 'Dhaka',
        isDefault: addresses.length === 0,
      });

      setAddresses((prev) => [created, ...prev]);
      setNewLabel('');
      setNewAddrText('');
      setShowAddAddrForm(false);
    } catch (err) {
      console.error('Failed to add address:', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await authService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-12 flex-grow">
        {/* Left Column: Profile Sidebar */}
        <div className="w-full md:w-72 shrink-0 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 text-center space-y-3 relative">
            <div className="relative w-24 h-24 mx-auto group">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Profile Avatar"
                  className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-[#00694c]"
                />
              ) : (
                <div className="w-24 h-24 bg-[#00694c] text-white rounded-full mx-auto flex items-center justify-center text-3xl font-black shadow-md border-2 border-emerald-700">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SR'}
                </div>
              )}
              {/* Photo Upload Overlay Button */}
              <label className="absolute bottom-0 right-0 bg-amber-400 hover:bg-amber-300 text-slate-900 p-2 rounded-full cursor-pointer shadow-lg transition-transform active:scale-95">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <h1 className="text-xl font-black text-slate-800">
                {user?.name || 'Shafiqur Rahman'}
              </h1>
              <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-[#00694c]" />
                {user?.phone || '01700000000'}
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
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-emerald-50 text-[#00694c]'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" /> Saved Addresses
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
              <Settings className="w-4 h-4" /> Edit Profile & Photo
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
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Order History</h2>
              </div>

              {orders.length === 0 ? (
                <EmptyState
                  title="No past orders"
                  description="You haven't placed any orders yet. Explore our delicious ready-to-cook menu!"
                  actionText="Browse Menu"
                  onAction={() => navigate('/')}
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs font-bold text-slate-400">Order ID</span>
                          <h4 className="text-base font-black text-slate-800">{order.id}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-500">{order.date}</span>
                          <span className="bg-emerald-100 text-[#00694c] text-xs font-extrabold px-3 py-1 rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm font-medium text-slate-700">
                            <span>
                              {item.quantity}x {item.productName} ({item.weight})
                            </span>
                            <span className="font-bold">৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-100 text-sm font-black text-slate-800">
                        <span>Total Amount</span>
                        <span className="text-lg text-[#00694c]">৳{order.totalPrice}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Saved Addresses</h2>
                <Button
                  onClick={() => setShowAddAddrForm(true)}
                  className="bg-[#00694c] hover:bg-[#004d37] text-xs font-extrabold px-4 py-2"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add New Address
                </Button>
              </div>

              {showAddAddrForm && (
                <form
                  onSubmit={handleCreateAddress}
                  className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 space-y-4"
                >
                  <h3 className="text-sm font-black text-[#00694c]">Add New Delivery Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Label (e.g. Home, Work) *"
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
                      label="Contact Phone"
                      placeholder="017XXXXXXXX"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                    />
                    <Input
                      label="Full Address (House, Road, Block) *"
                      placeholder="House 42, Road 11, Banani, Dhaka"
                      value={newAddrText}
                      onChange={(e) => setNewAddrText(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="bg-[#00694c] text-xs">
                      Save Address
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddAddrForm(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {addresses.length === 0 ? (
                <EmptyState
                  title="No saved addresses"
                  description="Add your delivery address for instant one-click checkout."
                  actionText="Add Address"
                  onAction={() => setShowAddAddrForm(true)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative"
                    >
                      <div className="flex justify-between items-center">
                        <span className="bg-emerald-100 text-[#00694c] text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                          {addr.label}
                        </span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{addr.fullName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{addr.phone}</p>
                        <p className="text-xs text-slate-700 font-medium mt-1 leading-relaxed">
                          {addr.address}, {addr.city}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS / PROFILE EDIT TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <h2 className="text-2xl font-black text-slate-800">Edit Profile Settings</h2>
                <p className="text-xs text-slate-500 font-medium">Update your profile info, avatar photo, and primary delivery address</p>
              </div>

              {updateSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-[#00694c] text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-2">
                  <Check className="w-4 h-4" /> {updateSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Profile Photo</label>
                    <div className="flex items-center gap-4">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-emerald-600" />
                      ) : (
                        <div className="w-16 h-16 bg-[#00694c] text-white rounded-full flex items-center justify-center font-bold text-xl">
                          {editName ? editName.slice(0, 2).toUpperCase() : 'SR'}
                        </div>
                      )}
                      <label className="bg-emerald-50 text-[#00694c] hover:bg-emerald-100 font-extrabold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors border border-emerald-200">
                        Choose New Photo
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <Input
                    label="Full Name *"
                    placeholder="Shafiqur Rahman"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />

                  <Input
                    label="Phone Number (Read-only)"
                    value={user?.phone || '01700000000'}
                    disabled
                  />

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Delivery Address</label>
                    <textarea
                      rows={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="House 42, Road 11, Banani, Dhaka"
                      className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    />
                  </div>
                </div>

                <Button type="submit" disabled={loading} className="bg-[#00694c] hover:bg-[#004d37] text-xs font-extrabold px-6 py-3">
                  {loading ? 'Saving Changes...' : 'Save Profile Changes'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-800">Log out of Metro Bazar?</h3>
            <p className="text-xs text-slate-500 font-medium">Are you sure you want to log out of your account session?</p>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleLogout} className="flex-1 bg-rose-600 hover:bg-rose-700 text-xs">
                Log out
              </Button>
              <Button onClick={() => setShowLogoutModal(false)} variant="outline" className="flex-1 text-xs">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
