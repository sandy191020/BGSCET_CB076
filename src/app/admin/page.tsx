"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, AlertTriangle, Activity, Users, 
  Trash2, Play, Pause, ChevronRight, Lock, Gavel,
  Megaphone, Send, Clock, Fingerprint, Info, 
  Search, Eye, Settings, Terminal, Zap, Leaf, X
} from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";

interface Auction {
  id: string;
  title: string;
  type: 'crops' | 'carbon';
  status: 'scheduled' | 'live' | 'completed';
  min_price: number;
  max_price?: number;
  highestBid?: any;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'announcements' | 'auctions' | 'users'>('overview');
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Real-time metrics
  const [metrics, setMetrics] = useState({
     users: 0,
     volume: 0,
     totalBids: 0,
     seatsReserved: 0
  });

  const stats = [
    { label: "Network_Velocity", value: `${(metrics.totalBids * 1.2).toFixed(1)} Ops/s`, icon: <Zap />, color: "text-emerald-500" },
    { label: "Active_Entities", value: metrics.users.toString(), icon: <Users />, color: "text-blue-500" },
    { label: "Exchange_Volume", value: `₹${(metrics.volume / 1000000).toFixed(2)}M`, icon: <Activity />, color: "text-amber-500" },
    { label: "Security_Uptime", value: "99.99%", icon: <ShieldCheck />, color: "text-emerald-500" },
  ];

