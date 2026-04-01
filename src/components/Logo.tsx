"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="group relative flex flex-col items-start justify-center cursor-pointer select-none">
      <div className="relative h-12 w-32">
        {/* GREEN on first line */}
        <motion.span
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute left-0 top-0 text-2xl font-black uppercase tracking-tighter text-emerald-500 italic leading-none"
        >
          Green
        </motion.span>

        {/* LEDGER on second line, overlapping */}
        <motion.span
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute left-4 top-4 text-2xl font-black uppercase tracking-tighter text-zinc-100 leading-none mix-blend-exclusion"
        >
          Ledger
        </motion.span>

        {/* Glitch/Criss-cross element decoration */}
        <motion.div
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scaleX: [1, 1.2, 1],
            x: [-5, 5, -5]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-0 h-px w-full bg-emerald-500/30 blur-sm -rotate-6 z-0"
        />
        
        {/* Animated glow */}
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-emerald-500/40 blur-md group-hover:bg-emerald-400 transition-colors" />
      </div>
    </Link>
  );
}
