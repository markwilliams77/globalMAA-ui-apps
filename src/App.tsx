/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VendorCard from './components/VendorCard';
import InteractiveMap from './components/InteractiveMap';
import VendorPortal from './components/VendorPortal';
import AIPoweredDiscovery from './components/AIPoweredDiscovery';
import TopDestinations from './components/TopDestinations';
import HealthcareDirectory from './components/HealthcareDirectory';
import ServiceEcosystem from './components/ServiceEcosystem';
import LeadCapture from './components/LeadCapture';
import AboutPage from './components/AboutPage';
import RegistryPage from './components/RegistryPage';
import InsightsPage from './components/InsightsPage';
import VendorProfilePage from './components/VendorProfilePage';
import DestinationsPage from './components/DestinationsPage';
import DestinationDetailPage from './components/DestinationDetailPage';
import LoginPage from './components/LoginPage';
import VendorLoginPage from './components/VendorLoginPage';
import ProviderDashboard from './components/ProviderDashboard';
import AdminDashboard from './components/AdminDashboard';
import VendorOnboarding from './components/VendorOnboarding';
import { useAuth } from './components/AuthContext';
import { auth } from './lib/firebase';
import type { VendorListItem } from './models';
import { getDirectoryVendors } from './utils/vendors';
import { Activity, Heart, Shield, Globe, Loader2 } from 'lucide-react';

