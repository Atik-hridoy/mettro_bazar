import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Smartphone, KeyRound } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setUser = useAuthStore((state) => state.setUser);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.sendOtp(phone);
      setStep('otp');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await authService.verifyOtp(phone, otp);
      setUser(user);
      onClose();
      
      // Admin redirect logic
      if (user.phone === '01700000000' || user.phone === '12345678901' || user.isAdmin) {
        navigate('/admin');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
          aria-label="Close Auth Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-black text-slate-800 text-center mb-1">
          {step === 'phone' ? 'Welcome to Metro Bazar' : 'Enter OTP Code'}
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          {step === 'phone'
            ? 'Enter your mobile number to get started'
            : `We sent a 4-digit code to ${phone} (Use 1234)`}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <Input
                label="Phone Number"
                placeholder="01700000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <Smartphone className="w-5 h-5 text-slate-400 absolute right-3 top-9" />
            </div>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Sending OTP...' : 'Continue'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="relative">
              <Input
                label="Verification Code (OTP)"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                required
              />
              <KeyRound className="w-5 h-5 text-slate-400 absolute right-3 top-9" />
            </div>
            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Login'}
            </Button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs font-semibold text-primary hover:underline"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
