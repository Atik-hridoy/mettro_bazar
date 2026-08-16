'use client';

import React, { useState } from 'react';
import { X, Mail, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setAuthModalOpen } = useCartStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setAuthModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={() => setAuthModalOpen(false)}
      />

      {/* Auth Modal Box matching Chaldal 1:1 */}
      <div className="relative w-full max-w-sm bg-white rounded-lg shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150 border border-zinc-200">
        {/* Modal Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-3.5 pt-1">
          {/* 1. Facebook Button */}
          <button className="w-full py-2.5 px-3 bg-[#4267B2] hover:bg-[#365899] text-white text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors shadow-2xs">
            <span className="font-black text-sm">f</span>
            <span>
              Sign Up or Login with <strong>Facebook</strong>
            </span>
          </button>

          {/* 2. Email Button */}
          <button className="w-full py-2.5 px-3 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold rounded border border-zinc-300 flex items-center justify-center gap-2 transition-colors shadow-2xs">
            <Mail className="w-4 h-4 text-amber-500" />
            <span>
              Login with <strong>Email</strong>
            </span>
          </button>

          {/* 3. Divider */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <span className="relative bg-white px-3 text-[11px] lowercase text-zinc-400 font-medium">
              or
            </span>
          </div>

          {/* 4. Phone Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                PLEASE ENTER YOUR MOBILE PHONE NUMBER
              </label>
              <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1.5">
                <div className="flex items-center gap-1 pr-2 text-xs font-medium text-zinc-700 select-none">
                  <span className="w-4 h-3 bg-emerald-700 inline-block relative rounded-xs overflow-hidden">
                    <span className="w-1.5 h-1.5 bg-red-600 rounded-full absolute inset-0 m-auto" />
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                  <span className="text-zinc-800 font-bold ml-1">+88</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full px-2 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* 5. Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs transition-colors"
            >
              {isSubmitted ? 'Logging In...' : 'SIGN UP / LOGIN'}
            </button>
          </form>

          {/* 6. reCAPTCHA Footer */}
          <p className="text-[10px] text-zinc-400 text-center pt-2 leading-relaxed">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a> and{' '}
            <a href="#" className="underline hover:text-zinc-600">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};
