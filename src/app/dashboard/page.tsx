"use client";

import { useState } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel";
import { Wallet, Satellite, BarChart3, Settings, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";

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
    
    // 1. AI Analysis
    await new Promise(r => setTimeout(r, 2000));
    setStatus("ANALYZING_SATELLITE_BANDS...");
    await new Promise(r => setTimeout(r, 2000));
    const finalScore = 0.82;
    setScore(finalScore);
    
    // 2. IPFS Upload
    setStatus("UPLOADING_PROOF_TO_IPFS...");
    await new Promise(r => setTimeout(r, 1500));
    const ipfsHash = `ipfs://Qm${Math.random().toString(36).substring(7)}`;
    
    // 3. Blockchain Minting
    setStatus("MINTING_ERC1155_ON_POLYGON...");
    await new Promise(r => setTimeout(r, 2500));
    const mockTx = "0x" + Math.random().toString(16).substring(2, 66);
    setTxHash(mockTx);
    
    setAnalyzing(false);
    setStatus(null);
  };

  const reasoning = "AI confirmed dense, healthy vegetation (NDVI: 0.82) based on NIR and Red band analysis. No industrial pesticide patterns detected. High carbon sequestration potential verified via Sentinel-2 satellite data.";

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/40">
            <Satellite className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight">GreenLedger</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" active />
          <NavItem icon={<Satellite className="h-4 w-4" />} label="Farm Analysis" />
          <NavItem icon={<Wallet className="h-4 w-4" />} label="Carbon Wallet" />
          <NavItem icon={<BarChart3 className="h-4 w-4" />} label="Marketplace" />
        </nav>

        <div className="mt-auto space-y-1">
          <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
          <NavItem icon={<LogOut className="h-4 w-4 text-red-400" />} label="Logout" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Farm Verification</h1>
            <p className="text-sm text-zinc-400">Satellite-linked carbon credit minting dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <div className="text-xs font-mono text-emerald-400 animate-pulse uppercase">
                {status}
              </div>
            )}
            <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-medium text-emerald-400">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM_SECURE
            </div>
          </div>
        </div>

        <div className="grid h-[calc(100vh-180px)] grid-cols-3 gap-8">
          {/* Map Column */}
          <div className="col-span-2 space-y-6">
            <div className="h-full">
              <MapContainer 
                onCoordsSelect={(lng, lat) => {
                  setCoords({ lng, lat });
                  setScore(null);
                }} 
              />
            </div>
          </div>

          {/* Analysis Column */}
          <div className="flex flex-col gap-6">
            <div onClick={startAnalysis} className="cursor-pointer h-full">
              <AnalysisPanel 
                analyzing={analyzing} 
                score={score} 
                reasoning={reasoning} 
              />
            </div>

            {/* Quick Stats */}
            <div className="glass rounded-2xl border border-white/10 p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Your Credits</h3>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-emerald-500">{score ? (score * 15.5).toFixed(1) : "12.5"}</span>
                <span className="text-xs text-zinc-500 mb-1">C02_TOKENS</span>
              </div>
              <div className="h-1 w-full rounded-full bg-zinc-800">
                <div className="h-full w-3/4 rounded-full bg-emerald-500" />
              </div>
              {txHash && (
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-[10px] font-mono text-zinc-500 truncate">TX: {txHash}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href="#" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
      {icon}
      {label}
    </Link>
  );
}
