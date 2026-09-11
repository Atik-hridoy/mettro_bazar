'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Home,
  Briefcase,
  MapPinIcon,
  Loader2,
  Check,
} from 'lucide-react';
import { useCartStore, Address } from '@/store/useCartStore';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const { addAddress, user } = useCartStore();

  const [selectedLabel, setSelectedLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [streetAddress, setStreetAddress] = useState('');
  const [area, setArea] = useState('Rangpur');
  const [city, setCity] = useState('Rangpur');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!streetAddress.trim()) {
      setErrorMsg('Please enter your street address / house & road number.');
      return;
    }

    setIsSaving(true);
    const fullDetails = `${streetAddress.trim()}${area ? `, ${area.trim()}` : ''}${city ? `, ${city.trim()}` : ''}`;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: selectedLabel,
      details: fullDetails,
      city: city || 'Rangpur',
      phone: user?.phone || '',
    };

    try {
      const { saveAddressToBackend } = await import('@/lib/api');
      await saveAddressToBackend({
        title: selectedLabel,
        address_type: selectedLabel.toLowerCase(),
        street_address: streetAddress.trim(),
        area: area.trim() || 'Rangpur',
        city: city.trim() || 'Rangpur',
        is_default: true,
      });
    } catch (err: any) {
      console.error('Failed to save address to backend:', err);
    } finally {
      setIsSaving(false);
    }

    addAddress(newAddr);
    onClose();
  };

  const labels = [
    { name: 'Home' as const, icon: Home },
    { name: 'Work' as const, icon: Briefcase },
    { name: 'Other' as const, icon: MapPinIcon },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Clean Single Card Modal (matching Profile View style) */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 border border-zinc-200 p-6 select-none">
        {/* Header & Close */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7533CB] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900">Add Delivery Address</h2>
              <p className="text-xs text-zinc-500">Enter your delivery location details below</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Label Buttons */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-2">
              Address Type / Label
            </label>
            <div className="flex items-center gap-2.5">
              {labels.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedLabel === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setSelectedLabel(item.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'border-[#7533CB] bg-purple-50 text-[#7533CB] shadow-xs'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-zinc-50/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Full Street Address */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1">
              Full Address (House #, Road #, Street) <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              required
              rows={2}
              placeholder="e.g. 12 Sourovi Building, Dhap Jummapara"
              className="w-full px-3 py-2.5 border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB] focus:ring-1 focus:ring-[#7533CB]"
            />
          </div>

          {/* Area & City Split */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                Area / Neighborhood <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
                placeholder="e.g. Rangpur / Badda"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-800 mb-1">
                City / District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                placeholder="e.g. Rangpur / Dhaka"
                className="w-full px-3 py-2.5 border border-zinc-300 rounded-xl text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 hover:bg-zinc-100 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Address</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
