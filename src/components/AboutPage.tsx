import { motion } from 'motion/react';
import { Shield, Globe, Activity, Users, Award, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-40 pb-24 bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-12 lg:px-24 mb-32">
        <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-end">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-brand-red rounded-full" />
              <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[10px]">WHO WE ARE</span>
            </div>
            <h1 className="text-5xl md:text-[8vw] font-light tracking-tighter leading-[1] text-navy mb-12">
              Helping the <br />
              <span className="text-gradient font-bold text-[1.05em] pr-2">World Heal.</span>
            </h1>
            <p className="text-xl md:text-2xl text-navy/40 max-w-2xl font-medium leading-relaxed">
              Global Med Access Alliance (GMAA) is more than just a directory. We're a team dedicated to helping you find the best care possible, no matter how far you have to travel.
            </p>
          </div>
          <div className="hidden lg:block w-[1px] h-64 bg-navy/5" />
          <div className="flex flex-col gap-8 pb-4">
             <div className="group">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-2">Verified Network</p>
                <p className="text-2xl font-bold text-navy group-hover:text-cyan transition-colors">50,000+ Vendors</p>
             </div>
             <div className="group">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-2">Global Coverage</p>
                <p className="text-2xl font-bold text-navy group-hover:text-cyan transition-colors">120+ Nations</p>
             </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-navy py-32 text-white relative overflow-hidden mb-32">
        <div className="absolute inset-0 opacity-[0.03] noise" />
        <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 md:gap-32">
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                 <Shield className="text-brand-red" size={32} />
                 <h2 className="text-4xl md:text-5xl font-light tracking-tight">Our Mission</h2>
              </div>
              <p className="text-xl text-white/40 leading-relaxed font-bold">
                "To give every person the power to find the best medical care. We believe that health should have no borders, and everyone deserves a clear, safe path to recovery."
              </p>
            </div>
            <div className="space-y-12">
              <div className="flex items-center gap-4">
                 <Activity className="text-cyan" size={32} />
                 <h2 className="text-4xl md:text-5xl font-light tracking-tight">Expertise You Can Trust</h2>
              </div>
              <p className="text-xl text-white/40 leading-relaxed">
                We work with the world's most talented specialists and clinics to ensure you the best outcomes. Every doctor and hospital in our network is chosen for their skill, compassion, and dedication to their patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 md:px-12 lg:px-24 mb-48">
        <div className="flex flex-col md:flex-row items-baseline justify-between mb-24 gap-4">
           <h2 className="text-5xl font-light tracking-tighter text-navy flex items-center gap-4">
              <span className="text-gradient font-bold pr-2">Directory</span> Categories
           </h2>
           <p className="text-navy/40 font-medium max-w-md">Our network encompasses every facet of the medical journey, from initial screening to advanced surgery.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { t: "Hospitals", d: "Multi-specialty institutions with international accreditation." },
            { t: "Clinics", d: "Boutique surgical and aesthetic centers of excellence." },
            { t: "Diagnostics", d: "Advanced imaging and precision laboratory networks." },
            { t: "Special Care", d: "Emergency logistics, air ambulances, and specialized recovery." }
          ].map((v, i) => (
            <div key={i} className="p-8 border border-navy/5 rounded-[40px] hover:bg-slate-bg transition-colors group">
               <div className="text-brand-red font-bold text-2xl mb-6 opacity-40 group-hover:opacity-100 Transition-opacity">0{i+1}</div>
               <h3 className="text-xl font-bold text-navy mb-4">{v.t}</h3>
               <p className="text-sm text-navy/40 leading-relaxed font-medium">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4 md:px-12 lg:px-24 mb-48">
        <div className="text-center mb-24">
           <span className="text-cyan font-bold uppercase tracking-[0.6em] text-[10px] mb-6 inline-block">What we believe in</span>
           <h2 className="text-5xl md:text-7xl font-light tracking-tighter text-navy">Built on <span className="text-gradient font-bold pr-2">Trust.</span></h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-navy/5 border border-navy/5">
          {[
            { icon: Activity, t: "Always Available", d: "We're here 24/7 to help you navigate your medical journey whenever you need us." },
            { icon: Globe, t: "Clear Communication", d: "We help bridge language and cultural gaps so you always know what to expect." },
            { icon: Award, t: "Real Quality", d: "We look beyond the certificates to find clinics that truly prioritize their patients." },
            { icon: Users, t: "Partners in Care", d: "We work alongside doctors to ensure you have a seamless experience from start to finish." },
            { icon: Shield, t: "Your Safety First", d: "Your health and safety are our top priorities in everything we do." },
            { icon: Zap, t: "Quick Response", d: "When you need help, our global team acts fast to get you the care you require." }
          ].map((v, i) => (
            <div key={i} className="bg-white p-16 group hover:bg-slate-bg transition-all duration-700">
               <v.icon className="text-navy group-hover:text-brand-red transition-all mb-8" size={32} strokeWidth={1.5} />
               <h3 className="text-2xl font-bold text-navy mb-4">{v.t}</h3>
               <p className="text-navy/40 leading-relaxed font-medium">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 md:px-12 lg:px-24 mb-48">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          <div className="flex-1">
             <div className="sticky top-40">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-1 bg-brand-red rounded-full" />
                  <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[10px]">The Genesis</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-light text-navy leading-[1] tracking-tighter mb-12">
                   Our <span className="text-gradient font-bold pr-2">Story.</span>
                </h2>
                <div className="space-y-6 text-xl text-navy/40 leading-relaxed font-bold max-w-sm">
                   <p>"It began with a simple observation: Healthcare is global, but access is fragmented. We set out to change that."</p>
                </div>
             </div>
          </div>
          <div className="flex-[1.5] space-y-12">
             <p className="text-2xl text-navy leading-relaxed font-light">
                Global Med Access Alliance was born out of a critical need for transparency in the international healthcare market. Our founders recognized that while the world possesses incredible medical talent and technology, the pathways for patients to safely and efficiently access those resources were often broken.
             </p>
             <p className="text-xl text-navy/60 leading-relaxed">
                What started as a small, focused initiative to bridge surgical corridors in South Asia has evolved into the world's most comprehensive medical directory and logistics infrastructure. We have spent years vetting partners, auditing clinics, and building the digital architecture that now supports over 50,000 providers worldwide.
             </p>
             <div className="grid grid-cols-2 gap-12 pt-8">
                <div className="p-8 bg-slate-bg rounded-[32px]">
                   <h4 className="text-navy font-bold mb-2">The Pivot</h4>
                   <p className="text-sm text-navy/40">From a simple directory to an institutional coordination layer.</p>
                </div>
                <div className="p-8 bg-navy text-white rounded-[32px]">
                   <h4 className="font-bold mb-2 text-cyan">The Impact</h4>
                   <p className="text-sm text-white/40">Facilitating cross-border care for thousands of families every year.</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Leadership / Founder Section */}
      <section className="container mx-auto px-4 md:px-12 lg:px-24 py-32 border-t border-navy/5">
         <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
            <div className="flex-1 relative">
               <div className="aspect-[4/5] bg-slate-bg rounded-[64px] overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000" 
                    alt="Dr. Alisha Singh"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute bottom-12 left-12">
                     <p className="text-white font-bold text-2xl mb-1">Dr. Alisha Singh</p>
                     <p className="text-white/60 uppercase tracking-widest text-[10px] font-bold">Founder & CEO</p>
                  </div>
               </div>
               <div className="absolute -top-12 -right-12 w-48 h-48 border border-navy/5 rounded-full flex items-center justify-center p-8 text-center animate-spin-slow">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-navy/20">Institutional Excellence • Global Access • Medical Integrity •</p>
               </div>
            </div>
            <div className="flex-1 space-y-8">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-1 bg-brand-red rounded-full" />
                  <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[10px]">Strategic Vision</span>
               </div>
               <h2 className="text-5xl md:text-7xl font-light text-navy leading-[1] tracking-tighter">
                  A New Era of <br />
                  <span className="text-gradient font-bold pr-2">Healthcare Logistics.</span>
               </h2>
               <p className="text-xl text-navy/40 leading-relaxed font-medium">
                  "Our goal was never to build just another directory. We set out to create a unified institutional layer—an alliance that bridges the gap between patient urgency and global medical capacity. GMAA is the realization of that vision."
               </p>
               <div className="flex gap-12 pt-8">
                  <div>
                     <p className="text-3xl font-bold text-navy mb-1">15+</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Years Expertise</p>
                  </div>
                  <div>
                     <p className="text-3xl font-bold text-navy mb-1">24</p>
                     <p className="text-[10px] font-bold uppercase tracking-widest text-navy/30">Strategic Regions</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
