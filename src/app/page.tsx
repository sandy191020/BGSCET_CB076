"use client";

import { Leaf, Satellite, BrainCircuit, Shovel, ArrowRight, Zap, Target, Lock, Globe, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AuctionBanner } from "@/components/AuctionBanner";
import { CinematicDemo } from "@/components/CinematicDemo";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden">
      {/* Dynamic Auction Announcement Banner */}
      <AuctionBanner />

      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="h-10 w-10 bg-emerald-500 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-emerald-500/20">
              <Leaf className="text-black h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">GreenLedger</span>
          </div>
          
          <div className="flex items-center gap-6">
            {!user ? (
              <>
                <Link href="/auth/signin" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Sign In</Link>
                <Link href="/auth/signup" className="bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-white/5">Get Started</Link>
              </>
            ) : (
              <Link href="/dashboard" className="bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-xl shadow-white/5">Go to Dashboard</Link>
            )}
          </div>
        </nav>
      </header>

      <main>
        {/* Cinematic Hero */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            <CinematicDemo />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black z-[5]" />
          
          <motion.div 
            style={{ opacity }}
            className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-2xl">
                <Globe className="h-3 w-3" />
                The Future of Global Agriculture
              </div>
              <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-[0.85] mb-8 drop-shadow-2xl">
                Decentralized <br />
                <span className="text-emerald-500 italic">Eco-Commerce</span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                Connect directly with sustainable farmers through AI-verified carbon indexing and real-time blockchain auctions.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={user ? "/dashboard" : "/auth/signup"} className="group relative px-10 py-5 bg-white text-black rounded-[2rem] font-black uppercase tracking-widest text-sm flex items-center gap-3 overflow-hidden transition-all hover:pr-12 active:scale-95 shadow-2xl shadow-white/10">
                  Join the Network
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="px-10 py-5 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-3 active:scale-95">
                  <Play className="h-4 w-4 fill-current" />
                  Watch Protocol
                </button>
              </div>
            </motion.div>
          </motion.div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white to-transparent" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] rotate-180 [writing-mode:vertical-lr]">Scroll Exploration</span>
          </div>
        </section>

        {/* Hide Problem/How It Works if user is logged in as requested */}
        {!user && (
          <>
            {/* The Problem Section */}
            <section id="problem" className="py-32 px-6 bg-zinc-950">
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <div className="h-16 w-16 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center text-red-500">
                    <Target className="h-8 w-8" />
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">The Invisible <br /><span className="text-red-500">Market Failure</span></h2>
                  <p className="text-zinc-400 text-lg leading-relaxed font-medium">Traditional supply chains are opaque, inefficient, and penalize sustainable practices. Smallholder farmers lose up to 60% of value to intermediaries while carbon offsets remain unverified.</p>
                  
                  <div className="space-y-4">
                    {[
                      { t: "Opaque Traceability", d: "No way to verify soil health or chemical-free claims." },
                      { t: "Middleman Tax", d: "Layered commission structures draining farmer revenue." },
                      { t: "Greenwashing", d: "Unverified carbon credits being sold as premium offsets." }
                    ].map(item => (
                      <div key={item.t} className="flex gap-4 p-6 rounded-3xl bg-zinc-900/30 border border-white/5 transition-colors hover:border-red-500/20">
                        <div className="h-2 w-2 rounded-full bg-red-500 mt-2 shrink-0" />
                        <div>
                          <h4 className="font-black uppercase tracking-widest text-xs text-white underline decoration-red-500 decoration-2 underline-offset-4 mb-2">{item.t}</h4>
                          <p className="text-zinc-500 text-sm font-bold uppercase tracking-tight">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="relative aspect-square">
                  <div className="absolute inset-0 bg-red-500/10 blur-[120px] rounded-full animate-pulse" />
                  <div className="relative h-full w-full glass rounded-[4rem] border border-white/10 flex items-center justify-center p-20 transform rotate-3 hover:rotate-0 transition-transform duration-700">
                    <div className="text-center space-y-6">
                       <AlertCircle className="h-32 w-32 text-red-500 mx-auto opacity-50" />
                       <div className="font-mono text-zinc-600 text-xs tracking-tighter">ERROR_CODE: MARKET_INEFFICIENCY_DETECTION</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-32 px-6 relative">
              <div className="max-w-7xl mx-auto text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
                  System Architecture
                </div>
                <h2 className="text-5xl font-black uppercase tracking-tighter">A Trusted <span className="text-emerald-500">Ecosystem</span></h2>
              </div>

              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: <Satellite />, title: "Satellite Verification", desc: "AI-powered NDVI analysis monitors farm health in real-time." },
                  { icon: <BrainCircuit />, title: "Carbon Indexing", desc: "Proprietary algorithms calculate true sequestered carbon volume." },
                  { icon: <Shovel />, title: "Blockchain Auction", desc: "Transparent bidding ensures fair market value for producers." }
                ].map((step, i) => (
                  <div key={i} className="group relative p-10 glass rounded-[3rem] border border-white/5 bg-zinc-950/20 hover:bg-emerald-500/5 transition-all duration-500">
                    <div className="h-16 w-16 bg-white text-black rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-emerald-500 transition-colors">
                      {React.cloneElement(step.icon as any, { className: "h-8 w-8" })}
                    </div>
                    <div className="text-emerald-500 text-xs font-black mb-2 opacity-50 uppercase tracking-[0.3em]">Phase 0{i+1}</div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">{step.title}</h3>
                    <p className="text-zinc-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="py-20 px-6 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Leaf className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-zinc-400">GreenLedger</span>
          </div>
          
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">API Docs</a>
          </div>

          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800">
            © 2024 GreenLedger Autonomous Systems
          </div>
        </div>
      </footer>
    </div>
  );
}
