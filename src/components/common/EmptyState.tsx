'use client';

import React from 'react';
import Link from 'next/link';
import { PackageX, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  titleBn?: string;
  description?: string;
  descriptionBn?: string;
  actionText?: string;
  actionTextBn?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  titleBn,
  description,
  descriptionBn,
  actionText,
  actionTextBn,
  actionHref,
  onAction,
  className = '',
}) => {
  const { language } = useCartStore();
  const isBN = language === 'BN';

  const displayTitle = isBN
    ? titleBn || title || 'কোনো তথ্য পাওয়া যায়নি'
    : title || 'No Items Available';

  const displayDescription = isBN
    ? descriptionBn || description || 'বর্তমানে এই তালিকায় কোনো পণ্য বা তথ্য যুক্ত করা হয়নি।'
    : description || 'There are currently no items available in this section.';

  const displayActionText = isBN
    ? actionTextBn || actionText || 'হোম পেজে ফিরে যান'
    : actionText || 'Return to Home';

  return (
    <div
      className={`w-full py-12 px-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-zinc-50/80 to-purple-50/30 border border-zinc-200/80 rounded-2xl shadow-2xs animate-in fade-in zoom-in-95 duration-200 select-none ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-purple-100/80 text-[#7533CB] flex items-center justify-center mb-4 shadow-2xs border border-purple-200/50">
        {icon || <PackageX className="w-8 h-8 text-[#7533CB]" />}
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-zinc-900 mb-1.5 tracking-tight">
        {displayTitle}
      </h3>

      <p className="text-xs sm:text-sm text-zinc-500 max-w-md mb-6 leading-relaxed">
        {displayDescription}
      </p>

      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold rounded-lg shadow-md transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>{displayActionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold rounded-lg shadow-md transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>{displayActionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      ) : null}
    </div>
  );
};
