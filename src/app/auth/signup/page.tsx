"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, ArrowRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const [role, setRole] = useState<"farmer" | "supermarket">("farmer");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data?.session) {
        router.refresh();
        router.push("/dashboard");
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="neural-grid min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass max-w-md w-full p-8 rounded-3xl border-emerald-500/10 text-center"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50 mx-auto mb-6">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Check your email</h1>
          <p className="text-zinc-400 mb-8">
            We've sent a verification link to <span className="text-white font-medium">{email}</span>. 
            Please verify your email to continue.
          </p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 text-emerald-500 font-semibold hover:text-emerald-400 transition-colors"
          >
            Back to Sign In
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="neural-grid min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass max-w-md w-full p-8 rounded-3xl border-emerald-500/10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50 group-hover:scale-110 transition-transform">
              <Leaf className="h-7 w-7" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-zinc-400 mt-2">Start your journey with GreenLedger</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("farmer")}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  role === "farmer"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                    : "bg-zinc-900/50 border-white/10 text-zinc-500 hover:border-white/20"
                }`}
              >
                Farmer
              </button>
              <button
                type="button"
                onClick={() => setRole("supermarket")}
                className={`py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  role === "supermarket"
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                    : "bg-zinc-900/50 border-white/10 text-zinc-500 hover:border-white/20"
                }`}
              >
                Supermarket
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-semibold shadow-xl shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-emerald-500 font-medium hover:text-emerald-400 transition-colors">
            Sign in instead
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