  useEffect(() => {
    fetchAuctions();
    fetchMetrics();
    const channel = supabase
      .channel('admin_dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auctions' }, fetchAuctions)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, fetchMetrics)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'auction_bids' }, fetchMetrics)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMetrics = async () => {
     // Fetch Users
     const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
     
     // Fetch Bids and Volume
     const { data: bids } = await supabase.from('auction_bids').select('amount');
     const totalVolume = bids?.reduce((sum, bid) => sum + (bid.amount || 0), 0) || 0;
     
     // Fetch Seats Reserved
     const { count: seatsCount } = await supabase.from('auction_seats').select('*', { count: 'exact', head: true });

     setMetrics({
        users: userCount || 0,
        volume: totalVolume,
        totalBids: bids?.length || 0,
        seatsReserved: seatsCount || 0
     });
  };

  const fetchAuctions = async () => {
    const { data: auctionsData } = await supabase
      .from('auctions')
      .select('*, auction_bids(amount, user_id, profiles(full_name, email))')
      .order('scheduled_at', { ascending: false });
    
    if (auctionsData) {
       const mapped = auctionsData.map((a: any) => {
           let highestBid = null;
           if (a.auction_bids && a.auction_bids.length > 0) {
              const sortedBids = [...a.auction_bids].sort((x, y) => y.amount - x.amount);
              highestBid = sortedBids[0];
           }
           delete a.auction_bids; // Cleanup nested relation
           return { ...a, highestBid };
       });
       setAuctions(mapped);
    }
    setLoading(false);
  };

  return (
    <AppShell hideSidebar>
      <div className="min-h-[calc(100vh-80px)] bg-[#050505] p-4 lg:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar: Admin Navigation */}
        <aside className="lg:w-72 flex flex-col gap-4">
          <div className="glass rounded-[2rem] border border-white/5 bg-zinc-950/50 p-6">
             <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500">
                   <Terminal className="h-5 w-5" />
                </div>
                <div>
                   <h2 className="text-xs font-black uppercase tracking-widest text-white">Root_Terminal</h2>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Admin Authorization: OK</p>
                </div>
             </div>

             <nav className="space-y-1">
                {[
                  { id: 'overview', icon: <Activity />, label: 'Market_Summary' },
                  { id: 'announcements', icon: <Megaphone />, label: 'Broadcast_Hub' },
                  { id: 'auctions', icon: <Gavel />, label: 'Exchange_Control' },
                  { id: 'users', icon: <Users />, label: 'Entity_Registry' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                       activeTab === item.id 
                       ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20' 
                       : 'text-zinc-500 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
             </nav>
          </div>

          <div className="glass rounded-[2rem] border border-white/5 bg-zinc-950/50 p-6 flex-1 hidden lg:block">
             <h3 className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-4">Security_Logs</h3>
             <div className="space-y-4">
                {[
                  { m: "ROOT LOGIN: SUCCESS", t: "2m ago", c: "text-emerald-500" },
                  { m: "DB_SYNC: OK", t: "5m ago", c: "text-zinc-500" },
                  { m: "NEW AUCTION: CREATED", t: "12m ago", c: "text-blue-500" },
                  { m: "RLS_GUARD: ACTIVE", t: "NOW", c: "text-red-500 animate-pulse" }
                ].map((log, i) => (
                  <div key={i} className="space-y-1">
                    <div className={`text-[8px] font-black uppercase tracking-tight ${log.c}`}>{log.m}</div>
                    <div className="text-[7px] font-bold text-zinc-700 uppercase tracking-widest">{log.t}</div>
                  </div>
                ))}
             </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col gap-8">
          
          {/* Header & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-[1.5rem] p-6 border border-white/5 bg-zinc-950/30 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between">
                  <div className={`h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center ${stat.color}`}>
                     {React.cloneElement(stat.icon as any, { className: "h-4 w-4" })}
                  </div>
                  <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">{stat.label}</span>
                </div>
                <div className="text-2xl font-black text-white tracking-tighter tabular-nums">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Dynamic Content Switches */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && <OverviewTab key="overview" auctions={auctions} metrics={metrics} />}
            {activeTab === 'announcements' && <AnnouncementsTab key="announcements" />}
            {activeTab === 'auctions' && <AuctionsTab key="auctions" auctions={auctions} fetchAuctions={fetchAuctions} />}
            {activeTab === 'users' && <UsersTab key="users" />}
          </AnimatePresence>
        </main>

      </div>
    </AppShell>
  );
}

/* --- TAB COMPONENTS --- */

function OverviewTab({ auctions, metrics }: { auctions: Auction[], metrics: { totalBids: number, seatsReserved: number } }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <div className="lg:col-span-2 space-y-8">
         <div className="glass rounded-[2.5rem] border border-white/5 bg-zinc-950/50 p-10 overflow-hidden relative min-h-[300px] flex flex-col justify-end">
            <div className="absolute top-10 left-10 z-10">
               <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 leading-none">Exchange_Core Status</h3>
               <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Platform Operational Integrity: <span className="text-emerald-500">OPTIMAL</span></p>
            </div>
            {/* Visual Flare */}
            <div className="absolute -top-1/4 -right-1/4 w-1/2 h-full bg-emerald-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10 grid grid-cols-3 gap-8 pt-20">
               <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Live Sessions</p>
                  <p className="text-3xl font-black text-white italic">{auctions.filter(a => a.status === 'live').length}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Commitment Bids</p>
                  <p className="text-3xl font-black text-white italic">{metrics.totalBids}</p>
               </div>
               <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Seats Reserved</p>
                  <p className="text-3xl font-black text-emerald-500 italic">{metrics.seatsReserved}/300</p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass rounded-[2rem] border border-white/5 bg-zinc-950/20 p-8">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Recent Activity Hub</h4>
               <div className="space-y-6">
                 {[1,2,3].map(i => (
                   <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white transition-colors">
                         <Fingerprint className="h-4 w-4" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-white uppercase tracking-tight">Bid_Node_Pulse: Verified</p>
                         <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Transaction hashed at index #420</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="glass rounded-[2rem] border border-white/5 bg-zinc-950/20 p-8">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-6">Security Vectors</h4>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">WAF Guard</span>
                     <span className="text-[10px] font-black text-emerald-500 uppercase">Shield_On</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-emerald-500" />
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">DDoS Mitigation</span>
                     <span className="text-[10px] font-black text-emerald-500 uppercase">Active</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="space-y-8">
         <div className="glass rounded-[2rem] border border-white/5 bg-zinc-950/50 p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-white mb-6">Live Auction Monitor</h3>
            <div className="space-y-3">
               {auctions.filter(a => a.status === 'live').map(a => (
                 <div key={a.id} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                    <div>
                       <p className="text-[10px] font-black text-white uppercase tracking-tight">{a.title}</p>
                       <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Currently Live & Bidding</p>
                    </div>
                    <Link href={`/auction/${a.id}`} className="h-8 w-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
                       <Eye className="h-4 w-4" />
                    </Link>
                 </div>
               ))}
               {auctions.filter(a => a.status === 'live').length === 0 && (
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest text-center py-4">No Active Live Streams_</p>
               )}
            </div>
         </div>

         <div className="glass rounded-[2rem] border border-white/5 bg-emerald-500/5 p-8 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-white">System Sustainability</h3>
               <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest leading-relaxed">Platform is currently offsetting 14.2 tons of Carbon through verified farmer nodes.</p>
               <button className="w-full py-4 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors shadow-xl shadow-emerald-500/10">View Impact_Report</button>
            </div>
            <Leaf className="absolute -bottom-4 -right-4 h-24 w-24 text-emerald-500/10 rotate-12" />
         </div>
      </div>
    </motion.div>
  );
}

function AnnouncementsTab() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"auction" | "credit" | "system" | "alert">("system");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    setSending(true);
    const { error } = await supabase
      .from('notifications')
      .insert([{ title, message, type, is_global: true }]);
    
    if (error) setStatus("Broadcast Fail_");
    else {
      setTitle(""); setMessage(""); setStatus("Global Broadcast Dispatched_");
      setTimeout(() => setStatus(null), 3000);
    }
    setSending(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl space-y-8"
    >
      <div className="glass rounded-[3rem] border border-white/5 bg-zinc-950/50 p-12">
         <div className="flex items-center gap-6 mb-12">
            <div className="h-16 w-16 rounded-[2rem] bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-2xl shadow-blue-500/10">
               <Megaphone className="h-8 w-8" />
            </div>
            <div>
               <h3 className="text-3xl font-black uppercase tracking-tighter text-white">Broadcast Console</h3>
               <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Notification Injection Interface</p>
            </div>
         </div>

         <form onSubmit={handleBroadcast} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Target: SYSTEM_WIDE</label>
                  <input 
                    type="text" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                    placeholder="Enter Broadcast Subject_"
                    className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-black placeholder:text-zinc-800"
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Signature Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'system', icon: <Info /> },
                      { id: 'auction', icon: <Clock /> },
                      { id: 'credit', icon: <Fingerprint /> },
                      { id: 'alert', icon: <AlertTriangle /> }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setType(t.id as any)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                           type === t.id ? 'bg-white text-black border-white' : 'bg-zinc-900 border-white/5 text-zinc-600 hover:border-white/10'
                        }`}
                      >
                         {React.cloneElement(t.icon as any, { className: "h-4 w-4" })}
                         <span className="text-[10px] font-black uppercase tracking-widest">{t.id}</span>
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">Payload Content</label>
                  <textarea 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Detailed signal data..."
                    rows={8}
                    className="w-full bg-zinc-950 border border-white/10 rounded-3xl px-6 py-5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium placeholder:text-zinc-800 resize-none"
                  />
               </div>
               <div className="flex items-center justify-between">
                  {status && <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">{status}</span>}
                  <button 
                    disabled={sending}
                    className="ml-auto flex items-center gap-2 rounded-2xl bg-white text-black px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-2xl"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? 'Injecting_Signal...' : 'Finalize_Dispatch'}
                  </button>
               </div>
            </div>
         </form>
      </div>

      <div className="glass rounded-[2rem] border border-white/5 p-8 flex items-center justify-between bg-zinc-950/20">
         <div className="flex items-center gap-4">
            <Info className="h-5 w-5 text-zinc-600" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Global signals appear instantly in the top announcement strip and user notification hubs.</p>
         </div>
      </div>
    </motion.div>
  );
}

function AuctionsTab({ auctions, fetchAuctions }: { auctions: Auction[], fetchAuctions: () => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    category: 'crops', 
    startingPrice: '',
    scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('auctions').insert([{
      title: formData.title,
      type: formData.category,
      min_price: Number(formData.startingPrice),
      max_price: Number(formData.startingPrice) * 1.3, // 30% regulation cap
      status: 'scheduled',
      scheduled_at: new Date(formData.scheduledAt).toISOString()
    }]);
    if (!error) {
      await supabase.from('notifications').insert([{
        title: `New ${formData.category === 'crops' ? 'Crop' : 'Carbon'} Auction Live`,
        message: `${formData.title} has been scheduled for ${new Date(formData.scheduledAt).toLocaleString()}`,
        type: 'auction',
        is_global: true,
        link: '/marketplace'
      }]);

      setIsAdding(false);
      setFormData({ 
        title: '', 
        category: 'crops', 
        startingPrice: '',
        scheduledAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16)
      });
      fetchAuctions();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('auctions').update({ status }).eq('id', id);
    fetchAuctions();
  };

  const deleteAuction = async (id: string) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    await supabase.from('auction_seats').delete().eq('auction_id', id);
    await supabase.from('auction_bids').delete().eq('auction_id', id);
    await supabase.from('auctions').delete().eq('id', id);
    fetchAuctions();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
         <h3 className="text-2xl font-black uppercase tracking-tighter text-white">Exchange Control Registry</h3>
         <button 
           onClick={() => setIsAdding(!isAdding)}
           className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10"
         >
           {isAdding ? <X className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
           {isAdding ? 'Cancel_Action' : 'Initiate_New_Auction'}
         </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <div className="glass rounded-[2rem] border border-emerald-500/20 bg-emerald-500/5 p-10 mb-8">
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                   <div className="space-y-2 lg:col-span-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Auction_Title</label>
                      <input 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-5 py-3 text-xs text-white uppercase font-black"
                        placeholder="Premium Wheat..."
                        required
                      />
                   </div>
                   <div className="space-y-2 lg:col-span-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Exhange_Type</label>
                      <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-5 py-3 text-xs text-white uppercase font-black"
                      >
                         <option value="crops">Crop Auction</option>
                         <option value="carbon">Carbon Credit</option>
                      </select>
                   </div>
                   <div className="space-y-2 lg:col-span-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Base_Price (₹)</label>
                      <input 
                        type="number" 
                        value={formData.startingPrice}
                        onChange={e => setFormData({...formData, startingPrice: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-5 py-3 text-xs text-white font-black"
                        placeholder="5000"
                        min="1"
                        required
                      />
                   </div>
                   <div className="space-y-2 lg:col-span-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500/70">Scheduled_Time</label>
                      <input 
                        type="datetime-local" 
                        value={formData.scheduledAt}
                        onChange={e => setFormData({...formData, scheduledAt: e.target.value})}
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl px-4 py-3 text-[11px] text-white uppercase font-black"
                        required
                      />
                   </div>
                   <button type="submit" className="w-full h-[40px] rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-zinc-200 transition-colors">Deploy_to_Ecosystem</button>
                </form>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass rounded-[2.5rem] border border-white/5 bg-zinc-950/20 overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-zinc-950/80 border-b border-white/5 whitespace-nowrap">
               <tr>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Signal_UID</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Exchange_Entity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status_Node</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Valuation_Floor</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
               {auctions.map(a => (
                 <tr key={a.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 font-mono text-[9px] text-zinc-600 uppercase tracking-tighter">#{a.id.slice(0,8)}</td>
                    <td className="px-8 py-6">
                       <p className="text-xs font-black text-white uppercase tracking-tight">{a.title}</p>
                       <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{a.type}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[9px] font-black uppercase ${
                          a.status === 'live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          a.status === 'scheduled' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          'bg-zinc-900 text-zinc-500 border-white/10'
                       }`}>
                          <div className={`h-1 w-1 rounded-full ${a.status === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                          {a.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-xs font-black text-white italic">₹{a.min_price.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right whitespace-nowrap">
                       <div className="flex items-center justify-end gap-3">
                          {a.status === 'scheduled' && <button onClick={() => updateStatus(a.id, 'live')} className="h-9 w-9 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all"><Play className="h-4 w-4" /></button>}
                          {a.status === 'live' && <button onClick={() => updateStatus(a.id, 'completed')} className="h-9 w-9 shrink-0 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center hover:bg-blue-500 hover:text-black transition-all font-black text-[9px]">DONE</button>}
                          
                          {a.status === 'completed' && a.highestBid && (
                              <div className="text-right ml-4 border-r border-white/10 pr-4">
                                  <p className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter leading-none mb-1">
                                    WINNER: {a.highestBid.profiles?.full_name || 'Anonymous'}
                                  </p>
                                  <p className="text-[8px] font-bold text-zinc-500">{a.highestBid.profiles?.email}</p>
                              </div>
                          )}

                          <button onClick={() => deleteAuction(a.id)} className="h-9 w-9 shrink-0 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-4 w-4" /></button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </motion.div>
  );
}

function UsersTab() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center">
       <Users className="h-16 w-16 text-zinc-800 mb-6" />
       <h3 className="text-xl font-black uppercase tracking-tighter text-white">Entity_Directory Encrypted</h3>
       <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.4em] mt-2">Authorization for Partner_Review required from Central Node</p>
    </motion.div>
  );
}
