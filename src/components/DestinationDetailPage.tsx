import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, MapPin, Building2, UserCheck, ShieldCheck, 
  Plane, CreditCard, Stethoscope, Award, Globe, 
  CheckCircle2, Clock, Activity, MessageSquare
} from 'lucide-react';

interface DestinationDetailPageProps {
  country: string;
  onBack: () => void;
  onExploreProviders: (region: string) => void;
}

const DESTINATION_DATA: Record<string, any> = {
  'Switzerland': {
    region: 'Central Europe',
    specialties: ['Precision Oncology', 'Sports Medicine', 'Longevity Medicine'],
    infrastructure: '5-Star Swiss Medical Association Standard',
    visa: 'Schengen Area (90 days for most carriers)',
    flightSupport: 'Major international hubs via Zurich & Geneva',
    highlights: [
      'Home to the world\'s leading rehabilitation clinics.',
      'Highest density of medical robots per capita.',
      'Neutral ground with strict patient privacy laws (Swiss Quality).'
    ],
    stats: {
      successRate: '98%',
      accreditedClinics: '45+',
      expertDoctors: '1,200+'
    },
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80'
  },
  'Singapore': {
    region: 'Southeast Asia',
    specialties: ['Oncology', 'Cardiology', 'Complex Orthopedics'],
    infrastructure: 'JCI Accredited Smart Hospitals',
    visa: 'Visa-free entry for 90 days for many nationalities',
    flightSupport: 'Changi International (Global Top 1 Transit Hub)',
    highlights: [
      'Ranked #1 for healthcare system quality in Asia.',
      'Multi-disciplinary approach with top-tier University hospitals.',
      'English-speaking staff across all clinical levels.'
    ],
    stats: {
      successRate: '97.5%',
      accreditedClinics: '38+',
      expertDoctors: '950+'
    },
    image: 'https://images.unsplash.com/photo-1525625232747-0748518cf266?auto=format&fit=crop&q=80'
  }
};

const DEFAULT_DATA = {
  region: 'Global Hub',
  specialties: ['General Medicine', 'Specialized Surgery', 'Advanced Diagnostics'],
  infrastructure: 'Modern Healthcare Infrastructure',
  visa: 'Varies by Nationality',
  flightSupport: 'International Airport Access',
  highlights: [
    'Strict adherence to international safety protocols.',
    'World-class patient coordination services.',
    'Access to local medical innovations.'
  ],
  stats: {
    successRate: '95%+',
    accreditedClinics: '20+',
    expertDoctors: '500+'
  },
  image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80'
};

export default function DestinationDetailPage({ country, onBack, onExploreProviders }: DestinationDetailPageProps) {
  const data = DESTINATION_DATA[country] || DEFAULT_DATA;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="h-[70vh] relative overflow-hidden">
        <img src={data.image} alt={country} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end pb-20">
          <div className="container mx-auto px-4 md:px-12 lg:px-24">
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="flex items-center gap-3 text-white/60 mb-12 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Back to Destinations</span>
            </motion.button>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-1 bg-brand-red rounded-full" />
                  <span className="text-cyan font-bold uppercase tracking-[0.6em] text-[10px] md:text-xs">{data.region} Hub</span>
                </div>
                <h1 className="text-6xl md:text-9xl font-light tracking-tighter text-white leading-none">
                  {country}<span className="text-brand-red">.</span>
                </h1>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-12 border-l border-white/10 pl-12">
                 <div>
                    <span className="block text-white/30 text-[9px] font-bold uppercase tracking-widest mb-2">Success Rate</span>
                    <span className="text-3xl font-light text-white">{data.stats.successRate}</span>
                 </div>
                 <div>
                    <span className="block text-white/30 text-[9px] font-bold uppercase tracking-widest mb-2">Expert Staff</span>
                    <span className="text-3xl font-light text-white">{data.stats.expertDoctors}</span>
                 </div>
                 <div className="hidden md:block">
                    <span className="block text-white/30 text-[9px] font-bold uppercase tracking-widest mb-2">Accreditations</span>
                    <span className="text-3xl font-light text-white">{data.stats.accreditedClinics}</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="py-32">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-[1fr_400px] gap-24 items-start">
            <div className="space-y-24">
              {/* Core Intelligence */}
              <div>
                <h2 className="text-4xl font-light tracking-tight text-navy mb-12 flex items-center gap-4">
                  Why choose <span className="font-serif italic font-medium text-brand-red">this location?</span>
                  <div className="flex-1 h-[1px] bg-navy/5" />
                </h2>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="p-10 rounded-[48px] bg-slate-bg/30 border border-navy/5 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-cyan shadow-sm">
                      <Stethoscope size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-navy">Exceptional Medical Care</h3>
                    <p className="text-sm text-navy/50 leading-relaxed">
                      Known for its specialized care in {data.specialties.join(', ')}. {country} is home to 
                      friendly clinics and world-class doctors certified by {data.infrastructure}.
                    </p>
                  </div>
                  
                  <div className="p-10 rounded-[48px] bg-slate-bg/30 border border-navy/5 space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-red shadow-sm">
                      <Globe size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-navy">Travel with Ease</h3>
                    <p className="text-sm text-navy/50 leading-relaxed">
                      {data.visa}. Getting here is simple via {data.flightSupport}, 
                      and we'll be there to help you every step of the way.
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-navy/30 mb-12 italic">What makes it special</h3>
                <div className="space-y-8">
                  {data.highlights.map((h: string, i: number) => (
                    <div key={i} className="flex gap-8 group">
                      <div className="text-4xl font-serif italic text-navy/10 group-hover:text-cyan transition-colors">0{i+1}</div>
                      <div className="pt-2">
                        <p className="text-xl text-navy/60 font-medium leading-relaxed group-hover:text-navy transition-colors">{h}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar CTA & Snapshot */}
            <div className="sticky top-40 space-y-8">
              <div className="bg-navy rounded-[48px] p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] noise" />
                <div className="relative z-10 space-y-8">
                  <h3 className="text-3xl font-light tracking-tight mb-8">Ready to explore <span className="italic font-serif">providers?</span></h3>
                  
                  <div className="space-y-4">
                    {[
                      { icon: CheckCircle2, text: 'Direct Medical Concierge' },
                      { icon: Clock, text: 'Zero Wait-List Access' },
                      { icon: Activity, text: 'Remote Case Review' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-white/40">
                        <item.icon size={16} className="text-cyan" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onExploreProviders(country)}
                    className="w-full py-5 bg-cyan hover:bg-brand-red rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl shadow-cyan/20 flex items-center justify-center gap-3"
                  >
                    View Registry
                    <Globe size={16} />
                  </button>
                  
                  <button className="w-full py-5 border border-white/10 hover:border-brand-red rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3">
                    Contact Liaison
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>

              <div className="p-10 border border-navy/5 rounded-[48px] bg-slate-bg/30">
                 <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-emerald-500" size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-navy">GMAA Vetted Hub</span>
                 </div>
                 <p className="text-[10px] text-navy/40 leading-relaxed font-medium">
                    This destination has passed our strict 14-point healthcare infrastructure audit, 
                    covering clinical safety, data privacy, and ethical standards.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
