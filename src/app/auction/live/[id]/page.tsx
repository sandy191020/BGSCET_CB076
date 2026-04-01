"use client";

import { useEffect, useState, use, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Tag, Users, Gavel, Timer, ArrowUp, CheckCircle, Smartphone, MapPin, Leaf, Search, ShieldCheck, Clock } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Tab = "crops" | "carbon";

export default function AuctionRoom({ params }: { params: Promise<{ id: string }> }) {
  const { id: auctionId } = use(params);
  const [auction, setAuction] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>("crops");
  const [currentBid, setCurrentBid] = useState(0);
  const [bidders, setBidders] = useState<any[]>([]);
  const [myBid, setMyBid] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bidPlaced, setBidPlaced] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes demo timer
  const [activeLot, setActiveLot] = useState({
    title: "Certified Grade A Paddy",
    location: "Mandya, Karnataka",
    farmId: "GL_4492",
    ndvi: 0.82,
    description: "Organic certified paddy with 14% moisture content. Satellite verification confirmed sustainable irrigation practices."
  });
  
  const router = useRouter();

  // Tab switching logic
  useEffect(() => {
    if (activeTab === "carbon") {
      setActiveLot({
        title: "Verified Carbon Offset",
        location: "Regenerative Forest, Kerala",
        farmId: "CO2_7721",
        ndvi: 0.94,
        description: "Soil carbon sequestration offsets verified via Mastra AI. Each credit represents 1 metric ton of CO2 avoided."
      });
    } else {
      setActiveLot({
        title: "Certified Grade A Paddy",
        location: "Mandya, Karnataka",
        farmId: "GL_4492",
        ndvi: 0.82,
        description: "Organic certified paddy with 14% moisture content. Satellite verification confirmed sustainable irrigation practices."
      });
    }
  }, [activeTab]);

  const [presenceCount, setPresenceCount] = useState(1);

  const [connStatus, setConnStatus] = useState<string>("connecting");

  useEffect(() => {
    const initRoom = async () => {
      setLoading(true);
      const { data: auctionData } = await supabase.from("auctions").select("*").eq("id", auctionId).single();
      if (auctionData) {
        setAuction(auctionData);
        const { data: bidsData } = await supabase.from("auction_bids").select("id, amount, created_at, user_id, profiles:user_id ( full_name, role )").eq("auction_id", auctionId).order("created_at", { ascending: false }).limit(10);
        if (bidsData && bidsData.length > 0) {
          setCurrentBid(Number(bidsData[0].amount));
          setBidders(bidsData);
        } else {
          setCurrentBid(Number(auctionData.min_price));
        }
      }
      setLoading(false);
    };
    initRoom();
    
    const channel = supabase.channel(`auction_room_${auctionId}`, {
      config: { presence: { key: auctionId } }
    });

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'auction_bids', filter: `auction_id=eq.${auctionId}` }, async (payload) => {
        const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", payload.new.user_id).single();
        handleNewBid({ ...payload.new, profiles: profile });
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Flatten and count unique sessions
        const allPresences = Object.values(state).flat();
        setPresenceCount(allPresences.length);
      })
      .subscribe(async (status) => {
        setConnStatus(status);
        if (status === 'SUBSCRIBED') {
          const user = (await supabase.auth.getUser()).data.user;
          await channel.track({
            user_id: user?.id || `anon_${Math.random().toString(36).substr(2, 9)}`,
            joined_at: new Date().toISOString(),
          });
        }
      });

    return () => { supabase.removeChannel(channel); };
  }, [auctionId]);

  const handleNewBid = (bid: any) => {
    setCurrentBid(Number(bid.amount));
    setBidders(prev => {
      if (prev.find(b => b.id === bid.id)) return prev;
      return [bid, ...prev.slice(0, 9)];
    });
  };

  const placeBid = async () => {
    const nextBid = currentBid + 100;
    if (auction?.max_price && nextBid > auction.max_price) {
      alert("Price cap reached! (+30% Gov limit)");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please sign in to place a real bid.");
      router.push("/auth/signin");
      return;
    }

    // Seat check: User must have a seat in this auction
    const { data: seat } = await supabase
      .from("auction_seats")
      .select("id")
      .eq("auction_id", auctionId)
      .eq("user_id", user.id)
      .single();

    if (!seat) {
      alert("You must book a seat in this auction before you can bid! (Security Deposit: ₹1000)");
      router.push(`/auction/booking/${auctionId}`);
      return;
    }

    const { error } = await supabase.from("auction_bids").insert({
      auction_id: auctionId,
      user_id: user.id,
      amount: nextBid
    });

    if (error) {
      console.error("Bid Error:", error);
      alert("Failed to place bid: " + error.message);
    } else {
      setMyBid(nextBid);
      setBidPlaced(true);
    }
  };

  useEffect(() => {
    const statusChannel = supabase
      .channel(`auction_status_${auctionId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'auctions',
        filter: `id=eq.${auctionId}`
      }, (payload) => {
        setAuction(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
    };
  }, [auctionId]);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-mono text-sm uppercase animate-pulse">
      SYNCING_LIVE_LEDGER...
    </div>
  );

  if (auction?.status === 'scheduled') {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center">
        <div className="h-20 w-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-8 animate-pulse">
          <Clock className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">{auction.title}</h1>
        <p className="text-zinc-500 font-mono text-sm mb-8">AUCTION_NOT_YET_LIVE // STATUS: SCHEDULED</p>
        <div className="glass rounded-3xl p-8 max-w-md border-white/5">
          <p className="text-zinc-400 text-sm leading-relaxed">
            This auction is scheduled to begin at <span className="text-white font-bold">{new Date(auction.scheduled_at).toLocaleString()}</span>. 
            Once the admin starts the session, this page will update automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-20 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Navigation / Stats */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <Gavel className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{auction?.title}</h1>
              <div className="flex gap-4 mt-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                <span className="flex items-center gap-1.5"><Timer className="h-3 w-3" /> LIVE_EXECUTION</span>
                <span className="flex items-center gap-1.5 text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  {presenceCount} {presenceCount === 1 ? 'PARTICIPANT' : 'PARTICIPANTS'} IN ROOM
                </span>
                <span className={`px-2 py-0.5 rounded-full border ${
                  connStatus === 'SUBSCRIBED' ? 'border-emerald-500/20 text-emerald-500 bg-emerald-500/5' : 'border-amber-500/20 text-amber-500 bg-amber-500/5'
                }`}>
                  {connStatus === 'SUBSCRIBED' ? 'CONNECTED' : connStatus.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab("crops")}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border ${
                activeTab === "crops" 
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-lg shadow-amber-500/10" 
                : "bg-zinc-900 border-white/5 text-zinc-500"
              }`}
            >
              CROP AUCTION
            </button>
            <button 
              onClick={() => setActiveTab("carbon")}
              className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all border ${
                activeTab === "carbon" 
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500 shadow-lg shadow-emerald-500/10" 
                : "bg-zinc-900 border-white/5 text-zinc-500"
              }`}
            >
              CARBON CREDITS
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Active Product Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass rounded-[2rem] overflow-hidden border-white/5">
              <div className="h-48 bg-emerald-950/20 relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-widest">Selected Lot</span>
                  <h3 className="text-xl font-bold mt-2">{activeLot.title}</h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  <span>{activeLot.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Smartphone className="h-4 w-4 text-emerald-500" />
                  <span className="font-mono">FARM_ID: {activeLot.farmId}</span>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-zinc-500 leading-relaxed italic">
                    "{activeLot.description}"
                  </p>
                </div>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 space-y-4">
              <h4 className="text-xs font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Leaf className="h-4 w-4 text-emerald-500" />
                Sustainability Proof
              </h4>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${activeLot.ndvi * 100}%` }}
                    className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                  />
                </div>
                <div className="flex justify-between text-[10px] font-mono uppercase">
                  <span className="text-zinc-600">NDVI Score</span>
                  <span className="text-emerald-500">{activeLot.ndvi} ({activeLot.ndvi > 0.9 ? 'PREMIUM' : 'EXCELLENT'})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bidding Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass rounded-[2.5rem] p-12 text-center border-emerald-500/20 relative overflow-hidden">
              {/* Radial Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-emerald-500/5 blur-[120px] pointer-events-none" />
              
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-8">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" /> Live Price
                </span>

                <div className="flex flex-col items-center">
                  <motion.p 
                    key={currentBid}
                    initial={{ scale: 1.1, textShadow: "0 0 20px rgba(16,185,129,0.5)" }}
                    animate={{ scale: 1, textShadow: "0 0 0px rgba(16,185,129,0)" }}
                    className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-2"
                  >
                    ₹{(currentBid || auction?.min_price || 0).toLocaleString()}
                  </motion.p>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 uppercase">
                    <span>Min: ₹{auction?.min_price}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-800" />
                    <span className="text-emerald-500">Cap: ₹{auction?.max_price}</span>
                  </div>
                </div>

                <div className="mt-16 flex flex-col items-center gap-6">
                  <button 
                    onClick={placeBid}
                    className="group relative h-24 w-full rounded-[2rem] bg-emerald-600 text-white font-black text-2xl shadow-2xl shadow-emerald-500/20 transition-all hover:bg-emerald-500 active:scale-95 overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-4">
                      PLACE BID (+₹100)
                      <ArrowUp className="h-8 w-8 transition-transform group-hover:-translate-y-1" />
                    </div>
                    {/* Progress bar to next automatic increase? No, manual for demo */}
                  </button>

                  <div className="w-full grid grid-cols-2 gap-4">
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 text-left">
                      <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Your Highest Bid</p>
                      <p className="text-xl font-bold text-white">₹{myBid || '---'}</p>
                    </div>
                    <div className="bg-zinc-950 p-4 rounded-2xl border border-white/5 text-left">
                      <p className="text-[10px] font-mono text-zinc-600 uppercase mb-1">Potential Refund</p>
                      <p className={`text-xl font-bold ${bidPlaced ? 'text-emerald-500' : 'text-zinc-700'}`}>
                        {bidPlaced ? '₹600.00' : '₹0.00'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Traceability Node (Real-time connection simulation) */}
            <div className="glass rounded-3xl p-6 border-white/5 text-center flex flex-col items-center gap-4">
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500">F</div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">Farmer_Node</span>
                </div>
                <div className="h-px w-24 bg-gradient-to-r from-emerald-500/10 via-emerald-500/50 to-emerald-500/10" />
                <div className="flex flex-col items-center gap-2 text-emerald-500">
                  <div className="h-12 w-12 rounded-full border border-emerald-500/30 flex items-center justify-center bg-emerald-500/5 animate-pulse">S</div>
                  <span className="text-[10px] font-mono uppercase tracking-widest">Trace_Active</span>
                </div>
                <div className="h-px w-24 bg-zinc-800" />
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full border border-white/10 flex items-center justify-center text-zinc-500">M</div>
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">Market_Node</span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-600 font-mono">ENCRYPTED_TRACEABILITY_ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex-1 glass rounded-[2rem] border-white/5 flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">Live Activity</h4>
                <Smartphone className="h-4 w-4 text-zinc-600" />
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence initial={false}>
                  {bidders.map((bid, i) => (
                    <motion.div 
                      key={bid.id || i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-bold">
                          {bid.profiles?.full_name?.slice(0, 1).toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">
                            {bid.profiles?.full_name || 'Anonymous'} ({bid.profiles?.role || 'Buyer'})
                          </p>
                          <p className="text-xs font-bold text-white">₹{Number(bid.amount).toLocaleString()}</p>
                        </div>
                      </div>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500/50" />
                    </motion.div>
                  ))}
                  {bidders.length === 0 && (
                    <div className="h-full flex items-center justify-center py-20 text-[10px] uppercase font-mono text-zinc-700">
                      Waiting for bids...
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border-white/5 bg-emerald-500/5 ring-1 ring-emerald-500/20">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Auction Guard</h4>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed mb-4">
                Anti-fraud engine monitoring participant patterns. Bid history is immutable and anchored to the GreenLedger core.
              </p>
              <div className="h-10 w-full rounded-xl bg-zinc-950 flex items-center justify-center text-[10px] font-mono text-emerald-500 tracking-widest">
                VERIFIED_BY_MASTRA
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
