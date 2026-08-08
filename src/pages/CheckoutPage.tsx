import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import {
  Plus,
  Minus,
  Trash2,
  Lock,
  CheckCircle,
  Leaf,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'card'>('cod');

  const subtotal = getTotalPrice();
  const deliveryFee = subtotal > 0 ? 60 : 0;
  const taxes = Math.round(subtotal * 0.02);
  const total = Math.max(0, subtotal + deliveryFee + taxes - discount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (promoCode.trim().toUpperCase() === 'METRO50') {
      setDiscount(50);
      setPromoSuccess('৳50 discount applied!');
    } else {
      setPromoError('Invalid promo code. Try METRO50');
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }
    alert(
      `Order placed successfully!\nName: ${fullName}\nTotal: ৳${total}\nPayment: ${paymentMethod.toUpperCase()}`
    );
    clearCart();
    navigate('/');
  };

  if (items.length === 0) {
    return (
      <div className="w-full px-4 py-16 flex flex-col items-center justify-center">
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before proceeding to checkout."
          actionText="Browse Ready-to-Cook Meals"
          onAction={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8 flex flex-col min-h-screen">
      <h1 className="text-2xl sm:text-4xl font-extrabold text-[#00694c]">
        Checkout
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Cart Items, Promo, Delivery Info, Payment */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* Cart Items List */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">
              Cart Items ({items.length})
            </h2>
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant.id}`}
                  className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Portion: {item.selectedVariant.weight}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedVariant.id,
                              item.quantity - 1
                            )
                          }
                          className="px-2 py-1 text-slate-600 hover:text-[#00694c]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 py-1 text-xs font-extrabold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.selectedVariant.id,
                              item.quantity + 1
                            )
                          }
                          className="px-2 py-1 text-slate-600 hover:text-[#00694c]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-base font-black text-[#00694c]">
                        ৳ {item.selectedVariant.price * item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          removeItem(item.product.id, item.selectedVariant.id)
                        }
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Promo Code Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-3">
            <h2 className="text-base font-bold text-slate-800">Promo Code</h2>
            <form onSubmit={handleApplyPromo} className="flex gap-3">
              <input
                type="text"
                placeholder="Enter promo code (Try METRO50)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00694c]"
              />
              <Button type="submit" variant="secondary" size="sm">
                Apply
              </Button>
            </form>
            {promoError && <p className="text-xs text-rose-500 font-semibold">{promoError}</p>}
            {promoSuccess && <p className="text-xs text-emerald-600 font-semibold">{promoSuccess}</p>}
          </section>

          {/* Delivery Information Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">
              Delivery Information
            </h2>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name *"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <Input
                label="Phone Number *"
                placeholder="+880 1XXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  Delivery Address *
                </label>
                <textarea
                  rows={3}
                  placeholder="House 42, Road 11, Banani, Dhaka"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00694c]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700">
                  City / Area
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00694c] bg-white"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                </select>
              </div>
              <Input
                label="Delivery Instructions (Optional)"
                placeholder="E.g., Leave with guard"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </form>
          </section>

          {/* Payment Method Section */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-3">
              Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              {/* COD Option */}
              <label
                onClick={() => setPaymentMethod('cod')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                  paymentMethod === 'cod'
                    ? 'border-[#00694c] bg-emerald-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 accent-[#00694c]"
                />
                <div>
                  <span className="block text-sm font-bold text-slate-800">
                    Cash on Delivery
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Pay with cash when your food arrives.
                  </span>
                </div>
                <span className="absolute top-2 right-2 bg-[#00694c] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  Recommended
                </span>
              </label>

              {/* bKash Option */}
              <label
                onClick={() => setPaymentMethod('bkash')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'bkash'
                    ? 'border-[#00694c] bg-emerald-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="mt-1 accent-[#00694c]"
                />
                <div>
                  <span className="block text-sm font-bold text-slate-800">
                    bKash / Nagad Wallet
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Pay securely via mobile wallet.
                  </span>
                </div>
              </label>

              {/* Card Option */}
              <label
                onClick={() => setPaymentMethod('card')}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#00694c] bg-emerald-50/40'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mt-1 accent-[#00694c]"
                />
                <div>
                  <span className="block text-sm font-bold text-slate-800">
                    Credit / Debit Card
                  </span>
                  <span className="block text-xs text-slate-500 mt-0.5">
                    Visa, MasterCard, Amex supported.
                  </span>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary (Sticky Sidebar) */}
        <div className="w-full lg:w-1/3 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-6">
            <h2 className="text-xl font-black text-slate-800">Order Summary</h2>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 border-b border-slate-200 pb-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-bold text-slate-800">৳ {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-bold text-slate-800">৳ {deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Packaging</span>
                <span className="font-bold text-slate-800">৳ {taxes}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount</span>
                  <span>- ৳ {discount}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center text-lg sm:text-xl font-black text-slate-800">
              <span>Total</span>
              <span className="text-[#00694c] text-2xl font-black">৳ {total}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#00694c] hover:bg-[#004d37] text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/10 uppercase tracking-wider text-sm active:scale-98"
            >
              Place Order
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
              <Lock className="w-4 h-4 text-[#00694c]" />
              <span>100% Encrypted & Secure Checkout</span>
            </div>
          </div>
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
    </div>
  );
};
