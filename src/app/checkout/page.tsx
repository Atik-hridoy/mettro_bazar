'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Clock, Plus, Check, X, Edit2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCartStore, Address } from '@/store/useCartStore';
import { ProductCard } from '@/components/common/ProductCard';
import { Product } from '@/lib/constants';

// Upsell recommendation items matching screenshot
const UPSELL_PRODUCTS: Product[] = [
  {
    id: 'upsell-1',
    name: 'Casio Calculator 12 Digit (MJ-120 D)',
    price: 780,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&q=80',
    deliveryTime: '4 hrs',
    categorySlug: 'stationery-office',
    inStock: true,
  },
  {
    id: 'upsell-2',
    name: 'Casio Scientific Calculator (FX 991ES Plus)',
    price: 1339,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=400&q=80',
    deliveryTime: '4 hrs',
    categorySlug: 'stationery-office',
    inStock: true,
  },
  {
    id: 'upsell-3',
    name: 'Biomil 2 Milk (6-12 months) Tin',
    price: 1950,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    deliveryTime: '4 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'upsell-4',
    name: 'Maya All Natural Spanish Rosehip Seed Oil',
    price: 850,
    unit: '30 ml',
    image: 'https://images.unsplash.com/photo-1608248597359-00984a9191d9?w=400&q=80',
    deliveryTime: '4 hrs',
    categorySlug: 'beauty-makeup',
    inStock: true,
  },
];

const DELIVERY_SLOTS = [
  { id: 'slot-1', time: 'Today 11:00 AM - 12:00 PM', available: true },
  { id: 'slot-2', time: 'Today 02:00 PM - 03:00 PM', available: true },
  { id: 'slot-3', time: 'Today 04:00 PM - 05:00 PM', available: true },
  { id: 'slot-4', time: 'Tomorrow 10:00 AM - 11:00 AM', available: true },
];

export default function CheckoutPage() {
  const {
    cartItems,
    totalPrice,
    selectedAddress,
    savedAddresses,
    setSelectedAddress,
    addAddress,
    clearCart,
  } = useCartStore();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('slot-2');
  const [newLabel, setNewLabel] = useState('Home');
  const [newStreet, setNewStreet] = useState('');
  const [newPhone, setNewPhone] = useState('01333410106');
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const SHIPPING_FEE = totalPrice >= 1000 || totalPrice === 0 ? 0 : 49;
  const finalTotal = totalPrice + SHIPPING_FEE;

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet.trim()) return;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: newLabel,
      details: newStreet,
      city: 'Dhaka',
      phone: newPhone,
    };

    addAddress(newAddr);
    setIsAddressModalOpen(false);
    setNewStreet('');
  };

  const handleProceed = () => {
    if (!selectedAddress && savedAddresses.length === 0) {
      setIsAddressModalOpen(true);
      return;
    }
    setIsOrderComplete(true);
    setTimeout(() => {
      clearCart();
    }, 4000);
  };

  if (isOrderComplete) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Order Confirmed!</h2>
        <p className="text-sm text-zinc-600 max-w-md mb-6">
          Thank you for shopping with <strong>METRO BAZAR</strong>. Your groceries are being carefully packed and will be delivered to your address on schedule.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* 1. Section: Select a Delivery Address */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-2xs overflow-hidden mb-6">
        <div className="bg-zinc-50/80 px-4 py-3 border-b border-zinc-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#7533CB]" />
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
            Select a Delivery Address
          </h2>
        </div>

        <div className="p-4 sm:p-5">
          {savedAddresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddress?.id === addr.id || (!selectedAddress && addr.id === savedAddresses[0].id);

                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#7533CB] bg-purple-50/20 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-zinc-900">{addr.label}</span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#7533CB] bg-purple-100/60 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {addr.details}
                      </p>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-2 font-medium">
                      Phone: {addr.phone}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Add New Address Button */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full py-3 border border-zinc-300 hover:border-[#7533CB] hover:bg-purple-50/20 rounded-md text-zinc-700 hover:text-[#7533CB] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Address</span>
          </button>
        </div>
      </div>

      {/* 2. Section: Preferred Delivery Time */}
      <div className="bg-white border border-zinc-200 rounded-lg shadow-2xs overflow-hidden mb-8">
        <div className="bg-zinc-50/80 px-4 py-3 border-b border-zinc-200 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#7533CB]" />
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
            Preferred Delivery Time
          </h2>
        </div>

        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
            {DELIVERY_SLOTS.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`px-3 py-2.5 rounded-md border text-xs font-medium transition-all text-left flex items-center justify-between ${
                  selectedSlot === slot.id
                    ? 'border-[#7533CB] bg-purple-50/40 text-[#7533CB] font-bold shadow-2xs'
                    : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-white'
                }`}
              >
                <span>{slot.time}</span>
                {selectedSlot === slot.id && <Check className="w-3.5 h-3.5 text-[#7533CB]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Section: Need Anything Else? (Upsell Row matching Chaldal 1:1) */}
      <div className="mb-10">
        <h3 className="text-base font-bold text-zinc-900 mb-4">
          Need Anything Else?
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {UPSELL_PRODUCTS.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName="Essentials"
            />
          ))}
        </div>
      </div>

      {/* 4. Bottom Sticky Action Bar matching Chaldal 1:1 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-zinc-200 py-3.5 px-4 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-zinc-500">Payment options available on the next page</span>
            <span className="text-[11px] text-zinc-400">
              By clicking/tapping proceed, I agree to METRO BAZAR's{' '}
              <a href="#" className="text-[#7533CB] underline font-medium">Terms of Services</a>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-700 font-medium hidden md:inline">
              ৳0 Delivery charge included
            </span>
            <button
              onClick={handleProceed}
              className="h-11 px-8 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded-lg flex items-center justify-between gap-4 transition-colors shadow-sm select-none"
            >
              <span>Proceed</span>
              <span className="bg-[#632AAD] px-2.5 py-0.5 rounded text-xs font-extrabold">
                ৳ {finalTotal}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs"
            onClick={() => setIsAddressModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl p-6 z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <h3 className="text-sm font-bold text-zinc-900">Add New Delivery Address</h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Address Label</label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map((lbl) => (
                    <button
                      key={lbl}
                      type="button"
                      onClick={() => setNewLabel(lbl)}
                      className={`px-3 py-1.5 rounded border ${
                        newLabel === lbl
                          ? 'border-[#7533CB] bg-purple-50 text-[#7533CB] font-bold'
                          : 'border-zinc-300 text-zinc-600'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">
                  Full Street Address / House & Road *
                </label>
                <textarea
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  placeholder="e.g. Flat 4B, House 12, Road 7, Dhanmondi, Dhaka"
                  required
                  rows={3}
                  className="w-full p-2.5 border border-zinc-300 rounded focus:outline-none focus:border-[#7533CB]"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Contact Phone *</label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  required
                  className="w-full p-2.5 border border-zinc-300 rounded focus:outline-none focus:border-[#7533CB]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border border-zinc-300 text-zinc-600 rounded font-medium hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#7533CB] hover:bg-[#632AAD] text-white rounded font-bold transition-colors"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
