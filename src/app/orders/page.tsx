'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Clock,
  MapPin,
  Phone,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  Calendar,
  CreditCard,
  Banknote,
  ArrowRight,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { fetchUserOrdersFromBackend, fetchUserProfileFromBackend } from '@/lib/api';

export default function OrdersPage() {
  const { user, language } = useCartStore();
  const isBN = language === 'BN';

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});

  const loadOrders = async (showRefreshSpinner = false) => {
    if (showRefreshSpinner) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      let uPhone = user?.phone && !user.phone.includes('@') ? user.phone : '';
      let uEmail = user?.email || '';

      if (!uPhone && !uEmail) {
        const profile = await fetchUserProfileFromBackend();
        if (profile) {
          if (profile.phone_number && !profile.phone_number.includes('@')) {
            uPhone = profile.phone_number;
          }
          if (profile.email) {
            uEmail = profile.email;
          }
        }
      }

      const data = await fetchUserOrdersFromBackend(uPhone, uEmail);
      setOrders(Array.isArray(data) ? data : []);

      // Auto expand the latest (first) order by default
      if (Array.isArray(data) && data.length > 0 && Object.keys(expandedOrderIds).length === 0) {
        const firstId = String(data[0].id || data[0].order_number);
        setExpandedOrderIds({ [firstId]: true });
      }
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedOrderIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return isBN ? 'নতুন অর্ডার' : 'Recent Order';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(isBN ? 'bn-BD' : 'en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('deliver') || s.includes('complete')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {isBN ? 'ডেলিভারি সম্পন্ন (Delivered)' : 'Delivered'}
        </span>
      );
    }
    if (s.includes('cancel')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertCircle className="w-3.5 h-3.5" />
          {isBN ? 'বাতিল করা হয়েছে (Cancelled)' : 'Cancelled'}
        </span>
      );
    }
    if (s.includes('out') || s.includes('transit')) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-300">
          <Truck className="w-3.5 h-3.5" />
          {isBN ? 'ডেলিভারি পথে (Out for Delivery)' : 'Out for Delivery'}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
        <Clock className="w-3.5 h-3.5 animate-pulse" />
        {isBN ? 'প্রসেসিং হচ্ছে (Processing)' : 'Processing'}
      </span>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-[#7533CB]" />
            <span>{isBN ? 'আপনার অর্ডারসমূহ (Your Orders)' : 'Your Orders'}</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            {isBN
              ? 'আপনার অর্ডারের বর্তমান স্ট্যাটাস, পণ্য তালিকা এবং মূল্য সম্পর্কিত বিস্তারিত তথ্য দেখুন।'
              : 'Track your current order status, purchased items, and detailed receipts.'}
          </p>
        </div>

        <button
          onClick={() => loadOrders(true)}
          disabled={isRefreshing}
          className="self-start sm:self-auto px-4 py-2 bg-purple-50 hover:bg-purple-100 text-[#7533CB] text-xs font-bold rounded-lg border border-purple-200 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? (isBN ? 'রিফ্রেশ হচ্ছে...' : 'Refreshing...') : (isBN ? 'অর্ডার রিফ্রেশ' : 'Refresh Orders')}</span>
        </button>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs animate-pulse space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 bg-zinc-200 rounded w-1/3" />
                <div className="h-6 bg-zinc-200 rounded-full w-24" />
              </div>
              <div className="h-3 bg-zinc-100 rounded w-1/2" />
              <div className="h-16 bg-zinc-50 rounded-lg" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center shadow-2xs my-8 select-none">
          <div className="w-20 h-20 bg-purple-50 text-[#7533CB] rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-100 shadow-sm">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-800 mb-2">
            {isBN ? 'এখনও কোন অর্ডার করেননি!' : 'No Orders Found Yet!'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-6 leading-relaxed">
            {isBN
              ? 'মেট্রো বাজারে আপনার পছন্দের পণ্য বেছে নিন এবং সহজে অর্ডার সম্পন্ন করুন।'
              : 'You haven’t placed any orders with METRO BAZAR yet. Explore our grocery and daily essential items now.'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <span>{isBN ? 'কেনাকাটা শুরু করুন' : 'Start Shopping Now'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {orders.map((order) => {
            const cardKey = String(order.id || order.order_number);
            const isExpanded = Boolean(expandedOrderIds[cardKey]);
            const itemsList = Array.isArray(order.items) ? order.items : [];
            const addr = order.delivery_address || order.delivery_address_snapshot || {};
            const street = addr.street_address || addr.details || 'Delivery Address';
            const city = addr.city || addr.area || 'Rangpur';

            return (
              <div
                key={cardKey}
                className="bg-white border border-zinc-200 rounded-2xl shadow-2xs hover:shadow-md transition-all overflow-hidden"
              >
                {/* Header Row */}
                <div className="p-4 sm:p-5 bg-zinc-50/70 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-extrabold text-[#7533CB] bg-purple-100/80 border border-purple-200 px-2.5 py-1 rounded-md">
                        {order.order_number || `ORD-${order.id}`}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 pt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-zinc-200 pt-2 sm:pt-0">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-zinc-400 font-medium uppercase block">
                        {isBN ? 'সর্বমোট মূল্য' : 'Total Amount'}
                      </span>
                      <span className="text-base sm:text-lg font-black text-zinc-900">
                        ৳{order.total_amount || order.total || 0}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(cardKey)}
                      className="p-2 text-zinc-600 hover:bg-zinc-200/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
                    >
                      <span>{isExpanded ? (isBN ? 'লুকান' : 'Hide Details') : (isBN ? 'বিস্তারিত' : 'View Details')}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4 animate-in fade-in duration-150">
                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                        <div className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-[#7533CB]" />
                          <span>{isBN ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}</span>
                        </div>
                        <p className="text-zinc-600 font-medium leading-relaxed pl-5.5">
                          {street}, {city}
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-1">
                        <div className="font-bold text-zinc-800 flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          <span>{isBN ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}</span>
                        </div>
                        <div className="pl-5.5 space-y-0.5">
                          <p className="text-zinc-800 font-bold">
                            {order.payment_gateway || 'Cash on Delivery'}
                          </p>
                          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            {(order.payment_status || 'UNPAID').toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ordered Items Table */}
                    <div>
                      <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#7533CB]" />
                        <span>
                          {isBN ? `অর্ডারকৃত পণ্য তালিকা (${itemsList.length} টি)` : `Purchased Items (${itemsList.length})`}
                        </span>
                      </h3>

                      <div className="bg-zinc-50 rounded-xl border border-zinc-200 divide-y divide-zinc-200/80 overflow-hidden">
                        {itemsList.map((item: any, idx: number) => {
                          const itemName = item.product_name_en || item.name || 'Product';
                          const qty = item.quantity || 1;
                          const price = item.unit_price || item.price || 0;
                          const itemSubtotal = item.subtotal || price * qty;
                          const unitStr = item.unit ? ` (${item.unit})` : '';

                          return (
                            <div key={item.id || idx} className="p-3 flex items-center justify-between text-xs gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-zinc-800 truncate">{itemName}</p>
                                <p className="text-[11px] text-zinc-500">
                                  ৳{price}{unitStr} × <strong className="text-zinc-900">{qty}</strong>
                                </p>
                              </div>
                              <div className="text-right font-black text-zinc-900 shrink-0">
                                ৳{itemSubtotal}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Order Financial Receipt Summary */}
                    <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-3.5 text-xs space-y-1.5">
                      <div className="flex justify-between text-zinc-600">
                        <span>{isBN ? 'পণ্যের মোট মূল্য (Subtotal)' : 'Subtotal'}</span>
                        <span>৳{order.subtotal || 0}</span>
                      </div>
                      <div className="flex justify-between text-zinc-600">
                        <span>{isBN ? 'ডেলিভারি চার্জ (Delivery Fee)' : 'Delivery Charge'}</span>
                        <span>৳{order.delivery_fee || 49}</span>
                      </div>
                      {Number(order.discount_amount || 0) > 0 && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>{isBN ? 'ডিসকাউন্ট' : 'Discount'}</span>
                          <span>-৳{order.discount_amount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-sm text-zinc-900 pt-2 border-t border-purple-200">
                        <span>{isBN ? 'সর্বমোট প্রদেয় (Total Payable)' : 'Total Charge'}</span>
                        <span className="text-[#7533CB]">৳{order.total_amount || order.total || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
