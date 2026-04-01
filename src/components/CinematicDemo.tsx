"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Zap, Coins, Leaf } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface CinematicDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  { text: "Satellite Verified Farms", icon: <ShieldCheck className="h-5 w-5" />, id: "GL_SAT_01" },
  { text: "AI Carbon Scoring", icon: <Zap className="h-5 w-5" />, id: "GL_AI_02" },
  { text: "Blockchain Secured Credits", icon: <Coins className="h-5 w-5" />, id: "GL_BC_03" },
  { text: "Direct Farmer Payments", icon: <Leaf className="h-5 w-5" />, id: "GL_PAY_04" },
];

export function CinematicDemo({ isOpen, onClose }: CinematicDemoProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timeline = [
        setTimeout(() => setStep(1), 800),    // Scene 1: Dark Start -> Soil
        setTimeout(() => setStep(2), 3000),   // Scene 2: Seed Drop
        setTimeout(() => setStep(3), 5500),   // Scene 3: Water Flow
        setTimeout(() => setStep(4), 8500),   // Scene 4: Sprout Emergence
        setTimeout(() => setStep(5), 12500),  // Scene 5: Full Plant growth
        setTimeout(() => setStep(6), 16000),  // Scene 6: Token Transformation
        setTimeout(() => setStep(7), 18500),  // Scene 7: RBI Card Reveal
      ];
      return () => timeline.forEach(clearTimeout);
    } else {
      setStep(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            backgroundColor: step >= 4 ? "rgba(12, 10, 8, 0.99)" : "rgba(0, 0, 0, 0.99)"
          }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-3xl transition-colors duration-4000"
        >
          {/* Ambient Lighting Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={step >= 4 ? { opacity: [0, 0.4, 0.2] } : { opacity: 0 }}
              className="absolute -top-[20%] -left-[10%] h-[150%] w-[150%] bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.1),transparent_50%)]"
            />
          </div>

          <button
            onClick={onClose}
            className="absolute right-10 top-10 z-[110] rounded-full bg-white/5 p-4 text-zinc-500 hover:bg-white/10 hover:text-white transition-all backdrop-blur-md border border-white/10"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="container relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-20 px-8 lg:grid-cols-2">

            {/* Left Side: RBI-Style Premium Cards */}
            <div className="flex flex-col space-y-8">
              <AnimatePresence>
                {step >= 7 && features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -80, rotateY: 30, filter: "blur(15px)", z: -100 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)", z: 0 }}
                    transition={{
                      duration: 1.5,
                      delay: idx * 0.2,
                      ease: [0.19, 1, 0.22, 1]
                    }}
                    className="perspective-1000"
                  >
                    <div className="glass relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-zinc-900/60 to-black/60 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all hover:scale-[1.02] hover:border-emerald-500/30">
                      {/* Currency Glow Sheen */}
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
                      />

                      <div className="flex items-center gap-8">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                          {feature.icon}
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">{feature.id}</p>
                          <h3 className="text-2xl font-semibold text-white tracking-tight">{feature.text}</h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Side: Hyper-Realistic Smartphone Experience */}
            <div className="relative flex items-center justify-center">
              {/* Cinematic Halo */}
              <motion.div
                animate={step >= 4 ? {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                } : { opacity: 0 }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_70%)] blur-[120px]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: -25, y: 50 }}
                animate={{ opacity: 1, scale: 1, rotateY: -10, y: 0 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="group relative z-10 h-[800px] w-[390px] overflow-hidden rounded-[4rem] bg-zinc-950 p-[14px] shadow-[0_40px_100px_rgba(0,0,0,1)] ring-[16px] ring-zinc-900/80 transition-transform hover:rotateY-[-5deg]"
              >
                <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none">

                  {/* Scene Layer 1: Soil (Base) */}
                  <AnimatePresence>
                    {step >= 1 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 3 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src="/assets/cinematic/soil_seed.png"
                          alt="Soil"
                          fill
                          className="object-cover opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scene Layer 2: Water Flow (Interaction) */}
                  <AnimatePresence>
                    {step === 3 && (
                      <motion.div
                        initial={{ opacity: 0, y: -100, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 z-20 mix-blend-screen"
                      >
                        <Image
                          src="/assets/cinematic/water.png"
                          alt="Water"
                          fill
                          className="object-cover scale-150"
                        />
                        {/* Macro absorption flare */}
                        <motion.div
                          animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.2, 1] }}
                          transition={{ duration: 2 }}
                          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-blue-400/20 blur-3xl"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scene Layer 3: Sprout Emergence */}
                  <AnimatePresence>
                    {step >= 4 && (
                      <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{
                          opacity: step === 4 ? 1 : 0,
                          y: step === 4 ? 0 : -50,
                          scale: step === 4 ? 1 : 1.2,
                          filter: step === 4 ? "blur(0px)" : "blur(10px)"
                        }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                        className="absolute inset-0 z-30"
                      >
                        <Image
                          src="/assets/cinematic/sprout.png"
                          alt="Sprout"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scene Layer 4: Full Growth (Natural reveal) */}
                  <AnimatePresence>
                    {step >= 5 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 5, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute inset-0 z-40"
                      >
                        <Image
                          src="/assets/cinematic/full_plant.png"
                          alt="Plant"
                          fill
                          className="object-cover"
                        />
                        {/* Sun glare bloom */}
                        <motion.div
                          animate={{ opacity: [0, 0.3, 0.1], x: [-100, 0] }}
                          transition={{ duration: 6 }}
                          className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-orange-400/20 blur-[100px]"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Scene Layer 5: Token Emergence */}
                  <AnimatePresence>
                    {step >= 6 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.2, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: -200 }}
                        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 z-50 flex items-center justify-center"
                      >
                        <motion.div
                          animate={{
                            rotateY: 360,
                            y: [0, -15, 0]
                          }}
                          transition={{
                            rotateY: { duration: 15, repeat: Infinity, ease: "linear" },
                            y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                          }}
                          className="relative h-64 w-64 select-none"
                        >
                          <Image
                            src="/assets/cinematic/token.png"
                            alt="Carbon Token"
                            fill
                            className="object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.6)]"
                          />
                          <div className="absolute inset-0 bg-emerald-400/10 blur-[60px] animate-pulse rounded-full" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Atmosphere: Particles & Dust */}
                  {step >= 4 && [...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-20, -600],
                        x: [0, Math.random() * 100 - 50],
                        opacity: [0, 0.4, 0],
                        scale: [0.5, 1.2, 0.5]
                      }}
                      transition={{
                        duration: 8 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                      }}
                      className="absolute h-1 w-1 z-20 rounded-full bg-orange-200/20"
                      style={{
                        left: `${Math.random() * 100}%`,
                        bottom: '20%'
                      }}
                    />
                  ))}

                  {/* Status Scrubber */}
                  <div className="absolute bottom-12 w-full px-12">
                    <div className="h-[2px] w-full bg-white/5 relative">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step / 7 }}
                        className="absolute inset-0 bg-emerald-500 origin-left"
                      />
                    </div>
                    <div className="mt-2 flex justify-between">
                      <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Seq_Real_0{step}</p>
                      <p className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-widest">Process_8k_HDR</p>
                    </div>
                  </div>
                </div>

                {/* iPhone Frame Accessories */}
                <div className="absolute left-1/2 top-4 h-7 w-28 -translate-x-1/2 rounded-full bg-zinc-950 shadow-inner" />
                <div className="absolute right-[-2px] top-32 h-14 w-[4px] rounded-l-md bg-zinc-800" />
                <div className="absolute left-[-2px] top-24 h-10 w-[4px] rounded-r-md bg-zinc-800" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
