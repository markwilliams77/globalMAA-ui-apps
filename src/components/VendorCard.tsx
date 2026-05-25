import { motion } from 'motion/react';
import { Star, ShieldCheck, MapPin, ArrowUpRight } from 'lucide-react';

export interface VendorCardProps {
  id: string;
  name: string;
  location: string;
  category: string;
  image: string;
  accreditation: string[];
  startingPrice: string;
  specialty: string;
  rating: number;
  onClick?: (id: string) => void;
  key?: string;
}

export default function VendorCard({ id, name, location, category, image, accreditation, startingPrice, specialty, rating, onClick }: VendorCardProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      onClick={() => onClick && onClick(id)}
      className={`group relative flex flex-col border-r border-b border-navy/5 p-8 hover:bg-navy transition-all duration-700 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Background Hover Effect */}
      <div className="absolute inset-x-0 bottom-0 h-0 bg-cyan group-hover:h-1 transition-all duration-700 delay-100" />
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Floating Category Label */}
        <div className="flex justify-between items-start mb-8">
           <div className="mixed-caps opacity-100 group-hover:text-cyan transition-colors uppercase tracking-widest text-[9px] font-bold">{category}</div>
           <div className="flex items-center gap-1 group-hover:text-brand-red transition-colors">
              <Star size={12} className="fill-current" />
              <span className="text-[10px] font-bold">{rating}</span>
           </div>
        </div>

        {/* Name & Location */}
        <h3 className="text-3xl font-headings mb-2 text-navy group-hover:text-white transition-all duration-500 transform group-hover:translate-x-2 pr-2">
            {name}
        </h3>
        <p className="text-[11px] font-medium text-navy/40 uppercase tracking-[0.1em] mb-4 group-hover:text-white/50 transition-colors">
           {location}
        </p>
        <p className="text-[10px] italic text-navy/30 group-hover:text-cyan mb-12 transition-colors">
          {specialty}
        </p>

        {/* Visual Anchor */}
        <div className="relative mb-12 overflow-hidden aspect-[4/3] grayscale group-hover:grayscale-0 transition-all duration-700">
           <img 
            src={image} 
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
           />
           <div className="absolute inset-0 bg-navy/20 mix-blend-overlay" />
        </div>

        {/* Accreditation & Stats */}
        <div className="mt-auto pt-8 border-t border-navy/10 group-hover:border-white/10 flex items-center justify-between">
           <div className="space-y-1">
              <p className="mixed-caps group-hover:text-white/40 transition-colors">Vetted by</p>
              <p className="text-[10px] font-bold text-navy group-hover:text-brand-red transition-colors">{accreditation[0]}</p>
           </div>
           <div className="text-right">
              <p className="mixed-caps group-hover:text-white/40 transition-colors">Alliance Score</p>
              <p className="text-sm font-bold text-navy group-hover:text-white transition-colors underline decoration-brand-red underline-offset-4">{rating}/5.0</p>
           </div>
        </div>

        {/* Action Reveal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
           <div className="w-20 h-20 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <ArrowUpRight className="text-white" size={32} />
           </div>
        </div>
      </div>
    </motion.div>
  );
}
