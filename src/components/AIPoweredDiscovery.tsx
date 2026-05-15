import { motion, AnimatePresence } from 'motion/react';
import { Search, Bot, Star, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { discoverHealthcare, HealthProvider } from '../services/geminiService';

const INITIAL_RECOMMENDATIONS = [
  {
    name: 'Bangkok Heart Hospital',
    location: 'Bangkok, Thailand',
    specialty: 'Cardiology • 250+ Beds',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1587350859728-117699f4a1ec?auto=format&fit=crop&q=80',
    description: 'Specialized cardiac care with international standards.'
  },
  {
    name: 'Bumrungrad International',
    location: 'Bangkok, Thailand',
    specialty: 'Cardiology • 580+ Beds',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80',
    description: 'One of the largest private hospitals in Southeast Asia.'
  },
  {
    name: 'Samitivej Sukhumvit Hospital',
    location: 'Bangkok, Thailand',
    specialty: 'Cardiology • 300+ Beds',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80',
    description: 'Expert medical care in the heart of Bangkok.'
  }
];

export default function AIPoweredDiscovery() {
  const [query, setQuery] = useState('');
  const [recommendations, setRecommendations] = useState<HealthProvider[]>(INITIAL_RECOMMENDATIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const results = await discoverHealthcare(query);
      if (results && results.length > 0) {
        setRecommendations(results);
        setIsAiGenerated(true);
      }
    } catch (error) {
      console.error("Discovery failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full lg:flex-1 space-y-8 md:space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan/10 flex items-center justify-center text-cyan shadow-sm shadow-cyan/10 shrink-0">
                   <Sparkles size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tighter text-navy uppercase">Find your specialist</h2>
              </div>
              <p className="text-lg md:text-xl text-navy/40 font-medium max-w-xl leading-relaxed">
                Tell us about your needs, and we'll help you find the most qualified doctors in our network. We're here to make your search simple and stress-free.
              </p>
            </div>

            <div className="relative group w-full max-w-xl">
               <div className="absolute inset-0 bg-cyan/5 rounded-[24px] md:rounded-[32px] blur-2xl group-hover:bg-cyan/10 transition-all" />
               <div className="relative bg-white border border-navy/5 rounded-[24px] md:rounded-[32px] p-1.5 md:p-2 shadow-2xl shadow-navy/5 flex items-center">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-navy/20 shrink-0 ml-1 md:ml-2">
                     <Search size={22} />
                  </div>
                  <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search hospitals..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-lg md:text-xl font-serif italic text-navy placeholder:text-navy/10 px-2 md:px-4"
                  />
                  <button 
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-cyan text-white flex items-center justify-center shadow-lg shadow-cyan/20 active:scale-90 transition-all mr-1 md:mr-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                     <AnimatePresence mode="wait">
                       {isLoading ? (
                         <motion.div
                           key="loader"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                         >
                           <Loader2 className="animate-spin" size={20} />
                         </motion.div>
                       ) : (
                         <motion.div
                           key="arrow"
                           initial={{ opacity: 0 }}
                           animate={{ opacity: 1 }}
                           exit={{ opacity: 0 }}
                         >
                           <ArrowRight size={20} />
                         </motion.div>
                       )}
                     </AnimatePresence>
                  </button>
               </div>
            </div>
            
            <div className="pt-8 md:pt-12 grid grid-cols-2 gap-8 md:gap-12 border-t border-navy/5">
               <div>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">99.8%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 italic">Accuracy</p>
               </div>
               <div>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-navy mb-2">Instant</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-navy/40 italic">Speed</p>
               </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-6 w-full"
          >
            <div className="flex justify-between items-center px-4">
              <div className="flex items-center gap-2">
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-navy/40 italic">
                  {isAiGenerated ? 'AI Matches' : 'Recommended'}
                </h3>
                {isAiGenerated && <Sparkles size={12} className="text-cyan animate-pulse" />}
              </div>
              <button 
                onClick={() => {
                  setRecommendations(INITIAL_RECOMMENDATIONS);
                  setIsAiGenerated(false);
                  setQuery('');
                }}
                className="text-[10px] font-black uppercase tracking-widest text-cyan hover:text-brand-red transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {recommendations.map((item, i) => (
                  <motion.div 
                    key={item.name}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative bg-white border border-navy/5 rounded-2xl md:rounded-3xl p-3 md:p-4 flex gap-4 md:gap-6 hover:shadow-2xl hover:shadow-navy/5 transition-all cursor-pointer"
                  >
                     <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden shrink-0 border border-navy/5">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          referrerPolicy="no-referrer"
                        />
                     </div>
                     <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                        <div className="flex justify-between items-start mb-1 md:mb-2">
                          <h4 className="text-xs md:text-sm font-bold text-navy truncate pr-2">{item.name}</h4>
                          <div className="flex items-center gap-1 shrink-0">
                             <Star size={10} className="text-amber-400 fill-amber-400" />
                             <span className="text-[10px] font-bold text-navy">{item.rating}</span>
                          </div>
                        </div>
                        <p className="text-[8px] md:text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1 md:mb-2">{item.location}</p>
                        <div className="flex items-center justify-between mt-auto">
                           <p className="text-[8px] md:text-[10px] font-bold text-navy/20 uppercase tracking-tighter truncate max-w-[60%]">{item.specialty}</p>
                           <div className="flex items-center gap-1.5 text-emerald-500">
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest italic">Verified</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {recommendations.length === 0 && !isLoading && (
                <div className="py-12 text-center">
                  <p className="text-navy/20 text-xs font-bold uppercase tracking-widest italic">No matches found. Try a different query.</p>
                </div>
              )}
              {isLoading && (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-bg animate-pulse rounded-3xl h-32 w-full" />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