export default function App() {
  const [portal, setPortal] = useState<'patient' | 'vendor' | 'admin'>('patient');
  const [view, setView] = useState<'home' | 'about' | 'vendors' | 'insights' | 'admin' | 'directory' | 'destinations' | 'destination-detail'>('home');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginAudience, setLoginAudience] = useState<'patient' | 'vendor'>('patient');
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [featuredVendors, setFeaturedVendors] = useState<VendorListItem[]>([]);
  const [isFeaturedLoading, setIsFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const { user, loading, profile, setSimulationUser } = useAuth();
  
  // Internal Role Mapping
  const isAdminEmployee = (profile?.role === 'admin' || 
                          user?.email === 'digitalised17@gmail.com' ||
                          (user?.email === 'admin@globalmaa.com')) && profile?.role !== 'vendor';
  const isVendorUser = profile?.role === 'vendor';

  // Smooth scroll behavior
  useEffect(() => {
    if (view === 'home') {
      document.documentElement.style.scrollBehavior = 'smooth';
    } else {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }, [view]);

  useEffect(() => {
    const controller = new AbortController();

    setIsFeaturedLoading(true);
    setFeaturedError(null);

    getDirectoryVendors({ page: 1, limit: 4 }, controller.signal)
      .then((response) => {
        setFeaturedVendors(response.data);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFeaturedVendors([]);
          setFeaturedError('Unable to load featured partners right now.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsFeaturedLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-navy animate-spin" />
      </div>
    );
  }

  if (isLoggingIn && loginAudience === 'patient' && !user) {
    return (
      <LoginPage 
        onBack={() => {
          setIsLoggingIn(false);
          setPortal('patient');
          setView('home');
        }} 
        onLoginBypass={(u) => {
          setSimulationUser(u);
          setPortal('patient');
          setView('home');
          setIsLoggingIn(false);
        }}
      />
    );
  }

  if (isLoggingIn && loginAudience === 'vendor' && !isVendorUser) {
    return (
      <VendorLoginPage
        onBack={() => {
          setIsLoggingIn(false);
          setPortal('vendor');
          setView('home');
        }}
      />
    );
  }

  const showPatientLogin = !user && view === 'vendors';

  if (showPatientLogin) {
    return (
      <LoginPage
        onBack={() => {
          setPortal('patient');
          setView('home');
        }}
        onLoginBypass={(u) => {
          setSimulationUser(u);
          setPortal('patient');
          setView('home');
          setIsLoggingIn(false);
        }}
      />
    );
  }

  // Automatic High-Level Routing for Institutional Users
  let effectiveView = view;
  if (view === 'admin' && !isAdminEmployee) {
    effectiveView = 'home';
  } else if (isAdminEmployee && view === 'admin') {
    // Keep admin view if explicitly set
    effectiveView = 'admin';
  }

  const handleLogout = async () => {
    try {
      const currentPortal = portal;
      if (auth.currentUser) {
        await auth.signOut();
      }
      setSimulationUser(null);
      setView('home');
      setIsLoggingIn(false);
      setLoginAudience('patient');
      setPortal(currentPortal);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleSourceVendors = (service?: string, region?: string) => {
    if (service) setSelectedService(service);
    if (region) setSelectedRegion(region);
    if (!user) {
      setLoginAudience('patient');
      setIsLoggingIn(true);
      return;
    }
    setView('vendors');
  };

  const handleViewChange = (newView: any) => {
    setSelectedVendorId(null);
    if (newView === 'vendors' && !user) {
      setLoginAudience('patient');
      setIsLoggingIn(true);
      return;
    }
    setView(newView);
  };

  return (
    <div className="min-h-screen relative selection:bg-cyan selection:text-white bg-white overflow-x-hidden">
      {/* Global Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] noise" />
      
      {/* Structural Grid Lines - Defining the adaptive content zone */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-y-0 left-0 md:left-[5%] lg:left-[10%] w-[1px] bg-navy/5" />
         <div className="absolute inset-y-0 right-0 md:right-[5%] lg:right-[10%] w-[1px] bg-navy/5" />
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 opacity-50" />
      </div>

      {/* Global Navbar - Hidden during institutional/admin sessions to prevent UI collision */}
      {!(effectiveView === 'admin' || (portal === 'vendor' && isVendorUser) || (profile?.role === 'admin' && view === 'admin')) && (
        <Navbar 
          portal={portal} 
          onPortalChange={setPortal} 
          currentView={view} 
          onViewChange={handleViewChange} 
          onLogout={handleLogout} 
          onLogin={() => {
            setLoginAudience(portal === 'vendor' ? 'vendor' : 'patient');
            setIsLoggingIn(true);
          }} 
          requireLogin
          isAdminView={false}
        />
      )}

      <AnimatePresence>
        {isOnboarding && (
          <VendorOnboarding 
            onCancel={() => setIsOnboarding(false)} 
            onComplete={() => {
              setIsOnboarding(false);
              setPortal('vendor');
              setLoginAudience('vendor');
              setIsLoggingIn(true); // Redirect to vendor login after onboarding completion
            }} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {effectiveView === 'admin' ? (
          <motion.main
            key="admin-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen overflow-hidden"
          >
            <AdminDashboard 
              onLogout={handleLogout} 
              onViewChange={handleViewChange} 
              onHome={() => {
                setPortal('patient');
                setView('home');
              }}
            />
          </motion.main>
        ) : effectiveView === 'home' ? (
          portal === 'patient' ? (
            <motion.main
              key="patient-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <Hero 
                onSourceVendors={handleSourceVendors} 
                onPortalChange={(p) => setPortal(p)}
              />

              <ServiceEcosystem />
              
              <div className="w-full">
                {/* Vendor Directory Section - Strictly Aligned */}
                <section id="network" className="py-24 md:py-32 border-b border-navy/5 bg-white relative z-10">
                  <div className="container mx-auto px-4 md:px-12 lg:px-24">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
                       <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-1 bg-brand-red rounded-full" />
                          <span className="text-navy font-bold uppercase tracking-[0.4em] text-[10px]">PROVIDER NETWORK</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-light tracking-tighter leading-[0.9] text-navy">
                          Our <span className="font-serif italic text-gradient font-medium pr-2">Featured</span> <br /> 
                          Partners.
                        </h2>
                      </div>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleViewChange('vendors')}
                          className="px-8 py-4 rounded-full bg-navy text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan shadow-2xl shadow-navy/10 transition-all active:scale-95"
                        >
                          View All 2.5k+
                        </button>
                      </div>
                    </div>

                    {isFeaturedLoading ? (
                      <div className="py-24 border-y border-navy/5 flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-8 h-8 text-navy animate-spin mb-5" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40">Loading Featured Partners</p>
                      </div>
                    ) : featuredVendors.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l border-t border-navy/5">
                        {featuredVendors.map((v) => (
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
                            onClick={(id) => {
                              if (!user) {
                                setLoginAudience('patient');
                                setIsLoggingIn(true);
                                return;
                              }
                              setSelectedVendorId(id);
                              setView('vendors');
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="py-24 border-y border-navy/5 text-center">
                        <Activity className="mx-auto text-navy/10 mb-6" size={48} />
                        <h3 className="text-2xl font-light text-navy/30 tracking-tight">
                          {featuredError ?? 'No approved partners are available yet.'}
                        </h3>
                      </div>
                    )}
                  </div>
                </section>

                <TopDestinations 
                  onSelectRegion={(region) => {
                    setSelectedCountry(region);
                    setView('destination-detail');
                  }}
                  onViewAll={() => setView('destinations')}
                />
                <AIPoweredDiscovery />
                
                <InteractiveMap onVisitRegistry={() => handleViewChange('vendors')} />

                {/* CTA Final */}
                <section className="py-48 relative overflow-hidden bg-navy text-white">
                   <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
                   <div className="container mx-auto px-4 md:px-12 lg:px-24 relative z-10 text-center">
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-8xl font-light leading-[0.9] tracking-tighter mb-16"
                      >
                        Access Healthcare <br />
                        <span className="font-serif italic font-medium text-gradient pr-2">now!</span>
                      </motion.h2>
                      <div className="flex flex-wrap justify-center gap-8">
                         <button 
                           onClick={() => {
                             if (!user) {
                               setLoginAudience('patient');
                               setIsLoggingIn(true);
                               return;
                             }
                             setIsConsultationOpen(true);
                           }}
                           className="px-16 py-7 bg-white text-navy rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95"
                         >
                            Request Consultation
                         </button>
                         <button 
                           onClick={() => setPortal('vendor')}
                           className="px-16 py-7 border border-white/20 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-navy transition-all active:scale-95"
                         >
                            Vendor Access
                         </button>
                      </div>
                   </div>
                </section>
              </div>
            </motion.main>
          ) : (
            <motion.main
              key="vendor-portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col"
            >
              {isVendorUser ? (
                <ProviderDashboard 
                  onLogout={handleLogout} 
                  onViewProfile={(id) => {
                    setSelectedVendorId(id);
                    setView('vendors');
                    setPortal('patient');
                  }}
                  onHome={() => {
                    setPortal('patient');
                    setView('home');
                  }}
                />
              ) : (
                <>
                  <VendorPortal
                    onLogin={() => {
                      setLoginAudience('vendor');
                      setIsLoggingIn(true);
                    }}
                    onPartnerWithUs={() => setIsOnboarding(true)}
                  />
                  <section className="py-24 md:py-32 bg-white">
                    <div className="container mx-auto px-4 md:px-12 lg:px-24">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
                         {[
                           { icon: Heart, t: "Patient Trust", d: "Join a curated list where quality is prioritized over volume." },
                           { icon: Shield, t: "Legal Security", d: "Benefit from our framework for international healthcare agreements." },
                           { icon: Globe, t: "Global Reach", d: "Reach patients from Europe, North America, and the Middle East." }
                         ].map((item, idx) => (
                           <div key={idx} className="space-y-4 p-8 rounded-[32px] bg-slate-bg/50 border border-navy/5">
                              <div className="w-12 h-12 bg-cyan rounded-2xl flex items-center justify-center text-white">
                                 <item.icon size={24} />
                              </div>
                              <h3 className="text-xl font-bold">{item.t}</h3>
                              <p className="text-navy/50 leading-relaxed">{item.d}</p>
                           </div>
                         ))}
                      </div>
                    </div>
                  </section>
                </>
              )}
            </motion.main>
          )
        ) : view === 'about' ? (
          <motion.main
            key="about-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <AboutPage />
          </motion.main>
        ) : view === 'insights' ? (
          <motion.main
            key="insights-page"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <InsightsPage />
          </motion.main>
        ) : view === 'directory' ? (
          <motion.main
            key="directory-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <HealthcareDirectory />
          </motion.main>
        ) : view === 'destinations' ? (
          <motion.main
            key="destinations-page"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <DestinationsPage 
              onSelectCountry={(country) => {
                setSelectedCountry(country);
                setView('destination-detail');
              }} 
            />
          </motion.main>
        ) : view === 'destination-detail' ? (
          <motion.main
            key="destination-detail-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <DestinationDetailPage 
              country={selectedCountry || 'Switzerland'} 
              onBack={() => setView('destinations')}
              onExploreProviders={(region) => {
                setSelectedRegion(region);
                handleViewChange('vendors');
              }}
            />
          </motion.main>
        ) : (
          <motion.main
            key="registry-page"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {selectedVendorId ? (
              <VendorProfilePage 
                vendorId={selectedVendorId} 
                onBack={() => setSelectedVendorId(null)} 
              />
            ) : (
              <RegistryPage 
                initialCategory={selectedService} 
                initialRegion={selectedRegion} 
                onSelectVendor={(id) => setSelectedVendorId(id)}
              />
            )}
          </motion.main>
        )}
      </AnimatePresence>

      <LeadCapture 
        externalOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />

      {/* Footer - Hidden on Admin/Institutional Views */}
      {!(portal === 'vendor' && view === 'home') && effectiveView !== 'admin' && (
        <footer className="bg-slate-bg py-20 md:py-32 border-t border-navy/5">
           <div className="container mx-auto px-4 md:px-12 lg:px-24">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
                 <div className="space-y-6 max-w-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                        <Activity className="text-brand-red animate-pulse" size={16} />
                      </div>
                      <span className="text-lg font-bold tracking-tight text-navy">
                        GMAA <span className="text-cyan">Alliance</span>
                      </span>
                    </div>
                    <p className="text-sm text-navy/40 font-medium">The world's most sophisticated medical logistics aggregator. Quality fulfillment beyond borders.</p>
                 </div>
                 
                 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 w-full lg:w-auto">
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-navy">Fulfillment</h4>
                       <ul className="space-y-2 text-sm text-navy/50 font-medium">
                          <li><a href="#" className="hover:text-cyan transition-colors">Sourcing</a></li>
                          <li><a href="#" className="hover:text-cyan transition-colors">Global Logistics</a></li>
                          <li><a href="#" className="hover:text-cyan transition-colors">Emergency Dispatch</a></li>
                       </ul>
                    </div>
                    <div className="space-y-4">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-navy">Network</h4>
                       <ul className="space-y-2 text-sm text-navy/50 font-medium">
                          <li><button onClick={() => handleViewChange('about')} className="hover:text-cyan transition-colors">About Us</button></li>
                          <li><button onClick={() => handleViewChange('insights')} className="hover:text-cyan transition-colors">Insights</button></li>
                          <li><a href="#" className="hover:text-cyan transition-colors">Security</a></li>
                          <li><a href="#" className="hover:text-cyan transition-colors">Contact</a></li>
                       </ul>
                    </div>
                    <div className="hidden lg:block space-y-4">
                       <h4 className="text-xs font-bold uppercase tracking-widest text-navy">Legal</h4>
                       <ul className="space-y-2 text-sm text-navy/50 font-medium">
                          <li><a href="#" className="hover:text-cyan transition-colors">Terms of Service</a></li>
                          <li><a href="#" className="hover:text-cyan transition-colors">Privacy Policy</a></li>
                          <li><a href="#" className="hover:text-cyan transition-colors">HIPAA</a></li>
                       </ul>
                    </div>
                 </div>
              </div>
              <div className="mt-20 md:mt-32 pt-8 md:pt-12 border-t border-navy/5 flex flex-col md:flex-row justify-between gap-8 md:gap-10">
                 <p className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em]">© 2026 Global Med Access Alliance Pvt. Ltd. PROVIDER NETWORK ACCESS ONLY.</p>
                 <div className="flex flex-wrap gap-6 md:gap-12">
                    <span className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em] hover:text-brand-red transition-colors cursor-pointer">Twitter / X</span>
                    <span className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em] hover:text-cyan transition-colors cursor-pointer">LinkedIn</span>
                    <span 
                      onClick={() => {
                        handleViewChange('admin');
                        setIsLoggingIn(true);
                      }}
                      className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em] hover:text-brand-red transition-colors cursor-pointer"
                    >
                      Terminal
                    </span>
                 </div>
              </div>
           </div>
        </footer>
      )}
    </div>
  );
}
