"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Gavel, Users, Clock, TrendingUp, AlertTriangle, 
  ArrowUp, ShieldCheck, Leaf, Zap, ChevronLeft, 
  Hand, Timer, Lock
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";

interface Auction {
  id: string;
  title: string;
  type: 'crops' | 'carbon';
  min_price: number;
  max_price: number;
  status: 'scheduled' | 'live' | 'completed';
}

interface Bid {
  id: string;
  amount: number;
  user_id: string;
  created_at: string;
  user_name?: string;
  profiles?: any;
}

export default function LiveAuctionPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [customBid, setCustomBid] = useState<string>('');
  const [isBidding, setIsBidding] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isConcluded, setIsConcluded] = useState(false);

  useEffect(() => {
    fetchAuctionData();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const bidChannel = supabase
      .channel(`auction_bids:${id}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'auction_bids',
        filter: `auction_id=eq.${id}`
      }, (payload) => {
        const newBid = payload.new as Bid;
        setBids(prev => {
          // Prevent duplicates if we already have it
          if (prev.some(b => b.id === newBid.id)) return prev;
          return [newBid, ...prev];
        });
        setAuction(prev => prev ? { ...prev, min_price: Math.max(prev.min_price, newBid.amount) } : null);
        setTimeLeft(30); // Reset timer on new bid
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'auctions',
        filter: `id=eq.${id}`
      }, (payload) => {
        const updated = payload.new as Auction;
        setAuction(updated);
        if (updated.status === 'completed') {
           setIsConcluded(true);
           setTimeLeft(0);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bidChannel);
    };
  }, [id]);

  // Timer Countdown Logic
  useEffect(() => {
    if (!auction || auction.status !== 'live' || isConcluded) return;
    
    // Only run timer if there has been at least one bid to start the clock, or start immediately
    const timer = setInterval(() => {
       setTimeLeft(prev => {
         if (prev <= 1) {
           clearInterval(timer);
           handleAuctionEnd();
           return 0;
         }
         return prev - 1;
       });
    }, 1000);

    return () => clearInterval(timer);
  }, [auction?.status, isConcluded, bids.length]);

  const handleAuctionEnd = async () => {
    setIsConcluded(true);
    // Optionally trigger an update to Supabase to mark as completed if admin
    await supabase.from('auctions').update({ status: 'completed' }).eq('id', id);
  };

  const fetchAuctionData = async () => {
    const { data: auctionData, error: auctionError } = await supabase
      .from('auctions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (auctionError) {
      router.push('/marketplace');
      return;
    }

    const { data: bidData } = await supabase
      .from('auction_bids')
      .select('*, profiles(full_name)')
      .eq('auction_id', id)
      .order('amount', { ascending: false });

    setAuction(auctionData);
    setBids(bidData || []);
    setIsConcluded(auctionData.status === 'completed');
    if (auctionData.status === 'completed') setTimeLeft(0);
    setLoading(false);
  };

  const placeBid = async (amount: number) => {
    if (!user || !auction || isConcluded || amount <= (bids[0]?.amount || auction.min_price)) return;
    
    // Auto-cap handling: if they bid above max_price, snap to max_price and close
    const meetsCap = auction.max_price && amount >= auction.max_price;
    const finalAmount = meetsCap ? auction.max_price : amount;

    setIsBidding(true);
    setCustomBid('');
    const { error } = await supabase
      .from('auction_bids')
      .insert([{
        auction_id: id,
        user_id: user.id,
        amount: finalAmount
      }]);

    if (!error) {
       if (meetsCap) {
         handleAuctionEnd();
         setTimeLeft(0);
       } else {
         setTimeLeft(30);
       }
    }
    setIsBidding(false);
  };

  if (loading || !auction) {
    return <AppShell><div className="flex h-[calc(100vh-80px)] items-center justify-center font-black uppercase text-zinc-600 tracking-widest text-sm">Syncing Exchange Stream...</div></AppShell>;
  }

  const highestBid = bids[0]?.amount || auction.min_price;
  const isCapped = auction.max_price && highestBid >= auction.max_price;

  // Extract unique participants from bids
  const uniqueParticipants = Array.from(new Set(bids.map(b => b.user_id))).map(userId => {
    return bids.find(b => b.user_id === userId);
  });

  return (
    <AppShell>
      <div className="h-[calc(100vh-80px)] bg-black overflow-hidden flex flex-col relative text-white">
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full" />

        {/* Header */}
        <header className="flex-none p-6 md:px-12 flex items-center justify-between z-20 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl">
           <button 
             onClick={() => router.push('/marketplace')}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
           >
             <ChevronLeft className="h-4 w-4" />
             Exit_Stream
           </button>
           <div className="flex items-center gap-4">
              <h1 className="text-xl font-black uppercase tracking-tighter hidden md:block">{auction.title}</h1>
              <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${
                isConcluded ? 'bg-zinc-900 border-zinc-700 text-zinc-400' :
                isCapped ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
              }`}>
                 {!isConcluded && !isCapped && <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                 {isConcluded ? 'Closed' : isCapped ? 'Cap Reached' : 'Live'}
              </div>
           </div>
        </header>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 min-h-0 relative z-10">
           
           {/* Left Sidebar: Participants */}
           <div className="hidden lg:flex flex-col border-r border-white/5 bg-zinc-950/30 overflow-hidden">
              <div className="p-6 border-b border-white/5">
                 <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Users className="h-4 w-4" /> Active Nodes ({uniqueParticipants.length})
                 </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                 {uniqueParticipants.map((p, i) => (
                    <div key={p?.user_id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                       <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs">
                          {p?.user_id.slice(0, 2).toUpperCase()}
                       </div>
                       <div>
                          <p className="text-xs font-bold text-white uppercase truncate max-w-[120px]">
                             {p?.user_id === user?.id ? 'You (Active)' : `Node_${p?.user_id.slice(0, 4)}`}
                          </p>
                          <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Verified</p>
                       </div>
                       {i === 0 && bids[0].user_id === p?.user_id && (
                          <div className="ml-auto h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                       )}
                    </div>
                 ))}
                 {uniqueParticipants.length === 0 && (
                    <div className="p-6 text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                       Awaiting Connections...
                    </div>
                 )}
              </div>
           </div>

           {/* Center Stage: Timer & Bidding */}
           <div className="col-span-1 lg:col-span-2 flex flex-col relative order-first lg:order-none">
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative py-12 lg:py-8">
                 
                 {/* 30s Timer */}
                 {!isConcluded && auction.status === 'live' && (
                    <motion.div 
                       key={timeLeft}
                       initial={{ scale: 1.2, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       className={`flex items-center gap-3 mb-6 px-6 py-2 rounded-full border bg-black/50 backdrop-blur-md shadow-2xl ${
                          timeLeft <= 5 ? 'border-red-500/50 text-red-500 shadow-red-500/20' : 'border-emerald-500/50 text-emerald-500 shadow-emerald-500/20'
                       }`}
                    >
                       <Timer className="h-5 w-5 mb-0.5 animate-pulse" />
                       <span className="text-3xl font-black tracking-tighter">00:{timeLeft.toString().padStart(2, '0')}</span>
                    </motion.div>
                 )}
                 {isConcluded && bids.length > 0 && (
                    <div className="mb-6 flex flex-col items-center">
                       <div className="px-6 py-2 rounded-full border border-blue-500/50 bg-black/50 text-blue-500 text-xl font-black tracking-widest uppercase mb-4">
                          CLOSED
                       </div>
                       <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Winning Node</p>
                       <p className="text-2xl font-black text-white">{bids[0]?.profiles?.full_name || 'Anonymous'}</p>
                    </div>
                 )}
                 {isConcluded && bids.length === 0 && (
                    <div className="mb-6 px-6 py-2 rounded-full border border-blue-500/50 bg-black/50 text-blue-500 text-xl font-black tracking-widest uppercase">
                       CLOSED (NO BIDS)
                    </div>
                 )}

                 <div className="relative z-10 w-full flex flex-col items-center">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Current Valuation</p>
                    <motion.div 
                       key={highestBid}
                       initial={{ scale: 0.9, y: 20, opacity: 0 }}
                       animate={{ scale: 1, y: 0, opacity: 1 }}
                       className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white tabular-nums drop-shadow-2xl mb-8"
                    >
                      ₹{highestBid.toLocaleString()}
                    </motion.div>

                    <div className="flex items-center gap-8 justify-center mb-12">
                       <div className="text-center">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Base Price</p>
                          <p className="text-lg font-black text-zinc-400">₹{auction.min_price.toLocaleString()}</p>
                       </div>
                       <div className="h-8 w-px bg-white/10" />
                       <div className="text-center">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Regulation Cap</p>
                          <p className="text-lg font-black text-emerald-500">₹{auction.max_price?.toLocaleString() || 'N/A'}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bidding Console */}
              <div className="p-6 md:p-10 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl">
                 {isConcluded ? (
                    <div className="p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-center">
                       <Gavel className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                       <h3 className="text-xl font-black uppercase tracking-tighter text-white">Auction Concluded</h3>
                       <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Winning Valuation: ₹{highestBid.toLocaleString()}</p>
                    </div>
                 ) : isCapped ? (
                    <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                       <Lock className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                       <h3 className="text-xl font-black uppercase tracking-tighter text-white">Cap Reached</h3>
                       <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">Awaiting Smart Contract Settlement.</p>
                    </div>
                 ) : (
                    <div className="flex flex-col gap-6">
                       <div className="grid grid-cols-3 gap-4">
                          {[100, 500, 1000].map((inc) => (
                            <button
                              key={inc}
                              disabled={isBidding}
                              onClick={() => placeBid(highestBid + inc)}
                              className="py-4 rounded-2xl bg-zinc-900 border border-white/5 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all active:scale-95 shadow-xl shadow-black/50 disabled:opacity-50"
                            >
                              +₹{inc.toLocaleString()}
                            </button>
                          ))}
                       </div>
                       <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative flex-1 group">
                             <div className="absolute inset-y-0 left-6 flex items-center font-black text-zinc-500 group-focus-within:text-emerald-500 transition-colors">₹</div>
                             <input 
                               type="number" 
                               value={customBid}
                               onChange={(e) => setCustomBid(e.target.value)}
                               placeholder="Custom Value"
                               className="w-full bg-zinc-900 border border-white/10 rounded-[2rem] pl-12 pr-6 py-5 text-xl font-black text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
                             />
                          </div>
                          <button 
                             disabled={isBidding || !customBid || Number(customBid) <= highestBid}
                             onClick={() => placeBid(Number(customBid))}
                             className="sm:w-48 bg-emerald-500 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-20 shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:shadow-none flex items-center justify-center gap-2"
                          >
                             Commit Bid <ArrowUp className="h-4 w-4" />
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>

           {/* Right Sidebar: Activity Stream */}
           <div className="border-l border-white/5 bg-zinc-950/30 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                 <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <ActivityIcon className="h-4 w-4" /> Network Stream
                 </h2>
                 {auction.status === 'live' && !isConcluded && (
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 <AnimatePresence>
                    {bids.map((bid, i) => (
                       <motion.div
                          key={bid.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-5 rounded-2xl border transition-all ${
                            i === 0 
                            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                            : 'bg-zinc-900/50 border-white/5'
                          }`}
                       >
                          <div className="flex items-center justify-between mb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                {bid.user_id === user?.id ? 'Your Bid' : `Node_${bid.user_id.slice(0, 4)}`}
                             </span>
                             <span className="text-[9px] font-bold text-zinc-700 font-mono">
                                {new Date(bid.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                             </span>
                          </div>
                          <p className={`text-xl font-black ${i === 0 ? 'text-emerald-400' : 'text-white'}`}>₹{bid.amount.toLocaleString()}</p>
                          {i === 0 && !isConcluded && (
                             <p className="text-[9px] font-black text-white uppercase tracking-tighter truncate w-16 text-right">
                                {bid?.profiles?.full_name?.split(' ')[0] || 'Unknown'}
                             </p>
                          )}
                       </motion.div>
                    ))}
                 </AnimatePresence>
                 {bids.length === 0 && (
                    <div className="p-10 text-center opacity-30 flex flex-col items-center">
                       <Gavel className="h-10 w-10 mb-3 text-zinc-500" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Waiting for Initial Bid</p>
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </AppShell>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  );
}
