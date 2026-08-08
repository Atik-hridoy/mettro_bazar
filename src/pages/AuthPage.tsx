import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';
import { ArrowLeft, Lock, User as UserIcon, Phone } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login Fields
  const [loginPhone, setLoginPhone] = useState('01700000000');
  const [loginPassword, setLoginPassword] = useState('admin1234');

  // Sign Up Fields
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginPhone || !loginPassword) {
      setError('Please enter both phone number and password.');
      return;
    }

    setLoading(true);
    try {
      const { user } = await authService.login(loginPhone, loginPassword);
      setUser({
        id: user.id || 'usr-' + Date.now(),
        phone: user.phone || loginPhone,
        name: user.name || 'Gourmet Chef',
        address: user.address || 'House 42, Road 11, Banani, Dhaka',
      });
      setLoading(false);
      
      if (user.phone === '01700000000' || user.phone === '12345678901' || user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid login credentials.');
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!signupName || !signupPhone || !signupPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { user } = await authService.register(signupName, signupPhone, signupPassword);
      setUser({
        id: user.id || 'usr-' + Date.now(),
        phone: user.phone || signupPhone,
        name: user.name || signupName,
        address: user.address || 'House 42, Road 11, Banani, Dhaka',
      });
      setLoading(false);
      
      if (user.phone === '01700000000' || user.phone === '12345678901' || user.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to register account.');
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    navigate('/');
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-slate-900 overflow-hidden font-sans">
      {/* Background Image with Dark Green Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[#00422f]/85 backdrop-blur-md z-0" />

      {/* Back to Store Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      {/* Auth Card Modal Container */}
      <main className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-100 my-8">
        {/* Tabs Header */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-4 text-center font-black text-base transition-colors ${
              mode === 'login'
                ? 'border-b-2 border-[#00694c] text-[#00694c] bg-emerald-50/40'
                : 'text-slate-400 hover:text-[#00694c]'
            }`}
          >
            Log in
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError('');
            }}
            className={`flex-1 py-4 text-center font-black text-base transition-colors ${
              mode === 'signup'
                ? 'border-b-2 border-[#00694c] text-[#00694c] bg-emerald-50/40'
                : 'text-slate-400 hover:text-[#00694c]'
            }`}
          >
            Sign up
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#00694c]">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {mode === 'login'
                ? 'Enter your phone number and password to log in'
                : 'Fill in your details to register your account'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-200 text-center">
              {error}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number / Username *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="017XXXXXXXX or admin"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#00694c] hover:bg-[#004d37] disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-900/10 active:scale-98 text-sm"
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Shafiqur Rahman"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    required
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    required
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00694c] text-slate-800 text-sm font-medium"
                    required
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#00694c] hover:bg-[#004d37] disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md shadow-emerald-900/10 active:scale-98 text-sm"
              >
                {loading ? 'Creating Account...' : 'Sign up'}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-slate-400 font-semibold text-xs">
                or
              </span>
            </div>
          </div>

          {/* Guest Button */}
          <button
            type="button"
            onClick={handleGuestContinue}
            className="w-full py-3 px-4 bg-white border-2 border-[#00694c] text-[#00694c] hover:bg-emerald-50 rounded-xl font-extrabold text-sm transition-all active:scale-98"
          >
            Continue as guest
          </button>
        </div>
      </main>
    </div>
  );
};
