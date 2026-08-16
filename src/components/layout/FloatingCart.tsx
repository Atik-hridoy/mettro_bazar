'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export const FloatingCart: React.FC = () => {
  const {
    cartItems,
    totalPrice,
    totalItems,
    isDrawerOpen,
    toggleDrawer,
    setDrawerOpen,
    addItem,
    removeItem,
    deleteItem,
    clearCart,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const FREE_DELIVERY_THRESHOLD = 1000;
  const STANDARD_DELIVERY_FEE = totalPrice >= FREE_DELIVERY_THRESHOLD || totalPrice === 0 ? 0 : 29;
  const discount = promoApplied ? Math.round(totalPrice * 0.1) : 0;
  const finalTotal = Math.max(0, totalPrice + STANDARD_DELIVERY_FEE - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    if (promoCode.trim().toUpperCase() === 'CHALDAL10') {
      setPromoApplied(true);
    } else {
      setPromoError('Invalid code. Try CHALDAL10');
    }
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        setOrderPlaced(false);
        setDrawerOpen(false);
      }, 2000);
    }, 800);
  };

  return (
    <>
      {/* Right Fixed Floating Cart Trigger */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          onClick={toggleDrawer}
          className="flex flex-col items-center justify-center bg-[#FF5252] hover:bg-[#E04040] text-white p-2.5 rounded-l-sm shadow-sm transition-colors border-l border-t border-b border-rose-600 select-none"
          aria-label="Open Shopping Bag"
        >
          <div className="flex items-center gap-1 mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-[11px] font-semibold">
              {totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}
            </span>
          </div>

          <div className="bg-white text-zinc-900 font-bold text-xs px-2 py-0.5 rounded-sm">
            ৳ {totalPrice.toLocaleString()}
          </div>
        </button>
      </div>

      {/* Cart Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-sm bg-white shadow-cart flex flex-col border-l border-zinc-200">
              {/* Drawer Header */}
              <div className="px-4 py-3 bg-zinc-100 border-b border-zinc-200 text-zinc-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FF5252]" />
                  <h2 className="text-sm font-semibold">Shopping Bag ({totalItems})</h2>
                </div>

                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-zinc-500 hover:text-zinc-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Delivery Banner */}
              <div className="bg-zinc-50 px-4 py-2 border-b border-zinc-200 text-xs text-zinc-700">
                {totalPrice >= FREE_DELIVERY_THRESHOLD ? (
                  <span className="text-emerald-700 font-medium">
                    ✓ Free 1-Hour Delivery Unlocked
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#FF5252]">৳{FREE_DELIVERY_THRESHOLD - totalPrice}</strong> more for Free Delivery
                  </span>
                )}
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-3 divide-y divide-zinc-100 custom-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-3">
                    <ShoppingBag className="w-10 h-10 text-zinc-300" />
                    <div>
                      <p className="text-xs font-semibold text-zinc-700">Your bag is empty</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Add items from popular categories or search.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 py-2 first:pt-0"
                      >
                        {/* Item Image */}
                        <div className="w-12 h-12 bg-white border border-zinc-200 rounded-sm overflow-hidden shrink-0 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-zinc-900 truncate">
                            {item.name}
                          </h4>
                          <span className="text-[10px] text-zinc-500 block">
                            ৳{item.price} / {item.unit}
                          </span>
                          <span className="text-xs font-semibold text-zinc-900">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-zinc-300 rounded-sm bg-white">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="px-1.5 py-0.5 text-zinc-600 hover:bg-zinc-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1 text-xs font-semibold text-zinc-800 min-w-[16px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => addItem(item)}
                            className="px-1.5 py-0.5 text-zinc-600 hover:bg-zinc-100"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="p-1 text-zinc-400 hover:text-rose-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Breakdown & Order Button */}
              {cartItems.length > 0 && (
                <div className="p-3 bg-zinc-50 border-t border-zinc-200 space-y-2 text-xs">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-1.5">
                    <div className="relative flex-1">
                      <Tag className="w-3 h-3 text-zinc-400 absolute left-2 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo Code (CHALDAL10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="w-full pl-6 pr-2 py-1 text-xs rounded-sm border border-zinc-300 focus:outline-none focus:border-zinc-500 bg-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={promoApplied || !promoCode}
                      className="px-2.5 py-1 text-xs font-medium rounded-sm bg-zinc-800 text-white hover:bg-zinc-900 disabled:opacity-50"
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </form>

                  {promoApplied && (
                    <div className="flex items-center justify-between text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                      <span>10% Discount Applied</span>
                      <button
                        onClick={() => {
                          setPromoApplied(false);
                          setPromoCode('');
                        }}
                        className="text-rose-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {promoError && (
                    <p className="text-[10px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {promoError}
                    </p>
                  )}

                  {/* Pricing Rows */}
                  <div className="space-y-1 pt-1 border-t border-zinc-200 text-zinc-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-zinc-900">
                        ৳ {totalPrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>
                        {STANDARD_DELIVERY_FEE === 0 ? (
                          <span className="text-emerald-700 font-semibold">FREE</span>
                        ) : (
                          `৳ ${STANDARD_DELIVERY_FEE}`
                        )}
                      </span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-emerald-700">
                        <span>Discount</span>
                        <span>- ৳ {discount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-semibold text-zinc-900 pt-1 border-t border-zinc-200">
                      <span>Total</span>
                      <span className="text-[#FF5252]">
                        ৳ {finalTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  {orderPlaced ? (
                    <div className="bg-emerald-700 text-white p-2 rounded-sm flex items-center justify-center gap-1.5 font-semibold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Order Placed Successfully!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="w-full py-2 px-3 bg-[#FF5252] hover:bg-[#E04040] text-white font-semibold text-xs rounded-sm transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Place Order • ৳{finalTotal.toLocaleString()}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
