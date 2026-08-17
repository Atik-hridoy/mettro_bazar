'use client';

import React from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  Truck,
} from 'lucide-react';
import logo from '@/assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-zinc-200 text-zinc-700 text-xs select-none">
      {/* 1. Value Proposition 4-Feature Highlights Bar */}
      <div className="border-b border-zinc-200/80 bg-white py-8 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7533CB] flex items-center justify-center mb-2.5">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-sm">1 hour delivery</h4>
            <p className="text-zinc-500 text-[11px] mt-0.5">Express delivery to your doorstep</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7533CB] flex items-center justify-center mb-2.5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-sm">Cash on Delivery</h4>
            <p className="text-zinc-500 text-[11px] mt-0.5">Pay after receiving your groceries</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7533CB] flex items-center justify-center mb-2.5">
              <Phone className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-sm">Hotline 16710</h4>
            <p className="text-zinc-500 text-[11px] mt-0.5">Available 8:00 AM - 10:00 PM</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7533CB] flex items-center justify-center mb-2.5">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-zinc-900 text-sm">7 Days Return</h4>
            <p className="text-zinc-500 text-[11px] mt-0.5">Hassle-free replacement policy</p>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Links Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
        {/* Brand Description & Mobile Apps (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={typeof logo === 'string' ? logo : logo.src || '/logo.png'}
              alt="METRO BAZAR Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-black text-[#4A235A] font-serif italic">
              METRO BAZAR
            </span>
          </Link>

          <p className="text-zinc-600 leading-relaxed text-[11px] sm:text-xs">
            Metro Bazar is Bangladesh's leading online grocery shopping platform delivering fresh groceries, daily essentials, baby care, hygiene products and more right to your doorstep.
          </p>

          {/* App Store Download Badges */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-zinc-900 mb-2 uppercase tracking-wider">
              Experience our mobile app
            </p>
            <div className="flex items-center gap-2.5">
              <div className="h-10 px-3.5 bg-black text-white rounded-lg flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-lg">▶</span>
                <div className="text-left">
                  <div className="text-[8px] uppercase tracking-wider text-zinc-400">GET IT ON</div>
                  <div className="text-xs font-bold leading-tight">Google Play</div>
                </div>
              </div>
              <div className="h-10 px-3.5 bg-black text-white rounded-lg flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
                <span className="text-lg"></span>
                <div className="text-left">
                  <div className="text-[8px] uppercase tracking-wider text-zinc-400">Download on the</div>
                  <div className="text-xs font-bold leading-tight">App Store</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Care (2 cols) */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            Customer Service
          </h4>
          <ul className="space-y-2 text-zinc-600">
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Contact Us</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">FAQ</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Terms of Use</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Return & Refund</Link></li>
          </ul>
        </div>

        {/* About Metro Bazar (2 cols) */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            About Us
          </h4>
          <ul className="space-y-2 text-zinc-600">
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">About Us</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Careers</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Our Blog</Link></li>
            <li><Link href="/" className="hover:text-[#7533CB] transition-colors">Corporate Solution</Link></li>
          </ul>
        </div>

        {/* For Business (4 cols) */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
            For Business & Contact
          </h4>
          <div className="space-y-2 text-zinc-600">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#7533CB]" />
              <span>16710 / 01333410106</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#7533CB]" />
              <span>support@metrobazar.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#7533CB]" />
              <span>House 24, Road 5, Block B, Banani, Dhaka</span>
            </div>
          </div>

          {/* Social Media Links with SVG */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-zinc-900 mb-2">Connect With Us</p>
            <div className="flex items-center gap-2 text-zinc-600">
              <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:border-[#7533CB] hover:text-[#7533CB] flex items-center justify-center transition-colors shadow-2xs cursor-pointer font-bold text-xs">
                f
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:border-[#7533CB] hover:text-[#7533CB] flex items-center justify-center transition-colors shadow-2xs cursor-pointer font-bold text-xs">
                ▶
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:border-[#7533CB] hover:text-[#7533CB] flex items-center justify-center transition-colors shadow-2xs cursor-pointer font-bold text-xs">
                📷
              </button>
              <button className="w-8 h-8 rounded-full bg-white border border-zinc-200 hover:border-[#7533CB] hover:text-[#7533CB] flex items-center justify-center transition-colors shadow-2xs cursor-pointer font-bold text-xs">
                in
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Payment Partners & Copyright Bar */}
      <div className="border-t border-zinc-200 bg-white py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[11px] text-zinc-500 font-light">
            © 2026 <strong>METRO BAZAR</strong>. All rights reserved.
          </p>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 flex-wrap justify-center">
            <span className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-pink-600 font-black">bKash</span>
            <span className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-orange-600 font-black">Nagad</span>
            <span className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-blue-800 font-black">VISA</span>
            <span className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-red-600 font-black">Mastercard</span>
            <span className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-blue-600 font-black">AMEX</span>
            <span className="px-2 py-0.5 rounded border border-zinc-200 bg-zinc-50 text-emerald-600 font-bold">Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
