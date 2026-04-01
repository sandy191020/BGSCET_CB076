"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Satellite, BrainCircuit, Shovel, ArrowRight, Zap, Target, Lock, Globe, Play, ChevronDown, Box, ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { AuctionBanner } from "@/components/AuctionBanner";
import { TypewriterTitle } from "@/components/TypewriterTitle";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

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
      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative overflow-hidden min-h-screen flex items-center justify-center px-6 lg:px-8">
        {/* Video Background (Static, decoupled from motion for raw performance) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            src="/assets/hero-bg.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute top-0 left-0 h-full w-full object-cover transform-gpu"
          />
          {/* Default Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
          {/* Emerald tint overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/30 via-transparent to-transparent" />

          {/* Parallax Fade Overlay - Fades in black to hide video on scroll */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-[#000000] z-10 will-change-opacity"
          />
        </div>

        <motion.div style={{ y: contentY }} className="relative z-10 mx-auto max-w-4xl text-center">

          <TypewriterTitle />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-lg leading-8 text-zinc-400"
          >
            GreenLedger connects sustainable farmers directly to the $2B global carbon credit market.
            Automated satellite verification. AI-driven scoring. Blockchain-powered liquidity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Link
              href="/verify"
              className="group flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105"
            >
              Start Earning
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/cinematic"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
            >
              <Play className="h-5 w-5 fill-emerald-500 text-emerald-500" />
              Watch Demo
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-400">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6 text-emerald-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none opacity-50 transform-gpu" />

        <div className="relative z-10 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Engineered for Transparency</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-lg">Our multi-layered verification system ensures every carbon credit is backed by scientific reality.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FeatureCard
            icon={<Satellite className="h-7 w-7 text-emerald-400" />}
            title="Satellite Verification"
            description="Sentinel-2 satellite imagery verifies farmland conditions and vegetation health using NDVI analysis."
            accentColor="emerald"
            slideFrom="left"
          />
          <FeatureCard
            icon={<BrainCircuit className="h-7 w-7 text-emerald-400" />}
            title="AI Sustainability Scoring"
            description="Mastra AI analyzes vegetation data and automatically scores farm sustainability."
            accentColor="emerald"
            slideFrom="right"
          />
          <FeatureCard
            icon={<Box className="h-7 w-7 text-emerald-400" />}
            title="Blockchain Tokenization"
            description="Verified carbon reduction is converted into ERC-1155 carbon credit tokens minted on Polygon."
            accentColor="emerald"
            slideFrom="left"
          />
          <FeatureCard
            icon={<ShoppingBag className="h-7 w-7 text-emerald-400" />}
            title="Direct Carbon Marketplace"
            description="Companies purchase carbon credits directly from farmers without intermediaries."
            accentColor="emerald"
            slideFrom="right"
          />
        </motion.div>
      </section>

      <main>
        {/* Cinematic Hero */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-40">
            {/* Cinematic background removed as per user request */}
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
                    <div className="text-emerald-500 text-xs font-black mb-2 opacity-50 uppercase tracking-[0.3em]">Phase 0{i + 1}</div>
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
}function FeatureCard({ title, description, accentColor, slideFrom = "left", className = "" }: { title: string, description: string, accentColor: string, slideFrom?: "left" | "right", className?: string }) {
  const xOffset = slideFrom === "left" ? -80 : 80;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: xOffset },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-[3rem] bg-zinc-900/10 p-12 backdrop-blur-3xl border border-white/5 transition-all hover:border-emerald-500/30 shadow-2xl min-h-[320px] flex flex-col justify-end ${className}`}
    >
      {/* Decorative gradients */}
      <div className="absolute -top-32 -left-32 h-64 w-64 bg-emerald-500/5 blur-[100px] rounded-full group-hover:bg-emerald-500/10 transition-colors" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <h3 className="relative z-10 text-3xl font-black uppercase tracking-tighter text-white mb-4 group-hover:text-emerald-400 transition-colors font-outfit">
        {title}
      </h3>
      
      <p className="relative z-10 text-zinc-400 text-base leading-relaxed group-hover:text-zinc-300 transition-colors max-w-sm">
        {description}
      </p>

      {/* Decorative accent glow */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full group-hover:bg-emerald-500/10 transition-colors" />
    </motion.div>
  );
}
