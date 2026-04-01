"use client";

import { motion } from "framer-motion";
import { Leaf, ShoppingCart, ExternalLink, TrendingUp } from "lucide-react";
import { ethers } from "ethers";
import type { Listing } from "../../../lib/types";
import { DEMO_FARMS, IPFS_GATEWAY, EXPLORER_URL } from "../../../lib/constants";

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

  const priceEth = typeof listing.pricePerToken === "string"
    ? listing.pricePerToken
    : ethers.formatEther(listing.pricePerToken as any);

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "Unknown";

  const getNdviColor = (score: number) => {
    if (score >= 0.75) return "text-emerald-400";
    if (score >= 0.55) return "text-yellow-400";
    return "text-red-400";
  };

  const getNdviLabel = (score: number) => {
    if (score >= 0.75) return "Dense Healthy";
    if (score >= 0.55) return "Moderate";
    return "Sparse";
  };

  const imageUrl = imageHash?.startsWith("Qm")
    ? `${IPFS_GATEWAY}${imageHash}`
    : `https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&q=80`;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl border border-white/10 bg-zinc-900 overflow-hidden hover:border-emerald-500/30 transition-colors"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-zinc-800">
        <img
          src={imageUrl}
          alt={farmName}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1500076656116-558758c991c1?w=400&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        {/* NDVI Badge */}
        <div className={`absolute top-3 right-3 flex items-center gap-1 rounded-full border bg-black/60 px-2.5 py-1 text-xs font-mono font-semibold backdrop-blur-sm ${getNdviColor(ndviScore)} border-current/20`}>
          <TrendingUp className="h-3 w-3" />
          NDVI {ndviScore.toFixed(2)}
        </div>

        {/* Amount badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-sm">
          <Leaf className="h-3 w-3" />
          {listing.amount} credits
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <h3 className="font-semibold text-white text-sm leading-tight">{farmName}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{sizeAcres} acres · {getNdviLabel(ndviScore)} vegetation</p>
        </div>

        {/* Seller */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Seller</span>
          <span className="font-mono text-zinc-400">{truncateAddress(listing.seller)}</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500">Price / credit</span>
          <div className="text-right">
            <span className="font-bold text-white font-mono">{Number(priceEth).toFixed(4)}</span>
            <span className="text-emerald-500 text-xs font-mono ml-1">MATIC</span>
          </div>
        </div>

        {/* Buy button */}
        <button
          onClick={() => onBuy(listing)}
          disabled={isBuying || !listing.active}
          className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/30"
        >
          {isBuying ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
              />
              Purchasing...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              Buy Credits
            </>
          )}
        </button>

        {/* Tx link */}
        {txHash && (
          <a
            href={`${EXPLORER_URL}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            View transaction
          </a>
        )}
      </div>
    </motion.div>
  );
}
