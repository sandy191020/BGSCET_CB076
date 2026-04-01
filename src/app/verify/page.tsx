"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, Leaf, ArrowRight, CheckCircle, ExternalLink, Upload, RotateCcw } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AgentReasoning } from "../components/AgentReasoning";
import { DEMO_FARMS } from "../../../lib/constants";
import type { Farm, AgentResult } from "../../../lib/types";

// Dynamic import to avoid SSR issues with Leaflet
const FarmMap = dynamic(
  () => import("../components/FarmMap").then((m) => m.FarmMap),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-full bg-zinc-900 rounded-2xl border border-white/10">
      <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin" />
    </div>
  )}
);

type Step = "idle" | "verifying" | "verified" | "minting" | "minted";

const STEPS = ["Select Farm", "Verify", "Mint Credits", "Listed"] as const;

export default function VerifyPage() {
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [step, setStep] = useState<Step>("idle");
  const [reasoningLines, setReasoningLines] = useState<string[]>([]);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stepIndex = {
    idle: 0,
    verifying: 1,
    verified: 1,
    minting: 2,
    minted: 3,
  }[step];

  const handleReset = () => {
    abortRef.current?.abort();
    setStep("idle");
    setReasoningLines([]);
    setAgentResult(null);
    setTxHash(null);
    setMintError(null);
  };

  const handleVerify = useCallback(async () => {
    if (!selectedFarm) return;

    setStep("verifying");
    setReasoningLines([]);
    setAgentResult(null);
    setTxHash(null);
    setMintError(null);

    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/verify-farm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmCoordinates: {
            lat: selectedFarm.coordinates.lat,
            lng: selectedFarm.coordinates.lng,
          },
          farmSizeAcres: selectedFarm.sizeAcres,
          farmerId: selectedFarm.ownerId,
        }),
        signal: abortRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Verification request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalResult: AgentResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);

            if (parsed.step === "__RESULT__" && parsed.result) {
              finalResult = parsed.result;
            } else if (parsed.step === "__ERROR__") {
              throw new Error(parsed.message);
            } else if (parsed.message) {
              // Add a small delay between lines for dramatic effect
              await new Promise((r) => setTimeout(r, 100));
              setReasoningLines((prev) => [...prev, parsed.message]);
            }
          } catch (parseErr) {
            // ignore non-JSON lines
          }
        }
      }

      if (finalResult) {
        setAgentResult(finalResult);
      }
      setStep("verified");
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setReasoningLines((prev) => [...prev, `❌ Error: ${err.message}`]);
      setStep("verified");
    }
  }, [selectedFarm]);

  const handleMint = async () => {
    if (!agentResult || !selectedFarm) return;
    setStep("minting");
    setMintError(null);

    try {
      const res = await fetch("/api/mint-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmerId: selectedFarm.ownerId,
          farmId: selectedFarm.id,
          creditAmount: agentResult.creditAmount,
          satelliteHash: agentResult.imageHash,
          agentVerdict: agentResult,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Minting failed");
      }

      setTxHash(data.txHash);
      setStep("minted");
    } catch (err: any) {
      setMintError(err.message ?? "Minting failed");
      setStep("verified");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-16">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Farm Verification</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Select a farm → AI verifies via satellite → Mint your carbon credits
            </p>
          </div>
          {step !== "idle" && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:text-white hover:border-white/30 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-all duration-500 ${
                      i < stepIndex
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : i === stepIndex
                        ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                        : "border-zinc-700 bg-zinc-900 text-zinc-600"
                    }`}
                  >
                    {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap ${i <= stepIndex ? "text-emerald-400" : "text-zinc-600"}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 mb-4 transition-all duration-700 ${i < stepIndex ? "bg-emerald-500" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-320px)] min-h-[500px]">

          {/* Left: Farm Selector + Map */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Farm selector tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {DEMO_FARMS.map((farm) => (
                <button
                  key={farm.id}
                  onClick={() => {
                    setSelectedFarm(farm as Farm);
                    if (step === "minted") handleReset();
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                    selectedFarm?.id === farm.id
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate max-w-[140px]">{farm.name}</span>
                </button>
              ))}
            </div>

            {/* Map */}
            <div className="flex-1">
              <FarmMap selectedFarm={selectedFarm} className="h-full min-h-[340px]" />
            </div>

            {/* Verify button */}
            <button
              onClick={handleVerify}
              disabled={!selectedFarm || step === "verifying" || step === "minting"}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 py-3.5 text-base font-semibold text-white shadow-xl shadow-emerald-900/40 transition-all hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === "verifying" ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
                  />
                  Verifying Farm...
                </>
              ) : (
                <>
                  <Satellite className="h-5 w-5" />
                  Verify Farm
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {/* Right: Agent Reasoning Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <AgentReasoning
              lines={reasoningLines}
              isLoading={step === "verifying"}
              result={agentResult}
            />

            {/* Mint button — appears after verification */}
            <AnimatePresence>
              {step === "verified" && agentResult?.approved && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {mintError && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                      ❌ {mintError}
                    </div>
                  )}
                  <button
                    onClick={handleMint}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:text-emerald-300"
                  >
                    <Upload className="h-4 w-4" />
                    Mint {agentResult.creditAmount} Credits on Polygon
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success state after minting */}
            <AnimatePresence>
              {step === "minted" && txHash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">Credits Minted!</div>
                      <div className="text-xs text-zinc-500 font-mono mt-0.5 truncate max-w-[200px]">{txHash.slice(0, 20)}...</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://mumbai.polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-zinc-800 border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View on Polygonscan
                    </a>
                    <Link
                      href="/marketplace"
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/80 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      View on Marketplace
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
