import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Calendar, ArrowRight, Share2, TrendingUp, Zap } from 'lucide-react';

const INSIGHTS = [
  {
    id: 1,
    title: "The Future of AI-Driven medical Diagnostics",
    excerpt: "How machine learning models are achieving 99% accuracy in early-stage oncology detection across Asian healthcare clusters.",
    category: "Advancements",
    date: "April 28, 2026",
    author: "Dr. Aradhya Sharma",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&q=80",
    featured: true
  },
  {
    id: 2,
    title: "Decentralized Medical Supply Chains",
    excerpt: "Exploring the shift from monolithic regional warehouses to hyper-local drone fulfillment networks for emergency bypass surgery kits.",
    category: "Global Logistics",
    date: "April 27, 2026",
    author: "James Chen",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1586528116311-ad86d7c48858?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Cross-Border Health Data Security",
    excerpt: "Implementing advanced zero-knowledge proof protocols to protect patient data during international medical transfers.",
    category: "Policy & Safety",
    date: "April 26, 2026",
    author: "Elena Petrova",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Personalized Precision Medicine at Scale",
    excerpt: "The integration of genomic sequencing into routine primary care: Challenges and breakthroughs in the 2026 landscape.",
    category: "Advancements",
    date: "April 25, 2026",
    author: "Dr. Michael Liao",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80"
  }
];

export default function InsightsPage() {
  const featuredPost = INSIGHTS.find(p => p.featured);
  const regularPosts = INSIGHTS.filter(p => !p.featured);

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Header Section */}
      <section className="pt-40 pb-20 border-b border-navy/5 bg-slate-bg/30">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-1 bg-brand-red rounded-full" />
            <span className="text-navy font-bold uppercase tracking-[0.4em] text-[9px] md:text-[10px]">Global Intelligence</span>
          </div>
          <h1 className="text-4xl md:text-8xl font-light tracking-tighter leading-[1.1] md:leading-[0.9] text-navy mb-6 md:mb-8">
            Network <span className="text-gradient font-bold pr-2">Insights.</span>
          </h1>
          <p className="max-w-2xl text-navy/50 font-medium leading-relaxed text-lg">
            Daily intelligence on healthcare advancements, global logistics breakthroughs, and institutional safety protocols for the modern medical age.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20 md:py-24 border-b border-navy/5">
          <div className="container mx-auto px-4 md:px-12 lg:px-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center"
            >
              <div className="relative aspect-video lg:aspect-[16/10] overflow-hidden rounded-[32px] md:rounded-[48px] shadow-2xl glass">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
                <div className="absolute top-8 left-8 flex gap-2">
                  <span className="px-6 py-2 bg-brand-red text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Featured
                  </span>
                  <span className="px-6 py-2 bg-white text-navy text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    {featuredPost.category}
                  </span>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">
                  <span className="flex items-center gap-2"><Calendar size={14} /> {featuredPost.date}</span>
                  <span className="flex items-center gap-2"><BookOpen size={14} /> {featuredPost.readTime}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-light tracking-tighter leading-tight text-navy">
                  {featuredPost.title}
                </h2>
                <p className="text-xl text-navy/60 leading-relaxed font-medium">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4">
                  <button className="px-12 py-5 bg-navy text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-brand-red transition-all shadow-2xl active:scale-95 flex items-center gap-4">
                    Read Article <ArrowRight size={16} />
                  </button>
                  <button className="p-5 rounded-full border border-navy/10 text-navy/40 hover:text-navy hover:bg-navy/5 transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-16 gap-6">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40">Latest Updates</h3>
            <div className="flex flex-wrap gap-2 md:gap-4">
               {["All", "Advancements", "Logistics", "Security"].map((cat) => (
                 <button key={cat} className="px-4 md:px-6 py-2 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-navy hover:text-white transition-all border border-navy/5 bg-slate-bg/50">
                   {cat}
                 </button>
               ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {regularPosts.map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-[32px] mb-8 relative shadow-xl">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/0 transition-all" />
                  <div className="absolute bottom-6 left-6">
                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md text-navy text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-navy/30">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 bg-brand-red rounded-full" />
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="text-2xl font-bold text-navy group-hover:text-brand-red transition-colors leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-navy/50 line-clamp-2 font-medium">{post.excerpt}</p>
                  <div className="pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all">
                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest flex items-center gap-2">View Post <ArrowRight size={14} /></span>
                    <div className="flex gap-2">
                       <TrendingUp size={14} className="text-cyan" />
                       <Zap size={14} className="text-brand-red" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Update Newsletter */}
      <section className="py-16 md:py-24">
         <div className="max-w-[95%] md:max-w-[80%] mx-auto px-4 md:px-0">
            <div className="bg-navy rounded-[32px] md:rounded-[64px] p-8 md:p-16 relative overflow-hidden text-center text-white">
               <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />
               <div className="relative z-10 max-w-2xl mx-auto space-y-6 md:space-y-8">
                  <h2 className="text-3xl md:text-6xl font-light tracking-tighter leading-tight">
                    Institutional <span className="font-bold text-gradient pr-2">Intelligence.</span>
                  </h2>
                  <p className="text-white/50 font-medium text-sm md:text-base">Subscribe for daily morning briefings delivered to your terminal every day at 06:00 GMT.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                     <input 
                       type="email" 
                       placeholder="Email Address" 
                       className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 md:px-8 py-4 md:py-5 focus:outline-none focus:border-brand-red transition-all font-medium text-sm"
                     />
                     <button className="bg-white text-navy px-10 md:px-12 py-4 md:py-5 rounded-full font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em] hover:bg-brand-red hover:text-white transition-all shadow-2xl active:scale-95">
                        Subscribe
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
