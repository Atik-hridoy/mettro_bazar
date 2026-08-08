import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { EmptyState } from '../ui/EmptyState';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-extrabold text-slate-800">Your Cart</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close Cart"
              className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <EmptyState
                title="Your cart is empty"
                description="Explore our ready-to-cook meals and add items to your cart."
                actionText="Browse Products"
                onAction={onClose}
              />
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedVariant.id}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {item.selectedVariant.weight} • ৳{item.selectedVariant.price}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.selectedVariant.id,
                            item.quantity - 1
                          )
                        }
                        className="p-1 bg-white rounded-lg border border-slate-200 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3 text-slate-600" />
                      </button>
                      <span className="text-xs font-bold text-slate-800 w-4 text-center">
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
                        className="p-1 bg-white rounded-lg border border-slate-200 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3 text-slate-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-extrabold text-primary-dark">
                      ৳{item.selectedVariant.price * item.quantity}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedVariant.id)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-800 font-bold">৳{totalPrice}</span>
              </div>
              <div className="flex justify-between items-center text-base font-extrabold">
                <span className="text-slate-800">Total</span>
                <span className="text-primary-dark text-xl">৳{totalPrice}</span>
              </div>
              <Button
                fullWidth
                onClick={() => {
                  onClose();
                  navigate('/checkout');
                }}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
