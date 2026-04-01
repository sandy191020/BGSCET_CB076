"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { AgentResult } from "../../../lib/types";

interface AgentReasoningProps {
  lines: string[];
  isLoading: boolean;
  result: AgentResult | null;
}

export function AgentReasoning({ lines, isLoading, result }: AgentReasoningProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const getLineColor = (line: string) => {
    if (line.startsWith("✅")) return "text-emerald-400";
    if (line.startsWith("❌")) return "text-red-400";
    if (line.startsWith("⚠️")) return "text-yellow-400";
    if (line.startsWith("🛰️") || line.startsWith("📡") || line.startsWith("🔬") ||
        line.startsWith("🔍") || line.startsWith("🧮") || line.startsWith("⚖️") ||
        line.startsWith("📤")) return "text-sky-400";
    if (line.startsWith("APPROVED")) return "text-emerald-300";
    if (line.startsWith("REJECTED")) return "text-red-300";
    return "text-zinc-300";
  };

  const fraudRiskColor = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    high: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const ndvi = result?.ndviScore ?? 0;
  const ndviPercent = Math.round(ndvi * 100);

  const getNdviBarColor = (score: number) => {
    if (score >= 0.75) return "from-emerald-500 to-emerald-400";
    if (score >= 0.55) return "from-yellow-500 to-yellow-400";
    return "from-red-500 to-red-400";
  };

  const calcLine = lines.find(l => l.includes("Farm size:"));
  const vegetationLine = lines.find(l => l.includes("Vegetation density index"));

  return (
    <div className="flex flex-col h-full rounded-2xl border border-emerald-500/20 bg-zinc-950 overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
        </div>
        <span className="ml-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          FarmVerificationAgent v1.0.0
        </span>
        {isLoading && (
          <span className="ml-auto flex items-center gap-1.5 text-xs font-mono text-emerald-400 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            RUNNING
          </span>
        )}
        {!isLoading && lines.length > 0 && (
          <span className="ml-auto text-xs font-mono text-zinc-500">COMPLETED</span>
        )}
      </div>

      {/* Terminal Body */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1 min-h-[280px] max-h-[360px]">
        {lines.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-600">
            <svg className="h-10 w-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xs uppercase tracking-wider">Select a farm & click Verify Farm to begin</span>
          </div>
        )}

        {isLoading && lines.length === 0 && (
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="animate-spin">⠋</span>
            <span>Initializing agent...</span>
          </div>
        )}

        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex gap-2 leading-relaxed ${getLineColor(line)}`}
            >
              <span className="text-zinc-600 select-none shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <span>{line}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && lines.length > 0 && (
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-emerald-400 font-mono"
          >
            █
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Results Panel */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-white/10 p-4 space-y-4 bg-zinc-900/50"
          >
            {/* NDVI Score Bar + Detailed Reasoning */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-500 uppercase tracking-wider">NDVI Score</span>
                  <span className={ndvi >= 0.75 ? "text-emerald-400" : ndvi >= 0.55 ? "text-yellow-400" : "text-red-400"}>
                    {ndvi.toFixed(2)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${getNdviBarColor(ndvi)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${ndviPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Detailed Reasoning Block */}
              {result.approved && (vegetationLine || calcLine) && (
                <div className="bg-black/40 border border-white/5 rounded-lg p-3 space-y-2 mt-2">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">AI Reasoning Breakdown</div>
                  {vegetationLine && (
                    <div className="text-[11px] text-zinc-300 font-mono leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500/50 mt-0.5">└</span>
                      <span>{vegetationLine.replace("✅", "").trim()}</span>
                    </div>
                  )}
                  {calcLine && (
                    <div className="text-[11px] text-zinc-300 font-mono leading-relaxed flex items-start gap-2">
                      <span className="text-emerald-500/50 mt-0.5">└</span>
                      <span>{calcLine.replace("✅", "").trim()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Fraud Risk + Credits */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono uppercase">Fraud Risk</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border font-mono uppercase ${fraudRiskColor[result.fraudRisk]}`}>
                  {result.fraudRisk}
                </span>
              </div>
            </div>

            {/* Final Verdict */}
            <div className={`rounded-xl border p-4 text-center ${result.approved ? "border-emerald-500/30 bg-emerald-500/5" : "border-red-500/30 bg-red-500/5"}`}>
              <div className={`text-3xl font-bold font-mono ${result.approved ? "text-emerald-400" : "text-red-400"}`}>
                {result.approved ? "✅ APPROVED" : "❌ REJECTED"}
              </div>
              {result.approved && (
                <div className="mt-1 text-xl font-bold text-white">
                  {result.creditAmount} <span className="text-emerald-500 text-sm font-mono">Carbon Credits</span>
                </div>
              )}
              {!result.approved && (
                <div className="mt-1 text-sm text-red-400 font-mono">Insufficient vegetation or fraud detected</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
