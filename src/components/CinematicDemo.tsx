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

// Styles removed for clean bento design

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
            backgroundColor: "rgba(15, 23, 42, 0.95)"
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
            
            {/* Left Side: Bento Grid Features */}
            <div className="flex w-full max-w-2xl flex-col justify-center relative z-10 pt-32">
              <div className="grid grid-cols-2 gap-6 relative">
                
                {/* Small Robot Perched on Top of the Bento Grid */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute -top-[160px] right-10 w-[200px] h-[200px] z-50 pointer-events-auto mix-blend-lighten"
                >
                  <iframe 
                    src="https://my.spline.design/rememberallrobot-zwWQBEBI2pJwOFDFZSqBhrZx/" 
                    frameBorder="0" width="100%" height="100%" 
                    style={{ border: "none", background: "transparent" }}
                    title="Small Top Robot"
                  ></iframe>
                </motion.div>

                <AnimatePresence>
                  {step >= 2 && features.map((feature, idx) => {
                    const isWide = idx === 0 || idx === 3;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        transition={{ 
                          duration: 0.8, 
                          delay: idx * 0.15,
                          ease: "easeOut" 
                        }}
                        className={`group relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl p-8 transition-colors duration-300 hover:border-white/50 ${
                          isWide 
                            ? 'col-span-2 flex flex-row items-center space-x-6' 
                            : 'col-span-1 flex flex-col items-start min-h-[160px]'
                        }`}
                      >
                        <div className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner border border-white/10 transition-transform duration-300 group-hover:scale-110 ${!isWide && 'mb-auto'}`}>
                          {feature.icon}
                        </div>
                        <div className={`relative z-10 flex flex-col justify-center ${!isWide && 'mt-4'}`}>
                          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-1.5">{feature.id}</p>
                          <h3 className={`font-medium text-white tracking-tight ${isWide ? 'text-xl' : 'text-lg leading-tight'}`}>{feature.text}</h3>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
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
                  
                  {/* Scene Layers 1-5: Growth Video Sequence */}
                  <AnimatePresence>
                    {step >= 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 3 }}
                        className="absolute inset-0 z-10"
                      >
                        <video 
                          src="/assets/demovideo/Seed_sprouts_into_202604011634.mp4" 
                          autoPlay 
                          muted 
                          loop
                          playsInline 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
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
