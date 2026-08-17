'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Truck, HelpCircle } from 'lucide-react';

const DELIVERY_CITIES = ['Dhaka', 'Chattogram', 'Jashore'];

const FAQS = [
  {
    q: 'How does the site work?',
    a: 'You can browse the site or use our search engine to find your desired products. You can then add them to your shopping bag and click on checkout. You can then select a delivery address and preferred delivery time. A delivery rider will deliver your order directly to your door.'
  },
  {
    q: 'How much do deliveries cost?',
    a: 'Delivery fee is ৳49 for orders below ৳1000. Orders of ৳1000 and above qualify for Free Delivery!'
  },
  {
    q: 'How can I contact you?',
    a: 'You can always call our hotline at 16710 or email us at support@metrobazar.com. You can also chat with our live customer support team.'
  },
  {
    q: 'What are your delivery hours?',
    a: 'We deliver from 8:00 AM to 10:00 PM every day across all serviceable areas in Dhaka, Chattogram, and Jashore.'
  },
  {
    q: 'How do I pay?',
    a: 'We accept Cash on Delivery (COD), bKash, Nagad, Visa, Mastercard, and American Express debit/credit cards.'
  },
  {
    q: 'What is your return policy?',
    a: 'If you are dissatisfied with any product, you can return it to our delivery rider immediately or contact customer care within 7 days for a hassle-free replacement or refund.'
  }
];

export const GuestBottomSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="w-full bg-white pb-20 select-none">
      {/* 1. Currently Delivering in Section matching Screenshot */}
      <div className="relative pt-12 pb-24 overflow-hidden bg-linear-to-b from-white via-purple-50/20 to-amber-50/30">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-8">
            Currently Delivering in
          </h2>

          {/* City Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-16">
            {DELIVERY_CITIES.map((city) => (
              <button
                key={city}
                className="px-8 sm:px-10 py-3 sm:py-3.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-sm sm:text-base font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-w-[130px] sm:min-w-[150px]"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Skyline & Delivery Rider Illustration Graphic */}
        <div className="w-full max-w-5xl mx-auto px-4 flex justify-center opacity-85 pointer-events-none">
          <svg
            viewBox="0 0 1000 320"
            className="w-full h-auto max-h-64 object-contain"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Background skyline silhouette */}
            <path
              d="M0,280 L40,280 L40,160 L90,160 L90,280 L140,280 L140,120 L200,120 L200,280 L250,280 L250,180 L290,180 L290,280 L350,280 L350,90 L420,90 L420,280 L500,280 L500,140 L560,140 L560,280 L620,280 L620,110 L680,110 L680,280 L750,280 L750,150 L810,150 L810,280 L880,280 L880,130 L940,130 L940,280 L1000,280 L1000,320 L0,320 Z"
              fill="#FDEED9"
            />
            {/* Midground buildings */}
            <path
              d="M80,280 L120,280 L120,210 L160,210 L160,280 L300,280 L300,230 L340,230 L340,280 L600,280 L600,200 L650,200 L650,280 L780,280 L780,220 L840,220 L840,280 L960,280 L960,320 L0,320 Z"
              fill="#F8DCBF"
            />
            {/* Ground line */}
            <rect x="0" y="280" width="1000" height="40" fill="#F0C8A0" />

            {/* Delivery Rider on Scooter Graphic */}
            <g transform="translate(440, 150) scale(0.9)">
              {/* Scooter body */}
              <circle cx="50" cy="110" r="22" fill="#333" />
              <circle cx="50" cy="110" r="12" fill="#fff" />
              <circle cx="160" cy="110" r="22" fill="#333" />
              <circle cx="160" cy="110" r="12" fill="#fff" />
              <path d="M50,110 L90,110 L120,70 L160,110" stroke="#7533CB" strokeWidth="10" fill="none" strokeLinecap="round" />
              <rect x="25" y="45" width="45" height="45" rx="6" fill="#F48FB1" />
              <rect x="30" y="50" width="35" height="35" rx="4" fill="#EC407A" />

              {/* Rider with helmet & groceries */}
              <circle cx="120" cy="15" r="18" fill="#FFA726" />
              <circle cx="120" cy="20" r="14" fill="#FFCC80" />
              <path d="M105,38 C105,38 120,32 135,38 L140,75 L95,75 Z" fill="#FFE082" />
              <path d="M125,45 L155,55" stroke="#FFE082" strokeWidth="8" strokeLinecap="round" />
              {/* Handlebar */}
              <path d="M150,45 L165,65" stroke="#333" strokeWidth="6" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>

      {/* 2. Common Questions (FAQ) Section matching Screenshot */}
      <div className="max-w-3xl mx-auto px-4 pt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight text-center mb-8">
          Common Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={faq.q}
                className="border border-zinc-200 rounded-lg overflow-hidden transition-all bg-white hover:border-zinc-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-zinc-800">
                    {faq.q}
                  </span>
                  <div className="text-zinc-400 shrink-0">
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#7533CB]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
