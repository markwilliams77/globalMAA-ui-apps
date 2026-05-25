import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, MapPin, ArrowUpRight } from 'lucide-react';

interface InteractiveMapProps {
  onVisitRegistry?: () => void;
}

export default function InteractiveMap({ onVisitRegistry }: InteractiveMapProps) {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const regionStats = [
    { 
      name: "India", 
      x: "73.5%", 
      y: "46%", 
      vendors: 124, 
      focus: "Specialized Surgery",
      specialties: ["Cardiac Surgery", "Oncology", "Orthopedics", "IVF"]
    },
    { 
      name: "Thailand", 
      x: "80%", 
      y: "54%", 
      vendors: 85, 
      focus: "Wellness & Recovery",
      specialties: ["Stem Cell", "Cosmetic Surgery", "Physical Rehab"]
    },
    { 
      name: "Turkey", 
      x: "59%", 
      y: "34%", 
      vendors: 92, 
      focus: "Dental & Aesthetics",
      specialties: ["Hair Transplant", "Advanced Dentistry", "Dermatology"]
    },
    { 
      name: "Mexico", 
      x: "18%", 
      y: "48%", 
      vendors: 78, 
      focus: "Bariatric & Restorative",
      specialties: ["Weight Loss Surgery", "Neurology", "Pain Management"]
    },
    { 
      name: "Spain", 
      x: "47.5%", 
      y: "28%", 
      vendors: 45, 
      focus: "Logistics & Fertility",
      specialties: ["Cryopreservation", "Genetic Screening", "Donor Services"]
    },
    { 
      name: "Malaysia", 
      x: "81%", 
      y: "62%", 
      vendors: 38, 
      focus: "Diagnostic Excellence",
      specialties: ["Digital Imaging", "Pathology", "Biomarker Testing"]
    },
  ];

  const selectedRegion = regionStats.find(r => r.name === activeRegion);

  return (
    <section className="py-40 bg-navy relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
         <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-white to-transparent opacity-10" />
         <div className="absolute inset-0 opacity-5 bg-[url('https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80&w=2000')] bg-cover" />
         <div className="absolute inset-0 noise opacity-5" />
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-32">
          <div className="w-full lg:flex-1 space-y-8 md:space-y-10">
            <div className="flex items-center gap-3">
               <Activity className="text-brand-red animate-pulse" size={18} />
               <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[9px] md:text-[10px]">Global Infrastructure</span>
            </div>
            
            <h2 className="text-4xl md:text-7xl font-light text-white leading-[1.1] md:leading-[0.9] tracking-tighter">
              Healthcare <br className="hidden md:block" /> 
              <span className="font-serif italic font-medium text-cyan pr-2">without borders.</span>
            </h2>

            <p className="text-lg md:text-xl text-white/40 leading-relaxed font-medium max-w-md">
              A borderless medical alliance engineered to connect patients with elite global health providers and specialized care networks.
            </p>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 pt-4 md:pt-8">
               {[
                 { l: "Global Hubs", v: "24" },
                 { l: "Verified Vendors", v: "2,500+" }
               ].map((s, i) => (
                 <div key={i} className="border-l border-white/10 pl-4 md:pl-6">
                    <p className="text-2xl md:text-3xl font-serif italic text-white mb-1 md:mb-2">{s.v}</p>
                    <p className="mixed-caps text-[7px] md:text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold">{s.l}</p>
                 </div>
               ))}
            </div>
          </div>

          <div className="w-full lg:flex-[1.5] relative">
            <div 
              className="glass bg-white/[0.03] border-white/10 rounded-[32px] md:rounded-[48px] p-4 md:p-8 aspect-square md:aspect-video flex items-center justify-center relative group overflow-hidden shadow-2xl"
              onMouseLeave={() => setActiveRegion(null)}
            >
              {/* World Map Background Layer - Distinct White */}
              <div className="absolute inset-0 z-0 overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-radial from-white/20 to-transparent opacity-30" />
                
                {/* High Contrast World Map - Forced White */}
                <svg viewBox="0 0 1000 500" className="w-full h-full opacity-60 transition-all duration-700 group-hover:scale-[1.02] group-hover:opacity-80">
                  <image 
                    href="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
                    width="1000" 
                    height="500" 
                    style={{ 
                      filter: 'invert(100%) brightness(3) contrast(2)',
                    }} 
                  />
                </svg>
                
                <div className="absolute inset-0 bg-gradient-radial from-transparent via-navy/5 to-navy/80" />
              </div>

              {/* Grid Lines for Map - Subtle white */}
              <div className="absolute inset-0 z-1 pointer-events-none">
                <div className="grid grid-cols-12 h-full w-full opacity-[0.03]">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border-r border-white/30" />
                  ))}
                </div>
              </div>

              {/* Technical Scanline effect */}
              <div className="absolute inset-0 pointer-events-none z-[2] bg-scanlines opacity-[0.03]" />

              {/* Interactive Nodes Layer - Blue Points Realigned */}
              <div className="relative w-full h-full z-10">
                 {regionStats.map((pos) => (
                   <motion.button
                     key={pos.name}
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     onMouseEnter={() => setActiveRegion(pos.name)}
                     className="absolute w-5 h-5 rounded-full bg-cyan border-2 border-white hover:border-white hover:scale-125 transition-all group/node shadow-[0_0_20px_rgba(0,229,255,0.6)]"
                     style={{ 
                       left: pos.x, 
                       top: pos.y,
                       transform: 'translate(-50%, -50%)'
                     }}
                   >
                     <div className="absolute inset-0 rounded-full bg-cyan animate-ping opacity-40" />
                     {activeRegion === pos.name && (
                       <motion.div 
                        layoutId="dot-ring"
                        className="absolute -inset-2 md:-inset-3 border-2 border-cyan/40 rounded-full" 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                       />
                     )}
                   </motion.button>
                 ))}
                 
                 {/* Decorative connecting lines - Blue themed */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
                    <defs>
                      <linearGradient id="lineGradientBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00E5FF" stopOpacity="0" />
                        <stop offset="50%" stopColor="#00E5FF" stopOpacity="1" />
                        <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.path 
                      d="M 20 45 Q 40 30 55 35" 
                      stroke="url(#lineGradientBlue)" 
                      fill="transparent" 
                      strokeWidth="1"
                    />
                 </svg>
              </div>

              {/* Hover Stats Dashboard */}
              <AnimatePresence>
                {activeRegion && selectedRegion && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute inset-x-4 bottom-4 md:inset-x-auto md:bottom-12 md:right-12 glass bg-white/95 border-cyan/10 text-navy p-6 md:p-8 rounded-[24px] md:rounded-[32px] md:w-80 shadow-2xl backdrop-blur-3xl z-50 pointer-events-auto"
                  >
                    <div className="flex justify-between items-start mb-4 md:mb-6">
                        <div>
                          <p className="mixed-caps text-navy/30 mb-1 md:mb-2 uppercase text-[7px] md:text-[8px] font-bold">Region Hub</p>
                          <h4 className="text-xl md:text-2xl font-serif italic pr-2">{selectedRegion.name}</h4>
                       </div>
                       <button 
                         onClick={() => setActiveRegion(null)}
                         className="md:hidden p-2 text-navy/20 hover:text-navy"
                       >
                          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                       </button>
                       <div className="hidden md:flex w-12 h-12 rounded-2xl bg-cyan/5 items-center justify-center">
                          <MapPin size={24} className="text-cyan" />
                       </div>
                    </div>
                    
                    <div className="space-y-4 md:space-y-6">
                       <div className="flex justify-between text-[10px] md:text-xs">
                          <span className="text-navy/40 font-bold uppercase tracking-widest text-[7px] md:text-[8px]">Capacity</span>
                          <span className="font-bold text-cyan">{selectedRegion.vendors} Hubs</span>
                       </div>
                       
                       <div className="pt-3 md:pt-4 border-t border-navy/5 space-y-3 md:space-y-4">
                          <p className="text-navy/30 uppercase text-[7px] md:text-[8px] font-bold tracking-widest">Specialties</p>
                          <div className="flex flex-wrap gap-1.5 md:gap-2">
                             {selectedRegion.specialties.map((s, idx) => (
                               <span 
                                 key={idx}
                                 className="px-2 py-1 rounded-lg bg-navy/5 border border-navy/10 text-[8px] md:text-[9px] font-bold text-navy/70"
                               >
                                 {s}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={onVisitRegistry}
                      className="w-full mt-6 md:mt-8 py-3 md:py-4 rounded-xl bg-cyan text-navy text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(0,229,255,0.2)]"
                    >
                       Explore Registry
                       <ArrowUpRight size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
