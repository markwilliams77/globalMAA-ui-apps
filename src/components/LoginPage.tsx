import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ChevronLeft, Mail, AlertCircle, Phone, User, KeyRound } from 'lucide-react';
import { authApi } from '../utils/auth';
import IndianPhoneInput from './IndianPhoneInput';
import { buildIndianPhoneNumber, isValidIndianPhoneDigits } from '../utils/phone';

interface LoginPageProps {
  onBack?: () => void;
  onLoginBypass?: (user: {
    email?: string;
    uid: string;
    displayName?: string;
    phone?: string;
    role?: string;
    isSimulation?: boolean;
    isPatientOtpUser?: boolean;
  }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginBypass }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const normalizedPhone = buildIndianPhoneNumber(phone);
  const phoneIsValid = isValidIndianPhoneDigits(phone);

  const getApiError = (err: any, fallback: string) => {
    return err?.response?.data?.error || err?.response?.data?.message || fallback;
  };

  const switchMode = (nextMode: 'login' | 'signup') => {
    setMode(nextMode);
    setStep('details');
    setOtp('');
    setError(null);
    setNotice(null);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneIsValid || (mode === 'signup' && (!name || !email))) return;

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await authApi.sendOtp({
        phone: normalizedPhone,
        mode,
        name: mode === 'signup' ? name.trim() : undefined,
        email: mode === 'signup' ? email.trim().toLowerCase() : undefined,
      });

      setStep('otp');
      setNotice(response.message || `OTP sent to ${normalizedPhone}`);
    } catch (err: any) {
      setError(getApiError(err, 'Could not send OTP. Please check the phone number and try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneIsValid || !otp) return;

    setLoading(true);
    setError(null);
    setNotice(null);

    try {
      const response = await authApi.verifyOtp({
        phone: normalizedPhone,
        code: otp.trim(),
      });

      if (!response.verified) {
        setError('Invalid OTP. Please try again.');
        return;
      }

      onLoginBypass?.({
        uid: `patient-${normalizedPhone.replace(/\D/g, '')}`,
        email: email.trim().toLowerCase() || undefined,
        displayName: name.trim() || 'Patient',
        phone: normalizedPhone,
        role: 'guest',
        isSimulation: false,
        isPatientOtpUser: true,
      });
    } catch (err: any) {
      setError(getApiError(err, 'Invalid OTP. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-y-0 left-[10%] w-[1px] bg-navy/5"></div>
        <div className="absolute inset-y-0 right-[10%] w-[1px] bg-navy/5"></div>
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 opacity-50"></div>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-navy/40 hover:text-navy transition-all px-6 py-3 rounded-full hover:bg-slate-bg uppercase text-[10px] font-black tracking-widest group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Return to Portal
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm p-8 md:p-12 glass bg-white/80 border-navy/5 rounded-[48px] shadow-2xl backdrop-blur-3xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20 mb-8">
            <ShieldCheck className="text-brand-red" size={32} />
          </div>

          <h1 className="text-3xl font-serif italic text-navy mb-2 tracking-tight pr-2">Patient Access</h1>
          <p className="text-navy/40 text-xs font-bold uppercase tracking-widest mb-8">OTP Security Gateway</p>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-bg p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              mode === 'login' ? 'bg-white text-navy shadow-sm' : 'text-navy/40'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode('signup')}
            className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
              mode === 'signup' ? 'bg-white text-navy shadow-sm' : 'text-navy/40'
            }`}
          >
            Signup
          </button>
        </div>

        <form onSubmit={step === 'details' ? handleSendOtp : handleVerifyOtp} className="space-y-4">
          {step === 'details' && mode === 'signup' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 px-5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    className="w-full bg-slate-bg border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-navy/20 transition-all"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 px-5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-slate-bg border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-navy/20 transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 px-5">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
              <IndianPhoneInput
                value={phone}
                onChange={setPhone}
                disabled={step === 'otp'}
                required
                prefixClassName="ml-14 pr-3 py-4 text-[10px]"
                inputClassName="min-w-0 flex-1 bg-transparent border-none rounded-r-2xl py-4 pl-3 pr-6 text-xs font-bold focus:ring-2 focus:ring-navy/20 transition-all disabled:opacity-60"
                placeholder="10 digit number"
              />
              <div className="absolute inset-0 -z-10 rounded-2xl bg-slate-bg" />
            </div>
            {phone && !phoneIsValid && (
              <p className="px-5 text-[9px] font-black uppercase tracking-widest text-brand-red">
                Enter exactly 10 digits.
              </p>
            )}
          </div>

          {step === 'otp' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 px-5">OTP Code</label>
              <div className="relative">
                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  placeholder="Enter OTP"
                  className="w-full bg-slate-bg border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-navy/20 transition-all"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
          )}

          {notice && (
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
              {notice}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-red uppercase tracking-wide bg-brand-red/5 p-4 rounded-xl border border-brand-red/10">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !phoneIsValid}
            className="w-full bg-navy text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-brand-red transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Please wait...' : step === 'details' ? 'Send OTP' : 'Verify OTP'}
          </button>

          {step === 'otp' && (
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setOtp('');
                setError(null);
              }}
              className="w-full text-[9px] font-black uppercase tracking-widest text-navy/40 hover:text-navy transition-all py-2"
            >
              Change Phone Number
            </button>
          )}
        </form>

        <div className="mt-12 pt-8 border-t border-navy/5 text-center">
          <p className="text-[9px] font-bold text-navy/20 uppercase tracking-[0.3em] leading-relaxed">
            Signup verifies your phone first. After signup, login again using OTP.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
