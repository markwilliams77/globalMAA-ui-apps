import React from 'react';
import { motion } from 'motion/react';
import { Shield, Brain, Globe, Database, ArrowRight, Activity, ClipboardCheck, Sparkles } from 'lucide-react';

const ECOSYSTEM_SERVICES = [
  {
    id: 'discovery',
    title: 'Find Your Doctor',
    description: 'Browse our hand-picked list of clinics that meet the highest standards of care.',
    icon: Globe,
    color: 'text-cyan',
    bgColor: 'bg-cyan/5',
    features: ['Vetted Specialists', 'Real Availability', 'Verified Reviews']
  },
  {
    id: 'insights',
    title: 'Medical Clarity',
    description: 'Get clear answers on costs, success rates, and what to expect from your treatment.',
    icon: Brain,
    color: 'text-brand-red',
    bgColor: 'bg-brand-red/5',
    features: ['Price Transparency', 'Proven Results', 'Patient Stories']
  },
  {
    id: 'shield',
    title: 'Your Safety First',
    description: 'We handle the paperwork and double-check every detail so you can focus on getting better.',
    icon: Shield,
    color: 'text-navy',
    bgColor: 'bg-navy/5',
    features: ['Secure Payments', 'Clinical Oversight', 'Constant Support']
  },
  {
    id: 'concierge',
    title: 'We Handle Everything',
    description: 'From booking flights to your first follow-up, our team is with you every step of the way.',
    icon: Sparkles,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/5',
    features: ['Travel Planning', 'Personal Assistance', 'Care Coordination']
  }
];

export default function ServiceEcosystem() {
  return (
    <section className="py-32 bg-slate-bg/30 relative overflow-hidden">
      {/* Decorative architectural elements */}
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-navy/5" />
      <div className="absolute top-0 right-1/4 w-[1px] h-full bg-navy/5" />

      <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row gap-20 items-start mb-24">
          <div className="lg:w-1/3">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-1 bg-brand-red rounded-full" />
              <span className="text-navy font-bold uppercase tracking-[0.4em] text-[10px]">How we help</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-light tracking-tighter text-navy mb-8 leading-[0.9]">
              The care you <br />
              <span className="font-serif italic font-medium text-gradient">deserve.</span>
            </h2>
            <p className="text-lg text-navy/50 font-medium leading-relaxed mb-12">
              Searching for medical help abroad shouldn't be scary. We've simplified the journey 
              so you can focus on what matters most—your recovery.
            </p>
            
            <div className="flex flex-col gap-6">
               <div className="p-6 rounded-3xl bg-white border border-navy/5 shadow-sm">
                  <div className="flex items-center gap-4 mb-2">
                     <ClipboardCheck className="text-cyan" size={18} />
                     <span className="text-[10px] font-black uppercase tracking-widest text-navy">Quality Checked</span>
                  </div>
                  <p className="text-[10px] text-navy/40 font-medium italic">
                    Every clinic in our network undergoes a rigorous review of their safety and success protocols.
                  </p>
               </div>
            </div>
          </div>

          <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
            {ECOSYSTEM_SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-10 rounded-[48px] border border-navy/5 hover:border-cyan/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >
                {/* Decorative Pattern Background */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.02] pointer-events-none translate-x-10 -translate-y-10">
                   <Database size={120} />
                </div>

                <div className={`w-14 h-14 ${service.bgColor} ${service.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                  <service.icon size={28} />
                </div>

                <h3 className="text-2xl font-bold text-navy mb-4">{service.title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed mb-8">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-10">
                  {service.features.map(feature => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan/20" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-navy/60">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className="flex items-center gap-3 text-navy hover:text-cyan transition-colors group/btn">
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Learn More</span>
                  <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Connectivity Visualization */}
        <div className="bg-navy rounded-[48px] p-12 md:p-20 text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-[0.03] noise" />
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-md">
                 <h3 className="text-3xl font-light tracking-tight mb-6">A more <br /><span className="font-serif italic text-cyan">connected way to heal.</span></h3>
                 <p className="text-sm text-white/40 leading-relaxed">
                   We believe that high-quality healthcare should be accessible to everyone, 
                   no matter where they live. We're bridging the distance, one patient at a time.
                 </p>
              </div>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                 {[
                   { label: 'Patient Support', val: '24/7' },
                   { label: 'Families Assisted', val: '120k+' },
                   { label: 'Trusted Partners', val: '4,200+' }
                 ].map(stat => (
                   <div key={stat.label} className="text-center">
                     <div className="text-3xl md:text-5xl font-light mb-2">{stat.val}</div>
                     <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">{stat.label}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
