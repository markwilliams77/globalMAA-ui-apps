import React from 'react';
import { motion } from 'motion/react';
import { Globe, ArrowRight, Search, MapPin, Building2, UserCheck, ShieldCheck } from 'lucide-react';

const ALL_DESTINATIONS = [
  { 
    country: 'Switzerland', 
    region: 'Europe',
    specialties: ['Oncology', 'Rehabilitation', 'Longevity'],
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80',
    providers: 450,
    rating: 4.9,
    description: 'World-leading precision in oncology and cellular therapies.'
  },
  { 
    country: 'Germany', 
    region: 'Europe',
    specialties: ['Orthopedics', 'Cardiology', 'Neurology'],
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80',
    providers: 820,
    rating: 4.8,
    description: 'Technical excellence and cutting-edge medical research.'
  },
  { 
    country: 'Singapore', 
    region: 'Asia',
    specialties: ['Complex Surgery', 'Fertility', 'Diagnostics'],
    image: 'https://images.unsplash.com/photo-1525625232747-0748518cf266?auto=format&fit=crop&q=80',
    providers: 310,
    rating: 4.9,
    description: 'The global standard for safety and clinical outcomes.'
  },
  { 
    country: 'UAE', 
    region: 'Middle East',
    specialties: ['Cosmetic', 'Wellness', 'Dental'],
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80',
    providers: 1200,
    rating: 4.7,
    description: 'Premier medical infrastructure with luxury patient hospitality.'
  },
  { 
    country: 'South Korea', 
    region: 'Asia',
    specialties: ['Aesthetics', 'Stem Cell', 'Smart Health'],
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&q=80',
    providers: 650,
    rating: 4.8,
    description: 'Global leader in aesthetic medicine and digital healthcare.'
  },
  { 
    country: 'Thailand', 
    region: 'Asia',
    specialties: ['Wellness', 'General Surgery', 'Dental'],
    image: 'https://images.unsplash.com/photo-1528181304800-2f140819898f?auto=format&fit=crop&q=80',
    providers: 940,
    rating: 4.6,
    description: 'Unmatched hospitality and highly accredited medical hubs.'
  }
];

interface DestinationsPageProps {
  onSelectCountry: (country: string) => void;
}

export default function DestinationsPage({ onSelectCountry }: DestinationsPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filtered = ALL_DESTINATIONS.filter(d => 
    d.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-40 pb-24 bg-white">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Header content */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-1 bg-brand-red rounded-full" />
              <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[10px]">Trusted Care Globally</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter text-navy leading-none mb-8">
              Places to <span className="font-serif italic font-medium text-gradient pr-2">heal better.</span>
            </h1>
            <p className="text-lg text-navy/50 font-medium leading-relaxed">
              Discover the world's most trusted medical hubs. We've personally vetted every region 
              to ensure you receive the safest, most compassionate care.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
            <input 
              type="text"
              placeholder="Search regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-bg py-4 pl-14 pr-6 rounded-2xl border border-navy/5 focus:outline-none focus:border-cyan transition-all font-medium text-navy text-sm"
            />
          </div>
        </div>

        {/* Categories / Regions */}
        <div className="flex gap-4 mb-20 overflow-x-auto pb-4 no-scrollbar">
          {['All Regions', 'Europe', 'Asia', 'Middle East', 'Americas'].map((region) => (
            <button 
              key={region}
              className="px-6 py-2.5 rounded-xl border border-navy/5 hover:border-navy hover:text-navy text-navy/40 font-bold uppercase tracking-widest text-[9px] transition-all whitespace-nowrap"
            >
              {region}
            </button>
          ))}
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest, i) => (
            <motion.div
              key={dest.country}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelectCountry(dest.country)}
              className="group cursor-pointer bg-white rounded-[48px] overflow-hidden border border-navy/5 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              <div className="h-64 relative overflow-hidden">
                <img 
                  src={dest.image} 
                  alt={dest.country} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-6 right-6">
                   <div className="bg-white/95 backdrop-blur shadow-sm px-4 py-2 rounded-2xl flex items-center gap-2">
                      <span className="text-brand-red font-black text-xs">★</span>
                      <span className="text-[10px] font-black text-navy">{dest.rating}</span>
                   </div>
                </div>
              </div>
              
              <div className="p-10">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={12} className="text-cyan" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan">{dest.region}</span>
                </div>
                <h3 className="text-3xl font-light tracking-tight text-navy mb-4 group-hover:text-brand-red transition-colors">
                  {dest.country}
                </h3>
                <p className="text-sm text-navy/40 font-medium mb-8 leading-relaxed">
                  {dest.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {dest.specialties.map(spec => (
                    <span key={spec} className="px-3 py-1 bg-slate-bg rounded-lg text-[8px] font-black uppercase tracking-widest text-navy/40">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-8 border-t border-navy/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-navy/20" />
                      <span className="text-[10px] font-black text-navy">{dest.providers}+ Providers</span>
                    </div>
                  </div>
                  <ArrowRight size={20} className="text-navy/20 group-hover:text-brand-red group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
