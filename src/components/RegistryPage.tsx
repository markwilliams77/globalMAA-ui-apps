import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Activity, SlidersHorizontal, X, Loader2 } from 'lucide-react';
import { SERVICES, REGIONS } from '../constants';
import type { VendorListItem } from '../models';
import { getDirectoryVendors } from '../utils/vendors';
import VendorCard from './VendorCard';

interface RegistryPageProps {
  initialCategory?: string | null;
  initialRegion?: string | null;
  onSelectVendor?: (id: string) => void;
}

export default function RegistryPage({ initialCategory = null, initialRegion = null, onSelectVendor }: RegistryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(initialRegion);
  const [showFilters, setShowFilters] = useState(false);
  const [vendors, setVendors] = useState<VendorListItem[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const hasActiveFilters = Boolean(searchQuery.trim() || selectedCategory || (selectedRegion && selectedRegion !== 'Global'));

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSelectedRegion(initialRegion);
  }, [initialRegion]);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setApiError(null);

    const timeoutId = window.setTimeout(() => {
      getDirectoryVendors(
        {
          search: searchQuery.trim(),
          category: selectedCategory,
          region: selectedRegion,
          page: 1,
          limit: 50,
        },
        controller.signal,
      )
        .then((response) => {
          setVendors(response.data);
          setTotalEntries(response.pagination.total);
        })
        .catch(() => {
          if (controller.signal.aborted) return;

          setVendors([]);
          setTotalEntries(0);
          setApiError('Unable to load the live registry right now.');
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, selectedCategory, selectedRegion]);

  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-12 lg:px-24">
        {/* Header Section */}
        <div className="mb-12 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-8 h-1 bg-brand-red rounded-full" />
            <span className="text-navy font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">PROVIDER NETWORK</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-light tracking-tighter leading-[1.1] md:leading-[0.9] text-navy mb-6 md:mb-8">
            Global Partner <span className="font-serif italic text-gradient font-medium pr-2">Directory.</span>
          </h1>
          <p className="text-navy/40 max-w-xl text-lg font-medium leading-relaxed">
            A comprehensive, verified database of international medical service providers, facilities, and biological logistics networks.
          </p>
        </div>

        {/* Filter/Search Bar */}
        <div className="sticky top-24 z-30 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-navy/20 group-focus-within:text-cyan transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by hospital name, specialty, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-slate-bg border border-navy/5 rounded-3xl outline-none focus:border-cyan/30 text-navy font-medium transition-all"
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-8 py-6 rounded-3xl border flex items-center gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${
                showFilters ? 'bg-navy text-white border-navy' : 'bg-white text-navy border-navy/5 hover:border-navy/20'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {(selectedCategory || selectedRegion) && (
                <span className="w-4 h-4 rounded-full bg-brand-red text-white flex items-center justify-center text-[8px]">
                  { (selectedCategory ? 1 : 0) + (selectedRegion ? 1 : 0) }
                </span>
              )}
            </button>
          </div>

          {/* Expanded Filters Overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 right-0 mt-4 p-8 bg-white border border-navy/5 rounded-[40px] shadow-2xl shadow-navy/10 z-50 overflow-hidden"
              >
                <div className="grid md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-6">Service Category</h4>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${!selectedCategory ? 'bg-cyan text-white' : 'bg-slate-bg text-navy/40 hover:bg-navy/5'}`}
                      >
                        All Services
                      </button>
                      {SERVICES.map(s => (
                        <button 
                          key={s}
                          onClick={() => setSelectedCategory(s)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCategory === s ? 'bg-cyan text-white' : 'bg-slate-bg text-navy/40 hover:bg-navy/5'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-navy/30 mb-6">Region</h4>
                    <div className="flex flex-wrap gap-2">
                       {REGIONS.map(r => (
                        <button 
                          key={r}
                          onClick={() => setSelectedRegion(r)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${selectedRegion === r ? 'bg-navy text-white' : 'bg-slate-bg text-navy/40 hover:bg-navy/5'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-navy/5 flex justify-between items-center">
                  <button 
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedRegion(null);
                      setSearchQuery('');
                    }}
                    className="text-brand-red text-[10px] font-bold uppercase tracking-widest hover:underline"
                  >
                    Reset All
                  </button>
                  <button 
                    onClick={() => setShowFilters(false)}
                    className="bg-navy text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest"
                  >
                    Apply Selection
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-navy/5">
          <span className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.4em]">
            {isLoading ? 'Loading' : `Showing ${totalEntries}`} Registry Entries
          </span>
          { (selectedCategory || selectedRegion || searchQuery) && (
            <div className="flex gap-2">
              {selectedCategory && (
                <span className="flex items-center gap-2 bg-cyan/10 text-cyan px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  {selectedCategory}
                  <X size={10} className="cursor-pointer" onClick={() => setSelectedCategory(null)} />
                </span>
              )}
              {selectedRegion && selectedRegion !== 'Global' && (
                <span className="flex items-center gap-2 bg-navy/10 text-navy px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">
                  {selectedRegion}
                  <X size={10} className="cursor-pointer" onClick={() => setSelectedRegion(null)} />
                </span>
              )}
            </div>
          )}
        </div>
        {apiError && (
          <div className="mb-6 rounded-2xl border border-brand-red/10 bg-brand-red/5 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-brand-red">
            {apiError}
          </div>
        )}

        {/* Grid Layout */}
        {isLoading && vendors.length === 0 ? (
          <div className="py-40 text-center">
            <Loader2 className="w-10 h-10 mx-auto text-navy animate-spin mb-6" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40">Loading Registry</p>
          </div>
        ) : vendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-navy/5">
            {vendors.map((v) => (
              <VendorCard 
                key={v.id} 
                id={v.id}
                name={v.name}
                location={v.location}
                category={v.category}
                image={v.image}
                accreditation={v.accreditation}
                startingPrice={v.startingPrice}
                specialty={v.specialty}
                rating={v.rating}
                onClick={onSelectVendor}
              />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center">
             <Activity className="mx-auto text-navy/10 mb-8" size={64} />
             <h3 className="text-3xl font-light text-navy/30 tracking-tight">
               {apiError ?? (hasActiveFilters ? 'No vendors found matching your criteria.' : 'No approved vendors are available yet.')}
             </h3>
             {hasActiveFilters && (
               <button 
                 onClick={() => { setSelectedCategory(null); setSelectedRegion(null); setSearchQuery(''); }}
                 className="mt-8 text-cyan font-bold uppercase tracking-widest text-xs"
               >
                 Clear filters & search
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
