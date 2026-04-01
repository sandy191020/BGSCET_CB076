"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Coins, Zap, ShieldCheck, X } from "lucide-react";
import { useState, useEffect } from "react";

interface CinematicDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  { text: "Satellite Verified Farms", icon: <ShieldCheck className="h-5 w-5" />, delay: 0.8 },
  { text: "AI-Based Carbon Scoring", icon: <Zap className="h-5 w-5" />, delay: 2.2 },
  { text: "Blockchain Secured Credits", icon: <Coins className="h-5 w-5" />, delay: 3.5 },
  { text: "Direct Farmer Payments", icon: <Leaf className="h-5 w-5" />, delay: 4.8 },
];

export function CinematicDemo({ isOpen, onClose }: CinematicDemoProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timer = setInterval(() => {
        setStep((s) => (s < 4 ? s + 1 : s));
      }, 2000);
      return () => clearInterval(timer);
    } else {
      setStep(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-8 top-8 z-[110] rounded-full bg-white/5 p-3 text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="container relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-2">
            
            {/* Left Side: Features */}
            <div className="flex flex-col space-y-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30, y: 10 }}
                  animate={step > idx ? { opacity: 1, x: 0, y: 0 } : {}}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex items-center gap-4 group"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/50 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{feature.text}</h3>
                    <div className="mt-1 h-0.5 w-0 bg-emerald-500 transition-all duration-1000 group-hover:w-full opacity-50" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right Side: Phone Mockup */}
            <div className="relative flex items-center justify-center">
              {/* Cinematic Glow Background */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[120px]"
              />

              {/* Phone Frame */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30, y: 50 }}
                animate={{ opacity: 1, scale: 1, rotateY: -5, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 h-[700px] w-[350px] overflow-hidden rounded-[3rem] bg-zinc-900 ring-4 ring-white/10 shadow-[0_0_100px_rgba(16,185,129,0.2)]"
              >
                {/* Inner Screen */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black p-4">
                  
                  {/* Dynamic Sunlight Rays */}
                  <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1], x: [-20, 20, -20] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent pointer-events-none"
                  />

                    {/* Growth Animation Area */}
                  <div className="relative h-full w-full overflow-hidden pt-10">
                    
                    {/* Floating Particles */}
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [-20, -400],
                          opacity: [0, 0.4, 0],
                          scale: [0.5, 1.2, 0.5]
                        }}
                        transition={{ 
                          duration: 5 + Math.random() * 3,
                          repeat: Infinity,
                          delay: i * 0.4
                        }}
                        className="absolute h-1 w-1 rounded-full bg-emerald-400"
                        style={{ 
                          left: `${Math.random() * 100}%`,
                          bottom: '10%'
                        }}
                      />
                    ))}

                    {/* Soil Layer (Moved to absolute bottom) */}
                    <motion.div 
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-[120%] rounded-[100%] bg-gradient-to-t from-zinc-900 to-zinc-800/20 blur-2xl"
                    />

                    {/* The Plant Growth Animation (Full Screen) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-10">
                      <AnimatePresence>
                        {/* Phase 1: The Seed (Drops from top) */}
                        {step === 1 && (
                          <motion.div
                            initial={{ y: -300, opacity: 0, scale: 0.5, rotate: 45 }}
                            animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 1.2, ease: "easeIn" }}
                            className="h-6 w-4 rounded-full bg-orange-900 shadow-2xl shadow-orange-900/50"
                          />
                        )}

                        {/* Phase 2+: The Organic Growth */}
                        {step >= 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="relative h-full w-full"
                          >
                            <svg width="100%" height="100%" viewBox="0 0 350 700" preserveAspectRatio="xMidYMax meet" className="drop-shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                              {/* Spiraling Main Stem (Taller) */}
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                d="M175 700 C175 700 120 600 175 500 C230 400 120 300 175 100"
                                stroke="#10b981"
                                strokeWidth="8"
                                strokeLinecap="round"
                                fill="none"
                              />

                              {/* Larger Leaf Groups */}
                              <LeafGroup delay={1.2} x={175} y={550} scale={1.2} rotation={-45} />
                              <LeafGroup delay={2.0} x={175} y={400} scale={1.5} rotation={45} />
                              <LeafGroup delay={2.8} x={175} y={150} scale={1.8} rotation={-30} />
                              
                              {/* Final Bloom (Positioned higher) */}
                              {step >= 3 && (
                                <motion.g
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 1, delay: 0.8, type: "spring" }}
                                >
                                  <circle cx="175" cy="100" r="25" fill="#fbbf24" className="filter blur-[5px]" />
                                  <motion.circle 
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.9, 0.6] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    cx="175" cy="100" r="40" 
                                    fill="url(#flowerGlowLarge)" 
                                  />
                                  <defs>
                                    <radialGradient id="flowerGlowLarge">
                                      <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                                      <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                                    </radialGradient>
                                  </defs>
                                </motion.g>
                              )}
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Carbon Token Appearance (Floating higher) */}
                      <AnimatePresence>
                        {step >= 3 && (
                          <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.5 }}
                            animate={{ y: -450, opacity: 1, scale: 1.5 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                          >
                            <motion.div
                              animate={{ rotateY: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="relative flex h-32 w-32 items-center justify-center"
                            >
                              <div className="absolute inset-0 rounded-full bg-emerald-500/30 blur-2xl animate-pulse" />
                              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_50px_rgba(16,185,129,0.6)]">
                                <Coins className="h-12 w-12 text-white" />
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Status Bar Overlay */}
                    <div className="absolute top-12 w-full text-center">
                      <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[12px] font-mono text-emerald-500/80 uppercase tracking-[0.2em] font-bold"
                      >
                        {step < 4 ? "Analyzing_Farm_DNA..." : "Token_Generation_Complete"}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* iPhone Details */}
                <div className="absolute left-1/2 top-4 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LeafGroup({ delay, x, y, scale, rotation }: { delay: number, x: number, y: number, scale: number, rotation: number }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0, rotate: rotation - 20 }}
      animate={{ scale, opacity: 1, rotate: rotation }}
      transition={{ duration: 1.5, delay, type: "spring", bounce: 0.4 }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <path
        d={`M${x} ${y} C${x} ${y} ${x - 30} ${y - 10} ${x - 40} ${y - 30} C${x - 50} ${y - 50} ${x - 20} ${y - 50} ${x} ${y - 30}`}
        fill="#10b981"
        fillOpacity="0.9"
        className="drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: delay + 0.5 }}
        d={`M${x} ${y} L${x - 25} ${y - 35}`}
        stroke="#065f46"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </motion.g>
  );
}
