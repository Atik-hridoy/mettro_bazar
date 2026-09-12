'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MapPin, Truck, HelpCircle } from 'lucide-react';

const DELIVERY_CITIES = ['Rangpur'];

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
    a: 'We deliver from 8:00 AM to 10:00 PM every day across all serviceable areas in Rangpur.'
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
      <div className="relative pt-12 pb-16 overflow-hidden bg-white">
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

        {/* Metro Bazar Rangpur Delivery Rider Hero Graphic - Full Width (No Shadow, No Hover) */}
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 pt-2">
          <div className="relative w-full overflow-hidden">
            <img
              src="/delivery_rider.jpg"
              alt="মেট্রোবাজার - আপনার পরিবারের দৈনন্দিন চাহিদা"
              className="w-full h-auto object-contain"
            />
          </div>
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
