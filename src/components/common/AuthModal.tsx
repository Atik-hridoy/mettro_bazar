'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Mail, Lock, UserPlus, LogIn, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { registerUserOnBackend, loginUserOnBackend, convertGuestCartOnBackend } from '@/lib/api';
import { getOrCreateGuestId } from '@/store/useCartStore';

type AuthMode = 'login' | 'signup';

export const AuthModal: React.FC = () => {
  const router = useRouter();
  const { isAuthModalOpen, setAuthModalOpen, isDrawerOpen, loginUser } = useCartStore();

  const [activeTab, setActiveTab] = useState<AuthMode>('login');
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Sign Up Form States
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isAuthModalOpen) return null;

  const resetState = () => {
    setActiveTab('login');
    setLoginEmail('');
    setLoginPassword('');
    setSignupFirstName('');
    setSignupLastName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupConfirmPassword('');
    setErrorMessage('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetState();
    setAuthModalOpen(false);
  };

  // Submit Handler for LOGIN Form
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim()) {
      setErrorMessage('Please enter your Phone Number or Email Address.');
      return;
    }

    if (!loginPassword) {
      setErrorMessage('Please enter your Password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginUserOnBackend(loginEmail.trim(), loginPassword);
      const guestId = getOrCreateGuestId();
      await convertGuestCartOnBackend(guestId, loginEmail.trim());

      const userObj = res?.user || {};
      const displayName = `${userObj.first_name || ''} ${userObj.last_name || ''}`.trim() || userObj.email || userObj.phone_number || 'Registered Customer';
      const identityStr = userObj.phone_number || userObj.email || loginEmail.trim();

      loginUser(identityStr, displayName, {
        firstName: userObj.first_name || '',
        lastName: userObj.last_name || '',
        email: userObj.email || (loginEmail.includes('@') ? loginEmail.trim() : ''),
        phone: userObj.phone_number || (!loginEmail.includes('@') ? loginEmail.trim() : ''),
      });
      handleClose();

      if (isDrawerOpen) {
        router.push('/checkout');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      setErrorMessage(err.message || 'Invalid credentials. Please check your phone/email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Handler for SIGN UP Form
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!signupEmail.trim()) {
      setErrorMessage('Phone Number or Email Address is required.');
      return;
    }

    if (!signupPassword || !signupConfirmPassword) {
      setErrorMessage('Password and Confirm Password are required.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (signupPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const isEmail = signupEmail.includes('@');
      const payload: any = {
        first_name: signupFirstName.trim() || 'New',
        last_name: signupLastName.trim() || 'Customer',
        password: signupPassword,
        confirm_password: signupConfirmPassword,
      };

      if (isEmail) {
        payload.email = signupEmail.trim();
      } else {
        payload.phone_number = signupEmail.trim();
      }

      const res = await registerUserOnBackend(payload);
      const guestId = getOrCreateGuestId();
      await convertGuestCartOnBackend(guestId, signupEmail.trim());

      const userObj = res?.user || {};
      const displayName = `${userObj.first_name || signupFirstName} ${userObj.last_name || signupLastName}`.trim() || 'Registered Customer';
      const identityStr = userObj.phone_number || userObj.email || signupEmail.trim();

      loginUser(identityStr, displayName, {
        firstName: userObj.first_name || signupFirstName.trim(),
        lastName: userObj.last_name || signupLastName.trim(),
        email: userObj.email || (isEmail ? signupEmail.trim() : ''),
        phone: userObj.phone_number || (!isEmail ? signupEmail.trim() : ''),
      });
      handleClose();

      if (isDrawerOpen) {
        router.push('/checkout');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      setErrorMessage(err.message || 'Registration failed. Please check your details or try a different phone/email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity"
        onClick={handleClose}
      />

      {/* Auth Modal Box */}
      <div
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 border border-zinc-200 ${
          isDrawerOpen ? 'lg:-translate-x-44' : ''
        }`}
      >
        {/* Modal Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3.5 right-3.5 text-zinc-400 hover:text-zinc-700 p-1 rounded-full hover:bg-zinc-100 transition-colors z-20"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* TOP TAB SWITCHER: LOGIN vs SIGN UP */}
        <div className="flex border-b border-zinc-200 bg-zinc-50/80">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#7533CB] text-[#7533CB] bg-white font-extrabold shadow-2xs'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>LOG IN</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'signup'
                ? 'border-[#7533CB] text-[#7533CB] bg-white font-extrabold shadow-2xs'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>SIGN UP / REGISTER</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Error Notification */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 text-left shadow-2xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-zinc-900">Welcome Back to Metro Bazar</h3>
                <p className="text-xs text-zinc-500">Sign in with your Phone Number or Email</p>
              </div>

              {/* Phone or Email Address Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  PHONE OR EMAIL ADDRESS
                </label>
                <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1.5">
                  <Mail className="w-4 h-4 text-amber-500 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="01700000000 or user@example.com"
                    required
                    className="w-full text-xs text-zinc-900 placeholder:text-zinc-300 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                    PASSWORD
                  </label>
                  <a href="#" className="text-[10px] font-semibold text-[#7533CB] hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1.5">
                  <Lock className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full text-xs text-zinc-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Submit Login */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Signing In...' : isDrawerOpen ? 'LOG IN & CHECKOUT' : 'LOG IN'}
              </button>

              <div className="text-center pt-2 border-t border-zinc-100">
                <span className="text-xs text-zinc-500">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-[#7533CB] hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          )}

          {/* FORM 2: EMAIL-ONLY SIGN UP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-left">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-zinc-900">Create New Account</h3>
                <p className="text-xs text-zinc-500">Enter your Email and details to register</p>
              </div>

              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    placeholder="Hridoy"
                    required
                    className="w-full border-b-2 border-zinc-300 focus:border-[#7533CB] py-1 text-xs text-zinc-900 focus:outline-none bg-transparent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    placeholder="Ahmed"
                    required
                    className="w-full border-b-2 border-zinc-300 focus:border-[#7533CB] py-1 text-xs text-zinc-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  EMAIL ADDRESS
                </label>
                <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1">
                  <Mail className="w-3.5 h-3.5 text-amber-500 mr-2 shrink-0" />
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    required
                    className="w-full text-xs text-zinc-900 placeholder:text-zinc-300 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  CREATE PASSWORD
                </label>
                <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1">
                  <Lock className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="At least 4 characters"
                    required
                    className="w-full text-xs text-zinc-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block">
                  CONFIRM PASSWORD
                </label>
                <div className="flex items-center border-b-2 border-zinc-300 focus-within:border-[#7533CB] py-1">
                  <Lock className="w-3.5 h-3.5 text-zinc-400 mr-2 shrink-0" />
                  <input
                    type="password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    className="w-full text-xs text-zinc-900 focus:outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Submit Register */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#7533CB] hover:bg-[#632AAD] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? 'Creating Account...' : isDrawerOpen ? 'CREATE ACCOUNT & CHECKOUT' : 'CREATE ACCOUNT'}
              </button>

              <div className="text-center pt-2 border-t border-zinc-100">
                <span className="text-xs text-zinc-500">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-[#7533CB] hover:underline cursor-pointer"
                >
                  Log In Here
                </button>
              </div>
            </form>
          )}

          {/* reCAPTCHA Footer */}
          <p className="text-[10px] text-zinc-400 text-center pt-2 leading-relaxed">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="#" className="underline hover:text-zinc-600">Privacy Policy</a> and{' '}
            <a href="#" className="underline hover:text-zinc-600">Terms of Service</a> apply.
          </p>
        </div>
      </div>
    </div>
  );
};
