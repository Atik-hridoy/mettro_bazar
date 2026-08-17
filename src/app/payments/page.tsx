'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Wallet, History, CreditCard, ShieldCheck } from 'lucide-react';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function PaymentHistoryPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('Aug');

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-8 py-6 pb-28 max-w-5xl">
      {/* 1. Title & Year Selector matching Screenshot */}
      <div className="mb-6">
        <h1 className="text-2xl font-light text-zinc-700 tracking-tight mb-2">
          Payment History
        </h1>

        <div className="relative inline-block">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="appearance-none bg-white border border-zinc-300 hover:border-zinc-400 text-xs font-semibold text-zinc-700 py-1.5 pl-3 pr-8 rounded focus:outline-none focus:border-[#7533CB] cursor-pointer"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. Available Balance Card matching Chaldal 1:1 */}
      <div className="bg-white border border-zinc-200 rounded-lg p-5 sm:p-6 mb-6 shadow-2xs">
        <div className="mb-6">
          <span className="text-base sm:text-lg font-light text-zinc-600">
            Available Balance
          </span>
          <div className="text-3xl font-light text-emerald-600 my-1">
            ৳0
          </div>
          <button className="text-xs text-zinc-500 hover:text-[#7533CB] flex items-center gap-0.5 cursor-pointer">
            <span>Details</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Bottom Sub-balances */}
        <div className="flex items-center gap-12 sm:gap-24 pt-4 border-t border-zinc-100 text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <span>Account Balance</span>
            <strong className="text-zinc-800">৳0</strong>
          </div>
          <div className="flex items-center gap-3">
            <span>Balance on hold</span>
            <strong className="text-zinc-800">৳0</strong>
          </div>
        </div>
      </div>

      {/* 3. Monthly Filter Tabs Bar */}
      <div className="border-b border-zinc-200 flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar mb-8">
        {MONTHS.map((month) => {
          const isSelected = selectedMonth === month;

          return (
            <button
              key={month}
              onClick={() => setSelectedMonth(month)}
              className={`pb-2.5 text-xs sm:text-sm transition-colors relative font-normal cursor-pointer whitespace-nowrap ${
                isSelected
                  ? 'text-[#7533CB] font-bold'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              {month}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7533CB] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Transactions State: Clean Centered "No transactions" */}
      <div className="py-24 text-center">
        <p className="text-sm font-light text-zinc-400 select-none">
          No transactions
        </p>
      </div>
    </div>
  );
}
