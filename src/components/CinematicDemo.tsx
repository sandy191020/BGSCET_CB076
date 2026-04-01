"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Leaf, Coins, Zap, ShieldCheck, X, Droplets, Sun, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface CinematicDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  { text: "Satellite Verified Land", icon: <ShieldCheck className="h-5 w-5" />, delay: 0 },
  { text: "AI-Powered Carbon Scoring", icon: <Zap className="h-5 w-5" />, delay: 0.2 },
  { text: "Blockchain Secured Credits", icon: <Coins className="h-5 w-5" />, delay: 0.4 },
  { text: "Direct Farmer Income", icon: <Leaf className="h-5 w-5" />, delay: 0.6 },
];

export function CinematicDemo({ isOpen, onClose }: CinematicDemoProps) {
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const timers = [
        setTimeout(() => setScene(1), 500),   // Scene 1: Dark Hook
        setTimeout(() => setScene(2), 2000),  // Scene 2: Seed Planting
        setTimeout(() => setScene(3), 4000),  // Scene 3: Water Flow
        setTimeout(() => setScene(4), 6500),  // Scene 4: Sunrise & Growth
        setTimeout(() => setScene(5), 11000), // Scene 5: Bloom & Token
        setTimeout(() => setScene(6), 13000), // Scene 6: Feature Reveal
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setScene(0);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            backgroundColor: scene >= 4 ? "rgba(10, 5, 0, 0.98)" : "rgba(0, 0, 0, 0.98)"
          }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-3xl transition-colors duration-2000"
        >
          {/* Ambient Lighting FX */}
          <AnimatePresence>
            {scene >= 4 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-b from-orange-500/5 via-transparent to-emerald-500/5 pointer-events-none"
              />
            )}
          </AnimatePresence>

          <button
            onClick={onClose}
            className="absolute right-8 top-8 z-[110] rounded-full bg-white/5 p-3 text-zinc-500 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="container relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
            
            {/* Left Side: RBI-Style Feature Reveal */}
            <div className="flex flex-col space-y-6 pt-20 lg:pt-0">
              <AnimatePresence>
                {scene >= 6 && features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -100, rotateY: 45, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, rotateY: 0, filter: "blur(0px)" }}
                    transition={{ 
                      duration: 1.2, 
                      delay: feature.delay,
                      ease: [0.16, 1, 0.3, 1] 
                    }}
                    className="group relative"
                  >
                    {/* Note/Card Style */}
                    <div className="glass relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/40 p-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:bg-zinc-900/60 lg:max-w-md">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none" />
                      <div className="flex items-center gap-6">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/30 group-hover:scale-110 transition-transform">
                          {feature.icon}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-emerald-500/60 uppercase tracking-widest">Digital_Asset_Id: 0xGL_{idx + 1}</p>
                          <h3 className="text-2xl font-bold text-white tracking-tight">{feature.text}</h3>
                        </div>
                      </div>
                      {/* Currency-style micro-pattern */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5">
                        <Coins className="h-20 w-20 rotate-12" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Right Side: Cinematic Smartphone Mockup */}
            <div className="relative flex items-center justify-center h-full">
              {/* Dynamic Aura */}
              <motion.div
                animate={scene >= 4 ? { 
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                  backgroundColor: ["rgba(16, 185, 129, 0.2)", "rgba(251, 191, 36, 0.2)", "rgba(16, 185, 129, 0.2)"]
                } : {}}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute h-[600px] w-[600px] rounded-full blur-[100px]"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotateY: -30, y: 100 }}
                animate={{ opacity: 1, scale: 1, rotateY: -5, y: 0 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 h-[750px] w-[370px] overflow-hidden rounded-[3.5rem] bg-zinc-950 ring-[12px] ring-zinc-900 shadow-[0_0_100px_rgba(0,0,0,1)]"
              >
                {/* Smartphone Screen Content */}
                <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none">
                  
                  {/* Scene Transitions */}
                  <AnimatePresence>
                    {scene >= 4 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-orange-500/10 to-transparent"
                      />
                    )}
                  </AnimatePresence>

                  <div className="relative h-full w-full">
                    
                    {/* Scene 4: Sunrise Sun */}
                    <AnimatePresence>
                      {scene >= 4 && (
                        <motion.div
                          initial={{ y: 200, opacity: 0 }}
                          animate={{ y: -300, opacity: 1 }}
                          transition={{ duration: 5, ease: "easeOut" }}
                          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-40 w-40 rounded-full bg-gradient-to-t from-orange-500 to-yellow-200 blur-2xl"
                        />
                      )}
                    </AnimatePresence>

                    {/* Scene 1: Soil Patch */}
                    <AnimatePresence>
                      {scene >= 1 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-48 w-[140%] rounded-[100%] bg-zinc-900 shadow-[inset_0_20px_50px_rgba(39,39,42,0.8)]"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Scene 2: Seed Planting */}
                    <AnimatePresence>
                      {scene === 2 && (
                        <motion.div
                          initial={{ y: -400, opacity: 0, scale: 0.5, rotate: 45 }}
                          animate={{ y: 480, opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 2 }}
                          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-6 rounded-full bg-orange-950 shadow-2xl ring-1 ring-orange-900/50"
                        />
                      )}
                    </AnimatePresence>

                    {/* Scene 3: Water Flow */}
                    <AnimatePresence>
                      {scene === 3 && (
                        <svg className="absolute inset-0 h-full w-full">
                          <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 0.8, 0.8, 0] }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            d="M 400 -50 C 300 100 250 300 185 530"
                            stroke="url(#waterGrad)"
                            strokeWidth="12"
                            strokeLinecap="round"
                            fill="none"
                          />
                          <defs>
                            <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
                            </linearGradient>
                          </defs>
                        </svg>
                      )}
                    </AnimatePresence>

                    {/* Growth Container */}
                    <div className="absolute inset-0 flex items-end justify-center pb-24">
                      {scene >= 4 && (
                        <svg width="100%" height="100%" viewBox="0 0 370 750" preserveAspectRatio="xMidYMax meet">
                          {/* Spiraling Main Stem */}
                          <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 5, ease: "easeInOut" }}
                            d="M185 680 C185 680 130 550 185 450 C240 350 130 250 185 100"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeLinecap="round"
                            fill="none"
                          />

                          {/* Organic Leaves */}
                          <AdLeaf delay={1.5} x={185} y={550} scale={1.4} rotation={-45} />
                          <AdLeaf delay={2.5} x={185} y={400} scale={1.8} rotation={45} />
                          <AdLeaf delay={3.5} x={185} y={150} scale={2.2} rotation={-30} />

                          {/* Bloom FX */}
                          {scene >= 5 && (
                            <motion.g
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 1.5, type: "spring" }}
                            >
                              <circle cx="185" cy="100" r="30" fill="#fbbf24" className="filter blur-[8px]" />
                              <motion.circle 
                                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.9, 0.6] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                cx="185" cy="100" r="50" 
                                fill="url(#adGlow)" 
                              />
                            </motion.g>
                          )}
                          <defs>
                            <radialGradient id="adGlow">
                              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                            </radialGradient>
                          </defs>
                        </svg>
                      )}
                    </div>

                    {/* Scene 5: Token Emergence */}
                    <AnimatePresence>
                      {scene >= 5 && (
                        <motion.div
                          initial={{ y: 50, opacity: 0, scale: 0.5, rotateY: 90 }}
                          animate={{ y: -500, opacity: 1, scale: 1.8, rotateY: 360 }}
                          transition={{ duration: 2, ease: "easeOut" }}
                          className="absolute inset-x-0 bottom-0 flex justify-center pb-24"
                        >
                          <motion.div
                            animate={{ rotateY: 360 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="relative flex h-32 w-32 items-center justify-center"
                          >
                            <div className="absolute inset-0 rounded-full bg-emerald-500/40 blur-3xl animate-pulse" />
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_0_60px_rgba(16,185,129,0.8)] border-2 border-white/20">
                              <Coins className="h-12 w-12 text-white" />
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Particles (Wind FX) */}
                    {scene >= 4 && [...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          x: [0, 50, -50, 0],
                          y: [-20, -500],
                          opacity: [0, 0.5, 0],
                        }}
                        transition={{ 
                          duration: 8 + i, 
                          repeat: Infinity,
                          delay: i * 0.5
                        }}
                        className="absolute h-1 w-1 rounded-full bg-emerald-400/30"
                        style={{ 
                          left: `${Math.random() * 100}%`,
                          bottom: '10%'
                        }}
                      />
                    ))}

                    {/* Status Display Overlay */}
                    <div className="absolute top-16 w-full text-center px-10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={scene >= 1 ? { opacity: 0.8 } : {}}
                        className="text-[10px] font-mono text-white/40 uppercase tracking-[0.4em]"
                      >
                        {scene === 1 && "Initializing_Soil_State..."}
                        {scene === 2 && "Nutrient_Injection_Sequence..."}
                        {scene === 3 && "Hydration_Flow_Active..."}
                        {scene === 4 && "Growth_Matrix_Initialized..."}
                        {scene >= 5 && "Asset_Tokenization_Complete"}
                      </motion.div>
                      <motion.div 
                        initial={{ scaleX: 0 }}
                        animate={scene >= 1 ? { scaleX: (scene / 6) } : {}}
                        className="mt-2 h-[1px] w-full bg-emerald-500/50 origin-left"
                      />
                    </div>
                  </div>
                </div>

                {/* iPhone Notch */}
                <div className="absolute left-1/2 top-4 h-7 w-28 -translate-x-1/2 rounded-full bg-zinc-950" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AdLeaf({ delay, x, y, scale, rotation }: { delay: number, x: number, y: number, scale: number, rotation: number }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0, rotate: rotation - 30 }}
      animate={{ scale, opacity: 1, rotate: rotation }}
      transition={{ duration: 2, delay, type: "spring", bounce: 0.3 }}
      style={{ originX: `${x}px`, originY: `${y}px` }}
    >
      <path
        d={`M${x} ${y} C${x} ${y} ${x - 40} ${y - 15} ${x - 50} ${y - 40} C${x - 60} ${y - 65} ${x - 30} ${y - 65} ${x} ${y - 45}`}
        fill="#10b981"
        fillOpacity="0.95"
        className="filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
      />
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: delay + 0.8 }}
        d={`M${x} ${y} L${x - 30} ${y - 50}`}
        stroke="#065f46"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </motion.g>
  );
}
