'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, PhoneCall, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';

export const Footer: React.FC = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

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

          {/* Quick Contact Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-zinc-200 text-zinc-800 text-[11px] font-semibold hover:border-[#7533CB] hover:text-[#7533CB] transition shadow-2xs cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-purple-600" />
              <span>support@metrobazar.online</span>
            </button>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold hover:bg-emerald-100 transition shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
              <span>01752084015</span>
            </button>
          </div>
        </div>

        {/* Links: Contact Us, Terms of Use, Privacy Policy */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8 text-xs font-semibold text-zinc-600 pt-2">
          <button
            onClick={() => setIsContactModalOpen(true)}
            className="hover:text-[#7533CB] transition-colors font-bold flex items-center gap-1 text-zinc-900 cursor-pointer"
          >
            <span>Contact Us</span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
          <Link href="/" className="hover:text-[#7533CB] transition-colors">
            Terms of Use
          </Link>
          <Link href="/" className="hover:text-[#7533CB] transition-colors">
            Privacy Policy
          </Link>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-zinc-200/80 bg-white py-4 px-4 sm:px-8 text-center text-[11px] text-zinc-500 space-y-1">
        <p>© 2026 <strong>METRO BAZAR</strong>. All rights reserved.</p>
        <p className="text-[10px] text-zinc-400">
          Developed and maintained by{' '}
          <a
            href="https://innovationark.co"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#7533CB] hover:underline"
          >
            innovationark.co
          </a>
        </p>
      </div>

      {/* Contact Us Interactive Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setIsContactModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 z-10 p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                  📞
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-zinc-900">
                    যোগাযোগ করুন (Contact Support)
                  </h3>
                  <p className="text-xs text-zinc-500">
                    সরাসরি ইমেইল বা হোয়াটসঅ্যাপ অ্যাপের মাধ্যমে আমাদের টিমকে পান
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Options List */}
            <div className="space-y-3">
              {/* Option 1: WhatsApp */}
              <a
                href="https://wa.me/8801752084015?text=Hello%20Metro%20Bazar%20Support!%20I%20have%20a%20query."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      WhatsApp Chat
                    </div>
                    <div className="text-sm font-extrabold text-zinc-900">
                      01752084015
                    </div>
                    <div className="text-[11px] text-emerald-700 font-medium">
                      হোয়াটসঅ্যাপে সরাসরি মেসেজ দিন
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-emerald-200/60 text-emerald-800 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>

              {/* Option 2: Email Support */}
              <a
                href="mailto:support@metrobazar.online?subject=Support%20Inquiry%20-%20Metro%20Bazar"
                className="group flex items-center justify-between p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                      Email Support
                    </div>
                    <div className="text-sm font-extrabold text-zinc-900">
                      support@metrobazar.online
                    </div>
                    <div className="text-[11px] text-purple-700 font-medium">
                      ইমেইল পাঠান (Send Mail)
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-purple-200/60 text-purple-800 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>

              {/* Option 3: Phone Call */}
              <a
                href="tel:01752084015"
                className="group flex items-center justify-between p-4 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 transition cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-zinc-800 text-white flex items-center justify-center shadow-md">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Phone Call
                    </div>
                    <div className="text-sm font-extrabold text-zinc-900">
                      01752084015
                    </div>
                    <div className="text-[11px] text-zinc-600 font-medium">
                      সরাসরি ফোন কল করুন (Call Now)
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-200/60 text-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 group-hover:text-white transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            </div>

            {/* Modal Footer */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                বন্ধ করুন (Close Window)
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

