import { motion } from 'motion/react';
import { ArrowRight, Globe } from 'lucide-react';

const DESTINATIONS = [
  { country: 'India', providers: '2,500+', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80', color: 'bg-orange-500' },
  { country: 'Thailand', providers: '8,700+', image: 'https://images.unsplash.com/photo-1528181304800-2f140819ad1c?auto=format&fit=crop&q=80', color: 'bg-emerald-500' },
  { country: 'Turkey', providers: '6,300+', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80', color: 'bg-red-500' },
  { country: 'Singapore', providers: '5,100+', image: 'https://images.unsplash.com/photo-1525625232218-997576599837?auto=format&fit=crop&q=80', color: 'bg-blue-500' },
  { country: 'UAE', providers: '7,800+', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80', color: 'bg-amber-500' }
];

interface TopDestinationsProps {
  onSelectRegion?: (region: string) => void;
  onViewAll?: () => void;
}

export default function TopDestinations({ onSelectRegion, onViewAll }: TopDestinationsProps) {
  return (
    <section className="py-20 md:py-24 bg-slate-bg/30">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
             <div className="flex items-center gap-3 mb-4">
                <Globe size={16} className="text-navy/30" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-navy/40 italic">Where we work</span>
             </div>
             <h2 className="text-4xl font-light tracking-tighter text-navy uppercase">Trusted <span className="font-serif italic font-medium text-gradient pr-2">Quality Care</span></h2>
          </div>
          <button 
            onClick={onViewAll}
            className="flex items-center gap-4 group"
          >
             <span className="text-[10px] font-black uppercase tracking-widest text-navy group-hover:text-cyan transition-colors">See all destinations</span>
             <div className="w-10 h-10 rounded-full border border-navy/10 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </div>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelectRegion?.(dest.country)}
              className="group relative h-80 rounded-[40px] overflow-hidden cursor-pointer"
            >
              <img src={dest.image} alt={dest.country} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              
              <div className="absolute inset-x-8 bottom-8 flex items-end justify-between">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-2 h-2 rounded-full ${dest.color}`} />
                       <span className="text-white text-xl font-bold">{dest.country}</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">{dest.providers} Providers</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-y-4 group-hover:translate-y-0 shadow-2xl">
                    <ArrowRight size={14} />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
