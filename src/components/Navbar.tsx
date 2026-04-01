"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
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

const cyberNavStyle = `
@keyframes glitch {
  0% {
    clip-path: polygon(0 2%, 100% 2%, 100% 95%, 95% 95%, 95% 90%, 85% 90%, 85% 95%, 8% 95%, 0 70%);
  }
  2%, 8% {
    clip-path: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 78%);
    transform: translate(-5%, 0);
  }
  6% {
    clip-path: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 78%);
    transform: translate(5%, 0);
  }
  9% {
    clip-path: polygon(0 78%, 100% 78%, 100% 100%, 95% 100%, 95% 90%, 85% 90%, 85% 100%, 8% 100%, 0 78%);
    transform: translate(0, 0);
  }
  10% {
    clip-path: polygon(0 44%, 100% 44%, 100% 54%, 95% 54%, 95% 54%, 85% 54%, 85% 54%, 8% 54%, 0 54%);
    transform: translate(5%, 0);
  }
  13% {
    clip-path: polygon(0 44%, 100% 44%, 100% 54%, 95% 54%, 95% 54%, 85% 54%, 85% 54%, 8% 54%, 0 54%);
    transform: translate(0, 0);
  }
  14%, 21% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    transform: translate(5%, 0);
  }
  25% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    transform: translate(5%, 0);
  }
  30% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
    transform: translate(-5%, 0);
  }
  35%, 45% {
    clip-path: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
    transform: translate(-5%);
  }
  40% {
    clip-path: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
    transform: translate(5%);
  }
  50% {
    clip-path: polygon(0 40%, 100% 40%, 100% 85%, 95% 85%, 95% 85%, 85% 85%, 85% 85%, 8% 85%, 0 70%);
    transform: translate(0, 0);
  }
  55% {
    clip-path: polygon(0 63%, 100% 63%, 100% 80%, 95% 80%, 95% 80%, 85% 80%, 85% 80%, 8% 80%, 0 70%);
    transform: translate(5%, 0);
  }
  60% {
    clip-path: polygon(0 63%, 100% 63%, 100% 80%, 95% 80%, 95% 80%, 85% 80%, 85% 80%, 8% 80%, 0 70%);
    transform: translate(0, 0);
  }
  31%, 61%, 100% {
    clip-path: polygon(0 0, 100% 0, 100% 0, 95% 0, 95% 0, 85% 0, 85% 0, 8% 0, 0 0);
  }
}

.cyber-nav-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
}

.cyber-radio-wrapper {
  position: relative;
  height: 50px;
  width: 150px;
}

.cyber-radio-wrapper .cyber-input {
  position: absolute;
  height: 100%;
  width: 100%;
  margin: 0;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
}

.cyber-btn {
  --primary: #1c1c1c;
  --shadow-primary: #10b981;
  --color: #a1a1aa;
  --font-size: 12px;
  --clip: polygon(11% 0, 95% 0, 100% 25%, 90% 90%, 95% 90%, 85% 90%, 85% 100%, 7% 100%, 0 80%);
  --border: 4px;
  color: var(--color);
  text-transform: uppercase;
  font-size: var(--font-size);
  letter-spacing: 2px;
  position: relative;
  font-weight: 900;
  width: 100%;
  height: 100%;
  line-height: 50px;
  text-align: center;
  transition: background 0.2s, font-size 0.3s;
  font-family: 'Inter', sans-serif;
}

.cyber-input:checked + .cyber-btn {
  --primary: #10b981;
  --shadow-primary: #00e572;
  --color: #ffffff;
}

.cyber-input:hover + .cyber-btn {
  --primary: #0d9668;
  --font-size: 10px;
  --color: #e5e7eb;
}

.cyber-btn::after,
.cyber-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  clip-path: var(--clip);
  z-index: -1;
}

.cyber-btn::before {
  background: var(--shadow-primary);
  transform: translate(var(--border), 0);
}

.cyber-btn::after {
  background: var(--primary);
}

.cyber-btn-glitch {
  position: absolute;
  top: calc(var(--border) * -1);
  left: calc(var(--border) * -1);
  right: calc(var(--border) * -1);
  bottom: calc(var(--border) * -1);
  background: var(--shadow-primary);
  text-shadow: 2px 2px var(--shadow-primary), -2px -2px hsl(60, 90%, 60%);
  clip-path: var(--clip);
  animation: glitch 2s infinite;
  display: none;
  color: #000;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 50px;
  text-align: center;
}

.cyber-input:hover + .cyber-btn .cyber-btn-glitch {
  display: block;
}

.cyber-input:checked + .cyber-btn .cyber-btn-glitch {
  display: block;
  animation: glitch 5s infinite;
}

.cyber-btn-glitch::before {
  content: '';
  position: absolute;
  top: calc(var(--border) * 1);
  right: calc(var(--border) * 1);
  bottom: calc(var(--border) * 1);
  left: calc(var(--border) * 1);
  clip-path: var(--clip);
  background: var(--primary);
  z-index: -1;
}

.cyber-btn-tag {
  background: var(--shadow-primary);
  color: #000;
  font-size: 5.5px;
  font-weight: 700;
  letter-spacing: 1px;
  position: absolute;
  width: 15px;
  height: 6px;
  top: 0;
  left: 81%;
  line-height: 6.2px;
  font-family: monospace;
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
    // Set active nav based on current path
    const match = navLinks.find((link) => {
      if (link.href.startsWith("/#")) return false; // hash links can't be detected via pathname
      return pathname === link.href || pathname.startsWith(link.href + "/");
    });
    if (match) {
      setActiveNav(match.href);
    }
  }, [pathname]);

  const handleNavClick = (href: string) => {
    setActiveNav(href);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl bg-black/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
      <style dangerouslySetInnerHTML={{ __html: cyberNavStyle }} />
      <div className="flex h-16 items-center justify-between px-5">
        {/* Logo — Left Section */}
        <div className="hidden md:flex w-[140px] items-center justify-start shrink-0">
          <Logo />
        </div>
        
        {/* Cyber Nav Buttons — Center */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="cyber-nav-container">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className="cyber-radio-wrapper"
                style={{ textDecoration: "none" }}
              >
                <input
                  className="cyber-input"
                  type="radio"
                  name="nav-btn"
                  checked={activeNav === link.href}
                  readOnly
                />
                <div className="cyber-btn">
                  _{link.label}
                  <span className="cyber-btn-glitch" aria-hidden={true}>
                    _{link.label}_
                  </span>
                  <span className="cyber-btn-tag">{link.tag}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Auth Section — Right */}
        <div className="hidden md:flex items-center gap-3 w-[140px] justify-end shrink-0">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-zinc-200 hover:text-emerald-500 transition-colors">
                <User className="h-4 w-4" />
              </Link>
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-300 ring-1 ring-white/10 transition-all hover:bg-zinc-800 hover:text-white"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signin" className="text-xs font-medium text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/auth/signup" className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500">
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
