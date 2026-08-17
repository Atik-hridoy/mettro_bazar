'use client';

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Search,
  Crosshair,
  Pencil,
  Info,
  Home,
  Briefcase,
  Heart,
  MapPinIcon,
} from 'lucide-react';
import { useCartStore, Address } from '@/store/useCartStore';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose }) => {
  const { addAddress, user } = useCartStore();

  const [streetAddress, setStreetAddress] = useState(
    'House Cha 71/2, Matabbar, Uttar Badda, Badda, Dhaka'
  );
  const [floorNo, setFloorNo] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [name, setName] = useState(user?.phone || '01333410106');
  const [phone, setPhone] = useState(user?.phone || '01333410106');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [selectedLabel, setSelectedLabel] = useState<'Home' | 'Work' | 'Partner' | 'Other'>('Home');
  const [isEditingStreet, setIsEditingStreet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fullDetails = `${streetAddress}${floorNo ? `, Floor ${floorNo}` : ''}${
      flatNo ? `, Flat ${flatNo}` : ''
    }${deliveryNotes ? ` (${deliveryNotes})` : ''}`;

    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      label: selectedLabel,
      details: fullDetails,
      city: 'Dhaka',
      phone: phone,
    };

    addAddress(newAddr);
    onClose();
  };

  const labels = [
    { name: 'Home' as const, icon: Home },
    { name: 'Work' as const, icon: Briefcase },
    { name: 'Partner' as const, icon: Heart },
    { name: 'Other' as const, icon: MapPinIcon },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card matching Chaldal 1:1 */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 border border-zinc-200 grid grid-cols-1 md:grid-cols-12 max-h-[92vh] select-none">
        {/* Left Column: Interactive Map Preview (7 cols) */}
        <div className="md:col-span-6 lg:col-span-7 bg-[#E8ECEF] relative flex flex-col justify-between overflow-hidden min-h-[300px] md:min-h-[520px]">
          {/* Top Search Overlay */}
          <div className="absolute top-3 left-3 right-3 z-20">
            <div className="relative flex items-center bg-white rounded-full shadow-md border border-zinc-200 px-3 py-2 text-xs">
              <Search className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your address here"
                className="w-full bg-transparent text-zinc-800 placeholder:text-zinc-400 focus:outline-none text-xs"
              />
              <button
                type="button"
                className="p-1 text-purple-600 hover:text-purple-800 shrink-0"
                title="Current Location"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Map Graphic Simulation */}
          <div className="w-full h-full relative flex items-center justify-center bg-[#E5E3DF] overflow-hidden">
            {/* Stylized Dhaka Map Graphic */}
            <div className="absolute inset-0 opacity-90">
              <svg
                viewBox="0 0 600 600"
                className="w-full h-full object-cover"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background grid / land */}
                <rect width="600" height="600" fill="#f2efe9" />
                {/* River / Water body */}
                <path
                  d="M160,0 C170,120 150,220 170,300 C190,380 180,480 160,600 L210,600 C230,480 240,380 220,300 C200,220 220,120 210,0 Z"
                  fill="#aad3df"
                />
                {/* Roads */}
                <path d="M0,80 L600,100 M0,200 L600,180 M0,380 L600,410 M0,500 L600,490" stroke="#ffffff" strokeWidth="12" />
                <path d="M0,80 L600,100 M0,200 L600,180 M0,380 L600,410 M0,500 L600,490" stroke="#fcd6a4" strokeWidth="6" />
                <path d="M100,0 L120,600 M320,0 L300,600 M450,0 L480,600 M260,0 L280,600" stroke="#ffffff" strokeWidth="14" />
                <path d="M100,0 L120,600 M320,0 L300,600 M450,0 L480,600 M260,0 L280,600" stroke="#ffeb99" strokeWidth="8" />
                {/* Secondary roads */}
                <path d="M220,240 L600,260 M220,340 L600,320 M0,280 L160,290" stroke="#ffffff" strokeWidth="6" />
                {/* Labels */}
                <text x="320" y="220" fill="#777" fontSize="13" fontWeight="bold">Shahjadpur</text>
                <text x="350" y="320" fill="#888" fontSize="11">Badda</text>
                <text x="370" y="440" fill="#c00" fontSize="11" fontWeight="bold">+ Badda General Hospital</text>
              </svg>
            </div>

            {/* Centered Map Pin "Deliver Here" matching Screenshot */}
            <div className="absolute z-10 flex flex-col items-center -translate-y-6">
              <span className="bg-[#4A235A] text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md mb-1 whitespace-nowrap animate-bounce">
                Deliver Here
              </span>
              <div className="w-8 h-8 rounded-full bg-[#7533CB] text-white flex items-center justify-center shadow-lg ring-4 ring-purple-200">
                <MapPin className="w-5 h-5 fill-white text-[#7533CB]" />
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-20 bg-zinc-100/95 backdrop-blur-xs rounded-lg p-2.5 flex items-center gap-2 border border-zinc-200 text-xs text-zinc-700 shadow-sm">
            <div className="w-5 h-5 rounded-md bg-[#7533CB] text-white flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] leading-tight">
              Drag the pin in the map to select your delivery area
            </span>
          </div>
        </div>

        {/* Right Column: Address Form (5 cols) */}
        <div className="md:col-span-6 lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[85vh]">
          <form onSubmit={handleSave} className="space-y-3.5 text-xs">
            {/* Header & Close */}
            <div className="flex items-center justify-between pb-1">
              <h2 className="text-base font-bold text-zinc-900">Add new address</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Detected Address Box with Edit */}
            <div className="flex items-start gap-2.5 p-3 rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="w-6 h-6 rounded-full bg-[#7533CB] text-white flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                {isEditingStreet ? (
                  <textarea
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    rows={2}
                    className="w-full text-xs text-zinc-800 p-1 border border-purple-300 rounded focus:outline-none"
                    autoFocus
                  />
                ) : (
                  <p className="text-xs text-zinc-800 font-medium leading-relaxed">
                    {streetAddress}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsEditingStreet(!isEditingStreet)}
                className="text-[#7533CB] hover:text-[#632AAD] p-1 shrink-0"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            {/* Floor No & Flat No Split */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                  Floor No
                </label>
                <input
                  type="text"
                  value={floorNo}
                  onChange={(e) => setFloorNo(e.target.value)}
                  placeholder="e.g. 4th"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                  Flat No
                </label>
                <input
                  type="text"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  placeholder="e.g. 4B"
                  className="w-full px-3 py-2 border border-zinc-300 rounded-md text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB]"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-zinc-300 rounded-md text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                Phone Number
              </label>
              <div className="flex items-center border border-zinc-300 rounded-md px-3 py-1.5 focus-within:border-[#7533CB]">
                <span className="text-zinc-500 font-medium text-xs mr-2">+88</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full text-zinc-800 text-xs focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Delivery Notes */}
            <div>
              <label className="block text-[11px] text-zinc-500 font-medium mb-1">
                Delivery Notes
              </label>
              <input
                type="text"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
                placeholder="E.g: Drop at door, Don't ring bell, Next to Masjid etc"
                className="w-full px-3 py-2 border border-zinc-300 rounded-md text-zinc-800 text-xs focus:outline-none focus:border-[#7533CB] placeholder:text-zinc-400"
              />
            </div>

            {/* Add a label */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-zinc-900 mb-2">
                Add a label
              </label>
              <div className="flex items-center gap-3">
                {labels.map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedLabel === item.name;

                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setSelectedLabel(item.name)}
                      className="flex flex-col items-center gap-1 cursor-pointer group"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-2 border-[#7533CB] bg-purple-50 text-[#7533CB] shadow-xs'
                            : 'border border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? 'text-[#7533CB]' : 'text-zinc-500'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[11px] ${
                          isSelected ? 'font-bold text-[#7533CB]' : 'text-zinc-600'
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button matching Chaldal 1:1 */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-sm rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
