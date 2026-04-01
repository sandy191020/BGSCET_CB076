import { useState, useEffect } from "react";
import { MapContainer } from "@/components/map/MapContainer";
import { AnalysisPanel } from "@/components/dashboard/AnalysisPanel";
import { motion } from "framer-motion";
import { 
  Wallet, Satellite, BarChart3, Settings, LogOut, 
  LayoutDashboard, HelpCircle, ShieldAlert, Gavel, 
  Leaf, X, Globe, User, Bell, Fingerprint
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const reasoning = "AI confirmed dense, healthy vegetation (NDVI: 0.82). No industrial pesticide patterns detected. High carbon sequestration potential verified via Sentinel-2 satellite data.";

  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 p-6 flex flex-col bg-[#080808]">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">GreenLedger</span>
        </div>

        <div className="flex-1 space-y-8 overflow-y-auto">
          {/* Main Navigation */}
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">Marketplace_Core</p>
            <nav className="space-y-1">
              <NavItem icon={<LayoutDashboard className="h-4 w-4" />} label="Overview" active />
              <NavItem href="/#problem" icon={<ShieldAlert className="h-4 w-4" />} label="The Problem" />
              <NavItem href="/#how-it-works" icon={<HelpCircle className="h-4 w-4" />} label="How It Works" />
              <NavItem icon={<Satellite className="h-4 w-4" />} label="Verify Farm" />
              <NavItem href="/marketplace" icon={<Globe className="h-4 w-4" />} label="Marketplace" />
              <NavItem href="/admin/dashboard" icon={<Gavel className="h-4 w-4" />} label="Admin_Portal" />
            </nav>
          </div>

          {/* Wallet & Credits */}
          <div>
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-4 px-2">Assets_Wallet</p>
            <nav className="space-y-1">
              <NavItem icon={<Wallet className="h-4 w-4" />} label="Carbon Wallet" />
              <NavItem icon={<BarChart3 className="h-4 w-4" />} label="Analytics" />
            </nav>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 space-y-1 border-t border-white/5">
          <button 
            onClick={() => setShowSettings(true)}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="mb-8 flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-1">Farm Verification</h1>
            <p className="text-sm text-zinc-500 font-mono">NODE_STATUS: <span className="text-emerald-500">ACTIVE_HEALTHY</span> // SATELLITE: SENTINEL-2</p>
          </div>
          <div className="flex items-center gap-4">
            {status && (
              <div className="text-[10px] font-mono text-emerald-400 animate-pulse px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">
                {status}
              </div>
            )}
            <div className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5">
              <User className="h-5 w-5 text-zinc-400" />
            </div>
          </div>
        </div>

        <div className="grid h-[calc(100vh-180px)] grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Map Column */}
          <div className="lg:col-span-2 rounded-[2rem] overflow-hidden border border-white/5 bg-[#080808] relative">
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
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowSettings(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-xl glass rounded-[2.5rem] border-white/10 p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tighter">System Settings</h2>
              <button onClick={() => setShowSettings(false)} className="h-10 w-10 rounded-full hover:bg-white/5 flex items-center justify-center">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <SettingsOption icon={<Bell className="h-5 w-5" />} title="Notifications" desc="Manage alerts for auction starts and trade updates." />
              <SettingsOption icon={<ShieldAlert className="h-5 w-5" />} title="Security" desc="Multi-signature wallet and 2FA configurations." />
              <SettingsOption icon={<Globe className="h-5 w-5" />} title="Region" desc="Set your primary agricultural zone for credit calculations." />
            </div>

            <button 
              onClick={() => setShowSettings(false)}
              className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-bold hover:bg-emerald-400 transition-colors uppercase tracking-widest text-sm"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active = false, href = "#" }: { icon: React.ReactNode, label: string, active?: boolean, href?: string }) {
  return (
    <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
      active ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      {label}
    </Link>
  );
}

function SettingsOption({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group">
      <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="font-bold text-white mb-0.5">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
