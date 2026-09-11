'use client';

import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, ChevronRight, Settings, Check } from 'lucide-react';
import { getCookie, setCookie } from '@/lib/deviceInfo';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always required
    analytics: true,
    personalized: true,
  });

  useEffect(() => {
    const consent = getCookie('mb_cookie_consent') || localStorage.getItem('mb_cookie_consent');
    if (!consent) {
      // Delay display slightly for smooth page load
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setCookie('mb_cookie_consent', 'accepted_all', 365);
    localStorage.setItem('mb_cookie_consent', 'accepted_all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    setCookie('mb_cookie_consent', 'essential_only', 365);
    localStorage.setItem('mb_cookie_consent', 'essential_only');
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    const value = JSON.stringify(preferences);
    setCookie('mb_cookie_consent', value, 365);
    localStorage.setItem('mb_cookie_consent', value);
    setIsCustomizeOpen(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom Cookie Consent Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-[70] animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white/95 backdrop-blur-md border border-[#DBC7F4] rounded-2xl shadow-2xl p-5 text-zinc-800 space-y-3.5 relative">
          <button
            onClick={handleAcceptEssential}
            className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-zinc-700 p-1 rounded-full hover:bg-purple-50 transition-colors"
            aria-label="Dismiss cookie banner"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7533CB] flex items-center justify-center shrink-0 border border-purple-200">
              <Cookie className="w-5 h-5" />
            </div>

            <div className="space-y-1 pr-6">
              <h4 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                We value your privacy on Metro Bazar
                <ShieldCheck className="w-4 h-4 text-emerald-600 inline" />
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                We use cookies and device tracking to maintain your persistent guest cart session, save your delivery preferences, and improve your grocery shopping experience.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-purple-100/60">
            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-600 hover:text-[#7533CB] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Customize</span>
            </button>

            <button
              onClick={handleAcceptEssential}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
            >
              Essential Only
            </button>

            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#7533CB] hover:bg-[#632AAD] rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Accept All Cookies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Customize Preferences Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 relative animate-in zoom-in-95 duration-150 border border-zinc-200">
            <button
              onClick={() => setIsCustomizeOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 p-1 rounded-full hover:bg-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7533CB] flex items-center justify-center border border-purple-200">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Customize Cookie Preferences
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage how Metro Bazar processes your session data
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Essential */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <div>
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    Essential Guest Cart Cookies
                    <span className="text-[10px] bg-purple-200 text-[#7533CB] px-1.5 py-0.2 rounded font-bold">
                      Always Required
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Required to persist guest IDs, active cart items, and delivery city selection.
                  </div>
                </div>
                <div className="w-5 h-5 rounded bg-[#7533CB] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Device & Location */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <div>
                  <div className="text-xs font-bold text-zinc-900">
                    Device & IP Activity Analytics
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Allows reporting client browser, OS, and IP address to Admin Center for guest tracking.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#7533CB] rounded cursor-pointer"
                />
              </div>

              {/* Personalized Offers */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                <div>
                  <div className="text-xs font-bold text-zinc-900">
                    Personalized Store Preferences
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Saves language selection (EN/BN) and recent search queries.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.personalized}
                  onChange={(e) =>
                    setPreferences({ ...preferences, personalized: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#7533CB] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustom}
                className="px-5 py-2 text-xs font-bold text-white bg-[#7533CB] hover:bg-[#632AAD] rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
