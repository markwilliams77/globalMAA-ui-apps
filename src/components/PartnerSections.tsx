import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Globe2, Zap, Sparkles, PhoneCall, Compass, HeartPulse, 
  Building2, Plane, Home, FlaskConical, Pill, Package, Activity, Smile, Eye, 
  Users, TrendingUp, Bot, Workflow, Target, Briefcase, ArrowRight, Check, Award, Server
} from 'lucide-react';

interface PartnerSectionsProps {
  onExploreVendors: (service?: string, region?: string) => void;
  onRequestConsultation: () => void;
}

export default function PartnerSections({ onExploreVendors, onRequestConsultation }: PartnerSectionsProps) {
  const [activeSegment, setActiveSegment] = useState<'ecosystem' | 'why-gmaa' | 'intelligence' | 'stories'>('ecosystem');
  // Section 4 states
  const [inquiriesCount, setInquiriesCount] = useState(14238);
  const [connectionsCount, setConnectionsCount] = useState(8912);
  const [suppliersCount, setSuppliersCount] = useState(2531);
  const [liveLog, setLiveLog] = useState<{ id: number; text: string; details: string; type: string; time: string }[]>([
    { id: 1, text: "🟢 Emergency Inquiry Submitted", details: "Urgent flyway clearance from Houston, TX to Zurich, CH", type: "emergency", time: "Just Now" },
    { id: 2, text: "🟢 Partnership Created", details: "Mounthaven Elder Care partnered with EuroLink Rehab Alliance", type: "partnership", time: "1m ago" },
    { id: 3, text: "🟢 Patient Referral Generated", details: "Heart Valve Specialist matched with patient in Nairobi, KE", type: "referral", time: "3m ago" },
    { id: 4, text: "🟢 New Vendor Joined", details: "Titan MedTools Group registered as certified equipment importer", type: "vendor", time: "5m ago" },
    { id: 5, text: "🟢 Cross-Border Connection Established", details: "Pediatric Surgery Support link launched between UAE & India", type: "connection", time: "7m ago" },
  ]);

  // Simulated real-time updates for Section 4
  useEffect(() => {
    const countsInterval = setInterval(() => {
      setInquiriesCount(prev => prev + Math.floor(Math.random() * 2) + 1);
      if (Math.random() > 0.4) {
        setConnectionsCount(prev => prev + 1);
      }
      if (Math.random() > 0.85) {
        setSuppliersCount(prev => prev + 1);
      }
    }, 4000);

    const logInterval = setInterval(() => {
      const logs = [
        { text: "🟢 Healthcare Inquiry Submitted", details: "Specialist consultation requested in Cologne, DE", type: "referral" },
        { text: "🟢 New Vendor Joined", details: "Lotus Integrative Care Center registered in Thailand", type: "vendor" },
        { text: "🟢 Cross-Border Connection Established", details: "Home ICU ventilators shipment cleared to Mumbai, IN", type: "connection" },
        { text: "🟢 Partnership Created", details: "Apollo General Hospitals partnered with SkyMed", type: "partnership" },
        { text: "🟢 Emergency Inquiry Submitted", details: "Medevac ground fleet dispatched near Cairo, EG", type: "emergency" }
      ];
      const randomLog = logs[Math.floor(Math.random() * logs.length)];
      setLiveLog(prev => [
        { id: Date.now(), text: randomLog.text, details: randomLog.details, type: randomLog.type, time: "Just Now" },
        ...prev.map(l => ({ ...l, time: l.time === "Just Now" ? "1m ago" : l.time.includes("m") ? `${parseInt(l.time) + 1}m ago` : l.time })).slice(0, 4)
      ]);
    }, 8000);

    return () => {
      clearInterval(countsInterval);
      clearInterval(logInterval);
    };
  }, []);

  // Section 10 Story Categories Tabs
  const [activeStoryTab, setActiveStoryTab] = useState<'patient' | 'family' | 'corporate' | 'travel'>('patient');

  const STORIES = {
    patient: {
      title: "Patient Journey Stories",
      story: "When Ronald required bilateral robotic-assisted knee replacement with specialized post-repair rehabilitation on short notice, local wait times were over nine months. Through GMAA, Ronald discovered and was connected to a certified care team at Radhakrishnan Hospital. Within ten days of his first search, Ronald traveled safely, underwent a successful recovery, and was restoring mobility with localized therapists.",
      meta: "Ronald S., Orthopedic Recoveree",
      tag: "Robotic Surgery"
    },
    family: {
      title: "Family Support Stories",
      story: "Caring for our elderly father from across the world was an everyday struggle. We needed to set up a cardiac home-ICU station in Mumbai with certified 24/7 nursing and on-call specialist visits. Within twelve minutes of describing our needs on GMAA AI, three verified homecare teams had responded with detailed proposals. It saved us months of stress and gave us total peace of mind.",
      meta: "Prisha & Dev L., UK/India Residents",
      tag: "At-Home Nursing"
    },
    corporate: {
      title: "Corporate Healthcare Stories",
      story: "For our multi-regional wellness program covering 1,800 workers, finding verified local healthcare providers who accepted international cover was a massive compliance roadblock. GMAA mapped our office coordinates with local dental, diagnostic, and preventative clinics. Our staff claims pipeline is now cashless and 100% transparent.",
      meta: "Sarah M., HR Director, FinTerra global",
      tag: "Corporate Wellness"
    },
    travel: {
      title: "Medical Travel Stories",
      story: "Our newborn child needed immediate medical relocation via fixed-wing air ambulance with critical neonatologist escorts. The speed of coordination mattered more than anything else. SkyMed International was matched with us within minutes. They handled everything—visa facilitation, stretcher airlines, and bedside handover. Genuine angels.",
      meta: "The Al-Sabah Family, Safat, Kuwait",
      tag: "Air Evacuation"
    }
  };

  // Section 7 interactive demo state
  const [demoFilter, setDemoFilter] = useState<'location' | 'specialty' | 'requirement' | 'emergency' | 'insurance' | 'service'>('requirement');

  const FILTER_DEMOS = {
    location: {
      title: "Location-Based Intelligence",
      subtitle: "GMAA maps regional regulations, access coordinates, and travel routes instantly.",
      examples: ["Hospitals near Toronto showing transparent package prices", "First aid ambulance teams stationed in Dubai Marina", "Regional medical equipment suppliers in Nairobi"]
    },
    specialty: {
      title: "Deep Specialty Matching",
      subtitle: "We analyze precise medical subfields rather than generic clinical departments.",
      examples: ["Pediatric Minimally Invasive Cardiac Surgeons", "Robotic-Assisted Knee Arthroplasty Directors", "Custom Orthotics and Joint Healing Counselors"]
    },
    requirement: {
      title: "Complex Goal Sourcing",
      subtitle: "Traditional lists show names. GMAA understands complex real-life objectives.",
      examples: ["Importing customized oxygen beds from Germany to Riyadh", "Securing rare specialized oncology pharmaceuticals with cold-chain transit", "Setting up step-down ICU facilities in residential homecare settings"]
    },
    emergency: {
      title: "Emergency Air & Ground Dispatch",
      subtitle: "Urgent red-alert support with real-time flyway and aircraft coordinates.",
      examples: ["Fixed-wing ICU planes with neonatologists ready within 3 hours", "Cardiac support ambulance units dispatched to critical events", "Bedside-to-bedside international patient repatriation teams"]
    },
    insurance: {
      title: "Insurance & Cover Compatibility",
      subtitle: "Filter networks based on third-party administrators and cashless options.",
      examples: ["Providers compatible with Aetna Global and Cigna International", "Hassle-free cashless billing coordinators matching major TPAs", "Reimbursement support specialists for travel insurance claims"]
    },
    service: {
      title: "Comprehensive Service Types",
      subtitle: "Connecting individuals and companies to any physical healthcare service or product.",
      examples: ["Specialized Medical Device Importers & Renters", "Certified Home Caregiver Squads and Physical Therapists", "Global Medical Concierges and Language Escorts"]
    }
  };

  return (
    <div className="w-full relative bg-white overflow-hidden text-navy">
      {/* Decorative center grid line */}
      <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 pointer-events-none" />

      {/* Dynamic Segment Switcher to reduce long scrolls */}
      <div className="sticky top-[64px] md:top-[72px] bg-white/95 backdrop-blur-md border-b border-navy/5 z-40 py-5 shadow-sm transition-all">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
            <div className="text-center xl:text-left">
              <span className="text-[9px] font-bold text-cyan uppercase tracking-[0.3em]">Home Navigation</span>
              <h2 className="text-xl font-light tracking-tight text-navy leading-none mt-1">Explore GMAA Platform</h2>
            </div>
            <div className="flex flex-wrap gap-2 justify-center bg-slate-bg/80 p-1.5 rounded-3xl border border-navy/5 max-w-full">
              {[
                { id: 'ecosystem', label: '🏥 Ecosystem & Sourcing' },
                { id: 'why-gmaa', label: '💎 Why Platform Access' },
                { id: 'intelligence', label: '📡 Live Network Grid' },
                { id: 'stories', label: '💫 Success Stories' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSegment(tab.id as any);
                    const el = document.getElementById('hub-anchor');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeSegment === tab.id
                      ? 'bg-navy text-white shadow-xl shadow-navy/25 scale-100'
                      : 'text-navy/50 hover:text-navy hover:bg-navy/5 scale-95'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div id="hub-anchor" className="scroll-mt-48" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35 }}
          className="w-full"
        >
          {activeSegment === 'why-gmaa' && (
            <section className="py-16 md:py-20 border-b border-navy/5 relative z-10" id="why-gmaa">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-bg rounded-full border border-navy/5">
              <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">INTELLIGENT FULFILLMENT</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-navy leading-[1.05] mb-8">
              Healthcare Decisions Are Too Important <br />
              <span className="font-serif italic text-gradient font-medium">For Endless Searching</span>
            </h2>
            <p className="text-lg text-navy/50 max-w-xl mx-auto font-medium leading-relaxed">
              Finding urgent care, localized nursing, customized gear, or specialized physicians shouldn't involve days of calling numbers. GMAA provides a fully unified intelligence layer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              {
                icon: ShieldCheck,
                title: "Verified Healthcare Network",
                desc: "Every clinic, ambulance crew, device supplier, and helper undergoes active vetting to guarantee strict credentials and safety records.",
                color: "group-hover:text-emerald-500",
                bgColor: "bg-emerald-500/[0.03]"
              },
              {
                icon: Globe2,
                title: "Access Providers Worldwide",
                desc: "A fully borderless coordinate system spanning dozens of continents, allowing you to source help locally or arrange care abroad easily.",
                color: "group-hover:text-cyan",
                bgColor: "bg-cyan/[0.03]"
              },
              {
                icon: Zap,
                title: "Faster Healthcare Discovery",
                desc: "Identify relevant, available certified teams in minutes rather than months. We replace spreadsheets with rapid matching pathways.",
                color: "group-hover:text-amber-500",
                bgColor: "bg-amber-500/[0.03]"
              },
              {
                icon: Bot,
                title: "AI-Powered Recommendations",
                desc: "Describe your complex situations in conversational language. Our engine translates needs into exact logistics plans.",
                color: "group-hover:text-indigo-500",
                bgColor: "bg-indigo-500/[0.03]"
              },
              {
                icon: PhoneCall,
                title: "Direct Provider Connections",
                desc: "No middlemen or commissions. Speak directly with the specialized clinical staff, lead coordinators, or shipping teams in charge.",
                color: "group-hover:text-brand-red",
                bgColor: "bg-brand-red/[0.03]"
              },
              {
                icon: Activity,
                title: "Complete Healthcare Ecosystem",
                desc: "We bring hospitals, emergency fleets, rare drug pharmacies, and specialized gear importers into one unified ecosystem.",
                color: "group-hover:text-purple-500",
                bgColor: "bg-purple-500/[0.03]"
              }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group p-8 rounded-[40px] bg-white border border-navy/5 hover:border-cyan/30 hover:shadow-2xl transition-all duration-500 flex flex-col relative overflow-hidden"
              >
                <div className={`absolute inset-0 ${card.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-14 h-14 rounded-2xl bg-slate-bg flex items-center justify-center mb-8 text-navy/40 transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg ${card.color} relative z-10`}>
                  <card.icon size={26} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-4 relative z-10">{card.title}</h3>
                <p className="text-sm text-navy/50 leading-relaxed font-medium relative z-10">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSegment === 'ecosystem' && (
      <section className="py-16 md:py-20 bg-slate-bg/30 relative z-10" id="ecosystem">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-2xl mb-10 md:mb-12">
            <p className="text-brand-red font-bold uppercase tracking-[0.3em] text-[10px] mb-4">UNIVERSAL CHANNELS</p>
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter text-navy leading-none">
              Everything Healthcare. <br />
              <span className="font-serif italic text-gradient font-medium">One Intelligent Platform.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 border-l border-t border-navy/5">
            {[
              { label: "Hospitals", i: Building2, desc: "Surgical, General & Specialty Wards", link: "Caring Hospitals & Surgery Centers" },
              { label: "Air Ambulance", i: Plane, desc: "Flying ICU Flights & Evacs", link: "Urgent Travel & Flying ICU Services" },
              { label: "Homecare", i: Home, desc: "In-Home Nurses & Caregivers", link: "Cozy Support & Gentle Nursing at Home" },
              { label: "Diagnostics", i: FlaskConical, desc: "Imaging, PET Scans & Lab Tests", link: "Health Scans, MRI, & Quick Testing" },
              { label: "Pharmaceuticals", i: Pill, desc: "Rare & Special Medicines Sourcing", link: "Prescriptions & Hard-to-Find Medicines" },
              { label: "Telemedicine", i: PhoneCall, desc: "Video Doctors & Remote Clinics", link: "Care From Anywhere (Virtual Doctors)" },
              { label: "Medical Tourism", i: Globe2, desc: "Travel Planners & Visa Guides", link: "Travel Concierge & Safe Care Abroad" },
              { label: "Medical Equipment", i: Package, desc: "Device Importing & Rentals", link: "Importing Specialized Devices & Health Gear" },
              { label: "Elder Care", i: HeartPulse, desc: "Senior Housing & Memory Care", link: "Golden Years Care & Cozy Senior Living" },
              { label: "Rehabilitation", i: Activity, desc: "Physical Therapy & Recovery", link: "Restoring Wellness & Daily Self-Care" },
              { label: "Dental Care", i: Smile, desc: "Surgical & Esthetic Dentistry", link: "Gentle Dental Care & Happy Smiles" },
              { label: "Eye Care", i: Eye, desc: "Laser Procedures & Diagnostics", link: "Friendly Doctors & Medical Counselors" }
            ].map((cat, idx) => (
              <div 
                key={idx} 
                onClick={() => onExploreVendors(cat.link, undefined)}
                className="group p-8 border-r border-b border-navy/5 bg-white hover:bg-slate-bg transition-all cursor-pointer flex flex-col justify-between aspect-square"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-bg text-navy/30 flex items-center justify-center mb-6 group-hover:bg-cyan group-hover:text-white transition-all">
                    <cat.i size={18} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-navy group-hover:text-cyan transition-colors mb-2">{cat.label}</h3>
                  <p className="text-[10.5px] text-navy/40 leading-relaxed font-medium">{cat.desc}</p>
                </div>
                <div className="pt-4 flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-navy/20 group-hover:text-cyan transition-colors">
                  Explore <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSegment === 'intelligence' && (
      <section className="py-16 md:py-20 bg-navy text-white relative z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] noise pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Context */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse animate-duration-1000" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">LIVE SYSTEM INDICATORS</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-none mb-8">
                Watch Healthcare <br />Connections Happen <br />
                <span className="font-serif italic text-gradient font-medium">In Real Time.</span>
              </h2>
              <p className="text-base text-white/40 leading-relaxed max-w-md font-medium mb-12">
                Our logistics network functions like an active clearinghouse. Watch cross-border demands, equipment imports, emergency dispatches, and care partnerships route dynamically in real-time.
              </p>

              {/* Dynamic Counters - Stock Market Dashboard design */}
              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
                <div>
                  <div className="text-3xl md:text-5xl font-mono tracking-tight font-light mb-1 text-cyan">
                    {inquiriesCount.toLocaleString()}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Active Inquiries</p>
                </div>
                <div>
                  <div className="text-3xl md:text-5xl font-mono tracking-tight font-light mb-1 text-brand-red">
                    {connectionsCount.toLocaleString()}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Matches Handled</p>
                </div>
                <div>
                  <div className="text-3xl md:text-5xl font-mono tracking-tight font-light mb-1 text-emerald-400">
                    {suppliersCount.toLocaleString()}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Vetted Teams</p>
                </div>
              </div>
            </div>

            {/* Live Log Board */}
            <div className="bg-white/[0.02] backdrop-blur-3xl rounded-[32px] border border-white/10 p-8 md:p-10 relative overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/40">GMAA Clearinghouse Feed</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-white/20 uppercase">SECURE PORT: 3000</span>
              </div>

              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {liveLog.map((log) => (
                    <motion.div
                      layout
                      key={log.id}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: "auto" }}
                      exit={{ opacity: 0, x: 20, height: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      className="p-5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-2xl transition-colors relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan font-mono">{log.text}</span>
                        <span className="text-[8px] font-mono text-white/30 whitespace-nowrap ml-4">{log.time}</span>
                      </div>
                      <p className="text-xs text-white/50 leading-normal font-medium">{log.details}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">Data encrypted and streamed with secure clinical integrity.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {activeSegment === 'intelligence' && (
      <section className="py-16 md:py-20 relative z-10 border-b border-navy/5" id="ai-discovery">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Graphic demonstration of Directory vs Intelligence */}
            <div className="order-2 lg:order-1 space-y-6">
              <div className="p-8 rounded-[36px] border border-navy/5 bg-slate-bg/50 relative">
                <span className="absolute top-6 right-8 text-[10px] font-mono text-navy/20 uppercase">Legacy Platforms</span>
                <h4 className="text-xs font-black uppercase tracking-widest text-navy/40 mb-3">Traditional Directory</h4>
                <p className="text-xs text-navy/60 font-medium mb-4 leading-relaxed">Lists generic phone numbers and names without interpreting clinical urgency, transport grids, or device stocks.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white text-[9px] font-bold uppercase tracking-wider rounded-lg border border-navy/5 text-navy/40 line-through">Outdated Lists</span>
                  <span className="px-3 py-1.5 bg-white text-[9px] font-bold uppercase tracking-wider rounded-lg border border-navy/5 text-navy/40 line-through">Static Numbers</span>
                  <span className="px-3 py-1.5 bg-white text-[9px] font-bold uppercase tracking-wider rounded-lg border border-navy/5 text-navy/40 line-through">No Logistics</span>
                </div>
              </div>

              <div className="p-8 rounded-[36px] bg-white border border-cyan/30 shadow-2xl relative shadow-cyan/5">
                <span className="absolute top-6 right-8 text-[10px] font-mono text-cyan uppercase font-bold">Intelligent Layer</span>
                <h4 className="text-xs font-black uppercase tracking-widest text-cyan mb-3 flex items-center gap-2">
                  <Bot size={14} /> GMAA Intelligence
                </h4>
                <p className="text-xs text-navy/60 font-medium mb-4 leading-relaxed">Interprets patient constraints, equipment supply locations, transport speeds, and regional medical clearance protocols in real-time.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-cyan/5 text-cyan text-[9px] font-bold uppercase tracking-wider rounded-lg border border-cyan/10">AI Sourcing Match</span>
                  <span className="px-3 py-1.5 bg-emerald-500/[0.03] text-emerald-500 text-[9px] font-bold uppercase tracking-wider rounded-lg border border-emerald-500/10">Active Vetting</span>
                  <span className="px-3 py-1.5 bg-brand-red/5 text-brand-red text-[9px] font-bold uppercase tracking-wider rounded-lg border border-brand-red/10">Direct Connects</span>
                </div>
              </div>
            </div>

            {/* Context */}
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-bg rounded-full border border-navy/5">
                <Bot size={14} className="text-cyan animate-bounce" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">INTELLIGENT DECISIONS</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-none mb-8 text-navy">
                Powered By <br />
                <span className="font-serif italic text-gradient font-medium">Healthcare Intelligence</span>
              </h2>
              <p className="text-base text-navy/50 leading-relaxed font-medium mb-12">
                Traditional directories merely show static listings. GMAA understands real medical objective constraints. Our intelligent network maps physical hospitals, specialized air transport teams, medication formulas, and customizable home helpers dynamically and responsibly.
              </p>

              <h4 className="text-xs font-black uppercase tracking-[0.2em] text-navy/30 mb-6">Future Capabilities Pipeline</h4>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "AI Recommendation Engine",
                  "Smart Provider Matching",
                  "Intelligent Partner Discovery",
                  "Predictive Business Needs",
                  "Healthcare Market Intelligence"
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check size={14} className="text-cyan shrink-0" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-navy/60">{f}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {activeSegment === 'why-gmaa' && (
      <section className="py-16 md:py-20 bg-slate-bg/30 relative z-10" id="how-it-works">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-tight mb-6">
              Finding Healthcare <br />
              <span className="font-serif italic text-gradient font-medium">Has Never Been Smarter</span>
            </h2>
            <p className="text-base text-navy/50 font-medium max-w-lg mx-auto leading-relaxed">
              We've created a seamless five-step coordination process designed around speed, custom verification, and direct pathways.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-5 relative">
            
            {/* Visual connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-10 right-10 h-[1px] bg-navy/10 z-0" />

            {[
              { num: "01", t: "Describe Needs", desc: "Speak naturally or select clinical paths to clarify your exact requirements." },
              { num: "02", t: "AI Correlates", desc: "Our engine maps physical assets, transport vehicles, and vetted experts." },
              { num: "03", t: "Compare Vetted Options", desc: "Filter matched results by transit times, direct credentials, or cost bounds." },
              { num: "04", t: "Connect Directly", desc: "Speak directly with certified clinicians or logistical supervisors instantly." },
              { num: "05", t: "Access Reliably", desc: "Secure hospital beds, schedule flights, or clear device custom entries safely." }
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-start bg-white p-8 rounded-[32px] border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-navy text-white text-xs font-mono font-bold flex items-center justify-center mb-6">
                  {step.num}
                </div>
                <h3 className="text-base font-bold text-navy mb-3 leading-snug">{step.t}</h3>
                <p className="text-[11.5px] text-navy/40 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSegment === 'ecosystem' && (
      <section className="py-16 md:py-20 border-b border-navy/5 relative z-10" id="intel">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Interactive demo on left */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[40px] border border-navy/5 shadow-2xl p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-navy/5">
                {[
                  { id: 'requirement', label: "Requirement" },
                  { id: 'location', label: "Location" },
                  { id: 'specialty', label: "Specialty" },
                  { id: 'emergency', label: "Emergency" },
                  { id: 'insurance', label: "Insurance" },
                  { id: 'service', label: "Service Type" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setDemoFilter(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                      demoFilter === tab.id 
                        ? 'bg-navy text-white border-navy scale-100 shadow-lg shadow-navy/10' 
                        : 'bg-slate-bg text-navy/40 border-transparent hover:text-navy hover:bg-navy/5 scale-95'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <motion.div
                key={demoFilter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-navy mb-1">{FILTER_DEMOS[demoFilter].title}</h3>
                  <p className="text-xs text-navy/40 leading-relaxed font-semibold">{FILTER_DEMOS[demoFilter].subtitle}</p>
                </div>

                <div className="space-y-3 pt-2">
                  {FILTER_DEMOS[demoFilter].examples.map((ex, i) => (
                    <div key={i} className="flex gap-3 items-start p-4 rounded-xl border border-navy/5 bg-slate-bg/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />
                      <p className="text-xs text-navy/60 font-medium leading-relaxed">{ex}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Content on right */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-bg rounded-full border border-navy/5">
                <Workflow className="text-brand-red shrink-0" size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">INTELLIGENT CLASSIFICATIONS</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-none mb-8 text-navy">
                Tailored Rather than <br />
                <span className="font-serif italic text-gradient font-medium">Generic Listings</span>
              </h2>
              <p className="text-base text-navy/50 leading-relaxed font-medium mb-12">
                Unlike traditional medical search sites that dump static index queries, our network targets precise requirements dynamically. Connect, source, and fulfill according to Location bounds, Specific Subfields, Real-Time Emergency Needs, Custom Device logistics, and Insurance Compatibility lists.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => onExploreVendors(undefined, undefined)}
                  className="px-8 py-4 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-cyan transition-all shadow-xl active:scale-95"
                >
                  Enter Search Register
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
      )}

      {activeSegment === 'why-gmaa' && (
      <section className="py-16 md:py-20 bg-slate-bg/30 relative z-10" id="why-love">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-none mb-6">
              One Platform. <br />
              <span className="font-serif italic text-gradient font-medium">Endless Possibilities.</span>
            </h2>
            <p className="text-base text-navy/50 font-medium max-w-lg mx-auto leading-relaxed">
              We focus on clinical accuracy, rapid fulfillment speeds, and human support to restore complete healthcare confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {[
              { t: "Save Time", desc: "Consolidate months of emailing and scheduling into transparent microinteractions within seconds.", stat: "Over 80% Faster" },
              { t: "Make Better Decisions", desc: "Compare verified hospital statistics, delivery time frames, and medical gear weights with complete transparency.", stat: "100% Verified Price" },
              { t: "Access Global Healthcare", desc: "Never be constrained by domestic borders. Acquire treatments and equipment from highly trusted countries natively.", stat: "85+ Countries" },
              { t: "Compare Options", desc: "Filter and view real, authenticated customer reviews, price tags, certs, and specialty licenses before initiating contact.", stat: "No Middlemen Fees" },
              { t: "Discover New Solutions", desc: "Access cutting-edge treatments, urgent helicopter routes, specialized mobility supports, and rare prescription pharmacies easily.", stat: "Complete Ecosystem" },
              { t: "Connect Directly", desc: "Message verified teams directly via secure channels to lock in quotes, request custom bed setups, or file cover claims.", stat: "Immediate Chat Channels" }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[36px] border border-navy/5 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                <div className="space-y-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan font-bold block">{f.stat}</span>
                  <h3 className="text-lg font-bold text-navy">{f.t}</h3>
                  <p className="text-xs text-navy/50 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {activeSegment === 'stories' && (
      <section className="py-16 md:py-20 relative z-10 border-b border-navy/5 overflow-hidden" id="future-health">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-slate-bg/30 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Visual illustration of digital bridge */}
            <div className="relative">
              <div className="relative z-10 bg-navy text-white rounded-[40px] p-10 md:p-14 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 opacity-[0.03] noise" />
                <div className="relative z-10 space-y-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan">
                    <Server size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-light leading-snug">The Digital Bridge Between Healthcare Seekers and Vetted Providers.</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-medium">By connecting seekers, institutions, logistics agencies, and medical equipment factories, GMAA removes domestic healthcare delays permanently.</p>
                  <div className="flex gap-4 pt-4 border-t border-white/5 items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-lg font-serif italic text-cyan">Secure. Global. Smart.</div>
                      <div className="text-[8px] font-mono text-white/30 uppercase">Alliance Framework</div>
                    </div>
                    <Award className="text-white/20" size={32} />
                  </div>
                </div>
              </div>
              
              {/* Backglows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-red/10 rounded-full blur-[100px] z-0 pointer-events-none" />
            </div>

            {/* Context */}
            <div>
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-slate-bg rounded-full border border-navy/5">
                <TrendingUp size={14} className="text-cyan animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">THE DIGITAL BRIDGE</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-[1.05] mb-8 text-navy">
                The Future Of Healthcare <br />
                <span className="font-serif italic text-gradient font-medium">Is Connected</span>
              </h2>
              <p className="text-base text-navy/50 leading-relaxed font-medium mb-12">
                Modern healthcare is rapidly becoming smarter, faster, and decentralized. Borders shouldn't determine whether you can source medical gear inside an emergency, secure comforting senior nursing at home, or request direct consults with elite global experts. GMAA is building that bridge cleanly.
              </p>

              <button 
                onClick={onRequestConsultation}
                className="relative overflow-hidden px-10 py-5 bg-navy text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] group/btn shadow-xl active:scale-95 transition-all"
              >
                <div className="absolute inset-0 bg-brand-red -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Connect With GMAA AI <ArrowRight size={14} />
                </span>
              </button>
            </div>

          </div>
        </div>
      </section>
      )}

      {activeSegment === 'stories' && (
      <section className="py-16 md:py-20 bg-slate-bg/30 relative z-10" id="success-stories">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16">
          
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-12">
            <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-none mb-6">
              Real Connections, <br />
              <span className="font-serif italic text-gradient font-medium">Real Human Impact</span>
            </h2>
            <p className="text-base text-navy/50 font-medium max-w-lg mx-auto leading-relaxed">
              Read how patients, corporate staff, and families secured emergency logistics, specialized device imports, and international therapies.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-[48px] border border-navy/5 p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl" />
            
            {/* Story categories tabs switcher */}
            <div className="flex flex-wrap justify-center gap-2 mb-12 pb-8 border-b border-navy/5">
              {[
                { id: 'patient', label: 'Patient Journeys' },
                { id: 'family', label: 'Family Support' },
                { id: 'corporate', label: 'Corporate Care' },
                { id: 'travel', label: 'Urgent Journeys' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStoryTab(tab.id as any)}
                  className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${
                    activeStoryTab === tab.id 
                      ? 'bg-navy text-white border-navy shadow-xl shadow-navy/15 scale-100' 
                      : 'bg-slate-bg text-navy/40 border-transparent hover:text-navy hover:bg-navy/5 scale-95'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStoryTab}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-brand-red/5 text-brand-red text-[9px] font-black uppercase tracking-widest rounded-lg border border-brand-red/10">
                    {STORIES[activeStoryTab].tag}
                  </span>
                  <span className="text-[10px] font-bold text-navy/20 uppercase tracking-widest">{STORIES[activeStoryTab].title}</span>
                </div>
                
                <blockquote className="text-lg md:text-2xl text-navy/70 leading-relaxed font-light italic">
                  "{STORIES[activeStoryTab].story}"
                </blockquote>

                <div className="flex items-center gap-4 pt-6 border-t border-navy/5">
                  <div className="w-10 h-10 rounded-full bg-slate-bg flex items-center justify-center font-bold text-navy/40 text-xs">
                    {STORIES[activeStoryTab].meta.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-black uppercase tracking-widest text-navy">{STORIES[activeStoryTab].meta}</div>
                    <div className="text-[9px] font-bold text-navy/30 uppercase tracking-wider">Verified Alliance User</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>
      )}

      {activeSegment === 'stories' && (
      <section className="py-20 md:py-28 bg-navy text-white relative z-10 overflow-hidden text-center">
        <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 lg:px-12 xl:px-16 relative z-10">
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-8xl font-light leading-[1.05] tracking-tighter mb-16 max-w-4xl mx-auto"
          >
            Your Healthcare Solution <br />May Be <span className="font-serif italic text-gradient font-medium pr-2">One Search Away.</span>
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <button 
              onClick={() => onExploreVendors(undefined, undefined)}
              className="px-12 py-6 bg-cyan text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-navy hover:scale-105 transition-all shadow-2xl shadow-cyan/20 active:scale-95 duration-500"
            >
              Find Healthcare Services
            </button>
            <button 
              onClick={() => onExploreVendors(undefined, undefined)}
              className="px-12 py-6 border border-white/25 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-navy hover:scale-105 transition-all active:scale-95 duration-500"
            >
              Explore Global Network
            </button>
            <button 
              onClick={onRequestConsultation}
              className="px-12 py-6 bg-brand-red text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-navy hover:scale-105 transition-all shadow-2xl shadow-brand-red/20 active:scale-95 duration-500"
            >
              Get Started Now
            </button>
          </div>

        </div>
      </section>
      )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
}
