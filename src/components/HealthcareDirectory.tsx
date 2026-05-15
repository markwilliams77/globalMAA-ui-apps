import { motion } from 'motion/react';
import { HEALTHCARE_CATEGORIES } from '../constants';
import { ChevronRight, LayoutGrid, List } from 'lucide-react';
import { useState } from 'react';

export default function HealthcareDirectory() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <section id="directory" className="py-24 md:py-32 bg-white relative">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="space-y-4 md:space-y-6 text-left">
            <div className="flex items-center gap-4">
               <div className="h-1 w-6 md:w-8 bg-brand-red rounded-full" />
               <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">Medical Network</span>
            </div>
            <h2 className="text-3xl md:text-7xl font-light tracking-tighter text-navy uppercase leading-[1.1]">
              Browse by <br className="hidden md:block" /> 
              <span className="font-serif italic font-medium text-gradient pr-2">Category.</span>
            </h2>
            <p className="text-lg md:text-xl text-navy/40 font-medium max-w-2xl leading-relaxed">
              Find the specific care you need by browsing our clinical categories. We cover everything from specialized surgery to wellness and rehabilitation.
            </p>
          </div>

          <div className="flex bg-slate-bg p-1 rounded-2xl border border-navy/5 self-start md:self-auto">
             <button 
               onClick={() => setView('grid')}
               className={`p-3 rounded-xl transition-all ${view === 'grid' ? 'bg-white shadow-xl shadow-navy/5 text-navy' : 'text-navy/30'}`}
             >
                <LayoutGrid size={20} />
             </button>
             <button 
               onClick={() => setView('list')}
               className={`p-3 rounded-xl transition-all ${view === 'list' ? 'bg-white shadow-xl shadow-navy/5 text-navy' : 'text-navy/30'}`}
             >
                <List size={20} />
             </button>
          </div>
        </div>

        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {HEALTHCARE_CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group p-6 md:p-10 rounded-[30px] md:rounded-[40px] bg-slate-bg/30 border border-navy/5 hover:bg-white hover:shadow-2xl hover:shadow-navy/5 transition-all cursor-pointer flex flex-col"
              >
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-navy/20 uppercase tracking-widest mb-1 italic">Category 0{idx + 1}</span>
                    <h3 className="text-xl md:text-2xl font-bold text-navy tracking-tight group-hover:text-cyan transition-colors">{cat.title}</h3>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-navy/5 flex items-center justify-center text-navy/20 group-hover:bg-navy group-hover:text-white group-hover:border-navy transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                   {cat.subcategories.slice(0, 5).map((sub, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="w-1 h-1 rounded-full bg-navy/10 group-hover:bg-cyan/40 transition-colors" />
                        <span className="text-[11px] font-bold text-navy/40 uppercase tracking-widest leading-none">{sub}</span>
                     </div>
                   ))}
                   {cat.subcategories.length > 5 && (
                     <p className="text-[10px] font-black text-cyan uppercase tracking-widest pt-2 italic">+{cat.subcategories.length - 5} More Specialties</p>
                   )}
                </div>

                {cat.specialized && (
                  <div className="mt-8 pt-8 border-t border-navy/5">
                     <span className="text-[8px] font-black uppercase tracking-[0.2em] text-brand-red/40 mb-3 block italic">Specialized Sub-Sectors</span>
                     <div className="flex flex-wrap gap-2">
                        {cat.specialized.slice(0, 3).map((spec, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-navy/5 rounded-full text-[9px] font-black uppercase tracking-tight text-navy/60 group-hover:border-navy/10 transition-colors">
                             {spec}
                          </span>
                        ))}
                     </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {HEALTHCARE_CATEGORIES.map((cat, idx) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-4 md:p-6 bg-slate-bg/30 border border-navy/5 rounded-2xl md:rounded-3xl hover:bg-white hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <span className="text-xl font-serif italic text-navy/10 w-12 group-hover:text-cyan/20 transition-colors">{idx + 1 < 10 ? `0${idx + 1}` : idx+1}</span>
                  <div className="sm:hidden w-8 h-8 rounded-full border border-navy/5 flex items-center justify-center text-navy/20">
                    <ChevronRight size={14} />
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-navy flex-1 tracking-tight">{cat.title}</h3>
                <div className="hidden sm:flex gap-4 px-4 md:px-8 border-l border-navy/5">
                  <span className="text-[8px] md:text-[10px] font-bold text-navy/30 uppercase tracking-widest">{cat.subcategories.length} Specialized Subcategories</span>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-full border border-navy/5 items-center justify-center text-navy/20 group-hover:bg-navy group-hover:text-white transition-all shrink-0">
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center">
           <button className="px-16 py-7 bg-navy text-white rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-brand-red transition-all shadow-2xl active:scale-95">
              Source From Full Network
           </button>
        </div>
      </div>
    </section>
  );
}
