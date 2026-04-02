"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, User, Zap, Leaf } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Logo } from "@/components/Logo";

const navLinks = [
  { href: "/#problem", label: "Problem", tag: "n1" },
  { href: "/#how-it-works", label: "How_It_Works", tag: "n2" },
  { href: "/verify", label: "Verify", tag: "n3" },
  { href: "/marketplace", label: "Market", tag: "n4" },
  { href: "/admin", label: "Admin", tag: "n5" },
];

const navStyle = `
.nav-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 130px;
  height: 44px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #a1a1aa;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.nav-link-btn:hover {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
  color: #ffffff;
  transform: translateY(-1px);
}

.nav-link-btn.active {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.15);
}

.nav-link-btn span {
  position: relative;
  z-index: 1;
}

.nav-link-tag {
  position: absolute;
  top: 4px;
  right: 6px;
  font-size: 8px;
  font-family: monospace;
  opacity: 0.4;
}
`;

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeNav, setActiveNav] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const match = navLinks.find((link) => {
      if (link.href.startsWith("/#")) return false;
      return pathname === link.href || pathname.startsWith(link.href + "/");
    });
    if (match) {
      setActiveNav(match.href);
    }
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string, label: string) => {
    if (!user && ["Verify", "Market", "Admin"].includes(label)) {
      e.preventDefault();
      router.push("/auth/signin" + (href !== "/" ? `?callbackUrl=${href}` : ""));
      return;
    }
    setActiveNav(href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl bg-black/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/5">
      <style dangerouslySetInnerHTML={{ __html: navStyle }} />
      <div className="flex h-20 items-center justify-between px-6">
        <div className="hidden md:flex w-[180px] items-center justify-start shrink-0">
          <Logo />
        </div>
        
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className={`nav-link-btn ${activeNav === link.href ? "active" : ""}`}
              >
                <span>{link.label.replace(/_/g, " ")}</span>
                <span className="nav-link-tag">{link.tag}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 w-[200px] justify-end shrink-0">
          {user ? (
            <>
              <Link href="/dashboard" className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
                <User className="h-5 w-5" />
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 border border-white/10 transition-all hover:bg-zinc-800 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors px-4 py-2">
                Sign In
              </Link>
              <Link href="/auth/signup" className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500 hover:scale-105 active:scale-95">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
