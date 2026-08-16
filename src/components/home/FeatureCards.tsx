'use client';

import React from 'react';
import { Zap, ShoppingBag, Percent, ShieldCheck } from 'lucide-react';
import { FEATURE_CARDS } from '@/lib/constants';

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  Zap: <Zap className="w-5 h-5 text-[#FF5252]" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5 text-[#6A1B9A]" />,
  Percent: <Percent className="w-5 h-5 text-[#FF5252]" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-[#6A1B9A]" />,
};

export const FeatureCards: React.FC = () => {
  return (
    <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto border-b border-zinc-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3 p-3 bg-zinc-50/70 border border-zinc-200 rounded-sm"
          >
            <div className="shrink-0 p-2 bg-white rounded-sm border border-zinc-200">
              {ICON_COMPONENTS[card.iconName]}
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-semibold text-zinc-900 truncate">
                {card.title}
              </h3>
              <p className="text-[11px] text-zinc-500 line-clamp-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
