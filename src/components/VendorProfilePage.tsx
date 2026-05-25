import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Activity, 
  Users, 
  Globe2, 
  Award,
  ChevronRight,
  Stethoscope,
  BriefcaseMedical,
  MessageSquare,
  Share2,
  Loader2
} from 'lucide-react';
import type { VendorDetails } from '../models';
import { getVendorDetails } from '../utils/vendors';
import ChatOverlay from './ChatOverlay';

interface VendorProfilePageProps {
  vendorId: string;
  onBack: () => void;
}

export default function VendorProfilePage({ vendorId, onBack }: VendorProfilePageProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setApiError(null);
    setVendor(null);

    getVendorDetails(vendorId, controller.signal)
      .then((response) => {
        setVendor(response);
      })
      .catch(() => {
        if (controller.signal.aborted) return;

        setVendor(null);
        setApiError('Unable to load this vendor profile right now.');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [vendorId]);

  if (isLoading && !vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-10 h-10 mx-auto text-navy animate-spin mb-6" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40">Loading Vendor Profile</p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-4xl font-light text-navy mb-4">Vendor not found</h2>
          {apiError && (
            <p className="text-sm text-navy/40 font-medium mb-6">{apiError}</p>
          )}
          <button onClick={onBack} className="text-brand-red font-bold uppercase tracking-widest text-sm">Return to Registry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header / Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        <img 
          src={vendor.image} 
          alt={vendor.name} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-12 md:pb-20">
          <div className="container mx-auto px-4 md:px-12 lg:px-24 w-full">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 md:mb-12"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em]">Back to Directory</span>
            </motion.button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8">
              <div>
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex items-center gap-4 mb-4 md:mb-6"
                >
                  <span className="px-3 md:px-4 py-1 md:py-1.5 bg-brand-red rounded-full text-[8px] md:text-[10px] font-bold text-white uppercase tracking-[0.2em] shadow-lg shadow-brand-red/20">
                    {vendor.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-white/80">
                    <Star size={12} className="fill-brand-red text-brand-red" />
                    <span className="text-xs font-bold">{vendor.rating} Excellence Score</span>
                  </div>
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-8xl font-serif italic text-white tracking-tighter pr-4 leading-tight"
                >
                  {vendor.name}
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 md:mt-6 text-white/50"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-cyan" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{vendor.location} HQ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-cyan" />
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">{vendor.specialty} Excellence</span>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] self-start md:self-auto"
              >
                <div className="text-right">
                  <p className="text-[8px] md:text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">MedAlliance Score</p>
                  <p className="text-2xl md:text-3xl font-bold text-white tracking-tighter">{vendor.rating}/5.0</p>
                </div>
                <div className="w-[1px] h-10 md:h-12 bg-white/10 mx-1 md:mx-2" />
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="bg-brand-red text-white p-4 md:p-6 rounded-xl md:rounded-2xl hover:bg-white hover:text-brand-red transition-all duration-500 shadow-xl shadow-brand-red/20 group"
                >
                  <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 -mt-8 relative z-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          
          {/* Left Column: Organization Summary */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-navy/5">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center">
                  <Globe2 className="text-navy/40" size={18} />
                </div>
                <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-navy">Corporate Profile</h2>
              </div>
              <p className="text-xl md:text-2xl text-navy/60 font-light leading-relaxed mb-6 md:mb-8">
                {vendor.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 pt-6 md:pt-8 border-t border-slate-bg">
                {Object.entries(vendor.stats || {}).map(([key, val]) => (
                  <div key={key}>
                    <p className="text-navy font-bold text-2xl md:text-3xl tracking-tighter">{val as string}</p>
                    <p className="text-navy/40 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] mt-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-navy/5">
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center">
                  <BriefcaseMedical className="text-navy/40" size={18} />
                </div>
                <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-navy">Specialized Services</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {(vendor.fullServices || []).map((service: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-bg group hover:bg-navy transition-all duration-500 cursor-default">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-2 h-2 rounded-full bg-cyan group-hover:bg-brand-red transition-colors" />
                      <span className="text-xs md:text-sm font-bold text-navy group-hover:text-white transition-colors">{service}</span>
                    </div>
                    <ChevronRight size={14} className="text-navy/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Trust & Actions */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-navy p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] text-white">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <ShieldCheck className="text-cyan" size={18} />
                <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Compliance</h3>
              </div>
              <div className="space-y-3 md:space-y-4">
                {vendor.accreditation.map((acc, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                    <Award size={14} className="text-brand-red" />
                    <span className="text-[10px] md:text-xs font-bold tracking-tight">{acc}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 md:mt-8 bg-cyan text-navy font-bold py-4 md:py-5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                Verification Report
              </button>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-navy/5 shadow-sm space-y-6">
              <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] text-navy/40">Resource Network</h3>
              <div className="flex items-center gap-4 p-4 hover:bg-slate-bg rounded-xl md:rounded-2xl transition-colors cursor-pointer group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-navy">{vendor.staffCount} Staff</p>
                  <p className="text-[8px] md:text-[10px] text-navy/40 font-bold uppercase tracking-widest">Medical Professionals</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 hover:bg-slate-bg rounded-xl md:rounded-2xl transition-colors cursor-pointer group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-navy">24/7 Concierge</p>
                  <p className="text-[8px] md:text-[10px] text-navy/40 font-bold uppercase tracking-widest">Global Liaison</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-white border border-navy/10 py-4 md:py-5 rounded-xl md:rounded-2xl text-navy font-bold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2">
                <Share2 size={14} />
                Share
              </button>
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex-1 bg-white border border-navy/10 py-4 md:py-5 rounded-xl md:rounded-2xl text-navy font-bold text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-navy hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Inquiry
                <ChevronRight size={14} className="text-brand-red" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <ChatOverlay 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        context={`Inquiry about ${vendor.name}`}
      />
    </div>
  );
}
