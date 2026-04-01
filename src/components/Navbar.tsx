"use client";

import Link from "next/link";
import { Leaf, BarChart3, Globe, Wallet } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50">
            <Leaf className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Green<span className="text-emerald-500">Ledger</span>
          </span>
        </div>
        
        <div className="hidden md:block">
          <div className="flex items-center gap-8">
            <Link href="#problem" className="text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-500">The Problem</Link>
            <Link href="#solution" className="text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-500">The Solution</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-zinc-400 transition-colors hover:text-emerald-500">How it Works</Link>
            <Link href="/dashboard" className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40">
              Launch App
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
