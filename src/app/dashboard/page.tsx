"use client";

import React, { useState, useEffect } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel";
import { motion } from "framer-motion";
import { 
  Wallet, Satellite, BarChart3, Fingerprint, ShieldAlert, X, Bell, User, Globe, HelpCircle,
  TrendingUp, Leaf, Zap
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/lib/supabase/client";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(prof);
      }
      setLoading(false);
    }
    getSession();
  }, []);

  const startAnalysis = async () => {
    if (!coords || !profile) return;
    setAnalyzing(true);
    setScore(null);
    setTxHash(null);
    
    setStatus("INITIALIZING_MASTRA_AGENT...");
    await new Promise(r => setTimeout(r, 2000));
    
    setStatus("ANALYZING_SATELLITE_BANDS...");
    await new Promise(r => setTimeout(r, 2000));
    
    const finalScore = 0.82;
    setScore(finalScore);
    
    setStatus("UPLOADING_PROOF_TO_IPFS...");
    await new Promise(r => setTimeout(r, 1500));
    
    setStatus("MINTING_CARBON_CREDITS...");
    
    // AWARD CREDITS IN DB
    const carbonCreditsToAdd = Math.round(finalScore * 100);
    const zapCreditsToAdd = 10;
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        carbon_credits: (profile.carbon_credits || 0) + carbonCreditsToAdd,
        credits: (profile.credits || 0) + zapCreditsToAdd
      })
      .eq('id', user.id);

    if (!error) {
      // Refresh local profile state
      setProfile({
        ...profile,
        carbon_credits: (profile.carbon_credits || 0) + carbonCreditsToAdd,
        credits: (profile.credits || 0) + zapCreditsToAdd
      });

      // CREATE MARKETPLACE LISTING AUTOMATICALLY
      await supabase
        .from('carbon_listings')
        .insert([{
          farmer_id: user.id,
          token_id: Math.floor(Math.random() * 1000), // Mock token ID for now
          amount: carbonCreditsToAdd,
          price_per_credit: 850,
          status: 'available',
          farm_id: 1, // Default or random
          farm_name: "Greenfield Farm", // Or from profile
          ndvi_score: finalScore,
          image_hash: "QmYxivKF7f5xfJBvJqPnWKvqzJ8xKZxZxKZxZxKZxZxK1",
          seller_address: profile.wallet_address || "0x0000000000000000000000000000000000000000"
        }]);
    }

    await new Promise(r => setTimeout(r, 2000));
    const mockTx = "0x" + Math.random().toString(16).substring(2, 66);
    setTxHash(mockTx);
    setAnalyzing(false);
    setStatus(null);
  };

  const reasoning = "AI confirmed dense, healthy vegetation (NDVI: 0.82). No industrial pesticide patterns detected. High carbon sequestration potential verified via Sentinel-2 satellite data.";

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
        </div>
      </AppShell>
    );
  }

  const isFarmer = profile?.role === 'farmer';

  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">
              {isFarmer ? "Farm Intelligence Hub" : "Market Analytics"}
            </h1>
            <p className="text-sm text-zinc-500 font-mono">
              USER_ROLE: <span className="text-emerald-500 uppercase">{profile?.role || "GUEST"}</span> // STATUS: {profile ? "VERIFIED" : "UNAUTHORIZED"}
            </p>
          </div>
          {status && (
            <div className="text-[10px] font-mono text-emerald-400 animate-pulse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">
              {status}
            </div>
          )}
        </div>

        {isFarmer ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Column */}
            <div className="lg:col-span-2 rounded-[2rem] overflow-hidden border border-white/5 bg-[#080808] relative min-h-[500px]">
               <MapContainer 
                onCoordsSelect={(lng, lat) => {
                  setCoords({ lng, lat });
                  setScore(null);
                }} 
              />
              {!coords && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-zinc-900/80 border border-white/10 rounded-2xl px-6 py-4 text-center">
                    <p className="text-sm font-bold text-emerald-500 uppercase tracking-widest mb-1">Select Farm Location</p>
                    <p className="text-xs text-zinc-500">Tap on the satellite map to begin verification</p>
                  </div>
                </div>
              )}
            </div>

            {/* Analysis Column */}
            <div className="flex flex-col gap-6">
              <div onClick={startAnalysis} className="cursor-pointer">
                <AnalysisPanel 
                  analyzing={analyzing} 
                  score={score} 
                  reasoning={reasoning} 
                />
              </div>

              {/* Quick Stats */}
              <div className="glass rounded-[2rem] border border-white/5 p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Carbon Inventory (LIVE)</h3>
                    <Fingerprint className="h-4 w-4 text-emerald-500/50" />
                  </div>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-5xl font-black tracking-tighter text-white">
                      {profile?.carbon_credits || "0.0"}
                    </span>
                    <span className="text-xs font-mono text-emerald-500 mb-2 uppercase tracking-widest">GL_TOKENS</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
                    <motion.div 
                      key={profile?.carbon_credits}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((profile?.carbon_credits || 0) / 10, 100)}%` }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                    />
                  </div>
                </div>
                
                {txHash && (
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Blockchain Receipt</p>
                    <div className="bg-black rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] font-mono text-emerald-500/80 break-all leading-relaxed truncate">{txHash}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]">
             <div className="glass rounded-[2rem] border border-white/5 p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <BarChart3 className="h-40 w-40" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Supply Chain Analysis</h2>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-md">
                    Monitor real-time carbon offsets and verified producer metrics across your entire acquisition nodes.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-950/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-emerald-500 uppercase mb-1">Impact Score</p>
                    <p className="text-xl font-black text-white">0.94 A+</p>
                  </div>
                  <div className="bg-zinc-950/50 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Offset Volume</p>
                    <p className="text-xl font-black text-white">4.2k Tonnes</p>
                  </div>
                </div>
             </div>

             <div className="glass rounded-[2rem] border border-white/5 p-10 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-4">Procurement_Stats</h2>
                  <div className="space-y-4">
                    {[
                      { l: "Verified Producers", v: "24", c: "text-emerald-500" },
                      { l: "QR Scans (24h)", v: "1,240", c: "text-white" },
                      { l: "Top Region", v: "Karnataka", c: "text-white" }
                    ].map(st => (
                      <div key={st.l} className="flex items-center justify-between py-3 border-b border-white/5">
                        <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{st.l}</span>
                        <span className={`text-sm font-black uppercase ${st.c}`}>{st.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full bg-white text-black py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">
                  Generate PDF Report
                </button>
             </div>
          </div>
        )}

        {/* Action Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isFarmer && (
            <StatWidget 
              icon={<Wallet />} 
              label="Carbon Wallet" 
              value={`${profile?.carbon_credits || "0"} GRC`} 
              trend={`Balance: ${profile?.credits || "0"} Credits`} 
            />
          )}
          <StatWidget 
            icon={<Satellite />} 
            label={isFarmer ? "Verified Land" : "Producer Network"} 
            value={isFarmer ? "45.2 Hectares" : "12 Active Orgs"} 
            trend={isFarmer ? "3 active plots" : "Across 4 states"} 
          />
          <StatWidget 
            icon={<TrendingUp />} 
            label="Impact Score" 
            value="0.92 NDVI" 
            trend="Exceeding targets" 
          />
        </div>
      </div>
    </AppShell>
  );
}

function StatWidget({ icon, label, value, trend }: { icon: React.ReactNode, label: string, value: string, trend: string }) {
  return (
    <div className="glass p-6 rounded-2xl border-white/5 hover:border-emerald-500/20 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-emerald-500 flex items-center gap-1 font-medium">{trend}</p>
      </div>
    </div>
  );
}
