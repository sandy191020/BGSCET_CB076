"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Zap, Leaf, ShoppingCart, ShieldCheck, 
  ChevronRight, ArrowRight, Wallet, Info, Search, Filter,
  TrendingUp, CheckCircle
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";

interface Listing {
  id: string;
  farmer_id: string;
  amount: number;
  price_per_credit: number;
  status: 'available' | 'sold';
  created_at: string;
  profiles: {
    full_name: string;
    credits: number;
  };
}

export default function CarbonMarketplace() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [buying, setBuying] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('carbon_listings')
      .select('*, profiles:farmer_id(full_name, credits)')
      .eq('status', 'available')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setListings(data as any);
    }
    setLoading(false);
  };

  const handleBuy = async () => {
    if (!selectedListing || !user) return;
    setBuying(true);

    try {
      const response = await fetch("/api/buy-carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: selectedListing.id,
          buyerId: user.id,
          amount: selectedListing.amount
        })
      });

      if (response.ok) {
        setPurchased(true);
        fetchListings(); // Refresh
      } else {
        const err = await response.json();
        alert(err.error || "Purchase failed");
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setBuying(false);
    }
  };

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-500">
              <Zap className="h-4 w-4" />
              verified Liquidity Node
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">
              Carbon <span className="text-emerald-500">Market_Hub</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-2xl leading-relaxed">
              Direct acquisition of high-fidelity carbon credits from verified producers. Every credit is backed by satellite-proofed NDVI telemetry.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="h-12 w-12 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-500">
               <Search className="h-5 w-5" />
             </div>
             <div className="h-12 w-12 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-500">
               <Filter className="h-5 w-5" />
             </div>
          </div>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { l: "Available Credits", v: listings.reduce((acc, l) => acc + l.amount, 0).toLocaleString(), i: <Leaf /> },
            { l: "Avg Price/Ton", v: "₹850", i: <TrendingUp /> },
            { l: "Total Offset", v: "124.5k", i: <ShieldCheck /> },
            { l: "Global Demand", v: "HIGH", i: <Globe />, c: "text-emerald-500 animate-pulse" }
          ].map(s => (
            <div key={s.l} className="glass p-6 rounded-3xl border border-white/5 bg-zinc-950/20">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">{s.l}</span>
                 <div className="text-emerald-500/30">{s.i}</div>
               </div>
               <p className={`text-2xl font-black text-white ${s.c || ''}`}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {loading ? (
             <div className="col-span-full py-20 text-center text-zinc-600 font-black uppercase tracking-widest text-sm">Syncing Carbon Ledger...</div>
          ) : listings.length === 0 ? (
            <div className="col-span-full py-32 text-center space-y-6">
              <div className="h-20 w-20 rounded-full bg-zinc-900 mx-auto flex items-center justify-center border border-white/5">
                <Info className="h-10 w-10 text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">No Active Listings in Pool</p>
            </div>
          ) : listings.map((l) => (
            <motion.div 
              key={l.id}
              whileHover={{ y: -4 }}
              className="glass rounded-[3rem] border border-white/5 bg-zinc-950/30 overflow-hidden group hover:border-emerald-500/20 transition-all shadow-2xl"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                      <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tighter truncate max-w-[150px]">{l.profiles?.full_name || 'Verified Farmer'}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Reputation: {l.profiles?.credits || 0} Zap</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">UNIT_PRICE</p>
                    <p className="text-lg font-black text-white">₹{l.price_per_credit}</p>
                  </div>
                </div>

                <div className="bg-black/40 rounded-2xl p-6 border border-white/5 text-center">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Available Volume</p>
                  <p className="text-4xl font-black text-white tracking-tighter">{l.amount} <span className="text-xs font-mono text-zinc-500">TONNES</span></p>
                </div>

                <button 
                  onClick={() => setSelectedListing(l)}
                  className="w-full bg-white text-black py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Acquire Credits <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Purchase Confirmation Overlay */}
        <AnimatePresence>
          {selectedListing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!buying) {
                    setSelectedListing(null);
                    setPurchased(false);
                  }
                }}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-zinc-950 border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl p-10 text-center"
              >
                {!purchased ? (
                  <>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Acquisition Finalization</h2>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-10">Confirm transaction with Exchange Node</p>

                    <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 mb-8 space-y-6 text-left">
                       <div className="flex justify-between pb-4 border-b border-white/5">
                         <span className="text-[10px] font-black uppercase text-zinc-600">Volume</span>
                         <span className="text-sm font-black text-white">{selectedListing.amount} Tonnes</span>
                       </div>
                       <div className="flex justify-between pb-4 border-b border-white/5">
                         <span className="text-[10px] font-black uppercase text-zinc-600">Avg Price/Ton</span>
                         <span className="text-sm font-black text-white">₹{selectedListing.price_per_credit}</span>
                       </div>
                       <div className="flex justify-between pt-2">
                         <span className="text-[10px] font-black uppercase text-emerald-500">Total Commitment</span>
                         <span className="text-xl font-black text-emerald-500">₹{(selectedListing.amount * selectedListing.price_per_credit).toLocaleString()}</span>
                       </div>
                    </div>

                    <div className="space-y-4">
                      <button 
                        onClick={handleBuy}
                        disabled={buying}
                        className="w-full bg-emerald-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                      >
                        {buying ? "Broadcasting to Node..." : "Finalize Purchase"}
                        {!buying && <ChevronRight className="h-4 w-4" />}
                      </button>
                      <button 
                        onClick={() => setSelectedListing(null)}
                        disabled={buying}
                        className="w-full text-zinc-600 py-3 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Abort Transaction
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-10 space-y-6">
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                       <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Transfer_Successful</h2>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Your carbon portfolio has been updated.</p>
                    
                    <button 
                      onClick={() => {
                        setSelectedListing(null);
                        setPurchased(false);
                      }}
                      className="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-widest text-xs"
                    >
                      Return to Hub
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
