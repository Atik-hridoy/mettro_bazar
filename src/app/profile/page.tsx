'use client';

import React, { useState } from 'react';
import { MapPin, Plus, Check, Pencil, Trash2, Sparkles, Mail } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { AddressModal } from '@/components/common/AddressModal';

export default function ProfilePage() {
  const { user, savedAddresses } = useCartStore();

  const [name, setName] = useState(user?.phone || '01333410106');
  const [email, setEmail] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [gender, setGender] = useState('--Select Gender--');
  const [dob, setDob] = useState('');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const phone = user?.phone ? `+88${user.phone.replace('+88', '')}` : '+8801333410106';

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsEmailVerified(true);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-8 py-6 pb-28 max-w-4xl">
      {/* 1. Large Light Title matching Screenshot */}
      <h1 className="text-2xl sm:text-3xl font-light text-zinc-600 tracking-tight mb-8">
        Your Profile
      </h1>

      {/* 2. Profile Details Form */}
      <div className="space-y-6 max-w-xl">
        {/* Name */}
        <div>
          <label className="block text-xs text-zinc-400 font-normal mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm font-medium text-zinc-800 border-b border-zinc-200 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent"
          />
        </div>

        {/* Email with Verification Incentive Banner */}
        <div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mb-1.5">
            <span>🌾</span>
            <span>Verify your email address & Get <strong>1 free delivery</strong></span>
          </div>

          <div className="relative flex items-center border-b border-zinc-200 pb-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none bg-transparent pr-20"
            />
            <button
              onClick={handleVerifyEmail}
              type="button"
              className={`px-4 py-1.5 text-xs font-bold rounded transition-colors uppercase cursor-pointer ${
                isEmailVerified
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#7533CB] hover:bg-[#632AAD] text-white shadow-2xs'
              }`}
            >
              {isEmailVerified ? 'Verified' : 'VERIFY'}
            </button>
          </div>
        </div>

        {/* Phone Number (Disabled/Read-only style) */}
        <div>
          <label className="block text-xs text-zinc-400 font-normal mb-1.5">
            Phone Number
          </label>
          <div className="w-full bg-zinc-100 text-zinc-600 text-sm font-medium px-3.5 py-2.5 rounded-md border border-zinc-200/80">
            {phone}
          </div>
        </div>

        {/* Gender Dropdown */}
        <div>
          <label className="block text-xs text-zinc-400 font-normal mb-1">
            Gender
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full text-sm text-zinc-800 border-b border-zinc-200 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent cursor-pointer"
          >
            <option value="--Select Gender--">--Select Gender--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs text-zinc-400 font-normal mb-1">
            Date of Birth (YYYY-MM-DD)
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full text-sm text-zinc-800 border-b border-zinc-200 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent"
          />
        </div>
      </div>

      {/* 3. Address Book Section matching Chaldal 1:1 */}
      <div className="mt-10 max-w-xl">
        <div className="border border-zinc-200 rounded-lg overflow-hidden shadow-2xs">
          {/* Header */}
          <div className="bg-zinc-50/90 px-4 py-3 border-b border-zinc-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#7533CB]" />
            <h2 className="text-xs font-bold text-zinc-800 uppercase tracking-wide">
              Address Book
            </h2>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* + New Address Button */}
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="w-full py-3 border border-zinc-300 hover:border-[#7533CB] hover:bg-purple-50/20 rounded-md text-zinc-700 hover:text-[#7533CB] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Address</span>
            </button>

            {/* Saved Addresses List */}
            {savedAddresses.map((addr) => (
              <div
                key={addr.id}
                className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/40 flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900">{addr.label}</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      Default
                    </span>
                  </div>
                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {addr.details}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-medium">
                    Phone: {addr.phone}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-zinc-400">
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="p-1 hover:text-[#7533CB] rounded transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Add/Edit Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
}
