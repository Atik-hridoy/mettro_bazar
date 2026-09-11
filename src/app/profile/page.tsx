'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  User,
  Building,
  Globe,
  X,
  Home,
  Briefcase,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import {
  fetchUserProfileFromBackend,
  updateUserProfileOnBackend,
  fetchAddressesFromBackend,
  saveAddressToBackend,
  deleteAddressFromBackend,
} from '@/lib/api';

export default function ProfilePage() {
  const { user, language, setLanguage, loginUser } = useCartStore();

  // Profile Form States
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const initialPhone = user?.phone && !user.phone.includes('@') ? user.phone : '';
  const [phone, setPhone] = useState(initialPhone);
  const [gender, setGender] = useState('--Select Gender--');
  const [dob, setDob] = useState('');

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Address Section States (Backend Integrated, Plain Line Listing)
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | string | null>(null);

  // Address Form Inputs
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrType, setAddrType] = useState('home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('Banani');
  const [addrCity, setAddrCity] = useState('Dhaka');
  const [isSavingAddr, setIsSavingAddr] = useState(false);
  const [addrFeedback, setAddrFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Bilingual UI Translations Dictionary (EN / BN)
  const isBN = language === 'BN';
  const t = {
    pageTitle: isBN ? 'আপনার প্রোফাইল' : 'Your Profile',
    pageSubtitle: isBN
      ? 'আপনার ব্যক্তিগত তথ্য, যোগাযোগের ঠিকানা এবং ডেলিভারি অ্যাড্রেস আপডেট করুন।'
      : 'Manage your personal details, contact information, and delivery addresses.',
    firstName: isBN ? 'নামের প্রথম অংশ' : 'First Name',
    lastName: isBN ? 'নামের শেষ অংশ' : 'Last Name',
    firstNamePlaceholder: isBN ? 'যেমন: হৃদয়' : 'Enter First Name',
    lastNamePlaceholder: isBN ? 'যেমন: আহমেদ' : 'Enter Last Name',
    email: isBN ? 'ইমেইল ঠিকানা' : 'Email Address',
    emailHint: isBN
      ? 'ইমেইল ঠিকানা ভেরিফাই করুন এবং ১টি ফ্রি ডেলিভারি পান'
      : 'Verify your email address & Get 1 free delivery',
    emailPlaceholder: isBN ? 'user@example.com' : 'user@example.com',
    verifyBtn: isBN ? 'ভেরিফাই' : 'VERIFY',
    verifiedBtn: isBN ? 'ভেরিফাইড' : 'Verified',
    phone: isBN ? 'ফোন নম্বর' : 'Phone Number',
    phonePlaceholder: isBN ? 'যেমন: 01700000000' : 'e.g. 01700000000',
    genderLabel: isBN ? 'লিঙ্গ নির্বাচন' : 'Gender Selection',
    genderDefault: isBN ? '--লিঙ্গ নির্বাচন করুন--' : '--Select Gender--',
    genderMale: isBN ? 'পুরুষ' : 'Male',
    genderFemale: isBN ? 'মহিলা' : 'Female',
    genderOther: isBN ? 'অন্যান্য' : 'Other',
    dobLabel: isBN ? 'জন্ম তারিখ (YYYY-MM-DD)' : 'Date of Birth (YYYY-MM-DD)',
    saveBtn: isBN ? 'প্রোফাইল আপডেট করুন' : 'Save Profile Changes',
    savingBtn: isBN ? 'সংরক্ষিত হচ্ছে...' : 'Saving to Backend...',
    
    // Address Section Translations
    addrSectionTitle: isBN ? 'সংরক্ষিত ডেলিভারি ঠিকানা সূচি' : 'Saved Delivery Address Book',
    addAddrBtn: isBN ? '+ নতুন ডেলিভারি ঠিকানা যোগ করুন' : '+ Add Delivery Address',
    cancelAddrBtn: isBN ? 'বাতিল' : 'Cancel',
    saveAddrBtn: isBN ? 'ঠিকানা সংরক্ষণ করুন' : 'Save Address',
    addrTitleLabel: isBN ? 'ঠিকানার ধরন / লেবেল' : 'Address Title / Label',
    addrHome: isBN ? 'বাসা (Home)' : 'Home',
    addrWork: isBN ? 'অফিস (Work)' : 'Work/Office',
    addrOther: isBN ? 'অন্যান্য (Other)' : 'Other',
    addrStreetLabel: isBN ? 'সম্পূর্ণ ঠিকানা (বাসা #, রোড #, এরিয়া, জেলা)' : 'Full Address (House #, Road #, Area, District)',
    addrStreetHint: isBN
      ? 'যেমন: বাসা #১২, রোড #৪, ব্লক বি, বনানী, ঢাকা'
      : 'e.g. House #12, Road #4, Block B, Banani, Dhaka',
    addrCityLabel: isBN ? 'জেলা / শহর' : 'District / City',
    addrAreaLabel: isBN ? 'এরিয়া / এলাকা' : 'Area / Neighborhood',
    noAddresses: isBN
      ? 'আপনার কোনো সংরক্ষিত ঠিকানা পাওয়া যায়নি। নিচে সরাসরি নতুন ঠিকানা লিখুন।'
      : 'No saved delivery addresses found. Add a new address below.',
    defaultBadge: isBN ? 'ডিফল্ট' : 'Default',
    editBtn: isBN ? 'সম্পাদনা' : 'Edit',
    deleteBtn: isBN ? 'মুছুন' : 'Delete',
  };

  // Load Profile and Addresses on Component Mount
  useEffect(() => {
    async function loadData() {
      setIsLoadingProfile(true);
      setIsLoadingAddresses(true);

      try {
        const profileData = await fetchUserProfileFromBackend();
        if (profileData) {
          const fn = profileData.first_name || user?.firstName || '';
          const ln = profileData.last_name || user?.lastName || '';
          setFirstName(fn);
          setLastName(ln);
          setEmail(profileData.email || user?.email || '');
          setPhone(profileData.phone_number || '');
          if (profileData.gender) setGender(profileData.gender);
          if (profileData.date_of_birth) setDob(profileData.date_of_birth);

          // Sync store if name updated from backend
          if (user?.isLoggedIn && (fn !== user.firstName || ln !== user.lastName)) {
            loginUser(profileData.phone_number || user.email || '', `${fn} ${ln}`.trim(), {
              firstName: fn,
              lastName: ln,
              email: profileData.email || user.email || '',
              phone: profileData.phone_number || '',
            });
          }
        } else if (user) {
          setFirstName(user.firstName || '');
          setLastName(user.lastName || '');
          setEmail(user.email || '');
          setPhone(user.phone && !user.phone.includes('@') ? user.phone : '');
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setIsLoadingProfile(false);
      }

      try {
        const addrList = await fetchAddressesFromBackend();
        setAddresses(addrList);
      } catch (err) {
        console.error('Failed to load addresses:', err);
      } finally {
        setIsLoadingAddresses(false);
      }
    }

    loadData();
  }, []);

  // Save Profile Form Submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback(null);

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        gender: gender !== '--Select Gender--' && gender !== '--লিঙ্গ নির্বাচন করুন--' ? gender : '',
        date_of_birth: dob || undefined,
      };

      const updated = await updateUserProfileOnBackend(payload);
      setProfileFeedback({
        type: 'success',
        text: isBN
          ? 'আপনার প্রোফাইল তথ্য ডাটাবেসে সফলভাবে আপডেট করা হয়েছে!'
          : 'Your profile details have been successfully updated in the database!',
      });

      if (updated) {
        const fn = updated.first_name !== undefined ? (updated.first_name || '') : firstName;
        const ln = updated.last_name !== undefined ? (updated.last_name || '') : lastName;
        setFirstName(fn);
        setLastName(ln);
        if (updated.email !== undefined) setEmail(updated.email || '');
        if (updated.phone_number) setPhone(updated.phone_number);
        if (updated.gender) setGender(updated.gender);
        if (updated.date_of_birth) setDob(updated.date_of_birth);

        // Update Zustand store
        loginUser(updated.phone_number || phone || email, `${fn} ${ln}`.trim(), {
          firstName: fn,
          lastName: ln,
          email: updated.email || email,
          phone: updated.phone_number || phone,
        });
      }
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setProfileFeedback({
        type: 'error',
        text: err.message || (isBN ? 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।' : 'Failed to update profile.'),
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Open Address Form for New or Edit
  const handleOpenAddrForm = (addr?: any) => {
    setAddrFeedback(null);
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrTitle(addr.title || 'Home');
      setAddrType(addr.address_type || 'home');
      setAddrStreet(addr.street_address || '');
      setAddrArea(addr.area || addr.city || '');
      setAddrCity(addr.city || '');
    } else {
      setEditingAddressId(null);
      setAddrTitle('Home');
      setAddrType('home');
      setAddrStreet('');
      setAddrArea('');
      setAddrCity('');
    }
    setShowAddressForm(true);
  };

  // Save Address Submission (No Location Picker, Direct Input)
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrFeedback(null);

    if (!addrStreet.trim()) {
      setAddrFeedback({
        type: 'error',
        text: isBN
          ? 'অনুগ্রহ করে সম্পূর্ণ ঠিকানার ঘরটি পূরণ করুন।'
          : 'Please enter your street address details.',
      });
      return;
    }

    setIsSavingAddr(true);

    try {
      const userCity = addrCity.trim() || 'Dhaka';
      const userArea = addrArea.trim() || userCity;

      const payload = {
        id: editingAddressId || undefined,
        title: addrTitle.trim() || 'Home',
        address_type: addrType,
        street_address: addrStreet.trim(),
        area: userArea,
        city: userCity,
        is_default: true,
      };

      await saveAddressToBackend(payload);
      const updatedList = await fetchAddressesFromBackend();
      setAddresses(updatedList);

      setShowAddressForm(false);
      setAddrStreet('');
      setAddrFeedback({
        type: 'success',
        text: isBN ? 'ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে!' : 'Address saved successfully!',
      });
    } catch (err: any) {
      console.error('Failed to save address:', err);
      const errText = err.message || (isBN ? 'ঠিকানা সংরক্ষণ করা যায়নি।' : 'Failed to save address.');
      setAddrFeedback({
        type: 'error',
        text: errText,
      });

      if (errText.toLowerCase().includes('session') || errText.toLowerCase().includes('token') || errText.toLowerCase().includes('log in')) {
        useCartStore.getState().setAuthModalOpen(true);
      }
    } finally {
      setIsSavingAddr(false);
    }
  };

  // Delete Address
  const handleDeleteAddress = async (id: number | string) => {
    if (
      !window.confirm(
        isBN ? 'আপনি কি নিশ্চিত যে এই ঠিকানাটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this address?'
      )
    ) {
      return;
    }

    try {
      await deleteAddressFromBackend(id);
      const updatedList = await fetchAddressesFromBackend();
      setAddresses(updatedList);
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] bg-white px-4 sm:px-8 py-6 pb-28 max-w-4xl">
      {/* Top Header with Language Switcher */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light text-zinc-800 tracking-tight flex items-center gap-2.5">
            <User className="w-7 h-7 text-[#7533CB]" />
            <span>{t.pageTitle}</span>
          </h1>
          <p className="text-xs text-zinc-500 mt-1">{t.pageSubtitle}</p>
        </div>

        {/* Language Toggle Button */}
        <button
          type="button"
          onClick={() => setLanguage(isBN ? 'EN' : 'BN')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7533CB] text-xs font-bold rounded-lg border border-purple-200 transition-colors cursor-pointer"
        >
          <Globe className="w-4 h-4 text-[#7533CB]" />
          <span>{isBN ? 'English (EN)' : 'বাংলা (BN)'}</span>
        </button>
      </div>

      {/* 1. PROFILE DETAILS FORM */}
      {isLoadingProfile ? (
        <div className="max-w-xl py-12 flex flex-col items-center justify-center text-zinc-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#7533CB]" />
          <span className="text-xs font-medium">
            {isBN ? 'ডাটাবেস থেকে তথ্য লোড করা হচ্ছে...' : 'Fetching profile details from backend...'}
          </span>
        </div>
      ) : (
        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-xl">
          {/* Profile Status Feedback */}
          {profileFeedback && (
            <div
              className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {profileFeedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{profileFeedback.text}</span>
            </div>
          )}

          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-zinc-500 font-semibold mb-1">{t.firstName}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={t.firstNamePlaceholder}
                className="w-full text-sm font-medium text-zinc-800 border-b border-zinc-300 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 font-semibold mb-1">{t.lastName}</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder={t.lastNamePlaceholder}
                className="w-full text-sm font-medium text-zinc-800 border-b border-zinc-300 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent"
              />
            </div>
          </div>

          {/* Email with Verification Incentive Banner */}
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mb-1.5">
              <span>🌾</span>
              <span>{t.emailHint}</span>
            </div>

            <div className="relative flex items-center border-b border-zinc-300 pb-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                className="w-full text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none bg-transparent pr-24"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (email) setIsEmailVerified(true);
                }}
                type="button"
                className={`px-4 py-1.5 text-xs font-bold rounded transition-colors uppercase cursor-pointer ${
                  isEmailVerified
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#7533CB] hover:bg-[#632AAD] text-white shadow-2xs'
                }`}
              >
                {isEmailVerified ? t.verifiedBtn : t.verifyBtn}
              </button>
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1">{t.phone}</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full text-sm font-medium text-zinc-800 border-b border-zinc-300 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent"
            />
          </div>

          {/* Gender Selection Dropdown */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1">{t.genderLabel}</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full text-sm text-zinc-800 border-b border-zinc-300 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent cursor-pointer"
            >
              <option value="--Select Gender--">{t.genderDefault}</option>
              <option value="Male">{t.genderMale}</option>
              <option value="Female">{t.genderFemale}</option>
              <option value="Other">{t.genderOther}</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs text-zinc-500 font-semibold mb-1">{t.dobLabel}</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full text-sm text-zinc-800 border-b border-zinc-300 pb-2 focus:outline-none focus:border-[#7533CB] bg-transparent"
            />
          </div>

          {/* Save Profile Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="w-full sm:w-auto px-7 py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.savingBtn}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.saveBtn}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 2. SAVED DELIVERY ADDRESS BOOK (PLAIN LINE LISTING, NO LOCATION PICKER POPUP) */}
      <div className="mt-12 max-w-xl">
        <div className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs bg-white">
          {/* Header */}
          <div className="bg-zinc-50 px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#7533CB]" />
              <h2 className="text-sm font-bold text-zinc-800 uppercase tracking-wide">
                {t.addrSectionTitle}
              </h2>
            </div>
            {!showAddressForm && (
              <button
                type="button"
                onClick={() => handleOpenAddrForm()}
                className="px-3.5 py-1.5 bg-[#7533CB] hover:bg-[#632AAD] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addAddrBtn}</span>
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 space-y-4">
            {/* Address Feedback Alert */}
            {addrFeedback && (
              <div
                className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                  addrFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {addrFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                )}
                <span>{addrFeedback.text}</span>
              </div>
            )}

            {/* INLINE ADDRESS FORM (NO POPUP / MAP PICKER) */}
            {showAddressForm && (
              <form onSubmit={handleSaveAddress} className="p-4 rounded-xl bg-purple-50/40 border border-purple-200 space-y-3.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                  <span className="text-xs font-bold text-[#7533CB] uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-4 h-4" />
                    {editingAddressId ? (isBN ? 'ঠিকানা আপডেট করুন' : 'Edit Delivery Address') : (isBN ? 'নতুন ঠিকানা যোগ করুন' : 'Add New Address')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="p-1 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Title & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 uppercase mb-1">
                      {t.addrTitleLabel}
                    </label>
                    <input
                      type="text"
                      value={addrTitle}
                      onChange={(e) => setAddrTitle(e.target.value)}
                      placeholder="Home / Office"
                      required
                      className="w-full text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded-lg p-2 focus:outline-none focus:border-[#7533CB]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-600 uppercase mb-1">
                      {t.addrCityLabel}
                    </label>
                    <input
                      type="text"
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="Dhaka"
                      required
                      className="w-full text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded-lg p-2 focus:outline-none focus:border-[#7533CB]"
                    />
                  </div>
                </div>

                {/* FULL ADDRESS INPUT BOX WITH BILINGUAL HINT */}
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-600 uppercase mb-1">
                    {t.addrStreetLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder={t.addrStreetHint}
                    required
                    className="w-full text-xs font-medium text-zinc-800 bg-white border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:border-[#7533CB] leading-relaxed placeholder:text-zinc-400"
                  />
                  <p className="text-[10px] text-zinc-400 mt-1 italic">
                    Hint: {t.addrStreetHint}
                  </p>
                </div>

                {/* Submit & Cancel Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={isSavingAddr}
                    className="px-5 py-2 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingAddr ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{t.saveAddrBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    {t.cancelAddrBtn}
                  </button>
                </div>
              </form>
            )}

            {/* PLAIN LINE ADDRESS LIST (FETCHED FROM BACKEND API) */}
            {isLoadingAddresses ? (
              <div className="py-6 text-center text-zinc-400 text-xs flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#7533CB]" />
                <span>{isBN ? 'সংরক্ষিত ঠিকানা লোড করা হচ্ছে...' : 'Loading saved addresses...'}</span>
              </div>
            ) : addresses.length === 0 ? (
              <div className="p-6 rounded-xl bg-zinc-50 border border-dashed border-zinc-300 text-center space-y-2">
                <p className="text-xs text-zinc-500 font-medium">{t.noAddresses}</p>
                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => handleOpenAddrForm()}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7533CB] hover:underline cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addAddrBtn}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-xl border border-zinc-200 bg-white hover:border-purple-300 shadow-2xs transition-all flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide flex items-center gap-1">
                          {addr.title === 'Home' ? <Home className="w-3.5 h-3.5 text-[#7533CB]" /> : <Briefcase className="w-3.5 h-3.5 text-[#7533CB]" />}
                          {addr.title || 'Home'}
                        </span>
                        {addr.is_default && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            {t.defaultBadge}
                          </span>
                        )}
                      </div>

                      {/* PLAIN SINGLE LINE / CLEAN ADDRESS LISTING */}
                      <p className="text-xs text-zinc-800 font-medium leading-relaxed pt-0.5">
                        {addr.street_address}{addr.area ? `, ${addr.area}` : ''}{addr.city ? `, ${addr.city}` : ''}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 text-zinc-400 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenAddrForm(addr)}
                        className="p-1.5 hover:text-[#7533CB] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title={t.editBtn}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title={t.deleteBtn}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
