"use client";

import { motion } from "framer-motion";
import { Leaf, Satellite, BrainCircuit, Shovel, ArrowRight, Zap, Target, Lock, Globe } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="neural-grid min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-sm font-medium text-emerald-400"
          >
            <Zap className="h-4 w-4" />
            <span>Powering the Carbon Resurgence</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl font-bold tracking-tight text-white sm:text-7xl"
          >
            Turn Your Soil into <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Liquid Capital</span>
          </motion.h1>
          
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
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105"
            >
              Start Earning
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#how-it-works" className="text-sm font-semibold leading-6 text-white hover:text-emerald-400">
              Watch Demo <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          <FeatureCard 
            icon={<Satellite className="h-8 w-8 text-emerald-500" />}
            title="Satellite Proof"
            description="High-resolution Sentinel-2 imagery proves your sustainable practices from space."
          />
          <FeatureCard 
            icon={<BrainCircuit className="h-8 w-8 text-emerald-500" />}
            title="Mastra AI Analysis"
            description="Autonomous agents calculate NDVI scores and detect fraud live on-screen."
          />
          <FeatureCard 
            icon={<Target className="h-8 w-8 text-emerald-500" />}
            title="Instant Minting"
            description="ERC-1155 tokens are minted directly to your wallet the moment you qualify."
          />
          <FeatureCard 
            icon={<Globe className="h-8 w-8 text-emerald-500" />}
            title="Direct Trade"
            description="Swap credits on our secondary marketplace with zero middlemen and zero delays."
          />
        </motion.div>
      </section>

      {/* Problem/Solution Section */}
      <section id="problem" className="bg-zinc-950/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">The Ecosystem of Fraud ends here.</h2>
              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Today, carbon brokers take up to 70% of the value. Farmers do the work, while middlemen reap the rewards. 
                GreenLedger creates a direct, trustless pipeline from land to liquidity.
              </p>
              <ul className="mt-10 space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <span className="text-zinc-300 font-medium">Tamper-proof satellite evidence anchored on-chain.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                    <Zap className="h-4 w-4" />
                  </div>
                  <span className="text-zinc-300 font-medium">Instant payouts via automated smart contracts.</span>
                </li>
              </ul>
            </div>
            <div className="glass relative rounded-3xl p-8 overflow-hidden min-h-[300px] flex flex-col justify-center border-emerald-500/10">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Leaf className="h-32 w-32" />
              </div>
              <div className="relative z-10">
                <p className="text-emerald-500 font-mono text-sm mb-4">SYSTEM_STATUS: SECURE_LEDGER</p>
                <div className="space-y-6">
                  <div className="h-2 w-3/4 rounded bg-emerald-500/20" />
                  <div className="h-2 w-1/2 rounded bg-emerald-500/20" />
                  <div className="h-2 w-5/6 rounded bg-emerald-500/20" />
                  <div className="h-2 w-2/3 rounded bg-emerald-500/20" />
                </div>
                <div className="mt-12 flex items-center justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/50">
                    <BrainCircuit className="h-8 w-8 text-emerald-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 }
      }}
      className="glass group rounded-2xl p-8 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/5"
    >
      <div className="mb-6 inline-flex rounded-xl bg-zinc-900 p-3 ring-1 ring-white/10 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
