"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ArrowRight, Zap, Megaphone } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";

export function AuctionBanner() {
  const [auction, setAuction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScheduled() {
      const { data, error } = await supabase
        .from("auctions")
        .select("*")
        .in("status", ["live", "scheduled"])
        .order("status", { ascending: true }) // 'live' < 'scheduled' alphabetically
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .single();
      if (error) console.error("Banner Supabase Error:", error);
      if (data) console.log("Banner Auction Data:", data);
      if (!error && data) setAuction(data);
      setLoading(false);
    }
    fetchScheduled();
  }, []);

  if (loading || !auction) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-[4.5rem] left-0 right-0 z-40 px-4"
      >
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600/20 via-emerald-500/10 to-emerald-600/20 border border-emerald-500/20 backdrop-blur-xl px-6 py-3 shadow-2xl">
            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent animate-shimmer" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {auction.status === 'live' ? <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" /> : (auction.type === 'carbon' ? <Zap className="h-4 w-4 text-emerald-400" /> : <Calendar className="h-4 w-4 text-amber-400" />)}
                    {auction.status === 'live' ? 'LIVE AUCTION: ' : 'Next Auction: '}
                    <span className="text-emerald-400">{auction.title}</span>
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {auction.status === 'live' ? 'Bidding is currently active. Secure your lot now.' : `Live bidding starts ${new Date(auction.scheduled_at).toLocaleString()}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Entry Fee</span>
                  <span className="text-sm font-bold text-white">₹1,000</span>
                </div>
                <Link 
                  href={auction.status === 'live' ? `/auction/live/${auction.id}` : `/auction/booking/${auction.id}`}
                  className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-all hover:scale-[1.02] ${
                    auction.status === 'live' 
                    ? "bg-red-600 text-white hover:bg-red-500 animate-pulse" 
                    : "bg-white text-black hover:bg-emerald-400"
                  }`}
                >
                  {auction.status === 'live' ? 'JOIN LIVE NOW' : 'Book Your Seat'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
