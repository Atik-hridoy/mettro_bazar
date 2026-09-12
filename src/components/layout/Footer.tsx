'use client';

import React from 'react';
import Link from 'next/link';
import logo from '@/assets/logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF9F6] border-t border-zinc-200 text-zinc-700 text-xs select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
        {/* Brand Logo & Description */}
        <div className="max-w-md space-y-3">
          <Link href="/" className="inline-flex items-center gap-2">
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
        </div>

        {/* Links: Contact Us, Terms of Use, Privacy Policy */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8 text-xs font-semibold text-zinc-600 pt-2">
          <Link href="/" className="hover:text-[#7533CB] transition-colors">
            Contact Us
          </Link>
          <Link href="/" className="hover:text-[#7533CB] transition-colors">
            Terms of Use
          </Link>
          <Link href="/" className="hover:text-[#7533CB] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-zinc-200/80 bg-white py-4 px-4 sm:px-8 text-center text-[11px] text-zinc-500">
        <p>© 2026 <strong>METRO BAZAR</strong>. All rights reserved.</p>
      </div>
    </footer>
  );
};
