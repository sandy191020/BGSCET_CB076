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
      }, 1500);
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
                  <div className="relative flex h-full w-full flex-col items-center justify-center pt-20">
                    
                    {/* Floating Particles */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [-20, -100],
                          opacity: [0, 0.5, 0],
                          scale: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 4 + Math.random() * 2,
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                        className="absolute h-1 w-1 rounded-full bg-emerald-400"
                        style={{ 
                          left: `${20 + Math.random() * 60}%`,
                          bottom: '30%'
                        }}
                      />
                    ))}

                    {/* Soil Layer */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute bottom-20 h-12 w-48 rounded-[100%] bg-zinc-800/80 blur-xl blur-md"
                    />

                    {/* The Plant Growth Animation */}
                    <div className="relative z-10 mb-12">
                      <AnimatePresence>
                        {step >= 1 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1.5, type: "spring" }}
                            className="relative"
                          >
                            <svg width="120" height="200" viewBox="0 0 120 200" fill="none">
                              {/* Stem */}
                              <motion.path
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 2 }}
                                d="M60 200V100"
                                stroke="#10b981"
                                strokeWidth="4"
                                strokeLinecap="round"
                              />
                              {/* Leaves */}
                              <motion.path
                                initial={{ scale: 0, opacity: 0 }}
                                animate={step >= 2 ? { scale: 1, opacity: 1 } : {}}
                                d="M60 140C60 140 30 130 20 110C10 90 40 90 60 110"
                                fill="#10b981"
                                fillOpacity="0.8"
                              />
                              <motion.path
                                initial={{ scale: 0, opacity: 0 }}
                                animate={step >= 2 ? { scale: 1, opacity: 1 } : {}}
                                d="M60 120C60 120 90 110 100 90C110 70 80 70 60 90"
                                fill="#10b981"
                                fillOpacity="0.8"
                              />
                              {/* Flower/Bloom */}
                              <motion.circle
                                initial={{ scale: 0, opacity: 0 }}
                                animate={step >= 3 ? { scale: 1, opacity: 1 } : {}}
                                transition={{ delay: 0.5 }}
                                cx="60" cy="80" r="15"
                                fill="#fbbf24"
                                className="drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]"
                              />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Carbon Token Appearance */}
                      <AnimatePresence>
                        {step >= 3 && (
                          <motion.div
                            initial={{ y: 20, opacity: 0, scale: 0.5 }}
                            animate={{ y: -80, opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <motion.div
                              animate={{ rotateY: 360 }}
                              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              className="relative flex h-24 w-24 items-center justify-center"
                            >
                              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
                              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                                <Coins className="h-8 w-8 text-white" />
                              </div>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="mt-auto pb-12 text-center">
                      <motion.div
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="text-[10px] font-mono text-emerald-500/60 uppercase tracking-widest"
                      >
                        {step < 4 ? "Processing_Neural_Verify..." : "Credit_Minted_Successfully"}
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
