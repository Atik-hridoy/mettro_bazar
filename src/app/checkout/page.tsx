'use client';

import React, { useState, useEffect } from 'react';
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
  User as UserIcon,
  Phone,
  Mail,
  CreditCard,
  Banknote,
  ShoppingBag,
  Edit2,
} from 'lucide-react';
import { useCartStore, Address } from '@/store/useCartStore';
import { ProductCard } from '@/components/common/ProductCard';
import { AddressModal } from '@/components/common/AddressModal';
import { Product, CHALDAL_PRODUCTS } from '@/lib/constants';
import { TRANSLATIONS } from '@/lib/translations';
import { fetchUserProfileFromBackend, fetchAddressesFromBackend, placeOrderOnBackend, fetchProductsFromBackend } from '@/lib/api';

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
    addAddress,
    clearCart,
    user,
    language,
  } = useCartStore();

  const isBN = language === 'BN';
  const t = TRANSLATIONS[language];

  // All catalog products for dynamic recommendations
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // User Profile Contact Info State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Address & Checkout State
  const [backendAddresses, setBackendAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>('slot-2');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash'>('cod');
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const SHIPPING_FEE = totalPrice >= 1000 || totalPrice === 0 ? 0 : 49;
  const finalTotal = totalPrice + SHIPPING_FEE;

  // Fetch backend products to merge into catalog for category recommendations
  useEffect(() => {
    async function loadCatalog() {
      try {
        const backendProds = await fetchProductsFromBackend();
        if (Array.isArray(backendProds) && backendProds.length > 0) {
          const combined = [...backendProds, ...CHALDAL_PRODUCTS];
          const unique = Array.from(new Map(combined.map((p) => [p.id, p])).values());
          setAllProducts(unique);
        }
      } catch (err) {
        console.error('Error fetching catalog for checkout recommendations:', err);
      }
    }
    loadCatalog();
  }, []);

  // --- Dynamic Related Products matching user's cart categories/sub-categories ---
  const cartProductIds = new Set(cartItems.map((item) => String(item.id)));

  // Extract category slugs and names from items in cart
  const cartCategorySlugs = Array.from(
    new Set(
      cartItems
        .map((item) => {
          if ((item as any).categorySlug) return String((item as any).categorySlug).toLowerCase();
          if (item.category) return String(item.category).toLowerCase();
          const matchedProd = allProducts.find((p) => String(p.id) === String(item.id));
          if (matchedProd) {
            return (matchedProd.categorySlug || matchedProd.category || '').toLowerCase();
          }
          return '';
        })
        .filter(Boolean)
    )
  );

  // Filter products that belong to the exact same categories/sub-categories as items in the cart
  const categoryMatchedProducts = allProducts.filter((prod) => {
    if (cartProductIds.has(String(prod.id))) return false;
    if (cartCategorySlugs.length === 0) return true;

    const prodCatSlug = (prod.categorySlug || '').toLowerCase();
    const prodCatName = (prod.category || '').toLowerCase();

    return cartCategorySlugs.some((cartCat) => {
      if (!cartCat) return false;
      return (
        prodCatSlug.includes(cartCat) ||
        cartCat.includes(prodCatSlug) ||
        prodCatName.includes(cartCat) ||
        cartCat.includes(prodCatName)
      );
    });
  });

  // Fallback if fewer than 4 matches found
  const fallbackProducts = allProducts.filter(
    (p) => !cartProductIds.has(String(p.id))
  );

  const relatedProducts = (
    categoryMatchedProducts.length >= 4
      ? categoryMatchedProducts
      : [...categoryMatchedProducts, ...fallbackProducts]
  )
    .filter((p, index, self) => self.findIndex((x) => x.id === p.id) === index)
    .slice(0, 4);

  // 1. Fetch User Profile & Backend Addresses on Mount
  useEffect(() => {
    async function loadUserData() {
      try {
        const profile = await fetchUserProfileFromBackend();
        if (profile) {
          const fn = profile.first_name || '';
          const ln = profile.last_name || '';
          const full = `${fn} ${ln}`.trim() || 'Valued Customer';
          setCustomerName(full);

          const rawPhone = profile.phone_number || '';
          const validPhone = rawPhone && !rawPhone.includes('@') ? rawPhone : '';
          setCustomerPhone(validPhone);
          setCustomerEmail(profile.email || '');

          if (!validPhone) {
            setIsEditingContact(true);
          }
        } else if (user) {
          setCustomerName(user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Valued Customer');
          const rawPhone = user.phone || '';
          const validPhone = rawPhone && !rawPhone.includes('@') ? rawPhone : '';
          setCustomerPhone(validPhone);
          setCustomerEmail(user.email || '');

          if (!validPhone) {
            setIsEditingContact(true);
          }
        }

        const addresses = await fetchAddressesFromBackend();
        if (Array.isArray(addresses) && addresses.length > 0) {
          const mapped: Address[] = addresses.map((a: any) => ({
            id: String(a.id),
            label: a.title || 'Home',
            details: `${a.street_address}${a.area ? `, ${a.area}` : ''}${a.city ? `, ${a.city}` : ''}`,
            city: a.city || 'Dhaka',
            phone: customerPhone || '01333410106',
          }));
          setBackendAddresses(mapped);

          // Select first default address if none selected
          if (!selectedAddress && mapped.length > 0) {
            setSelectedAddress(mapped[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load checkout user data:', err);
      }
    }
    loadUserData();
  }, []);

  const allAddresses = backendAddresses.length > 0 ? backendAddresses : savedAddresses;
  const activeAddress = selectedAddress || (allAddresses.length > 0 ? allAddresses[0] : null);

  const handleModalClose = async () => {
    setIsAddressModalOpen(false);
    // Reload addresses from backend
    try {
      const addresses = await fetchAddressesFromBackend();
      if (Array.isArray(addresses) && addresses.length > 0) {
        const mapped: Address[] = addresses.map((a: any) => ({
          id: String(a.id),
          label: a.title || 'Home',
          details: `${a.street_address}${a.area ? `, ${a.area}` : ''}${a.city ? `, ${a.city}` : ''}`,
          city: a.city || 'Dhaka',
          phone: customerPhone || '01333410106',
        }));
        setBackendAddresses(mapped);
        if (mapped.length > 0) setSelectedAddress(mapped[mapped.length - 1]);
      }
    } catch (err) {
      console.error('Error refreshing addresses:', err);
    }
  };

  const [createdOrderNumber, setCreatedOrderNumber] = useState<string>('');
  const [confirmedOrderTotal, setConfirmedOrderTotal] = useState<number>(0);

  const handleProceed = async () => {
    setPhoneError('');
    const cleanPhone = customerPhone.trim();

    // Check if phone number is empty, contains '@', or invalid
    if (!cleanPhone || cleanPhone.includes('@') || cleanPhone.length < 9) {
      setPhoneError(
        isBN
          ? '⚠️ চেকআউট সম্পন্ন করার জন্য একটি সক্রিয় ফোন নম্বর প্রদান করা আবশ্যক! দয়া করে নিচে ফোন নম্বরটি পূরণ করুন।'
          : '⚠️ A valid contact phone number is required to proceed with checkout! Please enter your phone number below.'
      );
      setIsEditingContact(true);
      return;
    }

    if (!activeAddress && allAddresses.length === 0) {
      setIsAddressModalOpen(true);
      return;
    }

    setIsPlacingOrder(true);
    try {
      const currentOrderTotal = finalTotal;
      const orderPayload = {
        customer_name: customerName || 'Customer',
        customer_phone: cleanPhone,
        customer_email: user?.email || '',
        delivery_address: {
          recipient_name: customerName || 'Customer',
          recipient_phone: cleanPhone,
          street_address: activeAddress?.details || 'Delivery Address',
          area: activeAddress?.city || 'Rangpur',
          city: activeAddress?.city || 'Rangpur',
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          subtotal: item.price * item.quantity,
        })),
        subtotal: totalPrice,
        delivery_fee: SHIPPING_FEE,
        total_amount: currentOrderTotal,
        note: '',
      };

      const res = await placeOrderOnBackend(orderPayload);
      const orderNum = res?.order_number || res?.order?.order_number || `ORD-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
      const totalPaid = Number(res?.order?.total_amount) || currentOrderTotal;
      setCreatedOrderNumber(orderNum);
      setConfirmedOrderTotal(totalPaid);
      setIsOrderComplete(true);
      clearCart();
    } catch (err: any) {
      console.error('Order placement failed:', err);
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (isOrderComplete) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 animate-bounce shadow-md">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 mb-2">
          {isBN ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Confirmed!'}
        </h2>
        <p className="text-sm text-zinc-600 max-w-md mb-6 leading-relaxed">
          {isBN
            ? `ধন্যবাদ ${customerName || ''}! মেট্রো বাজার থেকে আপনার কেনাকাটার অর্ডারটি নেওয়া হয়েছে। দ্রুততম সময়ে আপনার ঠিকানায় ডেলিভারি দেওয়া হবে।`
            : `Thank you ${customerName || ''}! Your order has been placed successfully with METRO BAZAR. Our team is preparing your items for delivery.`}
        </p>

        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 mb-6 max-w-md w-full text-left text-xs space-y-2">
          {createdOrderNumber && (
            <div className="flex justify-between text-zinc-600 pb-2 border-b border-zinc-200 font-bold">
              <span>{isBN ? 'অর্ডার নম্বর:' : 'Order Number:'}</span>
              <strong className="text-emerald-600 font-mono text-sm">{createdOrderNumber}</strong>
            </div>
          )}
          <div className="flex justify-between text-zinc-600">
            <span>{isBN ? 'গ্রাহকের নাম:' : 'Customer Name:'}</span>
            <strong className="text-zinc-900">{customerName || 'Customer'}</strong>
          </div>
          {customerPhone && (
            <div className="flex justify-between text-zinc-600">
              <span>{isBN ? 'ফোন নম্বর:' : 'Phone Number:'}</span>
              <strong className="text-zinc-900">{customerPhone}</strong>
            </div>
          )}
          {activeAddress && (
            <div className="flex justify-between text-zinc-600">
              <span>{isBN ? 'ডেলিভারি ঠিকানা:' : 'Delivery Address:'}</span>
              <strong className="text-zinc-900 truncate max-w-[200px]">{activeAddress.details}</strong>
            </div>
          )}
          <div className="flex justify-between text-zinc-600 pt-2 border-t border-zinc-200 font-bold text-sm">
            <span>{isBN ? 'মোট প্রদেয় মূল্য:' : 'Total Payable:'}</span>
            <strong className="text-[#7533CB]">৳{confirmedOrderTotal}</strong>
          </div>
        </div>

        <Link
          href="/"
          className="px-8 py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer"
        >
          {isBN ? 'আরও কেনাকাটা করুন' : 'Continue Shopping'}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-32">
      <h1 className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight mb-6">
        {isBN ? 'চেকআউট ও ডেলিভারি' : 'Checkout & Delivery'}
      </h1>

      {/* 1. Section: User / Contact Information (Professional Profile Integration) */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden mb-6">
        <div className="bg-zinc-50/80 px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-[#7533CB]" />
            <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
              {isBN ? 'গ্রাহকের তথ্য (Customer Information)' : 'Customer Information'}
            </h2>
          </div>
          <button
            onClick={() => setIsEditingContact(!isEditingContact)}
            className="text-xs font-semibold text-[#7533CB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditingContact ? (isBN ? 'সংরক্ষণ' : 'Save') : (isBN ? 'এডিট করুন' : 'Edit')}</span>
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {phoneError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold flex items-center gap-2">
              <span>{phoneError}</span>
            </div>
          )}

          {isEditingContact ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                  {isBN ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-[#7533CB]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                  {isBN ? 'ফোন নম্বর' : 'Phone Number'} <span className="text-rose-500 font-bold">* ({isBN ? 'আবশ্যক' : 'Required'})</span>
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => {
                    setCustomerPhone(e.target.value);
                    if (e.target.value) setPhoneError('');
                  }}
                  placeholder="017XXXXXXXX"
                  className={`w-full px-3 py-2 border rounded-md text-xs focus:outline-none ${
                    phoneError || !customerPhone
                      ? 'border-rose-400 bg-rose-50/40 focus:border-rose-500 font-bold text-rose-900'
                      : 'border-zinc-300 focus:border-[#7533CB]'
                  }`}
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                  {isBN ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-xs focus:outline-none focus:border-[#7533CB]"
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <UserIcon className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-medium uppercase">{isBN ? 'নাম' : 'Name'}</span>
                  <span className="font-bold text-zinc-900 truncate block">{customerName || 'Valued Customer'}</span>
                </div>
              </div>

              <div className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${
                !customerPhone ? 'bg-rose-50/60 border-rose-300' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <Phone className={`w-4 h-4 shrink-0 ${!customerPhone ? 'text-rose-600' : 'text-purple-600'}`} />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-medium uppercase">{isBN ? 'ফোন' : 'Phone'}</span>
                  <span className={`font-bold truncate block ${!customerPhone ? 'text-rose-600 italic' : 'text-zinc-900'}`}>
                    {customerPhone || (isBN ? 'ফোন নম্বর দিন (আবশ্যক)' : 'Click Edit to Add Phone')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200">
                <Mail className="w-4 h-4 text-purple-600 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-zinc-400 block font-medium uppercase">{isBN ? 'ইমেইল' : 'Email'}</span>
                  <span className="font-bold text-zinc-900 truncate block">{customerEmail || 'Not set'}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Section: Select a Delivery Address */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden mb-6">
        <div className="bg-zinc-50/80 px-4 py-3 border-b border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7533CB]" />
            <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
              {isBN ? 'ডেলিভারি ঠিকানা নির্বাচন করুন' : 'SELECT A DELIVERY ADDRESS'}
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-zinc-500">
            {allAddresses.length} {isBN ? 'টি সংরক্ষিত ঠিকানা' : 'Saved Addresses'}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {allAddresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {allAddresses.map((addr) => {
                const isSelected = activeAddress?.id === addr.id;

                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#7533CB] bg-purple-50/30 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-zinc-900">{addr.label}</span>
                        {isSelected && (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#7533CB] bg-purple-100/80 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> {isBN ? 'নির্বাচিত' : 'Selected'}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {addr.details}
                      </p>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-2 font-medium">
                      Phone: {addr.phone || customerPhone || '01333410106'}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* Add New Address Button matching Chaldal 1:1 */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="w-full py-3.5 border-2 border-dashed border-zinc-300 hover:border-[#7533CB] hover:bg-purple-50/30 rounded-xl text-zinc-700 hover:text-[#7533CB] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isBN ? '+ নতুন ঠিকানা যুক্ত করুন' : '+ New Address'}</span>
          </button>
        </div>
      </div>

      {/* 3. Section: Payment Method Selection */}
      <div className="bg-white border border-zinc-200 rounded-xl shadow-2xs overflow-hidden mb-8">
        <div className="bg-zinc-50/80 px-4 py-3 border-b border-zinc-200 flex items-center gap-2">
          <Banknote className="w-4 h-4 text-[#7533CB]" />
          <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
            {isBN ? 'পেমেন্ট পদ্ধতি (Payment Method)' : 'Payment Method'}
          </h2>
        </div>

        <div className="p-4 sm:p-5">
          <div className="max-w-md">
            <div className="p-4 rounded-xl border-2 border-[#7533CB] bg-purple-50/30 shadow-xs flex items-start gap-3 select-none">
              <Banknote className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 block">
                    {isBN ? 'ক্যাশ অন ডেলিভারি (Cash on Delivery)' : 'Cash on Delivery'}
                  </span>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {isBN ? 'সক্রিয়' : 'Active'}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-500 block mt-1 leading-relaxed">
                  {isBN ? 'পণ্য হাতে পেয়ে দেখে শুনে নগদ মূল্য পরিশোধ করুন।' : 'Pay with cash upon receiving your order at your doorstep.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Section: Need Anything Else? (Category & Sub-Category Related Recommendations) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 flex items-center gap-1.5">
              <span>{isBN ? 'আপনার আর কিছু লাগবে?' : 'Need Anything Else?'}</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isBN
                ? 'আপনার কার্টে যুক্ত ক্যাটাগরি ও সাব-ক্যাটাগরির সম্পর্কিত অন্যান্য সেরা নিত্যপ্রয়োজনীয় পণ্যসমূহ:'
                : 'Related essential items based on categories in your cart:'}
            </p>
          </div>
          {cartCategorySlugs.length > 0 && (
            <span className="text-[11px] font-bold text-[#7533CB] bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full hidden sm:inline">
              {isBN ? 'ক্যাটাগরি ম্যাচিং' : 'Category Matched'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {relatedProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} categoryName="Related" />
          ))}
        </div>
      </div>

      {/* 6. Bottom Sticky Proceed Bar matching Chaldal 1:1 */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3.5 sm:px-8 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[11px] text-zinc-500 font-medium">{isBN ? 'সর্বমোট প্রদেয়' : 'Total Payable'}</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-zinc-900">
                  ৳{finalTotal}
                </span>
                {SHIPPING_FEE === 0 ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {isBN ? 'ফ্রি ডেলিভারি' : 'Free Delivery'}
                  </span>
                ) : (
                  <span className="text-[11px] text-zinc-500">+৳49 delivery</span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleProceed}
            disabled={isPlacingOrder}
            className="flex-1 sm:flex-initial sm:min-w-[260px] py-3.5 px-6 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isPlacingOrder ? (isBN ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...') : (isBN ? 'অর্ডার সম্পন্ন করুন' : 'Proceed to Order')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 7. Authentic Add New Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
