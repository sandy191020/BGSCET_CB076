"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight, Activity, Fingerprint, Coins, ShieldCheck, Zap, Unplug, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useAccount, useConnect, useDisconnect, useReadContract, useReadContracts } from 'wagmi';
import { injected } from 'wagmi/connectors';

const CCT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "account", "type": "address" },
      { "internalType": "uint256", "name": "id", "type": "uint256" }
    ],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function WalletPage() {
  const { address: metamaskAddress, isConnected: isMetaMaskConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [walletConnected, setWalletConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [dbBalance, setDbBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Read balance for demo ID (e.g., Farm ID 1 or current farm context)
  // For production, we would use an indexer or query all farm IDs the user owns
  const { data: onChainBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CCT_ABI,
    functionName: 'balanceOf',
    args: metamaskAddress ? [metamaskAddress, BigInt(1)] : undefined,
    query: {
      enabled: !!metamaskAddress,
    }
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setWalletConnected(true);
      fetchWalletData(user.id);
    } else {
      setLoading(false);
    }
  };

  const handleConnectAuth = async () => {
    window.location.href = "/auth";
  };

  const handleConnectMetaMask = () => {
    connect({ connector: injected() });
  };

  const fetchWalletData = async (userId: string) => {
    setLoading(true);
    try {
      const { data: txData } = await supabase
        .from("transactions")
        .select("*")
        .or(`buyer_id.eq.${userId},farmer_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      const { data: rewardData } = await supabase
        .from("farmer_rewards")
        .select("*")
        .eq("farmer_id", userId)
        .order("created_at", { ascending: false });

      const combinedTxs: any[] = [];
      let currentBalance = 0;

      txData?.forEach(tx => {
        const isReceive = tx.farmer_id === userId;
        const amount = Number(tx.amount);
        combinedTxs.push({
          id: tx.id,
          type: isReceive ? "receive" : "send",
          amount: `${isReceive ? "+" : "-"} ${amount} CCT`,
          rawAmount: isReceive ? amount : -amount,
          date: new Date(tx.created_at).toLocaleString(),
          status: "Confirmed",
          hash: tx.id.split('-')[0],
          from: isReceive ? "Marketplace Purchase" : "CCT Retirement/Transfer"
        });
        currentBalance += isReceive ? amount : -amount;
      });

      rewardData?.forEach(reward => {
        const amount = Number(reward.amount);
        combinedTxs.push({
          id: reward.id,
          type: "receive",
          amount: `+ ${amount} CCT`,
          rawAmount: amount,
          date: new Date(reward.created_at).toLocaleString(),
          status: "Confirmed",
          hash: reward.id.split('-')[0],
          from: "Agronomic Verification Reward"
        });
        currentBalance += amount;
      });

      combinedTxs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(combinedTxs);
      setDbBalance(currentBalance);
    } catch (error) {
      console.error("Error fetching wallet data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Determine which balance to show
  const displayBalance = isMetaMaskConnected && onChainBalance !== undefined 
    ? Number(onChainBalance) 
    : dbBalance;

  return (
    <AppShell>
      <div className="p-8 max-w-6xl mx-auto space-y-12 mb-20">
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-emerald-500">
              <Wallet className="h-4 w-4" />
              Asset Management
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">
              Carbon <span className="text-emerald-500">Wallet</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm max-w-2xl leading-relaxed">
              Secure custody and tracking of your verified Carbon Credit Tokens (CCT).
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {!walletConnected ? (
              <button 
                onClick={handleConnectAuth}
                className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-[0.98]"
              >
                <Fingerprint className="h-4 w-4" />
                Login Identity
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-zinc-900/50 border border-white/5 py-3 px-6 rounded-3xl">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-zinc-400">Node: {user?.id.slice(0, 8)}...</span>
              </div>
            )}

            {!isMetaMaskConnected ? (
              <button 
                onClick={handleConnectMetaMask}
                className="flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-[0_0_30px_rgba(16,185,129,0.2)]"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Alpha_color.svg" className="h-4 w-4" alt="MetaMask" />
                Connect MetaMask
              </button>
            ) : (
              <button 
                onClick={() => disconnect()}
                className="flex items-center gap-3 bg-orange-500/10 text-orange-500 border border-orange-500/20 px-6 py-3 rounded-3xl group transition-all hover:bg-orange-500/20"
              >
                <div className="h-2 w-2 rounded-full bg-orange-500" />
                <span className="text-xs font-mono font-bold">{metamaskAddress?.slice(0, 6)}...{metamaskAddress?.slice(-4)}</span>
                <Unplug className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </div>
        </section>

        {walletConnected || isMetaMaskConnected ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Balance Card */}
            <div className="col-span-1 lg:col-span-2 glass p-10 rounded-[3rem] border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 to-zinc-950/80 relative overflow-hidden group hover:border-emerald-500/40 transition-colors shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
              <p className="text-xs font-black text-emerald-500/70 uppercase tracking-[0.2em] mb-2 relative z-10 flex items-center gap-2">
                <Coins className="h-4 w-4" /> {isMetaMaskConnected ? "On-Chain Verified Balance" : "Database Synchronized Balance"}
              </p>
              <div className="flex items-baseline gap-4 relative z-10">
                <h2 className="text-7xl font-black text-white tracking-tighter">{displayBalance.toLocaleString()}</h2>
                <span className="text-2xl font-black text-emerald-500 tracking-widest">CCT</span>
              </div>
              <p className="text-sm font-bold text-zinc-500 mt-4 relative z-10">~ ₹ {(displayBalance * 20).toLocaleString()} INR Equivalent</p>
              
              <div className="flex gap-4 mt-12 relative z-10">
                <button className="flex-1 bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <ArrowDownRight className="h-4 w-4" /> Receive Assets
                </button>
                <button className="flex-1 bg-zinc-900 border border-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                  <ArrowUpRight className="h-4 w-4" /> Transfer Tokens
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4 flex flex-col justify-between">
              <div className="glass p-6 rounded-3xl border border-white/5 bg-zinc-950/30 flex items-center justify-between group hover:border-white/10 transition-colors">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Blockchain Network</p>
                  <p className="text-xl font-black text-white">{isMetaMaskConnected ? "Hardhat Node" : "Off-chain"}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/5 group-hover:text-white transition-colors">
                  <Activity className="h-5 w-5" />
                </div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/5 bg-zinc-950/30 flex items-center justify-between group hover:border-white/10 transition-colors">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Protocol Staking</p>
                  <p className="text-xl font-black text-emerald-500">+4.2% APY</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
              </div>
              <div className="glass p-6 rounded-3xl border border-white/5 bg-zinc-950/30 flex items-center justify-between group hover:border-white/10 transition-colors">
                <div>
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Identity Trust</p>
                  <p className="text-xl font-black text-white">{user ? "Level 3" : "Level 1"}</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-green-500 border border-white/5 group-hover:border-green-500/20 transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="col-span-1 lg:col-span-3 glass rounded-[3rem] border border-white/5 bg-zinc-950/30 p-10 overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black uppercase tracking-tighter text-white">Recent Transactions</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Show:</span>
                    <button className="text-[10px] font-black text-emerald-500 uppercase tracking-widest underline decoration-2 underline-offset-4">Database</button>
                    <button className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white-400">Blockchain</button>
                  </div>
               </div>
               
               <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                 <AnimatePresence mode="popLayout">
                   {transactions.length > 0 ? (
                     transactions.map((tx) => (
                       <motion.div 
                         layout
                         initial={{ opacity: 0, x: -20 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, scale: 0.9 }}
                         key={tx.id} 
                         className="flex items-center justify-between p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-white/10 transition-colors group cursor-pointer"
                       >
                          <div className="flex items-center gap-6">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center border shadow-lg ${
                              tx.type === 'receive' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                              {tx.type === 'receive' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-wider">{tx.from}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{tx.date}</span>
                                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                                <span className="text-[10px] font-mono text-zinc-600 group-hover:text-zinc-400 transition-colors">HEX {tx.hash}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-lg font-black tracking-tighter ${tx.type === 'receive' ? 'text-emerald-500' : 'text-white'}`}>{tx.amount}</p>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-1">{tx.status}</p>
                          </div>
                       </motion.div>
                     ))
                   ) : (
                     <div className="text-center py-20 opacity-50 font-black uppercase tracking-widest text-xs">
                       Initialization pending. Awaiting network synchronization...
                     </div>
                   )}
                 </AnimatePresence>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-[3rem] border border-white/5 bg-zinc-950/30 p-20 text-center flex flex-col items-center shadow-xl"
          >
            <div className="h-24 w-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 shadow-inner">
              <Wallet className="h-10 w-10 text-zinc-600" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-400 mb-4">No Verified Account Linked</h2>
            <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest max-w-md mx-auto leading-relaxed">
              Connect your MetaMask wallet or sign in with your decentralized identity node to view your verified Carbon Credit Token (CCT) portfolio.
            </p>
            <div className="mt-10 flex gap-4">
               <button onClick={handleConnectMetaMask} className="flex items-center gap-3 bg-emerald-500 text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all">
                  Connect Wallet
               </button>
               <button onClick={handleConnectAuth} className="flex items-center gap-3 bg-white/5 text-white border border-white/10 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                  Sign In
               </button>
            </div>
          </motion.div>
        )}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.5);
        }
      `}</style>
    </AppShell>
  );
}
