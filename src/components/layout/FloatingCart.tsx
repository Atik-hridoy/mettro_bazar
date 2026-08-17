'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  ChevronsRight,
  Plus,
  Minus,
  MessageCircle,
  Info,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { TRANSLATIONS } from '@/lib/translations';

export const FloatingCart: React.FC = () => {
  const {
    cartItems,
    totalPrice,
    totalItems,
    isDrawerOpen,
    language,
    toggleDrawer,
    setDrawerOpen,
    setAuthModalOpen,
    addItem,
    removeItem,
  } = useCartStore();

  const [isSpecialCodeOpen, setIsSpecialCodeOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  const t = TRANSLATIONS[language];

  const SHIPPING_FEE = totalPrice >= 1000 || totalPrice === 0 ? 0 : 49;
  const targetForDiscount = Math.max(0, 500 - totalPrice);
  const finalTotal = totalPrice + SHIPPING_FEE;

  const handleCheckout = () => {
    setAuthModalOpen(true);
  };

  return (
    <>
      {/* 1. Exact Chaldal Right Sticky Cart Widget (Desktop) */}
      <div className="fixed right-0 top-[45%] z-40 hidden md:block">
        <button
          onClick={toggleDrawer}
          className="w-18 flex flex-col rounded-l-xl overflow-hidden shadow-md select-none group transition-transform hover:-translate-x-0.5 cursor-pointer"
          aria-label="Shopping Cart"
        >
          {/* Top Half: #7F4CC1 */}
          <div className="bg-[#7F4CC1] group-hover:bg-[#723FB5] text-white py-2 px-2.5 flex flex-col items-center justify-center">
            <ShoppingBag className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-bold italic tracking-tight">
              {totalItems} {t.items}
            </span>
          </div>

          {/* Bottom Half: #632AAD */}
          <div className="bg-[#632AAD] text-white py-1 px-2 text-center text-xs font-bold">
            ৳ {totalPrice}
          </div>
        </button>
      </div>

      {/* 2. Floating Chat Support Button at Bottom Right (Desktop) */}
      <div className="fixed bottom-4 right-4 z-40 hidden md:block">
        <button
          className="w-12 h-12 rounded-full bg-[#FF6F71] hover:bg-[#FF5759] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
          title="Customer Support Chat"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>

      {/* 3. Mobile Bottom Sticky Action Bar matching Screenshot 1:1 */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 px-3 py-2 flex items-center justify-between gap-3 md:hidden shadow-lg">
        {/* Pink Chat Button */}
        <button
          className="w-10 h-10 rounded-full bg-[#FF6F71] text-white flex items-center justify-center shrink-0 shadow-xs cursor-pointer"
          title="Chat Support"
        >
          <MessageCircle className="w-5 h-5" />
        </button>

        {/* Purple Start Shopping Button */}
        <button
          onClick={toggleDrawer}
          className="flex-1 h-10 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded flex items-center justify-center shadow-xs cursor-pointer active:scale-98 transition-transform"
        >
          {language === 'BN' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
        </button>

        {/* Green Cart Bag with Badge */}
        <button
          onClick={toggleDrawer}
          className="relative p-1 text-emerald-600 flex items-center justify-center shrink-0 cursor-pointer"
          aria-label="View Cart"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <span className="absolute -top-1 -right-1 bg-[#7533CB] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
            {totalItems}
          </span>
        </button>
      </div>

      {/* 4. Chaldal Cart Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Sliding Drawer Container */}
          <div className="relative w-full max-w-sm bg-white h-full shadow-2xl z-10 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Top Incentive Banner */}
            <div className="bg-[#bc3a29] text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
              <span>
                {language === 'BN'
                  ? targetForDiscount > 0
                    ? `আরও ৳${targetForDiscount} কেনাকাটা করুন এবং ৳১০ ফি বাঁচান`
                    : '🎉 আপনি বিশেষ ডেলিভারি ডিসকাউন্ট উপভোগ করছেন!'
                  : targetForDiscount > 0
                  ? `Shop ৳${targetForDiscount} more and save ৳10 fee`
                  : '🎉 You have unlocked special delivery discount!'}
              </span>
            </div>

            {/* Drawer Header */}
            <div className="px-4 py-3 bg-[#FCFAFF] border-b border-purple-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 text-emerald-700">
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-bold italic text-zinc-900">
                    {totalItems} {t.items}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    {language === 'BN' ? 'ডেলিভারি ফি:' : 'Shipping Fee:'} ৳ {SHIPPING_FEE}{' '}
                    <Info className="w-3 h-3 text-emerald-600 inline" />
                  </p>
                </div>
              </div>

              {/* Close Button '>>' */}
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[#7F4CC1] hover:text-[#632AAD] p-1 font-black cursor-pointer"
                title="Close Cart"
              >
                <ChevronsRight className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-4 divide-y divide-zinc-100 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-zinc-300" />
                  <p className="text-sm font-semibold text-zinc-700">
                    {language === 'BN'
                      ? 'আপনার শপিং ব্যাগটি খালি'
                      : 'Your shopping bag is empty'}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {language === 'BN'
                      ? 'প্রয়োজনীয় নিত্যপণ্য খুঁজে ব্যাগে যোগ করুন।'
                      : 'Explore daily essentials and add products to your bag.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 pt-3 first:pt-0"
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 bg-white border border-zinc-200 rounded p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-zinc-800 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] text-zinc-500 block">
                          {item.unit}
                        </span>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center border border-zinc-300 rounded text-xs bg-zinc-50">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="px-1.5 py-0.5 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                            aria-label="Decrease"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 font-bold text-zinc-900 text-xs">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            className="px-1.5 py-0.5 hover:bg-zinc-200 text-zinc-600 cursor-pointer"
                            aria-label="Increase"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-zinc-900">
                          ৳{item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Code & Checkout Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-zinc-200 bg-white">
                {/* Collapsible Special Code */}
                <div className="border-b border-zinc-200 bg-zinc-50">
                  <button
                    onClick={() => setIsSpecialCodeOpen(!isSpecialCodeOpen)}
                    className="w-full py-2 px-4 text-xs font-semibold text-zinc-600 flex items-center justify-center gap-1 hover:text-zinc-900 cursor-pointer"
                  >
                    {isSpecialCodeOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronUp className="w-3.5 h-3.5" />
                    )}
                    <span>{language === 'BN' ? 'স্পেশাল কোড লিখুন' : 'Enter special code'}</span>
                  </button>

                  {isSpecialCodeOpen && (
                    <div className="p-3 pt-0 flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder={language === 'BN' ? 'কুপন কোড দিন' : 'Enter coupon code'}
                        className="flex-1 px-3 py-1.5 text-xs border border-zinc-300 rounded bg-white"
                      />
                      <button className="px-3 py-1.5 bg-zinc-800 text-white text-xs font-semibold rounded cursor-pointer">
                        {language === 'BN' ? 'প্রয়োগ করুন' : 'Apply'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Chaldal Authentic Checkout Button */}
                <div className="p-3">
                  <button
                    onClick={handleCheckout}
                    className="w-full h-12 bg-[#9E70DB] hover:bg-[#854CD6] text-white rounded-lg font-bold text-base flex items-center justify-between px-4 transition-colors shadow-sm select-none cursor-pointer"
                  >
                    <span className="font-bold">{t.checkout}</span>
                    <span className="bg-[#7533CB] px-3 py-1 rounded-md text-sm font-extrabold">
                      ৳ {finalTotal}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
