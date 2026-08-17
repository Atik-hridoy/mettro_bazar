'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Plus,
  Check,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { useCartStore, Address } from '@/store/useCartStore';
import { ProductCard } from '@/components/common/ProductCard';
import { AddressModal } from '@/components/common/AddressModal';
import { Product } from '@/lib/constants';

// 4 Upsell Items under "Need Anything Else?" matching Screenshot
const UPSELL_PRODUCTS: Product[] = [
  {
    id: 'casio-1',
    name: 'Casio Scientific Calculator (FX 991ES Plus 2nd Edition)',
    price: 1339,
    unit: 'each',
    image: 'https://images.unsplash.com/photo-1611125832047-1d7ad1e8e48f?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'stationery-office',
    inStock: true,
  },
  {
    id: 'biomil-1',
    name: 'Biomil 2 Milk (6-12 months) Tin',
    price: 1950,
    unit: '1 kg',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'baby-care',
    inStock: true,
  },
  {
    id: 'maya-1',
    name: 'Maya All Natural Spanish Rosehip Seed Oil',
    price: 850,
    unit: '30 ml',
    image: 'https://images.unsplash.com/photo-1608248597359-00984a9191d9?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'beauty-makeup',
    inStock: true,
  },
  {
    id: 'dilmah-1',
    name: 'Dilmah Green Tea with Camomile Flowers',
    price: 630,
    unit: '20 pcs',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80',
    deliveryTime: '3 hrs',
    categorySlug: 'food',
    inStock: true,
  },
];

const DELIVERY_SLOTS = [
  { id: 'slot-1', time: 'Today 8 AM - 9 AM', status: 'Available' },
  { id: 'slot-2', time: 'Today 10 AM - 11 AM', status: 'Recommended', isRecommended: true },
  { id: 'slot-3', time: 'Today 1 PM - 2 PM', status: 'Available' },
  { id: 'slot-4', time: 'Today 4 PM - 5 PM', status: 'Available' },
];

export default function CheckoutPage() {
  const {
    cartItems,
    totalPrice,
    selectedAddress,
    savedAddresses,
    setSelectedAddress,
    clearCart,
  } = useCartStore();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('slot-2');
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const SHIPPING_FEE = totalPrice >= 1000 || totalPrice === 0 ? 0 : 49;
  const finalTotal = totalPrice + SHIPPING_FEE;

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
                const isSelected =
                  selectedAddress?.id === addr.id ||
                  (!selectedAddress && addr.id === savedAddresses[0].id);

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

          {/* Add New Address Button matching Chaldal */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full py-3 border border-zinc-300 hover:border-[#7533CB] hover:bg-purple-50/20 rounded-md text-zinc-700 hover:text-[#7533CB] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
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
            {DELIVERY_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.id;

              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all relative ${
                    isSelected
                      ? 'border-[#7533CB] bg-purple-50/30 shadow-xs'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white'
                  }`}
                >
                  {slot.isRecommended && (
                    <span className="absolute -top-2.5 right-2 bg-amber-500 text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider shadow-2xs">
                      Fastest
                    </span>
                  )}
                  <div className="text-xs font-bold text-zinc-900 mb-1">{slot.time}</div>
                  <div
                    className={`text-[11px] font-semibold ${
                      isSelected ? 'text-[#7533CB]' : 'text-emerald-600'
                    }`}
                  >
                    {slot.status}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Section: Need Anything Else? */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-1.5">
              <span>Need Anything Else?</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Add frequently forgotten daily essentials before checkout
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {UPSELL_PRODUCTS.map((prod) => (
            <ProductCard key={prod.id} product={prod} categoryName="Upsell" />
          ))}
        </div>
      </div>

      {/* 4. Bottom Sticky Proceed Bar matching Chaldal */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3.5 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-zinc-500 font-medium">Total Payable</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-zinc-900">
                  ৳{finalTotal}
                </span>
                {SHIPPING_FEE === 0 ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Free Delivery
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-500">+৳49 delivery</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="flex-1 sm:flex-initial sm:min-w-[260px] py-3 px-6 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Payment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. 1:1 Authentic Add New Address Modal with Map & Pin */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}
