"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Leaf, Satellite, BrainCircuit, Shovel, ArrowRight, Zap, Target, Lock, Globe, Play, ChevronDown, Box, ShoppingBag, AlertCircle } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { AuctionBanner } from "@/components/AuctionBanner";
import { TypewriterTitle } from "@/components/TypewriterTitle";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

import { useTranslation } from "@/lib/translations/provider";

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const { t } = useTranslation();
  const heroRef = useRef<HTMLElement>(null);

  // ... (useScroll logic same)
  const { scrollYProgress } = useScroll({ target: heroRef });
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
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
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden pt-16">
      {/* Hero Section with Video Background */}
      <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] md:min-h-screen flex items-center justify-center px-4 md:px-8 py-20 md:py-0">
        {/* Video Background */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-transparent" />
          <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[#000000] z-10 will-change-opacity" />
        </div>

        <motion.div style={{ y: contentY }} className="relative z-10 mx-auto max-w-4xl text-center">
          <TypewriterTitle />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 md:mt-8 text-base md:text-lg leading-7 md:leading-8 text-zinc-300 drop-shadow-md max-w-2xl mx-auto font-medium"

          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-x-6"
          >
            <Link
              href="/verify"
              className="w-full sm:w-auto group flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base md:text-lg font-semibold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105"
            >
              {t('hero.start_earning')}
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/cinematic"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base md:text-lg font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
            >
              <Play className="h-4 w-4 md:h-5 md:w-5 fill-emerald-500 text-emerald-500" />
              {t('hero.watch_demo')}
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 italic">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ChevronDown className="h-5 w-5 md:h-6 md:w-6 text-emerald-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="relative mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20 lg:px-8">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] bg-emerald-500/10 blur-3xl rounded-full pointer-events-none opacity-50 transform-gpu" />

        <div className="relative z-10 text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white sm:text-5xl">{t('features.title')}</h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">{t('features.subtitle')}</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FeatureCard
            title={t('features.satellite.title')}
            description={t('features.satellite.desc')}
            accentColor="emerald"
            slideFrom="left"
            className="md:col-span-1"
          />
          <FeatureCard
            title={t('features.ai.title')}
            description={t('features.ai.desc')}
            accentColor="emerald"
            slideFrom="right"
          />
          <FeatureCard
            title={t('features.blockchain.title')}
            description={t('features.blockchain.desc')}
            accentColor="emerald"
            slideFrom="left"
          />
          <FeatureCard
            title={t('features.market.title')}
            description={t('features.market.desc')}
            accentColor="emerald"
            slideFrom="right"
          />
        </motion.div>
      </section>

      {/* Upcoming Event Section */}
      <section className="relative py-12 md:py-20 px-4 md:px-6 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto">
          <div className="relative glass border border-white/10 rounded-3xl md:rounded-[4rem] p-8 md:p-20 overflow-hidden group">
            {/* Animated accent lines */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-30" />
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-30" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 md:mb-8"
                >
                  <Zap className="h-3 w-3 md:h-4 md:w-4 animate-pulse" />
                  {t('event.upcoming')}
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4 md:mb-6"
                >
                  {t('event.title')} <span className="text-emerald-500 italic">Exchange</span><br />
                  <span className="text-zinc-500 text-2xl md:text-5xl">{t('event.subtitle')}</span>
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-zinc-400 text-base md:text-lg font-medium max-w-lg mb-8 md:mb-10"
                >
                  Join the first-ever institutional-grade agricultural liquid capital event. 
                  Directly stake your yield for carbon credit leverage.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
                >
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{t('event.time')}</span>
                    <span className="text-lg md:text-xl font-bold text-white font-mono">02/04/2026 @ 21:30</span>
                  </div>
                  
                  <button className="w-full sm:w-auto rounded-full bg-white text-black px-8 py-3 text-sm md:text-base font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all shadow-xl shadow-white/5 disabled:opacity-50">
                    {t('event.register')}
                  </button>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative aspect-square md:aspect-auto md:h-[400px] flex items-center justify-center mt-8 lg:mt-0"
              >
                <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] md:blur-[100px] rounded-full animate-pulse" />
                <div className="relative w-64 h-64 md:w-96 md:h-96 glass-dark rounded-[2.5rem] md:rounded-[3rem] border border-white/10 flex items-center justify-center p-8 md:p-12 overflow-hidden shadow-2xl skew-x-1 md:skew-x-3 hover:skew-x-0 transition-transform duration-700">
                    <Leaf className="absolute h-32 w-32 md:h-48 md:w-48 text-emerald-500 opacity-20" />
                    <div className="relative text-center z-10">
                      <div className="mb-4">
                        <Lock className="h-6 w-6 md:h-8 md:w-8 text-emerald-400 mx-auto" />
                      </div>
                      <div className="text-3xl md:text-5xl font-black text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">GL_STAKE</div>
                      <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400/80 italic">SECURED_VAULT_001</div>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] font-mono text-emerald-400/60 uppercase">System Ready</span>
                      </div>
                    </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <main>

      {/* The Problem Section */}
      <section id="problem" className="py-12 md:py-20 px-4 md:px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6 md:space-y-8">
            <div className="h-14 w-14 md:h-16 md:w-16 bg-red-500/10 border border-red-500/20 rounded-2xl md:rounded-3xl flex items-center justify-center text-red-500">
              <Target className="h-7 w-7 md:h-8 md:w-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
              The Invisible <br /><span className="text-red-500">{t('nav.problem')}</span>
            </h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed font-medium">{t('problem.desc')}</p>

            <div className="space-y-4">
              {[
                { t: t('problem.traceability.title'), d: t('problem.traceability.desc') },
                { t: t('problem.middleman.title'), d: t('problem.middleman.desc') },
                { t: t('problem.greenwash.title'), d: t('problem.greenwash.desc') }
              ].map(item => (
                <div key={item.t} className="flex gap-4 p-5 md:p-6 rounded-2xl md:rounded-3xl bg-zinc-900/30 border border-white/5 transition-colors hover:border-red-500/20">
                  <div className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-red-500 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-black uppercase tracking-widest text-[10px] md:text-xs text-white underline decoration-red-500 decoration-2 underline-offset-4 mb-2">{item.t}</h4>
                    <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-tight">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-red-500/10 blur-[80px] md:blur-[120px] rounded-full animate-pulse" />
            <div className="relative h-full w-full glass rounded-[2.5rem] md:rounded-[4rem] border border-white/10 flex items-center justify-center p-12 md:p-20 transform rotate-2 md:rotate-3 hover:rotate-0 transition-transform duration-700">
              <div className="text-center space-y-4 md:space-y-6">
                <AlertCircle className="h-24 w-24 md:h-32 md:w-32 text-red-500 mx-auto opacity-50" />
                <div className="font-mono text-zinc-600 text-[10px] tracking-tighter italic uppercase">ERROR_CODE: MARKET_INEFFICIENCY_DETECTION</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 md:py-20 px-4 md:px-6 relative">
        <div className="max-w-7xl mx-auto text-center mb-12 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-6">
            System Architecture
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">A Trusted <span className="text-emerald-500">Ecosystem</span></h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: <Satellite />, title: t('features.satellite.title'), desc: t('features.satellite.desc') },
            { icon: <BrainCircuit />, title: t('features.ai.title'), desc: t('features.ai.desc') },
            { icon: <Shovel />, title: t('features.blockchain.title'), desc: t('features.blockchain.desc') }
          ].map((step, i) => (
            <div key={i} className="group relative p-8 md:p-10 glass rounded-[2.5rem] md:rounded-[3rem] border border-white/5 bg-zinc-950/20 hover:bg-emerald-500/5 transition-all duration-500">
              <div className="h-14 w-14 md:h-16 md:w-16 bg-white text-black rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-xl group-hover:bg-emerald-500 transition-colors">
                {React.cloneElement(step.icon as any, { className: "h-7 w-7 md:h-8 md:w-8" })}
              </div>
              <div className="text-emerald-500 text-[10px] font-black mb-2 opacity-50 uppercase tracking-[0.3em]">Phase 0{i + 1}</div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white mb-3 md:mb-4">{step.title}</h3>
              <p className="text-zinc-500 text-sm md:text-base leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>
      </main>

      <footer className="py-12 md:py-20 px-4 md:px-6 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <Leaf className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic text-zinc-400">GreenLedger</span>
          </div>

          <div className="flex gap-4 md:gap-8 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-zinc-600">
            <a href="#" className="hover:text-emerald-500 transition-colors italic">{t('footer.terms')}</a>
            <a href="#" className="hover:text-emerald-500 transition-colors italic">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-emerald-500 transition-colors italic">{t('footer.api')}</a>
          </div>

          <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-800 italic">
            {t('footer.copyright')}
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
