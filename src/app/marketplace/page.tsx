"use client";

import { motion } from "framer-motion";
import { BarChart3, Leaf, Globe } from "lucide-react";
import { Marketplace } from "../components/Marketplace";

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-16">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4 flex-wrap"
          >
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs font-mono text-emerald-400">
                <Globe className="h-3.5 w-3.5" />
                Live Carbon Market
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">
                Carbon Credit <span className="text-emerald-500">Marketplace</span>
              </h1>
              <p className="mt-3 text-zinc-400 max-w-2xl">
                Buy and sell AI-verified, blockchain-anchored carbon credits directly from sustainable farmers.
                Zero middlemen. Tamper-proof satellite proof.
              </p>
            </div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { label: "Active Listings", value: "3", icon: <BarChart3 className="h-4 w-4" />, color: "text-emerald-400" },
              { label: "Credits Available", value: "165", icon: <Leaf className="h-4 w-4" />, color: "text-emerald-400" },
              { label: "Floor Price", value: "0.012 MATIC", icon: null, color: "text-white" },
              { label: "Avg NDVI Score", value: "0.82", icon: null, color: "text-emerald-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-4 border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  {stat.icon && <span className="text-zinc-500">{stat.icon}</span>}
                  <span className="text-xs text-zinc-500 uppercase tracking-wide">{stat.label}</span>
                </div>
                <div className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Marketplace grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Marketplace listings={[]} />
        </motion.div>
      </div>
    </div>
  );
}
