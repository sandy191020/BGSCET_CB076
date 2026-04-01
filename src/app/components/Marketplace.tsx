"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Wallet, CheckCircle, X } from "lucide-react";
import { CreditCard } from "./CreditCard";
import type { Listing } from "../../../lib/types";
import { DEMO_FARMS } from "../../../lib/constants";


interface MarketplaceProps {
  listings: Listing[];
}

// Demo listings with enriched farm data
const DEMO_LISTINGS: (Listing & { farmName?: string; ndviScore?: number; imageHash?: string; sizeAcres?: number })[] = [
  {
    listingId: 1,
    tokenId: 1,
    farmId: 1,
    seller: "0x1234567890123456789012345678901234567890",
    amount: 50,
    pricePerToken: "0.012",
    active: true,
    farmName: DEMO_FARMS[0].name,
    ndviScore: DEMO_FARMS[0].ndviScore,
    imageHash: DEMO_FARMS[0].imageHash,
    sizeAcres: DEMO_FARMS[0].sizeAcres,
  },
  {
    listingId: 2,
    tokenId: 2,
    farmId: 2,
    seller: "0x2345678901234567890123456789012345678901",
    amount: 75,
    pricePerToken: "0.015",
    active: true,
    farmName: DEMO_FARMS[1].name,
    ndviScore: DEMO_FARMS[1].ndviScore,
    imageHash: DEMO_FARMS[1].imageHash,
    sizeAcres: DEMO_FARMS[1].sizeAcres,
  },
  {
    listingId: 3,
    tokenId: 3,
    farmId: 3,
    seller: "0x3456789012345678901234567890123456789012",
    amount: 40,
    pricePerToken: "0.018",
    active: true,
    farmName: DEMO_FARMS[2].name,
    ndviScore: DEMO_FARMS[2].ndviScore,
    imageHash: DEMO_FARMS[2].imageHash,
    sizeAcres: DEMO_FARMS[2].sizeAcres,
  },
];

type FilterType = "all" | "ndvi-high" | "price-low" | "price-high";

export function Marketplace({ listings }: MarketplaceProps) {
  const enrichedListings = listings.length > 0 ? listings : DEMO_LISTINGS;

  const [filter, setFilter] = useState<FilterType>("all");
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [txHashes, setTxHashes] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const connectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        showToast("MetaMask not found. Please install MetaMask.", "error");
        return;
      }
      const accounts: string[] = await (window as any).ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      showToast(`Wallet connected: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
    } catch {
      showToast("Wallet connection rejected", "error");
    }
  };

  const handleBuy = useCallback(async (listing: Listing) => {
    setBuyingId(listing.listingId);
    try {
      // Demo mode: simulate buy
      await new Promise((r) => setTimeout(r, 2000));
      const mockTx = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")}`;
      setTxHashes((prev) => ({ ...prev, [listing.listingId]: mockTx }));
      showToast(`✅ Purchased ${listing.amount} credits! Tx: ${mockTx.slice(0, 10)}...`);
    } catch (err: any) {
      showToast(err.message ?? "Purchase failed", "error");
    } finally {
      setBuyingId(null);
    }
  }, []);

  const filteredListings = [...(enrichedListings as any[])].sort((a, b) => {
    if (filter === "ndvi-high") return ((b.ndviScore ?? 0) as number) - ((a.ndviScore ?? 0) as number);
    if (filter === "price-low") return Number(a.pricePerToken) - Number(b.pricePerToken);
    if (filter === "price-high") return Number(b.pricePerToken) - Number(a.pricePerToken);
    return 0;
  }).filter((l: any) => l.active) as typeof enrichedListings;

  const filterOptions: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Highest NDVI", value: "ndvi-high" },
    { label: "Price: Low → High", value: "price-low" },
    { label: "Price: High → Low", value: "price-high" },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-zinc-400" />
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  filter === opt.value
                    ? "bg-emerald-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet */}
        {walletAddress ? (
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-1.5 text-xs font-mono text-emerald-400">
            <CheckCircle className="h-3 w-3" />
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 rounded-full bg-zinc-800 border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
          >
            <Wallet className="h-3.5 w-3.5" />
            Connect Wallet
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredListings.map((listing, i) => (
            <motion.div
              key={listing.listingId}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ delay: i * 0.08 }}
            >
              <CreditCard
                listing={listing}
                onBuy={handleBuy}
                isBuying={buyingId === listing.listingId}
                txHash={txHashes[listing.listingId]}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-4 py-3 shadow-xl text-sm font-medium max-w-sm ${
              toast.type === "success"
                ? "bg-emerald-900/90 border border-emerald-500/30 text-emerald-200"
                : "bg-red-900/90 border border-red-500/30 text-red-200"
            } backdrop-blur-sm`}
          >
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)} className="shrink-0 opacity-60 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
