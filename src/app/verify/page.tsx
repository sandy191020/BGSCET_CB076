"use client";

import React, { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, Leaf, ArrowRight, CheckCircle, ExternalLink, Upload, RotateCcw } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AgentReasoning } from "../components/AgentReasoning";
import { DEMO_FARMS } from "../../../lib/constants";
import type { Farm, AgentResult } from "../../../lib/types";
import { AppShell } from "@/components/AppShell";

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

  // Custom Farm State
  const [isCustomLoc, setIsCustomLoc] = useState(false);
  const [customLat, setCustomLat] = useState("12.9716");
  const [customLng, setCustomLng] = useState("77.5946");
  const [customSize, setCustomSize] = useState("10");

  // Geocoding Search
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchLocation = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCustomLat(lat.toFixed(6));
        setCustomLng(lng.toFixed(6));
        
        // Auto-plot to map
        const size = parseFloat(customSize) || 10;
        const offset = 0.001 * Math.sqrt(size);
        setSelectedFarm({
          id: Date.now(),
          name: data[0].display_name.split(',')[0] || "Search Result",
          sizeAcres: size,
          ownerId: "custom_farmer_001",
          verified: false,
          coordinates: {
            lat,
            lng,
            polygon: [
              [lng - offset, lat + offset],
              [lng + offset, lat + offset],
              [lng + offset, lat - offset],
              [lng - offset, lat - offset],
              [lng - offset, lat + offset]
            ] as [number, number][]
          }
        });
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

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
          farmCoordinates: {
            lat: selectedFarm.coordinates.lat,
            lng: selectedFarm.coordinates.lng,
          },
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
    <AppShell>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white uppercase tracking-tighter">Farm Verification</h1>
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
        <div className="w-full">
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
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${i <= stepIndex ? "text-emerald-400" : "text-zinc-600"}`}>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left: Farm Selector + Map */}
          <div className="lg:col-span-3 flex flex-col gap-4">

            {/* Farm selector tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {DEMO_FARMS.map((farm) => (
                <button
                  key={farm.id}
                  onClick={() => {
                    setSelectedFarm(farm as Farm);
                    setIsCustomLoc(false);
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
              
              <button
                onClick={() => {
                  setSelectedFarm(null);
                  setIsCustomLoc(true);
                  if (step === "minted") handleReset();
                }}
                className={`flex-shrink-0 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                  isCustomLoc
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-white/10 bg-zinc-900 text-zinc-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <span className="truncate max-w-[140px]">+ Custom Location</span>
              </button>
            </div>

            {/* Map */}
            <div className="rounded-[2rem] border border-white/5 bg-[#080808] relative min-h-[400px]">
              <FarmMap 
                selectedFarm={selectedFarm} 
                className="h-full w-full" 
                verificationStep={step}
                ndviScore={agentResult?.ndviScore ?? selectedFarm?.ndviScore}
              />
            </div>

            {/* Verify button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleVerify}
              disabled={!selectedFarm || step === "verifying" || step === "minting"}
              className="relative flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-900/40 transition-all hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group"
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
                  <Satellite className="h-6 w-6" />
                  Verify Farm
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>
          </div>

          {/* Right: Agent Reasoning Panel */}
          <div className="lg:col-span-2 flex flex-col gap-6">
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
                  <button
                    onClick={handleMint}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-black px-6 py-4 text-sm font-bold transition-all hover:bg-emerald-400 uppercase tracking-widest"
                  >
                    <Upload className="h-4 w-4" />
                    Mint {agentResult.creditAmount} Credits
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
                  className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4"
                >
                  <div className="flex items-center gap-3 font-bold text-white text-sm uppercase tracking-widest text-emerald-500">
                    <CheckCircle className="h-5 w-5" />
                    Credits Successfully Minted
                  </div>

                  <div className="bg-black rounded-xl p-4 border border-white/5 space-y-2">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Transaction Hash</p>
                    <p className="text-[10px] font-mono text-emerald-400 break-all">{txHash}</p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href="/marketplace"
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 text-black px-4 py-3 text-xs font-bold transition-all hover:bg-emerald-400 uppercase tracking-widest"
                    >
                      <Gavel className="h-4 w-4" />
                      Trade on Market
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

import { Gavel } from "lucide-react";
