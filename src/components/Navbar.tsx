"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Leaf, LogOut, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Green<span className="text-emerald-500">Ledger</span>
          </span>
        </Link>
        
        <div className="flex items-center gap-8">
          {user ? (
            <>
              {/* Logged In View - Show only Dashboard + Sign Out on landing page */}
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium text-zinc-200 hover:text-emerald-500 transition-colors flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 ring-1 ring-white/10 transition-all hover:bg-zinc-800 hover:text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Not Logged In View - Show ONLY Auth actions */}
              <div className="flex items-center gap-4">
                <Link href="/auth/signin" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40">
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
