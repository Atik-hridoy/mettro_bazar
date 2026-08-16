'use client';

import React from 'react';
import { ShoppingBag, Wallet, Bike, HandCoins } from 'lucide-react';
import { CHALDAL_FEATURE_CARDS } from '@/lib/constants';

const ICON_COMPONENTS: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag className="w-6 h-6 text-zinc-800" />,
  Wallet: <Wallet className="w-6 h-6 text-zinc-800" />,
  Bike: <Bike className="w-6 h-6 text-zinc-800" />,
  HandCoins: <HandCoins className="w-6 h-6 text-zinc-800" />,
};

export const FeatureCards: React.FC = () => {
  return (
    <section className="w-full py-6 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CHALDAL_FEATURE_CARDS.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3.5 p-4 bg-[#F9F9F9] hover:bg-white border border-zinc-200/90 rounded-lg shadow-2xs hover:shadow-sm transition-all"
          >
            <div className="shrink-0 text-zinc-800">
              {ICON_COMPONENTS[card.iconName]}
            </div>

            <div className="text-xs text-zinc-700 leading-snug">
              {card.id === 'feat-1' && (
                <span>
                  <strong className="font-bold text-zinc-900">+15000 products</strong> to shop from
                </span>
              )}
              {card.id === 'feat-2' && (
                <span>
                  Pay <strong className="font-bold text-zinc-900">after</strong> receiving products
                </span>
              )}
              {card.id === 'feat-3' && (
                <span>
                  Get your delivery within <strong className="font-bold text-zinc-900">1 hour</strong>
                </span>
              )}
              {card.id === 'feat-4' && (
                <span>
                  Get offers that <strong className="font-bold text-zinc-900">Save Money</strong>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
