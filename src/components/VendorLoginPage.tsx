import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Building2, ChevronLeft, KeyRound, Mail, ShieldCheck } from 'lucide-react';

interface VendorLoginPageProps {
  onBack?: () => void;
}

const VendorLoginPage: React.FC<VendorLoginPageProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotice('Vendor credential login will be enabled after partner onboarding is connected.');
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
          Return to Vendor Portal
        </button>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm p-8 md:p-12 glass bg-white/80 border-navy/5 rounded-[48px] shadow-2xl backdrop-blur-3xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-navy rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20 mb-8">
            <Building2 className="text-brand-red" size={32} />
          </div>

          <h1 className="text-3xl font-serif italic text-navy mb-2 tracking-tight pr-2">Vendor Access</h1>
          <p className="text-navy/40 text-xs font-bold uppercase tracking-widest mb-8">Partner Credential Gateway</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 px-5">Vendor Email</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
              <input
                type="email"
                required
                placeholder="partner@clinic.com"
                className="w-full bg-slate-bg border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-navy/20 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 px-5">Access Key</label>
            <div className="relative">
              <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
              <input
                type="password"
                required
                placeholder="Issued by GMAA"
                className="w-full bg-slate-bg border-none rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:ring-2 focus:ring-navy/20 transition-all"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
              />
            </div>
          </div>

          {notice && (
            <div className="flex items-center gap-2 text-[10px] font-bold text-brand-red uppercase tracking-wide bg-brand-red/5 p-4 rounded-xl border border-brand-red/10">
              <AlertCircle size={14} />
              {notice}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-navy text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:bg-brand-red transition-all active:scale-95"
          >
            <ShieldCheck size={14} className="inline mr-2" />
            Authorize Vendor
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-navy/5 text-center">
          <p className="text-[9px] font-bold text-navy/20 uppercase tracking-[0.3em] leading-relaxed">
            Vendor credentials are issued after onboarding and sales verification.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VendorLoginPage;
