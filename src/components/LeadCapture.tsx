import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ArrowRight, Send, CheckCircle2, Phone, Briefcase, MapPin } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface LeadCaptureProps {
  externalOpen?: boolean;
  onClose?: () => void;
}

export default function LeadCapture({ externalOpen, onClose }: LeadCaptureProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    service: 'Specialized Surgery',
    email: '',
    phone: '',
    region: 'Thailand'
  });

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSubmitted(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'consultations'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        handleClose();
        setStep(1);
      }, 3000);
    } catch (error) {
      console.error("Error saving consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Trigger - only show if not externally controlled */}
      {externalOpen === undefined && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setInternalOpen(true)}
          className="fixed bottom-12 right-12 z-[60] bg-navy text-white p-2 rounded-full shadow-2xl shadow-navy/40 flex items-center gap-1 group overflow-hidden"
        >
          <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 border border-white/10">
            <MessageCircle size={24} className="text-brand-red animate-pulse" />
          </div>
          <span className="mixed-caps px-6 font-black tracking-[0.3em] text-white opacity-100 hidden md:block">Registry Access</span>
        </motion.button>
      )}

      {/* Multi-step Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 md:p-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-navy/80 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] bg-white rounded-3xl md:rounded-[48px] overflow-y-auto shadow-[0_50px_100px_rgba(10,17,31,0.5)] border border-white/10"
            >
              {/* Noise Texture */}
              <div className="absolute inset-0 noise opacity-[0.03] pointer-events-none" />

              <button 
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-8 md:right-8 p-2 md:p-3 rounded-full hover:bg-navy/5 text-navy group transition-all z-20"
              >
                <X size={20} className="md:size-6 group-hover:rotate-90 transition-transform" />
              </button>

              <div className="p-6 pt-14 sm:p-8 sm:pt-16 md:p-16 lg:p-20 relative z-10">
                {isSubmitted ? (
                  <div className="py-10 md:py-20 text-center space-y-6 md:space-y-10">
                    <motion.div 
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-20 h-20 md:w-32 md:h-32 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-red/10"
                    >
                       <CheckCircle2 size={40} className="md:size-16" strokeWidth={1} />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl md:text-5xl font-serif italic mb-4 md:mb-6 pr-2">Inquiry Received.</h3>
                      <p className="text-sm md:text-xl text-navy/40 font-medium max-w-sm mx-auto leading-relaxed">
                        Your private concierge will initiate contact shortly through secure channels.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 md:mb-20">
                       <div className="flex items-center gap-4 mb-4 md:mb-6">
                          <div className="h-1 w-6 md:w-8 bg-brand-red rounded-full shadow-lg shadow-brand-red/20" />
                          <span className="mixed-caps text-cyan opacity-100 font-bold tracking-[0.3em] uppercase text-[10px]">PROVIDER NETWORK</span>
                       </div>
                       <h3 className="text-4xl md:text-6xl font-light leading-[0.9] tracking-tighter">
                          Curate Your <br />
                          <span className="font-serif italic text-gradient font-medium pr-2">Alliance.</span>
                       </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
                       <AnimatePresence mode="wait">
                         {step === 1 ? (
                           <motion.div
                             key="step1"
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -20 }}
                             className="space-y-8 md:space-y-10"
                           >
                              <div className="space-y-2 md:space-y-4 border-b border-navy/5 pb-2 md:pb-4">
                                <label className="mixed-caps text-navy/30 uppercase text-[9px] md:text-[10px] font-bold">Identified As</label>
                                <input 
                                  type="text" 
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  placeholder="Full Legal Name" 
                                  className="w-full bg-transparent text-xl md:text-2xl font-serif italic text-navy placeholder:text-navy/10 focus:outline-none" 
                                  required 
                                />
                              </div>
                              <div className="space-y-2 md:space-y-4 border-b border-navy/5 pb-2 md:pb-4">
                                <label className="mixed-caps text-navy/30 uppercase text-[9px] md:text-[10px] font-bold">Clinical Focus</label>
                                <div className="relative">
                                  <select 
                                    value={formData.service}
                                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                                    className="w-full bg-transparent text-xl md:text-2xl font-serif italic text-navy focus:outline-none appearance-none cursor-pointer pr-10"
                                  >
                                    <option>Specialized Surgery</option>
                                    <option>Diagnostic Intelligence</option>
                                    <option>Chronic Care Management</option>
                                    <option>Global Logistics & Evac</option>
                                    <option>Pharmaceutical Sourcing</option>
                                    <option>Restorative Wellness</option>
                                  </select>
                                  <Briefcase className="absolute right-0 top-1/2 -translate-y-1/2 text-navy/20 pointer-events-none" size={18} />
                                </div>
                              </div>
                              <button 
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!formData.name}
                                className="group relative overflow-hidden bg-navy text-white w-full py-6 md:py-8 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <div className="absolute inset-0 bg-brand-red -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                <span className="relative z-10 flex items-center justify-center gap-4">
                                  Request Secure Access <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                              </button>
                           </motion.div>
                         ) : (
                           <motion.div
                             key="step2"
                             initial={{ opacity: 0, x: 20 }}
                             animate={{ opacity: 1, x: 0 }}
                             exit={{ opacity: 0, x: -20 }}
                             className="space-y-8 md:space-y-10"
                           >
                              <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                                <div className="space-y-2 md:space-y-4 border-b border-navy/5 pb-2 md:pb-4">
                                  <label className="mixed-caps text-navy/30 uppercase text-[9px] md:text-[10px] font-bold">Encrypted Contact</label>
                                  <input 
                                    type="email" 
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    placeholder="Email Address" 
                                    className="w-full bg-transparent text-lg md:text-xl font-serif italic text-navy placeholder:text-navy/10 focus:outline-none" 
                                    required 
                                  />
                                </div>
                                <div className="space-y-2 md:space-y-4 border-b border-navy/5 pb-2 md:pb-4">
                                  <label className="mixed-caps text-navy/30 uppercase text-[9px] md:text-[10px] font-bold">Secure Line</label>
                                  <div className="relative">
                                    <input 
                                      type="tel" 
                                      value={formData.phone}
                                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                      placeholder="+1 (xxx) xxx-xxxx" 
                                      className="w-full bg-transparent text-lg md:text-xl font-serif italic text-navy placeholder:text-navy/10 focus:outline-none pr-10" 
                                      required 
                                    />
                                    <Phone className="absolute right-0 top-1/2 -translate-y-1/2 text-navy/20 pointer-events-none" size={18} />
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 md:space-y-6">
                                <label className="mixed-caps text-navy/30 uppercase text-[9px] md:text-[10px] font-bold block mb-2 md:mb-4">Target Care Region</label>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                   {['Thailand', 'Turkey', 'Mexico', 'Spain', 'Singapore', 'India'].map(c => (
                                     <button 
                                      type="button" 
                                      key={c} 
                                      onClick={() => setFormData({...formData, region: c})}
                                      className={`py-3 px-6 md:py-4 md:px-8 rounded-full border text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        formData.region === c 
                                          ? 'bg-navy text-white border-navy shadow-lg' 
                                          : 'border-navy/5 text-navy hover:bg-navy/5'
                                      }`}
                                     >
                                      {c}
                                     </button>
                                   ))}
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                  type="button"
                                  onClick={() => setStep(1)}
                                  className="flex-1 bg-slate-bg text-navy py-5 md:py-6 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-navy/5 transition-colors"
                                >
                                  Previous
                                </button>
                                <button 
                                  type="submit"
                                  disabled={loading || !formData.email || !formData.phone}
                                  className="group relative overflow-hidden flex-[2] bg-brand-red text-white py-5 md:py-6 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <div className="absolute inset-0 bg-navy -translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                                  <span className="relative z-10 flex items-center justify-center gap-4 text-[10px] md:text-xs">
                                    {loading ? 'Processing...' : 'Finalize Access'} <Send size={14} />
                                  </span>
                                </button>
                              </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </form>

                    <div className="mt-10 md:mt-20 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 opacity-20 group hover:opacity-100 transition-opacity">
                       <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">End-to-End Encryption</span>
                       <div className="hidden md:block w-1 h-1 bg-navy rounded-full" />
                       <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Institutional HIPAA Compliance</span>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
