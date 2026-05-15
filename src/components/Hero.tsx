import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES, REGIONS } from '../constants';
import { Search, ChevronDown, MapPin, Activity, ArrowRight, Plane, Building2, FlaskConical, LifeBuoy } from 'lucide-react';

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1579154238337-142f360a7e6b?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1631815587644-b83075b9533a?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586773860418-d37222d8fce2?auto=format&fit=crop&q=80"
];

const LIVE_ACTIVITIES = [
  { id: 1, icon: Plane, color: 'text-cyan', text: 'Air ambulance requested', detail: 'from Dubai to London', time: '2 min ago' },
  { id: 2, icon: Building2, color: 'text-emerald-500', text: 'Hospital joined', detail: 'from Istanbul, Turkey', time: '5 min ago' },
  { id: 3, icon: FlaskConical, color: 'text-amber-500', text: 'Diagnostic inquiry', detail: 'from New York, USA', time: '8 min ago' },
];

interface HeroProps {
  onSourceVendors?: (service?: string, region?: string) => void;
  onPortalChange?: (portal: 'patient' | 'vendor') => void;
}

export default function Hero({ onSourceVendors, onPortalChange }: HeroProps) {
  const [service, setService] = useState('');
  const [region, setRegion] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const filteredServices = SERVICES.filter(s => 
    s.toLowerCase().includes(serviceSearch.toLowerCase()) && s !== serviceSearch
  );

  const filteredRegions = REGIONS.filter(r => 
    r.toLowerCase().includes(regionSearch.toLowerCase()) && r !== regionSearch
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden bg-white">
      {/* Slideshow Background */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.45, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center grayscale opacity-60"
            style={{ backgroundImage: `url(${BACKGROUND_IMAGES[currentImage]})` }}
          />
        </AnimatePresence>
        
        {/* Soft Vignette and Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white opacity-30" />

        {/* Floating Blurs */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-20 w-96 h-96 bg-cyan/10 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], x: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-navy/5 rounded-full blur-[140px]" 
        />

        {/* Abstract Medical Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 0.1, 0],
                y: [Math.random() * 100, Math.random() * -100],
                x: [Math.random() * 50, Math.random() * -50]
              }}
              transition={{ 
                duration: 10 + Math.random() * 10, 
                repeat: Infinity,
                delay: i * 2 
              }}
              className="absolute text-navy"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              <Activity size={24 + i * 8} strokeWidth={1} />
            </motion.div>
          ))}
        </div>

        {/* Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      <div className="container mx-auto px-4 md:px-12 lg:px-24 w-full relative z-10 mx-auto">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
          <div className="w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <h2 className="text-xl font-bold text-navy mb-4 tracking-tighter">Your Health, Without Borders</h2>
              <h1 className="text-4xl sm:text-5xl md:text-8xl font-light tracking-tighter text-navy mb-8 md:mb-10 leading-[1.1] md:leading-[0.9]">
                Expert care <span className="font-serif italic text-gradient font-medium pr-2">wherever</span> <br className="hidden sm:block" /> 
                you need it most.
              </h1>
              
              <p className="text-lg md:text-xl text-navy/50 max-w-2xl mb-12 font-medium leading-relaxed">
                We've built a trusted network of the world's best doctors and clinics. 
                Because when it comes to your health, the only thing that matters is getting you the best care possible.
              </p>

              {/* Natural Language Search Box */}
              <div className="max-w-4xl">
                <div className="bg-white/95 backdrop-blur-xl rounded-[30px] md:rounded-[40px] p-2 border border-navy/10 shadow-2xl shadow-navy/10 hover:shadow-cyan/20 hover:border-cyan/30 transition-all duration-500">
                  <div className="flex flex-col lg:flex-row items-center gap-1 md:gap-4 p-2 md:p-3 lg:pl-10 lg:pr-3">
                    <Search className="text-navy/20 hidden min-[1400px]:block shrink-0 mr-2" size={22} />
                    
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-2 md:gap-4 lg:gap-x-8 w-full py-2">
                      {/* Service Section */}
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/30 italic shrink-0 md:hidden">Looking for:</span>
                        <div className="relative flex-1">
                          <input 
                            type="text"
                            value={serviceSearch}
                            onChange={(e) => {
                              setServiceSearch(e.target.value);
                              setShowServiceSuggestions(true);
                            }}
                            onFocus={() => setShowServiceSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowServiceSuggestions(false), 200)}
                            className="w-full bg-transparent border-b-2 border-navy/5 font-serif italic font-bold focus:outline-none focus:border-cyan text-lg md:text-xl lg:text-2xl pb-1 px-1 transition-all outline-none md:min-w-[200px] lg:min-w-[320px] placeholder:text-navy/10"
                            placeholder="medical service..."
                          />
                          <AnimatePresence>
                            {showServiceSuggestions && filteredServices.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 w-full md:w-[400px] bg-white border border-navy/5 rounded-3xl shadow-2xl z-50 p-2 mt-4 max-h-[300px] overflow-y-auto scrollbar-hide"
                              >
                                <div className="px-4 py-2 border-b border-navy/5 mb-2">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-navy/20 italic">Select Category</span>
                                </div>
                                {filteredServices.map(s => (
                                  <button
                                    key={s}
                                    onClick={() => {
                                      setServiceSearch(s);
                                      setService(s);
                                      setShowServiceSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-bg rounded-2xl text-[10px] md:text-xs font-bold text-navy/60 hover:text-navy transition-all uppercase tracking-widest flex items-center justify-between group"
                                  >
                                    <span>{s}</span>
                                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/30 italic hidden lg:block">in</span>

                      {/* Region Section */}
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/30 italic shrink-0 md:hidden">Region:</span>
                        <div className="relative flex-1">
                          <input 
                            type="text"
                            value={regionSearch}
                            onChange={(e) => {
                              setRegionSearch(e.target.value);
                              setShowRegionSuggestions(true);
                            }}
                            onFocus={() => setShowRegionSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowRegionSuggestions(false), 200)}
                            className="w-full bg-transparent border-b-2 border-navy/5 font-serif italic font-bold focus:outline-none focus:border-cyan text-lg md:text-xl lg:text-2xl pb-1 px-1 transition-all outline-none md:min-w-[100px] lg:min-w-[160px] placeholder:text-navy/10"
                            placeholder="region..."
                          />
                          <AnimatePresence>
                            {showRegionSuggestions && filteredRegions.length > 0 && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-full left-0 w-full md:w-64 bg-white border border-navy/5 rounded-3xl shadow-2xl z-50 p-2 mt-4 max-h-60 overflow-y-auto"
                              >
                                {filteredRegions.map(r => (
                                  <button
                                    key={r}
                                    onClick={() => {
                                      setRegionSearch(r);
                                      setRegion(r);
                                      setShowRegionSuggestions(false);
                                    }}
                                    className="w-full text-left px-4 py-3 hover:bg-slate-bg rounded-2xl text-[10px] md:text-xs font-bold text-navy/60 hover:text-navy transition-all uppercase tracking-widest"
                                  >
                                    {r}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => onSourceVendors?.(serviceSearch, regionSearch)}
                      className="relative overflow-hidden w-full md:w-auto px-10 py-5 bg-navy text-white rounded-[25px] md:rounded-[30px] text-xs font-bold uppercase tracking-[0.2em] group/btn shadow-xl active:scale-95 shrink-0 transition-all"
                    >
                      <div className="absolute inset-0 bg-cyan -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Search <span className="hidden md:inline">Network</span> <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                    </button>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-wrap gap-8 items-center justify-center md:justify-start">
                   <p className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">Popular Searches:</p>
                   {['Cardiac Surgery', 'Diagnostic Centers', 'Wellness'].map(s => (
                     <button key={s} className="text-[10px] font-bold text-navy/40 uppercase tracking-widest hover:text-cyan transition-colors">{s}</button>
                   ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Live Activity Widget */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-8 border border-navy/5 shadow-2xl relative overflow-hidden group">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-navy">Live Activity</h3>
                  <div className="flex gap-1">
                     <span className="w-1 h-1 rounded-full bg-cyan animate-pulse" />
                     <span className="w-1 h-1 rounded-full bg-cyan animate-pulse delay-75" />
                     <span className="w-1 h-1 rounded-full bg-cyan animate-pulse delay-150" />
                  </div>
               </div>

               <div className="space-y-6">
                  {LIVE_ACTIVITIES.map((act) => (
                    <div key={act.id} className="flex gap-4 group/item">
                       <div className="w-10 h-10 rounded-xl bg-slate-bg flex items-center justify-center shrink-0 group-hover/item:bg-navy group-hover/item:text-white transition-colors">
                          <act.icon size={18} className={act.color} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-0.5">
                             <p className="text-[10px] font-black text-navy uppercase">{act.text}</p>
                             <span className="text-[8px] font-bold text-navy/20 uppercase whitespace-nowrap ml-4">{act.time}</span>
                          </div>
                          <p className="text-[10px] text-navy/40 font-medium truncate">{act.detail}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <button className="w-full mt-8 pt-6 border-t border-navy/5 text-[9px] font-black uppercase tracking-widest text-cyan hover:text-brand-red transition-colors flex items-center justify-center gap-2">
                  View All Activity <ArrowRight size={10} />
               </button>
            </div>
          </motion.div>
        </div>

        {/* Choose Your Experience Section */}
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.6 }}
           className="mt-32"
        >
           <h3 className="text-center text-xs font-black uppercase tracking-[0.4em] text-navy/20 mb-12 italic">Choose Your Experience</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div 
                onClick={() => onPortalChange?.('patient')}
                className="bg-slate-bg/50 backdrop-blur-sm p-6 sm:p-10 rounded-[30px] md:rounded-[40px] border border-navy/5 group hover:bg-white hover:shadow-2xl transition-all cursor-pointer flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center shadow-sm"
              >
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-cyan/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-cyan shrink-0 group-hover:scale-110 transition-transform">
                    <LifeBuoy size={32} />
                 </div>
                 <div className="flex-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-cyan mb-2 block">I am looking for</span>
                    <h4 className="text-xl sm:text-2xl font-bold text-navy mb-2 sm:mb-4">Healthcare Services</h4>
                    <p className="text-[10px] sm:text-xs text-navy/40 font-medium mb-6 leading-relaxed">Access worldwide hospitals, diagnostic centers, and air ambulance services with a single click.</p>
                    <button 
                      className="w-full sm:w-auto px-8 py-3 bg-cyan text-white text-[10px] font-bold uppercase tracking-widest rounded-xl group-hover:bg-navy transition-all shadow-lg shadow-cyan/20"
                    >
                      Enter Client Portal
                    </button>
                 </div>
              </div>

              <div 
                onClick={() => onPortalChange?.('vendor')}
                className="bg-slate-bg/50 backdrop-blur-sm p-6 sm:p-10 rounded-[30px] md:rounded-[40px] border border-navy/5 group hover:bg-white hover:shadow-2xl transition-all cursor-pointer flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center shadow-sm"
              >
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-red/10 rounded-2xl sm:rounded-3xl flex items-center justify-center text-brand-red shrink-0 group-hover:scale-110 transition-transform">
                    <Building2 size={32} strokeWidth={1.5} />
                 </div>
                 <div className="flex-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-red mb-2 block">I am a</span>
                    <h4 className="text-xl sm:text-2xl font-bold text-navy mb-2 sm:mb-4">Healthcare Business</h4>
                    <p className="text-[10px] sm:text-xs text-navy/40 font-medium mb-6 leading-relaxed">Scale your healthcare institution globally, generate quality leads, and connect with international partners.</p>
                    <button 
                      className="w-full sm:w-auto px-8 py-3 bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest rounded-xl group-hover:bg-navy transition-all shadow-lg shadow-brand-red/20"
                    >
                      Enter Vendor Portal
                    </button>
                 </div>
              </div>
           </div>
        </motion.div>
      </div>
    </section>
  );
}
