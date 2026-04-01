"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Wallet, CheckCircle, X, Search, Zap, Globe, Info } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { CreditCard } from "./CreditCard";
import type { Listing } from "../../lib/types";
import { DEMO_FARMS } from "../../lib/constants";
import { supabase } from "../lib/supabase/client";

interface MarketplaceProps {
  initialListings?: Listing[];
}

// Default demo listings if none provided
const DEFAULT_DEMO_LISTINGS: Listing[] = [
  {
    listingId: 1,
    tokenId: 1,
    farmId: 1,
    seller: "0x1234567890123456789012345678901234567890",
    amount: 50,
    pricePerToken: "0.012",
    active: true,
  },
  {
    listingId: 2,
    tokenId: 2,
    farmId: 2,
    seller: "0x2345678901234567890123456789012345678901",
    amount: 75,
    pricePerToken: "0.015",
    active: true,
  },
];

type FilterType = "all" | "ndvi-high" | "price-low" | "price-high";

export function Marketplace({ initialListings }: MarketplaceProps) {
  const [listings, setListings] = useState<Listing[]>(initialListings || []);
  const [loading, setLoading] = useState(!initialListings);
  const [filter, setFilter] = useState<FilterType>("all");
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [txHashes, setTxHashes] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Wagmi hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    if (!initialListings) {
      fetchListings();
    }
  }, [initialListings]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('carbon_listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map supabase data to Listing interface
      const mappedListings = (data || []).map((l: any) => ({
        listingId: l.id,
        tokenId: l.token_id,
        farmId: l.farm_id,
        seller: l.seller_address,
        amount: l.amount,
        pricePerToken: l.price_per_credit.toString(),
        active: true,
        farmName: l.farm_name,
        ndviScore: l.ndvi_score,
        imageHash: l.image_hash,
      }));

      setListings(mappedListings.length > 0 ? mappedListings : DEFAULT_DEMO_LISTINGS);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setListings(DEFAULT_DEMO_LISTINGS);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleBuy = useCallback(async (listing: Listing) => {
    if (!isConnected) {
      showToast("Please connect your wallet first", "error");
      return;
    }
    
    setBuyingId(listing.listingId);
    try {
      const response = await fetch("/api/buy-carbon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.listingId,
          buyerId: address,
          amount: listing.amount
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setTxHashes((prev) => ({ ...prev, [listing.listingId]: result.txHash }));
        showToast(`Transaction successful! Broadcashed to Polygon Explorer.`);
        fetchListings(); // Refresh
      } else {
        throw new Error(result.error || "Purchase failed");
      }
    } catch (err: any) {
      showToast(err.message ?? "Purchase failed", "error");
    } finally {
      setBuyingId(null);
    }
  }, [isConnected, address]);

  const filteredListings = [...listings].sort((a: any, b: any) => {
    if (filter === "ndvi-high") return (b.ndviScore || 0) - (a.ndviScore || 0);
    if (filter === "price-low") return Number(a.pricePerToken) - Number(b.pricePerToken);
    if (filter === "price-high") return Number(b.pricePerToken) - Number(a.pricePerToken);
    return 0;
  });

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: "All Entries", value: "all" },
    { label: "Highest NDVI", value: "ndvi-high" },
    { label: "Price: Low to High", value: "price-low" },
    { label: "Price: High to Low", value: "price-high" },
  ];

  return (
    <div className="space-y-12">
      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-white/5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <Filter className="h-4 w-4 text-emerald-500/50" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Filters_Engine</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`group relative h-10 px-5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === opt.value
                    ? "bg-white text-black"
                    : "bg-zinc-950 border border-white/5 text-zinc-500 hover:text-white hover:border-emerald-500/20"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Status */}
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-2 px-4 group hover:border-emerald-500/40 transition-colors">
               <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
               <span className="text-[11px] font-mono font-black text-emerald-500">
                 {address?.slice(0, 6)}...{address?.slice(-4)}
               </span>
               <button 
                 onClick={() => disconnect()}
                 className="opacity-0 group-hover:opacity-100 transition-opacity"
               >
                 <X className="h-3 w-3 text-emerald-500" />
               </button>
            </div>
          ) : (
            <button
              onClick={() => connect({ connector: injected() })}
              className="group flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-black hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-2xl shadow-emerald-500/10"
            >
              <Wallet className="h-4 w-4" />
              Connect Exchange Node
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
             className="h-12 w-12 border-b-2 border-emerald-500 rounded-full mx-auto"
           />
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">Syncing with Greenhouse Ledger...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="py-40 text-center">
           <Globe className="h-16 w-16 text-zinc-900 mx-auto mb-6" />
           <p className="text-zinc-600 font-black uppercase tracking-widest text-xs">No active nodes in current pool</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredListings.map((listing, i) => (
              <motion.div
                key={listing.listingId}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              >
                <CreditCard
                  listing={listing as any}
                  onBuy={handleBuy}
                  isBuying={buyingId === listing.listingId}
                  txHash={txHashes[listing.listingId]}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modern Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            className={`fixed bottom-8 right-8 z-[200] flex items-center gap-4 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl border ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-200"
                : "bg-red-500/10 border-red-500/20 text-red-200"
            }`}
          >
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
               toast.type === "success" ? "bg-emerald-500 text-black" : "bg-red-500 text-white"
            }`}>
               {toast.type === "success" ? <CheckCircle className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </div>
            <div className="pr-4">
               <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{toast.type === "success" ? "Node Sync Complete" : "Critical System Error"}</p>
               <p className="text-xs font-medium opacity-80">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="opacity-40 hover:opacity-100 transition-opacity">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
