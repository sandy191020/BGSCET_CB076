"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Satellite, Leaf, ArrowRight, CheckCircle, ExternalLink, Upload, RotateCcw } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AgentReasoning } from "../components/AgentReasoning";
import { DEMO_FARMS } from "../../../lib/constants";
import type { Farm, AgentResult } from "../../../lib/types";
import { useTranslation } from "@/lib/translations/provider";

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

export default function VerifyPage() {
  const { t } = useTranslation();
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

  const STEPS = [
    t('verify.steps.select'),
    t('verify.steps.verify'),
    t('verify.steps.mint'),
    t('verify.steps.listed')
  ] as const;

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
    <div className="min-h-screen bg-[#050505] pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-10 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tighter">
              {t('verify.title')}
            </h1>
            <p className="mt-1 md:mt-2 text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
              {t('verify.subtitle')}
            </p>
          </div>
          {step !== "idle" && (
            <button
              onClick={handleReset}
              className="flex w-fit items-center gap-2 rounded-full border border-white/5 bg-zinc-900/50 backdrop-blur-xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-emerald-500/20 transition-all active:scale-95"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t('verify.reset')}
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        <div className="mb-8 md:mb-12 overflow-x-auto pb-4 scrollbar-hide md:overflow-visible">
          <div className="flex items-center min-w-[600px] md:min-w-0">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full text-xs md:text-sm font-black border-2 transition-all duration-500 shadow-2xl ${
                      i < stepIndex
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : i === stepIndex
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400 backdrop-blur-xl"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-600"
                    }`}
                  >
                    {i < stepIndex ? <CheckCircle className="h-5 w-5 md:h-6 md:w-6" /> : i + 1}
                  </div>
                  <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${i <= stepIndex ? "text-emerald-400" : "text-zinc-700"}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mx-4 md:mx-6 mb-6 transition-all duration-700 ${i < stepIndex ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-zinc-800"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:h-[calc(100vh-420px)] lg:min-h-[600px]">

          {/* Left: Farm Selector + Map */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">

            {/* Farm selector tabs */}
            <div className="flex gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-hide">
              {DEMO_FARMS.map((farm) => (
                <button
                  key={farm.id}
                  onClick={() => {
                    setSelectedFarm(farm as Farm);
                    setIsCustomLoc(false);
                    if (step === "minted") handleReset();
                  }}
                  className={`flex-shrink-0 flex items-center gap-2 rounded-2xl border px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedFarm?.id === farm.id
                      ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-xl shadow-emerald-900/10"
                      : "border-white/5 bg-zinc-900/40 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                  }`}
                >
                  <Leaf className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate max-w-[120px]">{farm.name}</span>
                </button>
              ))}
              
              <button
                onClick={() => {
                  setSelectedFarm(null);
                  setIsCustomLoc(true);
                  if (step === "minted") handleReset();
                }}
                className={`flex-shrink-0 flex items-center gap-2 rounded-2xl border px-5 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isCustomLoc
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400 shadow-xl shadow-emerald-900/10"
                    : "border-white/5 bg-zinc-900/40 text-zinc-500 hover:border-white/10 hover:text-zinc-300"
                }`}
              >
                <span className="truncate max-w-[140px]">+ {t('verify.custom_loc')}</span>
              </button>
            </div>

            {/* Custom Location Form */}
            {isCustomLoc && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4 bg-zinc-900/50 backdrop-blur-xl p-5 md:p-6 rounded-[2rem] border border-white/5 shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                    {t('verify.custom_loc')}
                  </span>
                  <button
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            setCustomLat(pos.coords.latitude.toFixed(6));
                            setCustomLng(pos.coords.longitude.toFixed(6));
                          },
                          (err) => console.warn(err)
                        );
                      }
                    }}
                    className="flex w-fit items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 px-4 py-2 rounded-xl transition-all active:scale-95"
                  >
                    📍 {t('verify.get_current')}
                  </button>
                </div>
                
                {/* Search Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('verify.search_placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSearchLocation();
                    }}
                    className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/30 transition-all font-medium"
                  />
                  <button
                    onClick={handleSearchLocation}
                    disabled={isSearching || !searchQuery.trim()}
                    className="bg-zinc-800/80 hover:bg-zinc-700 disabled:opacity-30 text-white border border-white/5 transition-all px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95"
                  >
                    {isSearching ? "..." : t('verify.search_btn')}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-4">
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t('verify.lat')}</label>
                    <input
                      type="number"
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/30 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t('verify.lng')}</label>
                    <input
                      type="number"
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/30 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-1 space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">{t('verify.size')}</label>
                    <input
                      type="number"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-500/30 transition-all"
                    />
                  </div>
                  <div className="sm:col-span-1 flex items-end">
                    <button
                      onClick={() => {
                        const lat = parseFloat(customLat) || 0;
                        const lng = parseFloat(customLng) || 0;
                        const size = parseFloat(customSize) || 1;
                        const offset = 0.001 * Math.sqrt(size);
                        setSelectedFarm({
                          id: Date.now(),
                          name: "Custom Farm",
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
                      }}
                      className="w-full bg-emerald-500 text-black border-none transition-all px-4 py-3 h-[46px] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 active:scale-95 shadow-xl shadow-emerald-500/20"
                    >
                      {t('verify.set_map')}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Map Container */}
            <div className="flex-1 rounded-[2.5rem] overflow-hidden border border-white/5 bg-zinc-900/40 shadow-2xl group relative">
              <FarmMap 
                selectedFarm={selectedFarm} 
                className="h-full min-h-[360px] md:min-h-[440px]" 
                verificationStep={step}
                ndviScore={agentResult?.ndviScore ?? selectedFarm?.ndviScore}
              />
              <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[2.5rem] z-10" />
            </div>

            {/* Verify primary action */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleVerify}
              disabled={!selectedFarm || step === "verifying" || step === "minting"}
              className="relative overflow-hidden flex w-full items-center justify-center gap-4 rounded-3xl bg-white px-8 py-5 md:py-6 text-sm md:text-base font-black text-black shadow-2xl transition-all hover:bg-emerald-400 disabled:opacity-20 disabled:cursor-not-allowed group uppercase tracking-[0.2em]"
            >
              <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-3xl" />
              <span className="relative z-10 flex items-center gap-3">
                {step === "verifying" ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="h-5 w-5 md:h-6 md:w-6 rounded-full border-2 border-black/20 border-t-black"
                    />
                    {t('verify.verifying_btn')}
                  </>
                ) : (
                  <>
                    <Satellite className="h-5 w-5 md:h-6 md:w-6" />
                    {t('verify.verify_btn')}
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:translate-x-2" />
                  </>
                )}
              </span>
            </motion.button>
          </div>

          {/* Right: Agent Reasoning Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6 h-full">
            <div className="flex-1 min-h-[400px] lg:h-full">
              <AgentReasoning
                lines={reasoningLines}
                isLoading={step === "verifying"}
                result={agentResult}
              />
            </div>

            {/* Post-Verification Actions */}
            <AnimatePresence>
              {step === "verified" && agentResult?.approved && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="space-y-4"
                >
                  {mintError && (
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-[10px] font-bold text-red-400 uppercase tracking-widest backdrop-blur-xl">
                      ❌ {mintError}
                    </div>
                  )}
                  <button
                    onClick={handleMint}
                    className="flex w-full items-center justify-center gap-3 rounded-[1.5rem] border border-emerald-500/30 bg-emerald-500/10 px-8 py-5 text-xs font-black text-emerald-400 uppercase tracking-widest transition-all hover:bg-emerald-500/20 active:scale-[0.98] shadow-2xl shadow-emerald-900/20"
                  >
                    <Upload className="h-4 w-4" />
                    {t('verify.mint_prefix')} {agentResult.creditAmount} {t('verify.mint_suffix')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success state — Global Anchor Verification */}
            <AnimatePresence>
              {step === "minted" && txHash && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[2.5rem] border border-emerald-500/30 bg-emerald-500/5 p-6 md:p-8 space-y-6 backdrop-blur-2xl shadow-3xl overflow-hidden relative group"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <CheckCircle className="h-32 w-32 -rotate-12" />
                  </div>

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-emerald-500 text-black shadow-xl shadow-emerald-500/50">
                      <CheckCircle className="h-6 w-6 md:h-7 md:w-7" />
                    </div>
                    <div>
                      <div className="font-black text-white text-lg md:text-xl uppercase tracking-tighter">{t('verify.mint_success')}</div>
                      <div className="text-[9px] md:text-[10px] text-emerald-500/60 font-mono font-bold mt-0.5 truncate max-w-[180px] md:max-w-none">{txHash}</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 relative z-10">
                    <a
                      href={`https://amoy.polygonscan.com/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-zinc-900/80 border border-white/5 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/10 transition-all active:scale-[0.98]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {t('verify.explorer')}
                    </a>
                    <Link
                      href="/marketplace"
                      className="flex items-center justify-center gap-2.5 rounded-2xl bg-white px-6 py-4 text-[10px] font-black uppercase tracking-widest text-black shadow-2xl transition-all hover:bg-emerald-400 active:scale-[0.98]"
                    >
                      <ArrowRight className="h-4 w-4" />
                      {t('verify.view_market')}
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
