import { motion } from 'motion/react';
import { LayoutDashboard, Users, CreditCard, BarChart3, Bell, Settings, ArrowRight, LogIn, Globe, Target, Briefcase, Zap, Bot, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface VendorPortalProps {
  onLogin?: () => void;
  onPartnerWithUs?: () => void;
}

export default function VendorPortal({ onLogin, onPartnerWithUs }: VendorPortalProps) {
  const STEPS = [
    { num: '01', title: 'Register', desc: 'Create your profile and showcase your services' },
    { num: '02', title: 'Verification', desc: 'We verify your information and ensure credibility' },
    { num: '03', title: 'Go Global', desc: 'Get discovered by customers worldwide' },
    { num: '04', title: 'Generate Opportunities', desc: 'Build trust, build partnerships and grow' },
  ];

  const FEATURES = [
    { icon: Globe, t: "Trusted Visibility", d: "Be seen by patients and families looking for expert care" },
    { icon: Target, t: "Better Connections", d: "Talk directly with patients ready for treatment" },
    { icon: Briefcase, t: "Supporting Doctors", d: "Expand your reach and help more people heal" },
    { icon: BarChart3, t: "Care Insights", d: "Understand your patient reach and community impact" },
    { icon: Bot, t: "Smart Matching", d: "We connect you with patients who need your specific skills" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative py-32 bg-white overflow-hidden">
        <div className="absolute inset-0 opacity-40">
           <div className="absolute inset-y-0 left-[10%] w-[1px] bg-navy/5" />
           <div className="absolute inset-y-0 right-[10%] w-[1px] bg-navy/5" />
           <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 opacity-50" />
        </div>

        <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
          <div className="w-full lg:flex-1 space-y-10">
            <div className="flex items-center gap-3">
               <div className="w-8 h-1 bg-brand-red rounded-full shadow-lg shadow-brand-red/20" />
               <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[10px]">For doctors and clinics</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-light leading-[0.9] tracking-tighter text-navy mb-8">
              Helping your care <br />
              <span className="font-serif italic font-medium text-gradient pr-2">reach the world.</span>
            </h1>
            <p className="text-xl text-navy/40 max-w-xl font-medium leading-relaxed mb-10">
              Connect with families who need your expertise. We handle the logistics so you can focus on what matters most—delivering exceptional patient care.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
               <button 
                 onClick={onPartnerWithUs}
                 className="px-12 py-6 bg-navy text-white rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-brand-red transition-all shadow-2xl active:scale-95"
               >
                 Join the Global Network
               </button>
               <button onClick={onLogin} className="px-12 py-6 border border-navy/10 rounded-full text-xs font-bold uppercase tracking-widest text-navy hover:bg-navy/5 transition-all inline-flex items-center gap-3">
                  <LogIn size={16} />
                  Vendor Login
               </button>
            </div>
          </div>

          <div className="relative group">
             <motion.div
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="relative z-10"
             >
                <div className="bg-navy p-3 rounded-[56px] shadow-[0_50px_100px_rgba(10,17,31,0.25)]">
                   <div className="bg-[#051622] rounded-[48px] overflow-hidden border border-white/5 aspect-[4/3] relative">
                      <img src="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                      <div className="absolute inset-0 p-10 flex flex-col justify-between">
                         <div className="flex justify-between items-start">
                            <div className="space-y-1">
                               <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Facility Registry</p>
                               <p className="text-sm font-bold text-white tracking-tight">Alliance Hub v2.1</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                               <BarChart3 size={18} />
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                               <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Total Inquiries</p>
                               <p className="text-2xl font-serif italic text-white">48,560</p>
                            </div>
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                               <p className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-2">Growth Rate</p>
                               <p className="text-2xl font-serif italic text-emerald-400">+18.5%</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </motion.div>
             <div className="absolute -inset-10 bg-cyan/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan/20 transition-all" />
          </div>
        </div>
      </section>

      {/* Feature Grid - Dark Block */}
      <section className="bg-[#051622] py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {FEATURES.map((f, i) => (
              <div key={i} className="space-y-6 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-white transition-all shadow-xl">
                  <f.icon size={24} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-tight">{f.t}</h4>
                  <p className="text-xs text-white/40 leading-relaxed font-medium">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Everything You Need to Succeed */}
      <section className="py-32 bg-white relative">
         <div className="container mx-auto px-4 md:px-12 lg:px-24">
            <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
               <div className="w-full lg:flex-1 space-y-12">
                  <div>
            <h2 className="text-5xl font-light tracking-tighter text-navy mb-8">Support for your <span className="font-serif italic font-medium text-gradient pr-2">practice.</span></h2>
            <p className="text-lg text-navy/40 font-medium max-w-xl">We provide the tools you need to build trust and care for patients across borders.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {[
              { i: Briefcase, t: "Trusted Online Presence", d: "Showcase your team, specialties, and facility to a global audience of patients." },
              { i: Target, t: "Patient Connections", d: "Get in touch with patients looking for the high-quality care you provide." },
              { i: Globe, t: "Borderless Care", d: "Make it easy for international patients to visit your clinic." },
              { i: Bot, t: "Smart Matching", d: "Our simple matchmaking process connects you with the right patients." },
              { i: ShieldCheck, t: "Verified Status", d: "Join a network that patients trust for its clinical and safety standards." },
            ].map((item, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="w-12 h-12 rounded-2xl border border-navy/5 bg-slate-bg flex items-center justify-center text-navy shrink-0 group-hover:bg-navy group-hover:text-white transition-all">
                          <item.i size={20} strokeWidth={1.5} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-navy mb-2">{item.t}</h4>
                          <p className="text-xs text-navy/40 leading-relaxed font-medium">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-slate-bg p-12 rounded-[48px] border border-navy/5">
                  <h3 className="text-xl font-bold text-navy mb-8 tracking-tight">Who Can Join GMAA?</h3>
                  <div className="space-y-4">
                    {[
                      "Hospitals & Speciality Centers",
                      "Air & Ground Ambulance Services",
                      "Diagnostic & Laboratory Networks",
                      "Homecare & Long-Term Care",
                      "Pharmaceutical & Medical Supplies",
                      "Medical Equipment & Devices",
                      "Telemedicine & Digital Health",
                      "Health Insurance & TPA",
                      "Rehabilitation & Wellness",
                      "Sports Medicine & Physiotherapy",
                      "Alternative & Complementary Medicine",
                      "Clinical Research & CRO",
                      "Healthcare IT & Tech Companies",
                      "Senior Care & Assisted Living"
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        <span className="text-xs font-bold text-navy/60 uppercase tracking-wide">{item}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={onPartnerWithUs} className="w-full mt-12 py-5 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-cyan transition-all shadow-xl">
                     Become a Member
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-48 bg-navy relative overflow-hidden">
         <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
         <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-black/20 to-transparent" />
         <div className="container mx-auto px-4 md:px-12 lg:px-24 text-center relative z-10">
            <h2 className="text-5xl md:text-8xl font-light tracking-tighter text-white mb-16 leading-[0.9]">
               Be part of the future <br />
               <span className="font-serif italic font-medium text-gradient pr-2">of global healthcare.</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
               <button onClick={onPartnerWithUs} className="px-16 py-7 bg-white text-navy rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all shadow-2xl active:scale-95">
                  Join GMAA Now
               </button>
               <button onClick={onLogin} className="px-16 py-7 border border-white/20 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-navy transition-all active:scale-95 inline-flex items-center gap-3">
                  <LogIn size={16} />
                  Vendor Login
               </button>
            </div>
         </div>
      </section>
    </div>
  );
}
