"use client";

import { motion } from "framer-motion";
import { Leaf, ShoppingCart, ExternalLink, TrendingUp, ShieldCheck } from "lucide-react";
import { formatEther } from "viem";
import type { Listing } from "../../lib/types";
import { DEMO_FARMS, IPFS_GATEWAY, EXPLORER_URL } from "../../lib/constants";

interface CreditCardProps {
  listing: Listing & {
    farmName?: string;
    ndviScore?: number;
    imageHash?: string;
    sizeAcres?: number;
  };
  onBuy: (listing: Listing) => void;
  isBuying?: boolean;
  txHash?: string;
}

export function CreditCard({ listing, onBuy, isBuying, txHash }: CreditCardProps) {
  const farm = DEMO_FARMS.find((f) => f.id === listing.farmId);
  const farmName = listing.farmName ?? farm?.name ?? `Farm #${listing.farmId}`;
  const ndviScore = listing.ndviScore ?? farm?.ndviScore ?? 0.7;
  const imageHash = listing.imageHash ?? farm?.imageHash;
  const sizeAcres = listing.sizeAcres ?? farm?.sizeAcres ?? 10;

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Unknown";

  const getNdviColor = (score: number) => {
    if (score >= 0.75) return "text-emerald-400";
    if (score >= 0.55) return "text-yellow-400";
    return "text-red-400";
  };

  const getNdviLabel = (score: number) => {
    if (score >= 0.75) return "Prime Growth";
    if (score >= 0.55) return "Stable";
    return "Stressed";
  };

  const imageUrl = imageHash?.startsWith("Qm")
    ? `${IPFS_GATEWAY}${imageHash}`
    : `https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80`;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative flex flex-col rounded-[2.5rem] border border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden hover:border-emerald-500/20 transition-all duration-500 shadow-2xl"
    >
      {/* Visual Header */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={imageUrl}
          alt={farmName}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        
        {/* Verification Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-500 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          AI_Verified
        </div>

        {/* NDVI Score Floating */}
        <div className="absolute bottom-6 right-6 flex flex-col items-end">
          <div className="flex items-center gap-2 mb-1">
             <TrendingUp className={`h-4 w-4 ${getNdviColor(ndviScore)}`} />
             <span className={`text-xl font-black ${getNdviColor(ndviScore)} font-mono`}>{ndviScore.toFixed(2)}</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{getNdviLabel(ndviScore)}</span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-8 space-y-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-1 truncate">{farmName}</h3>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <span>{sizeAcres} Acres</span>
            <span className="h-1 w-1 rounded-full bg-zinc-800" />
            <span>Polygon Network</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Available</p>
            <p className="text-lg font-black text-white">{listing.amount} <span className="text-[10px] text-zinc-500">TONS</span></p>
          </div>
          <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">Unit Price</p>
            <p className="text-lg font-black text-emerald-500">{listing.pricePerToken} <span className="text-[10px] text-emerald-500/50">MATIC</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Producer Node</span>
            <span className="text-[10px] font-mono font-bold text-zinc-400">{truncateAddress(listing.seller)}</span>
          </div>

          <button
            onClick={() => onBuy(listing)}
            disabled={isBuying || !listing.active}
            className="w-full relative group/btn h-14 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-all active:scale-[0.98] disabled:opacity-20 shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isBuying ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full"
                  />
                  Broadcasting...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Acquire Credits
                </>
              )}
            </span>
          </button>

          {txHash && (
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors py-2"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Verifiable Receipt
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
