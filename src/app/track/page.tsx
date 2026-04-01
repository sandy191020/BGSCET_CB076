"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Award, MapPin, ScanLine, Wallet, ArrowRight, User, CheckCircle, Sprout, Zap } from 'lucide-react';

function TrackingMatrix() {
  const searchParams = useSearchParams();
  const crop_id = searchParams.get('crop_id');
  
  const [loading, setLoading] = useState(true);
  const [auction, setAuction] = useState<any>(null);
  const [scanCount, setScanCount] = useState<number>(0);

  // Scanner form state  
  const [showForm, setShowForm] = useState(false);
  const [formDone, setFormDone] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('Track Matrix ID:', crop_id);
    
    // Fail-safe: Force stop loading after 6 seconds no matter what
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Tracking data fetch timed out. Forcing load completion.');
        setLoading(false);
      }
    }, 6000);

    const scannerId = localStorage.getItem(`scanner_${crop_id}`);
    if (scannerId) {
      setFormDone(true);
    } else {
      setShowForm(true);
    }

    if (crop_id) {
      fetchLedgerData();
    } else {
      console.warn('No crop_id found in URL.');
      setLoading(false);
    }

    return () => clearTimeout(timeout);
  }, [crop_id]);

  const fetchLedgerData = async () => {
    try {
      console.log('Initiating ledger fetch for:', crop_id);
      
      // 1. Fetch Auction core data - keep it simple to avoid RLS/Join issues
      const { data: auctionData, error: auctionError } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', crop_id)
        .single();

      if (auctionError || !auctionData) {
        console.error('Auction Fetch Error:', auctionError?.message || 'NULL DATA');
        setLoading(false);
        return;
      }

      console.log('Auction Core Found:', auctionData.title);

      // 2. Fetch Farmer & Winner details - separate calls, wrap in try to prevent total failure
      let farmer = null;
      let winner = null;
      
      try {
        const { data: f } = await supabase.from('profiles').select('*').eq('id', auctionData.farmer_id).single();
        farmer = f;
      } catch (e) {
        console.warn('Farmer profile fetch failed (likely RLS):', e);
      }

      if (auctionData.winner_id) {
        try {
          const { data: w } = await supabase.from('profiles').select('full_name').eq('id', auctionData.winner_id).single();
          winner = w;
        } catch (e) {
          console.warn('Winner profile fetch failed (likely RLS):', e);
        }
      }

      // 3. Fetch Top Bid
      const { data: bids } = await supabase
        .from('auction_bids')
        .select('amount')
        .eq('auction_id', crop_id)
        .order('amount', { ascending: false })
        .limit(1);

      // 4. Fetch Scan Count
      const { count } = await supabase
        .from('scanners')
        .select('*', { count: 'exact', head: true })
        .eq('crop_id', crop_id);

      setAuction({ 
        ...auctionData, 
        farmer, 
        winner,
        final_price: bids?.[0]?.amount || auctionData.min_price 
      });
      setScanCount(count || 0);
      console.log('Ledger Fetch Complete ✅');
    } catch (err: any) {
      console.error('Fatal Tracking Error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase
      .from('scanners')
      .insert([{ name: formData.name, phone: formData.phone, email: formData.email, crop_id }])
      .select()
      .single();

    if (!error && data) {
      // Award 1 credit to the farmer (resiliently)
      if (auction?.farmer_id) {
        try {
          const { data: farmerProfile } = await supabase.from('profiles').select('credits').eq('id', auction.farmer_id).single();
          const currentCredits = farmerProfile?.credits || 0;
          await supabase.from('profiles').update({ credits: currentCredits + 1 }).eq('id', auction.farmer_id);
          
          // Update local state to show current credits
          setAuction((prev: any) => ({
            ...prev,
            farmer: { ...prev.farmer, credits: (currentCredits + 1) }
          }));
        } catch (e) {
          console.warn('Credits system failed (likely missing column or RLS):', e);
        }
      }

      localStorage.setItem(`scanner_${crop_id}`, data.id);
      setFormDone(true);
      setShowForm(false);
      setScanCount(c => c + 1);
    }
    setSubmitting(false);
  };

  const initiateUpiTip = async () => {
    if (!auction?.farmer) return;
    const tipAmount = Math.ceil((auction.final_price * 0.05) / 10) * 10; // Round to nearest 10
    // UPI ID derived from farmer's profile — in a real system, farmer would register their UPI
    const upiId = `${auction.farmer.full_name.replace(/\s+/g, '').toLowerCase()}@upi`;
    const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(auction.farmer.full_name)}&am=${tipAmount}&cu=INR&tn=${encodeURIComponent(`Tip for ${auction.title} from GreenLedger`)}`;
    
    // Record the tip intent
    const scannerId = localStorage.getItem(`scanner_${crop_id}`);
    if (scannerId && auction.farmer.id) {
      const tipAmount5pct = Math.ceil(auction.final_price * 0.05);
      await supabase.from('farmer_rewards').insert([{
        farmer_id: auction.farmer.id,
        scanner_id: scannerId,
        amount: tipAmount5pct
      }]);
    }
    
    window.location.href = upiDeepLink;
  };

  // Version for debugging
  const VERSION = "v1.2-FIX";

  // Manual bypass
  const bypassLoading = () => {
    console.log('User manually bypassed loading');
    setLoading(false);
  };

  const farmerName = auction?.farmer?.full_name || 'Verified Producer';
  const winnerName = auction?.winner?.full_name || 'Retail Partner';
  const farmerCredits = auction?.farmer?.credits || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      
      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center gap-6"
          >
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
              <Sprout className="absolute inset-0 m-auto h-10 w-10 text-emerald-500 animate-pulse" />
            </div>
            <div className="text-center space-y-4">
              <p className="text-emerald-400 font-black uppercase tracking-[0.5em] text-[12px] animate-pulse">Syncing_Ledger_{VERSION}</p>
              <p className="text-zinc-600 font-bold uppercase text-[9px] tracking-widest text-center px-10">Establishing Secure Provenance Node...</p>
              
              <button 
                onClick={bypassLoading}
                className="mt-8 bg-zinc-900 border border-white/5 px-6 py-2 rounded-full text-[10px] font-black uppercase text-zinc-500 hover:text-emerald-500 transition-colors"
              >
                Skip Synchronization
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!auction && !loading ? (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-8 text-center">
          <ScanLine className="h-12 w-12 text-red-500" />
          <h1 className="text-white font-black uppercase text-xl tracking-tighter">Asset Not Found</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Registry block {crop_id?.slice(0,8)} is either incomplete or invalid.</p>
          <button onClick={() => window.location.href = '/'} className="mt-8 text-emerald-500 text-[10px] font-black uppercase border border-emerald-500/20 px-8 py-3 rounded-full hover:bg-emerald-500/5 transition-all">Back to Exchange</button>
        </div>
      ) : auction ? (
        <>
          {/* Ambient glow */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
          </div>

          <div className="relative z-10 max-w-lg mx-auto px-6 py-12 space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 bg-zinc-900/50 border border-emerald-500/20 px-5 py-2 rounded-full backdrop-blur-xl">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-[0.4em]">Origin_Verified</span>
              </div>
              <div className="space-y-3">
                <h1 className="text-6xl font-black uppercase tracking-tighter text-white leading-none italic">{auction.title}</h1>
                <div className="flex items-center justify-center gap-4">
                   <div className="bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 rounded-lg">
                     <span className="text-[11px] font-black text-emerald-400 uppercase tracking-widest">Type: {auction.type || 'Superfine Crop'}</span>
                   </div>
                   <div className="h-1 w-1 rounded-full bg-zinc-700" />
                   <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">ID: {auction.id.slice(0,8).toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Farmer Card — the hero element */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 border border-emerald-500/10 rounded-[3rem] p-10 space-y-8 shadow-2xl relative overflow-hidden"
            >
              {/* Credit Badge */}
              <div className="absolute top-8 right-8 bg-emerald-500 text-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl shadow-emerald-500/20">
                 <Zap className="h-3 w-3 fill-current" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{farmerCredits} Credits</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-700">
                   <User className="h-12 w-12 text-emerald-500/40" />
                </div>
                <div>
                  <p className="text-[11px] font-black text-emerald-500/70 uppercase tracking-[0.3em] mb-1.5">Master Producer</p>
                  <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-none">{farmerName}</h2>
                  <div className="flex items-center gap-2 mt-3 text-emerald-300">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Identity_Protocol_Verified</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4 pb-2">
                <div className="space-y-px">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location Node
                  </p>
                  <p className="text-xs font-black text-white uppercase italic">Central Hub, South Sector</p>
                </div>
                <div className="space-y-px text-right">
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest flex items-center gap-1 justify-end">
                    <Award className="h-3 w-3" /> Ledger Rank
                  </p>
                  <p className="text-xs font-black text-white uppercase italic">Tier-1 Master Producer</p>
                </div>
              </div>

              <div className="h-px bg-emerald-500/10" />

              {/* Farmer Story / Details */}
              <div className="space-y-3">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Producer_Brief</h3>
                 <p className="text-xs text-zinc-400 font-bold leading-relaxed uppercase tracking-tight italic">
                   This asset was cultivated using regenerative agricultural protocols. {farmerName} has been a verified network participant since 2024, maintaining a 98% quality audit score. All crops are tracked from seed-to-shelf using GreenLedger's immutable node registry.
                 </p>
              </div>

              <div className="h-px bg-emerald-500/10" />

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Final Valuation</p>
                  <p className="text-2xl font-black text-emerald-400 leading-none">₹{auction.final_price?.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 text-right">
                  <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Network Scans</p>
                  <p className="text-2xl font-black text-emerald-400 leading-none">{scanCount}</p>
                </div>
              </div>
            </motion.div>

            {/* Verification Ledger */}
            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-700 text-center">Supply_Chain_Provenance</h3>
               <div className="glass rounded-3xl border border-white/5 bg-zinc-950/40 p-6 space-y-4">
                  <div className="flex items-center gap-4">
                     <div className="h-8 w-8 rounded-full border border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                     </div>
                     <div className="flex-1 border-b border-white/5 pb-2">
                        <p className="text-[10px] font-black text-white uppercase">Cultivation_Finalized</p>
                        <p className="text-[8px] font-bold text-zinc-600">Verification Hash: {auction.id.slice(0, 16)}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-8 w-8 rounded-full border border-emerald-500/20 flex items-center justify-center bg-emerald-500/5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                     </div>
                     <div className="flex-1 border-b border-white/5 pb-2">
                        <p className="text-[10px] font-black text-white uppercase">Procured by {winnerName}</p>
                        <p className="text-[8px] font-bold text-zinc-600">Smart Contract Executed</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="h-8 w-8 rounded-full border border-emerald-500/20 flex items-center justify-center bg-emerald-500/5 animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-white" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-black text-white uppercase">Retail Display Active</p>
                        <p className="text-[8px] font-bold text-zinc-600">Direct-to-Consumer Scan Stream</p>
                     </div>
                  </div>
               </div>
            </div>
            
            {/* QR code image if available */}
            {auction.qr_code && (
              <div className="flex justify-center pt-4">
                <div className="bg-white p-5 rounded-[2rem] shadow-2xl shadow-emerald-500/20">
                  <img src={auction.qr_code} alt="Traceability QR" className="w-28 h-28" />
                </div>
              </div>
            )}

            {/* UPI Tip Button — only shown after registration */}
            <AnimatePresence>
              {formDone && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <button
                    onClick={initiateUpiTip}
                    className="w-full rounded-[1.5rem] bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all p-6 flex items-center gap-4 text-left"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-black/20 flex items-center justify-center shrink-0">
                      <Wallet className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-widest text-black leading-none mb-1">Tip the Farmer via UPI</p>
                      <p className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">5% of wholesale · No fees · Opens UPI app</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-black shrink-0" />
                  </button>
                  <p className="text-center text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-3">
                    Tip goes directly to {farmerName} via UPI
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="text-center pb-10">
              <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest">GreenLedger Farm-to-Shelf Protocol</p>
            </div>
          </div>

          {/* Consumer Registration Bottom Sheet — first-time only */}
          <AnimatePresence>
            {showForm && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                  onClick={() => {}} // Prevent dismiss — must register
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  exit={{ y: '100%' }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                  className="fixed inset-x-0 bottom-0 z-50 bg-zinc-950 border-t border-white/10 rounded-t-[3rem] p-8 pb-14"
                >
                  <div className="max-w-md mx-auto space-y-6">
                    <div className="w-10 h-1 bg-zinc-800 rounded-full mx-auto" />
                    
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-emerald-500" />
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tighter text-white leading-none">Consumer Ledger</h3>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-0.5">One-time registration to view full traceability</p>
                      </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-3">
                      <input
                        type="text" placeholder="Your Full Name" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50"
                      />
                      <input
                        type="email" placeholder="Email Address" required
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50"
                      />
                      <input
                        type="tel" placeholder="Mobile Number" required
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black rounded-2xl p-4 font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                      >
                        {submitting ? 'Registering...' : <>View Crop Details <ArrowRight className="h-4 w-4" /></>}
                      </button>
                    </form>
                    
                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
                      Free • No password • One time only per crop
                    </p>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      ) : null}
    </div>
  );
}

export default function TrackPage() {
return (
  <Suspense fallback={
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Sprout className="h-10 w-10 text-emerald-500 animate-bounce" />
    </div>
  }>
    <TrackingMatrix />
  </Suspense>
);
}
