"use client";

import React from "react";
import { motion } from "framer-motion";
import { Globe, BarChart3, Leaf, Zap, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Marketplace } from "@/components/Marketplace";

export default function MarketplacePage() {
  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-16">
        {/* Cinematic Header */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[4rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-12 bg-zinc-950/20 p-12 rounded-[4rem] border border-white/5 backdrop-blur-xl">
            <div className="space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">
                <Globe className="h-4 w-4" />
                DEX_Marketplace_v2.0
              </div>
              <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                GreenLedger <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Exchange_Hub</span>
              </h1>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[11px] leading-relaxed">
                Direct acquisition of high-fidelity carbon credits from verified producers. Every credit is backed by satellite-proofed NDVI telemetry and blockchain-anchored smart contracts.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="glass p-8 rounded-[2rem] border border-white/5 bg-zinc-950/40 text-center min-w-[160px]">
                <div className="flex items-center justify-center gap-2 mb-2 text-zinc-600">
                   <BarChart3 className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest">Active_Nodes</span>
                </div>
                <p className="text-3xl font-black text-white">12,482</p>
              </div>
              <div className="glass p-8 rounded-[2rem] border border-white/5 bg-zinc-950/40 text-center min-w-[160px]">
                 <div className="flex items-center justify-center gap-2 mb-2 text-emerald-500">
                   <ShieldCheck className="h-4 w-4" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Verified_Pool</span>
                </div>
                <p className="text-3xl font-black text-emerald-500 font-mono tracking-tighter">98.4%</p>
              </div>
            </div>
          </div>
        </section>

        {/* Marketplace Component Interop */}
        <div className="relative">
          <div className="flex items-center gap-4 mb-8">
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Available_Carbon_Pools</div>
             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
          </div>
          
          <Marketplace />
        </div>

        {/* Protocol Info */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
           {[
             { title: "Zero Middlemen", desc: "Direct peer-to-peer settlement between producers and industrialists.", icon: <Zap className="h-5 w-5" /> },
             { title: "Proof of Growth", desc: "Every credit is mathematically verified via satellite NDVI telemetry.", icon: <Leaf className="h-5 w-5" /> },
             { title: "Blockchain Settlement", desc: "Instant fund transfer to farmers upon credit acquisition.", icon: <Globe className="h-5 w-5" /> }
           ].map((item, i) => (
             <div key={i} className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-emerald-500">
                   {item.icon}
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-white">{item.title}</h4>
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </section>
      </div>
    </AppShell>
  );
}
