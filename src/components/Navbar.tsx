"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogOut, User, Menu, X, Globe, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Logo } from "@/components/Logo";
import { useTranslation } from "@/lib/translations/provider";
import { languages, Language } from "@/lib/translations";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/#problem", label: "problem", tag: "n1" },
  { href: "/#how-it-works", label: "how_it_works", tag: "n2" },
  { href: "/verify", label: "verify", tag: "n3" },
  { href: "/marketplace", label: "market", tag: "n4" },
  { href: "/admin", label: "admin", tag: "n5" },
];

const navStyle = `
.nav-link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  md:width: 130px;
  height: 48px;
  md:height: 44px;
  border-radius: 12px;
  font-size: 14px;
  md:font-size: 13px;
  font-weight: 600;
  color: #a1a1aa;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
}

.nav-link-btn:hover {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
  color: #ffffff;
}

.nav-link-btn.active {
  background: rgba(16, 185, 129, 0.15);
  border-color: #10b981;
  color: #10b981;
}

.language-selector {
  position: relative;
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #0a0a0a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 8px;
  width: 160px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.8);
  z-index: 100;
}

.lang-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
}

.lang-item.active {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}
`;

export function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [activeNav, setActiveNav] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, language, setLanguage, currentLanguage } = useTranslation();
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
    if (match) setActiveNav(match.href);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string, labelKey: string) => {
    if (!user && ["verify", "market", "admin"].includes(labelKey)) {
      e.preventDefault();
      router.push("/auth/signin" + (href !== "/" ? `?callbackUrl=${href}` : ""));
      return;
    }
    setActiveNav(href);
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-2 md:top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl rounded-2xl bg-black/80 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-white/5">
      <style dangerouslySetInnerHTML={{ __html: navStyle }} />
      <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="md:w-[180px]">
            <Logo />
          </div>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.label)}
                className={`nav-link-btn w-[120px] ${activeNav === link.href ? "active" : ""}`}
              >
                <span>{t(`nav.${link.label}`)}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0 justify-end md:min-w-[200px]">
          
          {/* Language Selector */}
          <div className="language-selector relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1.5 h-10 px-2 md:px-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all text-xs font-semibold uppercase tracking-wider text-zinc-300 hover:text-white"
            >
              <Globe className="h-4 w-4 text-emerald-500" />
              <span className="hidden sm:inline">{currentLanguage.label}</span>
              <span className="sm:hidden">{currentLanguage.code}</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="lang-dropdown"
                >
                  {languages.map((lang) => (
                    <div 
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`lang-item ${language === lang.code ? 'active' : ''}`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center justify-center h-10 w-10 rounded-xl bg-zinc-900 border border-white/10 text-zinc-200 hover:text-emerald-500 hover:border-emerald-500/30 transition-all">
                  <User className="h-5 w-5" />
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-zinc-300 border border-white/10 transition-all hover:bg-zinc-800 hover:text-white"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="text-base font-bold text-zinc-400 hover:text-white transition-colors px-6 py-3">
                  {t('nav.signin')}
                </Link>
                <Link href="/auth/signup" className="rounded-xl bg-emerald-600 px-8 py-3 text-base font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-500">
                  {t('nav.join')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-300"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-black/60 backdrop-blur-3xl rounded-b-2xl"
          >
            <div className="p-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.label)}
                  className={`nav-link-btn ${activeNav === link.href ? "active" : ""}`}
                >
                  {t(`nav.${link.label}`)}
                </Link>
              ))}
              <div className="h-px bg-white/5 my-2" />
              {user ? (
                <div className="flex items-center justify-between gap-3">
                  <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex-1 h-12 rounded-xl bg-emerald-600/20 text-emerald-500 border border-emerald-500/20 font-bold"
                  >
                    {t('nav.logout')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/auth/signin" className="flex items-center justify-center h-12 rounded-xl border border-white/10 text-zinc-300 font-bold">
                    {t('nav.signin')}
                  </Link>
                  <Link href="/auth/signup" className="flex items-center justify-center h-12 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-wider">
                    {t('nav.join')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
