"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Gavel, Clock, Users, Activity, 
  Trash2, Play, Pause, ChevronRight, X,
  TrendingUp, ShieldCheck, AlertCircle, Calendar, 
  CheckCircle2, DollarSign, Leaf, Zap
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";

interface Auction {
  id: string;
  title: string;
  type: 'crops' | 'carbon';
  min_price: number;
  max_price: number;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  scheduled_at: string;
}

export default function AdminAuctions() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [title, setTitle] = useState("");
  const [type, setType] = useState<'crops' | 'carbon'>('crops');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [scheduledAt, setScheduledAt] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAuctions();
    const interval = setInterval(fetchAuctions, 10000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  const fetchAuctions = async () => {
    const { data, error } = await supabase
      .from('auctions')
      .select('*')
      .order('scheduled_at', { ascending: false });
    
    if (!error && data) setAuctions(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    
    const maxPrice = minPrice * 1.3; // Automatic 30% Regulation Cap

    const { error } = await supabase
      .from('auctions')
      .insert([{
        title,
        type,
        min_price: minPrice,
        max_price: maxPrice,
        scheduled_at: scheduledAt,
        status: 'scheduled'
      }]);

    if (!error) {
      setIsModalOpen(false);
      setTitle("");
      setMinPrice(0);
      setScheduledAt("");
      fetchAuctions();
    }
    setCreating(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('auctions').update({ status }).eq('id', id);
    fetchAuctions();
  };

  const deleteAuction = async (id: string) => {
    if (confirm("Permanently delete this auction?")) {
      await supabase.from('auctions').delete().eq('id', id);
      fetchAuctions();
    }
  };

  return (
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Auction Control_Panel</h1>
            <p className="text-sm font-mono text-zinc-500 mt-1 italic">SYSTEM_STATUS: <span className="text-emerald-500">OPERATIONAL</span></p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 rounded-2xl bg-white text-black px-6 py-4 text-sm font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-white/10"
          >
            <Plus className="h-5 w-5" />
            Schedule New_Event
          </button>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="Active Auctions" value={auctions.filter(a => a.status === 'live').length.toString()} icon={<Activity />} color="text-emerald-500" />
          <StatCard label="Scheduled" value={auctions.filter(a => a.status === 'scheduled').length.toString()} icon={<Clock />} color="text-blue-500" />
          <StatCard label="Completed" value={auctions.filter(a => a.status === 'completed').length.toString()} icon={<TrendingUp />} color="text-zinc-500" />
        </div>

        {/* Auction List */}
        <div className="glass rounded-[3rem] border border-white/5 overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-zinc-950/30 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Manage Marketplace_Events</h3>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Total: {auctions.length}</span>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center text-zinc-600 uppercase font-black tracking-widest text-xs">Syncing Platform Node...</div>
            ) : auctions.length === 0 ? (
              <div className="p-20 text-center text-zinc-600 uppercase font-black tracking-widest text-xs">No Events Defined</div>
            ) : (
              auctions.map((a) => (
                <div key={a.id} className="p-6 hover:bg-white/[0.02] transition-colors group flex items-center gap-8 min-w-[800px]">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${
                    a.type === 'crops' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                  }`}>
                    {a.type === 'crops' ? <Leaf className="h-6 w-6" /> : <Zap className="h-6 w-6" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-black text-white uppercase tracking-tight truncate">{a.title}</h4>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Calendar className="h-3 w-3" />
                        {new Date(a.scheduled_at).toLocaleDateString()} @ {new Date(a.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-zinc-800" />
                      <span>{a.type} Exchange</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-12 px-8 border-x border-white/5">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Base Price</p>
                      <p className="text-sm font-black text-white">₹{a.min_price.toLocaleString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Regulation Cap</p>
                      <p className="text-sm font-black text-emerald-500">₹{a.max_price?.toLocaleString() || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {a.status === 'scheduled' && (
                        <button 
                          onClick={() => updateStatus(a.id, 'live')}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-95 flex items-center gap-2"
                        >
                          <Play className="h-3 w-3 fill-current" />
                          Start Live
                        </button>
                    )}
                    {a.status === 'live' && (
                        <button 
                          onClick={() => updateStatus(a.id, 'completed')}
                          className="px-4 py-2 rounded-xl bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-400 transition-all active:scale-95 flex items-center gap-2"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          Finalize
                        </button>
                    )}
                    <button 
                      onClick={() => deleteAuction(a.id)}
                      className="p-3 rounded-xl bg-white/5 text-zinc-600 hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Create Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] p-10 shadow-2xl"
              >
                <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
                  <X className="h-6 w-6" />
                </button>

                <div className="mb-10">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6 border border-emerald-500/20">
                    <Gavel className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white">Schedule Marketplace Event</h2>
                  <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Configure pricing & regulatory parameters</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Event Title</label>
                      <input 
                        type="text" 
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="E.g. Certified Organic Paddy"
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all font-bold placeholder:text-zinc-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Asset Category</label>
                      <div className="flex gap-2">
                        {['crops', 'carbon'].map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t as any)}
                            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                              type === t 
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' 
                              : 'bg-black border-white/5 text-zinc-600 hover:border-white/10'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-tighter">{t} Exchange</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Minimum Base Price (₹)</label>
                      <input 
                        type="number" 
                        required
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                      <div className="mt-2 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.1em] text-emerald-500/70 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <span>Price Cap (30% Regulation):</span>
                        <span>₹{(minPrice * 1.3).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Commencement Time</label>
                      <input 
                        type="datetime-local" 
                        required
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm font-mono text-zinc-400 focus:outline-none focus:border-emerald-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    disabled={creating}
                    className="w-full bg-white text-black py-5 rounded-3xl font-black uppercase tracking-widest text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
                  >
                    {creating ? "Initiating Protocol..." : "Finalize & Schedule Auction"}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, icon, color }: { label: string, value: string, icon: React.ReactNode, color: string }) {
  return (
    <div className="glass rounded-[2rem] p-8 border border-white/5 bg-zinc-950/20 group hover:border-white/10 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10 ${color}`}>
          {React.cloneElement(icon as any, { className: "h-6 w-6" })}
        </div>
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</span>
      </div>
      <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    scheduled: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    live: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 animate-pulse",
    completed: "text-zinc-500 bg-zinc-800/30 border-white/5",
    cancelled: "text-red-400 bg-red-500/10 border-red-500/20"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  );
}

function ArrowRight(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
}
