"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, User, ArrowRight, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Fixed credentials check
    if (userId === "admin" && password === "admin123") {
      // Set a session cookie or localStorage for the demo
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("Invalid administrative credentials");
      setLoading(false);
    }
  };

  return (
    <div className="neural-grid min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass max-w-md w-full p-8 rounded-3xl border-emerald-500/20"
      >
        <div className="text-center mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50 mx-auto mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-widest">Admin Access</h1>
          <p className="text-zinc-500 text-sm mt-2">Restricted System Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Admin ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
              <input
                type="text"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono"
                placeholder="system_id"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400 ml-1">Access Token</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-mono"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase tracking-widest transition-all hover:bg-emerald-500/30 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Verifying..." : (
              <>
                Initialize Session
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
