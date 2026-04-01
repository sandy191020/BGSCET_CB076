"use client";

import React, { useState } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel";
import { motion } from "framer-motion";
import { 
  Wallet, Satellite, BarChart3, Fingerprint, ShieldAlert, X, Bell, User, Globe, HelpCircle
} from "lucide-react";
import { AppShell } from "@/components/AppShell";

export default function Dashboard() {
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const startAnalysis = async () => {
    if (!coords) return;
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
    setStatus("MINTING_ERC1155_ON_POLYGON...");
    await new Promise(r => setTimeout(r, 2500));
    const mockTx = "0x" + Math.random().toString(16).substring(2, 66);
    setTxHash(mockTx);
    setAnalyzing(false);
    setStatus(null);
  };

  const reasoning = "AI confirmed dense, healthy vegetation (NDVI: 0.82). No industrial pesticide patterns detected. High carbon sequestration potential verified via Sentinel-2 satellite data.";

  return (
    <AppShell>
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Farm Verification</h1>
            <p className="text-sm text-zinc-500 font-mono">NODE_STATUS: <span className="text-emerald-500">ACTIVE_HEALTHY</span> // SATELLITE: SENTINEL-2</p>
          </div>
          {status && (
            <div className="text-[10px] font-mono text-emerald-400 animate-pulse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">
              {status}
            </div>
          )}
        </div>

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
                  <p className="text-xs text-zinc-500">Tap on the satellite map to begin</p>
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
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em]">Carbon Inventory</h3>
                  <Fingerprint className="h-4 w-4 text-emerald-500/50" />
                </div>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-black tracking-tighter text-white">
                    {score ? (score * 15.5).toFixed(1) : "12.5"}
                  </span>
                  <span className="text-xs font-mono text-emerald-500 mb-2 uppercase tracking-widest">GL_TOKENS</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-900 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400" 
                  />
                </div>
              </div>
              
              {txHash && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Blockchain Receipt</p>
                  <div className="bg-black rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] font-mono text-emerald-500/80 break-all leading-relaxed">{txHash}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatWidget icon={<Wallet />} label="Carbon Wallet" value="1,240.50 GRC" trend="+12.5% this month" />
          <StatWidget icon={<Satellite />} label="Verified Land" value="45.2 Hectares" trend="3 active plots" />
          <StatWidget icon={<BarChart3 />} label="Impact Score" value="0.92 NDVI" trend="Exceeding targets" />
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
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-emerald-500 flex items-center gap-1">{trend}</p>
      </div>
    </div>
  );
}
