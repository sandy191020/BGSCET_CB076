"use client";

import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface AnalysisPanelProps {
  analyzing: boolean;
  score: number | null;
  reasoning: string;
}

export function AnalysisPanel({ analyzing, score, reasoning }: AnalysisPanelProps) {
  return (
    <div className="glass flex h-full flex-col rounded-2xl border border-white/10 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-emerald-500" />
          <h2 className="text-lg font-bold">Mastra AI Agent</h2>
        </div>
        {analyzing ? (
          <span className="flex items-center gap-2 text-xs font-medium text-emerald-400">
            <Loader2 className="h-3 w-3 animate-spin" />
            ANALYZING_BANDS...
          </span>
        ) : score !== null ? (
          <span className="text-xs font-mono text-emerald-500">STATUS: VERIFIED</span>
        ) : (
          <span className="text-xs font-mono text-zinc-500">IDLE</span>
        )}
      </div>

      <div className="flex-1 space-y-6">
        {analyzing ? (
          <div className="space-y-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-emerald-500/10" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-emerald-500/10" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-emerald-500/10" />
          </div>
        ) : score !== null ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center py-4">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-emerald-500/20">
                <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow" />
                <span className="text-4xl font-bold text-emerald-500">{(score * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-sm italic leading-relaxed text-emerald-100/80">
                "{reasoning}"
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>NDVI Confidence: High</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Fraud Mask: No Anomaly Detected</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-zinc-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Proof: Anchor #0x4...8b2</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center text-zinc-500">
            <AlertCircle className="mb-4 h-12 w-12 opacity-20" />
            <p className="text-sm">Select a farm on the map to begin AI verification.</p>
          </div>
        )}
      </div>

      <div className="mt-8 border-t border-white/5 pt-6">
        <button 
          disabled={analyzing || score !== null}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600"
        >
          {score !== null ? "Verification Complete" : "Analyze Farmland"}
        </button>
      </div>
    </div>
  );
}
