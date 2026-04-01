"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gavel, Clock, ChevronRight, Zap, Leaf, AlertCircle } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Auction {
  id: string;
  title: string;
  type: 'crops' | 'carbon';
  scheduled_at: string;
  status: 'scheduled' | 'live';
}

export function AuctionBanner() {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuction = async () => {
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .or('status.eq.scheduled,status.eq.live')
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();
      
      if (!error && data) setAuction(data);
      setLoading(false);
    };

    fetchAuction();
    
    // Subscribe to changes
    const channel = supabase
      .channel('banner_updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, fetchAuction)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading || !auction) return null;

  const isLive = auction.status === 'live';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="w-full bg-zinc-950 border-b border-white/5 relative overflow-hidden group"
      >
        {/* Progress Background */}
        {isLive && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-emerald-500/5 w-1/2 blur-2xl"
          />
        )}

        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-lg ${
              isLive ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            }`}>
              {isLive ? <Zap className="h-5 w-5 animate-pulse" /> : <Clock className="h-5 w-5" />}
            </div>
            
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLive ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {isLive ? '• System Live' : '• Upcoming Event'}
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{auction.type} Exchange</span>
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-tight">{auction.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex flex-col items-end">
              <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Commencement</p>
              <p className="text-xs font-black text-white uppercase tabular-nums">
                {new Date(auction.scheduled_at).toLocaleDateString()} @ {new Date(auction.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <Link 
              href="/marketplace"
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                isLive 
                ? 'bg-emerald-500 text-black hover:bg-emerald-400' 
                : 'bg-white text-black hover:bg-zinc-200'
              }`}
            >
              {isLive ? 'Enter Live Engine' : 'Register for Seat'}
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
