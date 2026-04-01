"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, BarChart3, Leaf, Zap, Gavel, 
  Calendar, Clock, CheckCircle2, X, AlertTriangle, 
  ShieldCheck, Info, ChevronRight, UserCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";

interface Auction {
  id: string;
  title: string;
  type: 'crops' | 'carbon';
  scheduled_at: string;
  min_price: number;
  status: 'scheduled' | 'live' | 'completed';
}

interface Seat {
  seat_number: number;
  is_occupied: boolean;
  is_selected: boolean;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showReceipt, setShowReceipt] = useState<{ auction: Auction, seat: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);

  useEffect(() => {
    fetchAuctions();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
       const sorted = data.sort((a, b) => {
         if (a.status === 'live' && b.status !== 'live') return -1;
         if (a.status !== 'live' && b.status === 'live') return 1;
         return 0; // fallback to created_at from supbase order
       });
       setAuctions(sorted);
    }
    
    // Fetch real member count
    const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    setTotalParticipants(count || 0);

    setLoading(false);
  };

  const loadSeats = async (auctionId: string) => {
    const { data, error } = await supabase
      .from('auction_seats')
      .select('seat_number')
      .eq('auction_id', auctionId);
    
    const occupied = data?.map(s => s.seat_number) || [];
    const newSeats = Array.from({ length: 300 }, (_, i) => ({
      seat_number: i + 1,
      is_occupied: occupied.includes(i + 1),
      is_selected: false
    }));
    setSeats(newSeats);
  };

  const handleJoin = (auction: Auction) => {
    if (auction.status === 'live') {
      router.push(`/auction/${auction.id}`);
      return;
    }
    setSelectedAuction(auction);
    loadSeats(auction.id);
  };

  const confirmBooking = async () => {
    if (!selectedSeat || !termsAccepted || !user || !selectedAuction) return;
    
    setBooking(true);
    const { error } = await supabase
      .from('auction_seats')
      .insert([{
        auction_id: selectedAuction.id,
        user_id: user.id,
        seat_number: selectedSeat,
        terms_accepted: true,
        fee_paid: true // Simulated fee payment
      }]);

    if (!error) {
      setShowReceipt({ auction: selectedAuction, seat: selectedSeat });
      setSelectedAuction(null);
      setSelectedSeat(null);
      setTermsAccepted(false);
    } else if (error.code === '23505') {
      alert("This seat was just taken. Please select another.");
      loadSeats(selectedAuction.id);
    }
    setBooking(false);
  };

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-500">
              <Globe className="h-4 w-4" />
              Live Auction Marketplace
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">
              GreenLedger <span className="text-emerald-500">Exchange_Node</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-2xl leading-relaxed">
              Secure, seat-based participation in high-value agricultural and environmental asset exchanges.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-6 rounded-3xl border border-white/5 bg-zinc-950/20 text-center">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Active Pools</p>
              <p className="text-2xl font-black text-white">{auctions.length}</p>
            </div>
            <div className="glass p-6 rounded-3xl border border-white/5 bg-zinc-950/20 text-center">
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Participants</p>
              <p className="text-2xl font-black text-emerald-500">{totalParticipants}</p>
            </div>
          </div>
        </section>

        {/* Categories Tab */}
        <div className="flex gap-4 border-b border-white/5 pb-1">
          {[
            { name: 'All Auctions', path: '/marketplace' },
            { name: 'Crop Exchange', path: '/marketplace' },
            { name: 'Carbon Credits', path: '/marketplace/carbon' }
          ].map((tab, i) => (
            <button 
              key={tab.name} 
              onClick={() => router.push(tab.path)}
              className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${tab.path === '/marketplace/carbon' ? 'text-white' : 'text-emerald-500'}`}
            >
              {tab.name}
              {tab.name === 'All Auctions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />}
            </button>
          ))}
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {loading ? (
             <div className="col-span-full py-20 text-center text-zinc-600 font-black uppercase tracking-widest text-sm">Syncing with Exchange Node...</div>
          ) : auctions.length === 0 ? (
            <div className="col-span-full py-20 text-center text-zinc-600 font-black uppercase tracking-widest text-sm">No Active Auctions Found</div>
          ) : auctions.map((a) => (
            <motion.div 
              key={a.id}
              whileHover={{ y: -4 }}
              className="glass rounded-[3rem] border border-white/5 bg-zinc-950/30 overflow-hidden group hover:border-emerald-500/20 transition-all shadow-2xl"
            >
              <div className="p-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div className={`h-16 w-16 rounded-3xl flex items-center justify-center border shadow-lg ${
                    a.type === 'crops' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {a.type === 'crops' ? <Leaf className="h-8 w-8" /> : <Zap className="h-8 w-8" />}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Base Valuation</p>
                    <p className="text-2xl font-black text-white leading-none">₹{a.min_price.toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{a.title}</h3>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                       <Calendar className="h-3.5 w-3.5" />
                       {new Date(a.scheduled_at).toLocaleDateString()}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-zinc-800" />
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                       <Clock className="h-3.5 w-3.5" />
                       {new Date(a.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button 
                    onClick={() => handleJoin(a)}
                    disabled={a.status === 'completed'}
                    className="flex-1 rounded-2xl bg-white text-black py-4 text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-xl shadow-white/5 disabled:opacity-50"
                  >
                    {a.status === 'live' ? 'Enter Auction Hub' : 'Reserve Participation Seat'}
                  </button>
                  <button className="h-12 w-12 rounded-2xl border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">
                    <Info className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="bg-zinc-950/50 px-10 py-4 border-t border-white/5 flex items-center justify-between">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${a.status === 'live' ? 'text-emerald-500 animate-pulse' : 'text-blue-500'}`}>
                  {a.status === 'live' ? '• Bidding Live' : '• Registration Open'}
                </span>
                <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest font-mono">ID: {a.id.slice(0, 8)}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Seat Booking Modal */}
        <AnimatePresence>
          {selectedAuction && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedAuction(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-5xl bg-zinc-950 border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[100vh] lg:max-h-[90vh]"
              >
                {/* Left: Info */}
                <div className="w-full md:w-80 bg-zinc-900 p-10 border-r border-white/5 shrink-0 overflow-y-auto">
                   <div className="mb-10">
                     <h2 className="text-xl font-black uppercase tracking-tighter text-white">Participation Suite</h2>
                     <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1">{selectedAuction.title}</p>
                   </div>

                   <div className="space-y-8">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70 border-b border-emerald-500/10 pb-2">Pool Protocol</p>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">₹1000 Commitment Fee</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">60% Refund on Active Bidding</p>
                          </li>
                          <li className="flex items-start gap-3">
                            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-tight">No Bidding = 0% Refund</p>
                          </li>
                        </ul>
                     </div>

                     <div className="p-6 rounded-3xl bg-zinc-950 border border-white/5 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Selected Seat</span>
                          <span className="text-sm font-black text-emerald-500">{selectedSeat ? `#${selectedSeat}` : '--'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Access Fee</span>
                          <span className="text-sm font-black text-white">₹1,000</span>
                        </div>
                     </div>

                     <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <div className="relative mt-1">
                            <input 
                              type="checkbox" 
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="peer sr-only" 
                            />
                            <div className="h-5 w-5 rounded-lg border-2 border-zinc-800 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all" />
                            <CheckCircle2 className="absolute top-0.5 left-0.5 h-4 w-4 text-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-[10px] font-bold text-zinc-500 leading-relaxed uppercase group-hover:text-zinc-400 transition-colors mt-1 block">
                            I agree to provide transparent traceability of purchased agricultural products via QR-based consumer access.
                          </span>
                        </label>

                        <button 
                          onClick={confirmBooking}
                          disabled={!selectedSeat || !termsAccepted || booking}
                          className="w-full bg-emerald-500 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-20 shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-2"
                        >
                          {booking ? 'Locking Node...' : 'Reserve Access'}
                          {!booking && <ChevronRight className="h-4 w-4" />}
                        </button>
                     </div>
                   </div>
                </div>

                {/* Right: Seat Grid */}
                <div className="flex-1 p-10 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 font-mono">Seat Distribution_Grid</h3>
                       <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                             <div className="h-2.5 w-2.5 rounded-full bg-zinc-800" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Open</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Selected</span>
                          </div>
                          <div className="flex items-center gap-2">
                             <div className="h-2.5 w-2.5 rounded-full bg-red-900/50" />
                             <span className="text-[9px] font-black uppercase tracking-widest text-red-900/50">Sold</span>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-10 xs:grid-cols-12 sm:grid-cols-15 md:grid-cols-20 gap-2">
                       {seats.map((s) => (
                         <button
                           key={s.seat_number}
                           disabled={s.is_occupied}
                           onClick={() => setSelectedSeat(s.seat_number)}
                           className={`h-6 w-6 rounded-md text-[8px] font-black transition-all ${
                             s.is_occupied 
                             ? 'bg-red-900/20 text-red-900/50 cursor-not-allowed border border-red-900/10' 
                             : selectedSeat === s.seat_number
                             ? 'bg-emerald-500 text-black scale-110 shadow-lg shadow-emerald-500/20'
                             : 'bg-zinc-900 text-zinc-700 hover:bg-zinc-800 border border-white/5'
                           }`}
                         >
                           {s.seat_number}
                         </button>
                       ))}
                    </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Receipt Modal */}
        <AnimatePresence>
          {showReceipt && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReceipt(null)}
                className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-zinc-950 border border-emerald-500/20 rounded-[3rem] overflow-hidden shadow-2xl p-10 flex flex-col items-center text-center"
              >
                 <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                 </div>
                 <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Access Secured</h2>
                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-10">Transactional Receipt Sent to Email</p>

                 <div className="w-full bg-zinc-900 border border-white/5 rounded-3xl p-6 space-y-4 mb-8 text-left">
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Node Identifier</span>
                       <span className="text-sm font-black text-white truncate max-w-[200px] text-right">{user?.email || 'VERIFIED_USER'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Exchange Pool</span>
                       <span className="text-sm font-black text-white truncate max-w-[200px] text-right">{showReceipt.auction.title}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-white/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Reserved Seat ID</span>
                       <span className="text-lg font-black text-emerald-500">#{showReceipt.seat}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Commitment Hash</span>
                       <span className="text-[10px] font-mono font-bold text-zinc-400">0x{(Math.random()*1e16).toString(16).slice(0,10)}...</span>
                    </div>
                 </div>

                 <div className="w-full space-y-3">
                   {showReceipt.auction.status === 'live' ? (
                     <button 
                       onClick={() => router.push(`/auction/${showReceipt.auction.id}`)}
                       className="w-full bg-emerald-500 text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-colors shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2"
                     >
                       Enter Live Auction <ChevronRight className="h-4 w-4" />
                     </button>
                   ) : (
                     <button 
                       onClick={() => router.push(`/auction/${showReceipt.auction.id}`)}
                       className="w-full bg-zinc-800 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-zinc-700 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                     >
                       View Auction Room <ChevronRight className="h-4 w-4" />
                     </button>
                   )}
                   <button 
                     onClick={() => setShowReceipt(null)}
                     className="w-full border border-white/10 text-zinc-500 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:text-white transition-colors"
                   >
                     Dismiss
                   </button>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
