"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Zap, Users, BarChart3, Clock, Tag, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"crops" | "carbon">("crops");
  const [scheduledAt, setScheduledAt] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Basic auth check
    const isAdmin = localStorage.getItem("admin_auth");
    if (!isAdmin) {
      router.push("/admin");
      return;
    }
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    setLoading(true);
    const { data: auctionsData } = await supabase
      .from("auctions")
      .select("*")
      .order("scheduled_at", { ascending: true });
    
    if (auctionsData) {
      // Fetch seat counts for each auction
      const { data: seatsData } = await supabase
        .from("auction_seats")
        .select("auction_id");
        
      const auctionsWithSeats = auctionsData.map(a => ({
        ...a,
        seat_count: seatsData?.filter(s => s.auction_id === a.id).length || 0
      }));
      
      setAuctions(auctionsWithSeats);
    }
    setLoading(false);
  };

  const handleDeleteAuction = async (id: string) => {
    if (!confirm("Are you sure you want to delete this auction? All related bids and seats will be PERMANENTLY removed.")) return;
    
    setLoading(true);
    const { error } = await supabase.from("auctions").delete().eq("id", id);
    if (error) {
      setError(`Delete Failed: ${error.message}`);
    } else {
      fetchAuctions();
    }
    setLoading(false);
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const minVal = parseFloat(minPrice);
    const maxVal = minVal * 1.3;

    if (isNaN(minVal)) {
      setError("Please enter a valid number for minimum price");
      setLoading(false);
      return;
    }

    let isoDate = "";
    try {
      const d = new Date(scheduledAt);
      if (isNaN(d.getTime())) throw new Error("Invalid Date");
      isoDate = d.toISOString();
    } catch (e) {
      setError("Invalid date/time format. Please use the picker.");
      setLoading(false);
      return;
    }

    console.log("SENDING_TO_SUPABASE:", { title, type, scheduled_at: isoDate, min_price: minVal, max_price: maxVal, status: "scheduled" });

    try {
      const payload = {
        title,
        type,
        scheduled_at: isoDate,
        min_price: minVal,
        max_price: maxVal,
        status: "scheduled"
      };
      
      const { data, error: insertError } = await supabase.from("auctions").insert(payload).select();

      if (insertError) {
        console.error("SUPABASE_LATENCY_ERROR:", insertError);
        setError(`DB ERROR: ${insertError.message || "Unknown"} | Code: ${insertError.code || "None"}`);
        return;
      }

      setShowAddForm(false);
      setTitle("");
      setMinPrice("");
      setScheduledAt("");
      fetchAuctions();
    } catch (err: any) {
      console.error("CRITICAL_CLIENT_ERROR:", err);
      setError(`APPLICATION ERROR: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("auctions").update({ status }).eq("id", id);
    fetchAuctions();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin <span className="text-emerald-500">Command Center</span></h1>
            <p className="text-zinc-500 mt-1">Manage global crop and carbon credit auctions</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-500"
          >
            <Plus className="h-5 w-5" />
            Schedule Auction
          </button>
        </div>

        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 mb-12 border-emerald-500/20"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              New Auction Parameters
            </h2>
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleCreateAuction} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Auction Title</label>
                <input 
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kharif Harvest 2024"
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Asset Type</label>
                <select 
                  value={type}
                  onChange={(e: any) => setType(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none"
                >
                  <option value="crops">Crops Exchange</option>
                  <option value="carbon">Carbon Credits</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Date & Time</label>
                <input 
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase">Min Price (₹)</label>
                <input 
                  type="number"
                  required
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-2.5 text-sm font-medium text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  {loading ? "Scheduling..." : "Confirm & Schedule"}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="text-center py-20 text-zinc-600 font-mono text-sm animate-pulse">
              SYNCING_LEDGER_DATA...
            </div>
          ) : auctions.length === 0 ? (
            <div className="glass rounded-3xl p-20 text-center border-dashed border-white/5">
              <Clock className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500">No auctions currently scheduled</p>
            </div>
          ) : (
            auctions.map((auction) => (
              <div 
                key={auction.id}
                className="glass rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between border-white/5 gap-6"
              >
                <div className="flex items-center gap-6">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center border ${
                    auction.type === 'crops' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                  }`}>
                    {auction.type === 'crops' ? <Tag className="h-7 w-7" /> : <Zap className="h-7 w-7" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{auction.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(auction.scheduled_at).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5 capitalize">
                        <Clock className="h-3.5 w-3.5" />
                        {auction.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 px-8 border-x border-white/5">
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1 text-zinc-400">Seats Booked</p>
                    <p className="text-lg font-bold text-emerald-500">{auction.seat_count || 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1">Min Price</p>
                    <p className="text-lg font-bold">₹{auction.min_price}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase mb-1 flex items-center gap-1">
                      Max Cap <span className="text-emerald-500">(Govt+30%)</span>
                    </p>
                    <p className="text-lg font-bold text-zinc-300">₹{auction.max_price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {auction.status === 'scheduled' && (
                    <button 
                      onClick={() => updateStatus(auction.id, 'live')}
                      className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                    >
                      GO LIVE
                    </button>
                  )}
                  {auction.status === 'live' && (
                    <button 
                      onClick={() => updateStatus(auction.id, 'completed')}
                      className="bg-red-600/20 text-red-400 border border-red-500/30 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                    >
                      STOP AUCTION
                    </button>
                  )}
                  <button 
                    onClick={() => handleDeleteAuction(auction.id)}
                    className="p-2.5 rounded-xl border border-red-500/10 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button className="p-2.5 rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors">
                    <BarChart3 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
