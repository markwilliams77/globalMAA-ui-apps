import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, User, Building2, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { logout } from '../lib/firebase';

interface NavbarProps {
  portal: 'patient' | 'vendor';
  onPortalChange: (p: 'patient' | 'vendor') => void;
  currentView: 'home' | 'about' | 'vendors' | 'insights' | 'admin' | 'directory';
  onViewChange: (v: 'home' | 'about' | 'vendors' | 'insights' | 'admin' | 'directory') => void;
  onLogout?: () => void;
  onLogin?: () => void;
  isAdminView?: boolean;
}

export default function Navbar({ portal, onPortalChange, currentView, onViewChange, onLogout, onLogin, isAdminView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminView) {
    return (
      <nav className="fixed top-0 lg:left-80 right-0 z-50 h-20 md:h-24 bg-white/95 backdrop-blur-xl border-b border-navy/5 flex items-center shadow-sm">
        <div className="w-full px-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                <Activity className="text-brand-red animate-pulse" size={18} />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-sm font-black text-navy leading-none tracking-tighter uppercase">GMAA Admin Panel</span>
                <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-navy/40">Verified Access</span>
              </div>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Systems Online
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-bg rounded-xl border border-navy/5">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-black uppercase tracking-widest text-navy/60">Secure Connection</span>
            </div>
            <button 
              onClick={() => onViewChange('home')} 
              className="px-6 py-2.5 bg-navy text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-lg shadow-navy/20 active:scale-95"
            >
              Back to site
            </button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-2 md:py-3 bg-white/80 backdrop-blur-xl shadow-xl shadow-navy/5 border-b border-navy/5' 
        : 'py-4 md:py-6 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-12 lg:px-24 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-8">
          {/* Logo - Matching Brand Identity */}
          <button 
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 md:gap-4 group shrink-0"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-navy rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-navy/20 group-hover:scale-105 transition-transform">
               <Activity className="text-brand-red animate-pulse" size={20} />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg md:text-xl font-bold tracking-tight text-navy leading-none">Global Med <span className="text-brand-red">Access</span></span>
              <span className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold text-navy/40 truncate max-w-[120px] md:max-w-none">Personalized Healthcare</span>
            </div>
          </button>

          {/* Desktop Portal Switcher */}
          <div className="hidden lg:flex items-center glass p-1 rounded-full border border-navy/5">
            <button
              onClick={() => { onPortalChange('patient'); onViewChange('home'); }}
              className={`flex items-center gap-2 px-4 xl:px-6 py-2 rounded-full transition-all duration-500 ease-out ${
                portal === 'patient'
                  ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-100'
                  : 'text-navy/40 hover:text-navy hover:bg-navy/5 scale-95'
              }`}
            >
              <User size={12} className={portal === 'patient' ? 'text-brand-red' : ''} />
              <span className="text-[8px] xl:text-[9px] font-black uppercase tracking-widest">Patients</span>
            </button>
            <button
              onClick={() => { onPortalChange('vendor'); onViewChange('home'); }}
              className={`flex items-center gap-2 px-4 xl:px-6 py-2 rounded-full transition-all duration-500 ease-out ${
                portal === 'vendor'
                  ? 'bg-navy text-white shadow-xl shadow-navy/20 scale-100'
                  : 'text-navy/40 hover:text-navy hover:bg-navy/5 scale-95'
              }`}
            >
              <Building2 size={12} className={portal === 'vendor' ? 'text-brand-red' : ''} />
              <span className="text-[8px] xl:text-[9px] font-black uppercase tracking-widest">Vendors</span>
            </button>
          </div>
        </div>

          {/* Desktop Nav Links - Using Brand Red Accents */}
          <div className="hidden md:flex items-center gap-3 lg:gap-10">
            <div className="flex items-center gap-3 lg:gap-8 mr-1 lg:mr-4 border-r border-navy/5 pr-4 lg:pr-8">
              {[
                { label: "Categories", view: "directory" as const },
                { label: "Insights", view: "insights" as const },
                { label: "About", view: "about" as const }
              ].map((item) => (
                <button 
                  key={item.label} 
                  onClick={() => onViewChange(item.view)}
                  className={`text-[8px] lg:text-[9.5px] font-bold uppercase tracking-[0.2em] lg:tracking-[0.3em] transition-all relative group ${
                    currentView === item.view ? 'text-navy' : 'text-navy/40 hover:text-navy'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-2 left-0 h-[2px] bg-brand-red transition-all ${
                    currentView === item.view ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
              
              {/* Admin Terminal Access */}
              {user && (user.email === 'digitalised17@gmail.com' || user.email?.endsWith('@globalmaa.com')) && (
                <button 
                  onClick={() => onViewChange('admin')}
                  className="text-[9.5px] font-black uppercase tracking-[0.3em] text-brand-red hover:text-navy transition-all relative group"
                >
                  Admin
                  <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-navy transition-all group-hover:w-full" />
                </button>
              )}
            </div>
  
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (portal === 'vendor' && currentView === 'home' && !user) {
                    onLogin?.();
                  } else {
                    onViewChange('vendors');
                  }
                }}
                className={`relative group overflow-hidden px-4 lg:px-8 py-3 rounded-2xl text-[8px] lg:text-[10px] font-bold lg:font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] shadow-xl transition-all active:scale-95 ${
                  currentView === 'vendors' ? 'bg-cyan text-white shadow-cyan/20' : 'bg-navy text-white shadow-navy/10'
                }`}
              >
              <span className="relative z-10">
                {currentView === 'vendors' 
                  ? 'Portal Active' 
                  : (portal === 'vendor' && currentView === 'home' && !user ? 'Vendor Login' : 'Partner Access')
                }
              </span>
              <div className={`absolute inset-0 bg-brand-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${currentView === 'vendors' ? 'hidden' : ''}`} />
            </button>

            {user && (
              <button 
                onClick={onLogout}
                className="p-3.5 rounded-2xl bg-navy text-white hover:bg-brand-red transition-all shadow-lg shadow-navy/10"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-navy"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-navy/5 p-8 flex flex-col gap-6 md:hidden z-40 overflow-y-auto max-h-[80vh]"
        >
          <div className="flex bg-slate-bg p-1 rounded-xl">
             <button
              onClick={() => { onPortalChange('patient'); setIsOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg ${
                portal === 'patient' ? 'bg-white shadow-sm text-navy' : 'text-navy/50'
              }`}
            >
              <User size={18} />
              <span className="text-sm font-medium">Patients</span>
            </button>
            <button
              onClick={() => { onPortalChange('vendor'); setIsOpen(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg ${
                portal === 'vendor' ? 'bg-white shadow-sm text-navy' : 'text-navy/50'
              }`}
            >
              <Building2 size={18} />
              <span className="text-sm font-medium">Vendors</span>
            </button>
          </div>
          <button 
            onClick={() => { onViewChange('directory'); setIsOpen(false); }}
            className="text-lg text-left font-medium text-navy py-2 border-b border-navy/5"
          >
            Medical Categories
          </button>
          <button 
            onClick={() => { onViewChange('insights'); setIsOpen(false); }}
            className="text-lg text-left font-medium text-navy py-2 border-b border-navy/5"
          >
            Network Insights
          </button>
          {user && (user.email === 'digitalised17@gmail.com' || user.email?.endsWith('@globalmaa.com')) && (
            <button 
              onClick={() => { onViewChange('admin'); setIsOpen(false); }}
              className="text-lg text-left font-bold text-brand-red py-2 border-b border-navy/5 uppercase tracking-widest"
            >
              Admin Panel
            </button>
          )}
          <a href="#" className="text-lg font-medium text-navy py-2 border-b border-navy/5">Medical Logistics</a>
          <button 
            onClick={() => { 
                if (portal === 'vendor' && currentView === 'home' && !user) {
                  onLogin?.();
                } else {
                  onViewChange('vendors');
                }
                setIsOpen(false); 
            }}
            className="w-full bg-cyan text-white py-4 rounded-xl font-bold mt-2 text-[10px] uppercase tracking-widest"
          >
            {portal === 'vendor' && currentView === 'home' && !user ? 'Vendor Login' : 'Access Network'}
          </button>

          {user && (
            <button 
              onClick={() => { onLogout?.(); setIsOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-4 text-brand-red font-bold uppercase tracking-widest text-xs border border-brand-red/10 rounded-xl hover:bg-brand-red/5 transition-all"
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}
