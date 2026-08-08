import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct, useProducts } from '../hooks/useProducts';
import { useCartStore } from '../store/useCartStore';
import { ProductCard } from '../components/features/ProductCard';
import { Button } from '../components/ui/Button';
import {
  ChevronRight,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  CheckCircle,
  Leaf,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(id || '');
  const { products: relatedProducts } = useProducts();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-6 w-48 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-slate-200 rounded-2xl w-full" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/4" />
            <div className="h-20 bg-slate-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Menu</Button>
      </div>
    );
  }

  const selectedVariant = product.weightVariants[selectedVariantIndex] || product.weightVariants[0];

  const handleAddToCart = () => {
    if (selectedVariant) {
      addItem(product, selectedVariant, quantity);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12 flex flex-col min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 overflow-x-auto">
        <Link to="/" className="hover:text-[#00694c] transition-colors whitespace-nowrap">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="capitalize whitespace-nowrap">{product.category}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-800 font-bold truncate">{product.name}</span>
      </div>

      {/* Main Product Layout */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Image */}
        <div className="flex flex-col gap-4">
          <div className="w-full bg-slate-100 rounded-2xl overflow-hidden shadow-md relative aspect-square">
            {product.badgeText && (
              <span className="absolute top-4 left-4 bg-[#00694c] text-white font-extrabold text-xs px-3 py-1 rounded-md z-10 shadow">
                {product.badgeText}
              </span>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column: Info & Portion Selection */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#00694c] leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-slate-500 font-medium">(128 Customer Reviews)</span>
            </div>
          </div>

          <p className="text-3xl sm:text-4xl font-black text-[#00694c]">
            ৳ {selectedVariant?.price}
          </p>

          <p className="text-sm text-slate-600 leading-relaxed">
            {product.description}
          </p>

          {/* Portion Weight Selection Buttons */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Select Portion Weight:
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.weightVariants.map((variant, idx) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    selectedVariantIndex === idx
                      ? 'border-[#00694c] bg-[#00694c]/10 text-[#00694c] border-2 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#00694c]'
                  }`}
                >
                  {variant.weight} — ৳{variant.price}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Controls & Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
            <div className="flex items-center border border-slate-300 rounded-xl h-12 w-full sm:w-36 shrink-0 justify-between px-4 bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-slate-600 hover:text-[#00694c] active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-slate-800 text-base">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-slate-600 hover:text-[#00694c] active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={handleAddToCart}
                className="w-full sm:flex-1 bg-[#00694c] hover:bg-[#004d37] text-white h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-900/10 active:scale-98"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 bg-white border-2 border-[#00694c] text-[#00694c] hover:bg-[#00694c]/10 h-12 rounded-xl font-bold text-sm flex items-center justify-center transition-all active:scale-98"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Meta Trust Badges */}
          <div className="space-y-2 pt-4 border-t border-slate-200 text-xs text-slate-600">
            <p className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#00694c]" /> Delivery usually within 2-4 hours inside Dhaka
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00694c]" /> Hygienically vacuum packed & 100% fresh guaranteed
            </p>
          </div>
        </div>
      </section>

      {/* How to Cook Section */}
      <section className="bg-emerald-50/60 rounded-3xl p-6 sm:p-10 border border-emerald-100 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-[#00694c] text-center">
          How to Cook
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {product.cookingSteps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col items-center text-center gap-3"
            >
              <div className="w-10 h-10 bg-[#00694c] text-white rounded-full flex items-center justify-center text-base font-extrabold shadow-sm">
                {step.stepNumber}
              </div>
              <h4 className="text-base font-bold text-slate-800">{step.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{step.instruction}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Products Section */}
      <section className="space-y-6 flex-grow">
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts
            .filter((p) => p.id !== product.id)
            .slice(0, 4)
            .map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
        </div>
      </section>

      {/* Shared Footer on Product Detail Page */}
      <footer className="bg-[#003b29] text-white rounded-3xl p-8 sm:p-12 space-y-8 mt-12 shadow-2xl border border-emerald-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="মেট্রো বাজার" className="h-10 w-auto rounded-lg" />
              <span className="text-2xl font-black text-white">Mettro Bazar</span>
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
          © 2026 Mettro Bazar. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};
