"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, Satellite, BarChart3, Settings, LogOut, 
  LayoutDashboard, HelpCircle, ShieldAlert, Gavel, 
  Leaf, X, Globe, User, Bell, Fingerprint, ChevronRight, Menu, CheckCircle2, AlertCircle, Info, Clock
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Notification {
  id: string;
  created_at: string;
  type: 'auction' | 'credit' | 'system' | 'alert';
  title: string;
  message: string;
  link?: string;
  is_global: boolean;
}

interface AppShellProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
}

export function AppShell({ children, hideSidebar = false }: AppShellProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isNotifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dismissedNotifs, setDismissedNotifs] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const stored = localStorage.getItem('dismissed_notifications');
    if (stored) setDismissedNotifs(JSON.parse(stored));

    fetchNotifications();

    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (!error && data) {
      setNotifications(data);
    }
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = [...dismissedNotifs, id];
    setDismissedNotifs(updated);
    localStorage.setItem('dismissed_notifications', JSON.stringify(updated));
  };

  const clearAllNotifications = () => {
    const allIds = notifications.map(n => n.id);
    const updated = Array.from(new Set([...dismissedNotifs, ...allIds]));
    setDismissedNotifs(updated);
    localStorage.setItem('dismissed_notifications', JSON.stringify(updated));
    setNotifOpen(false);
  };

  const visibleNotifications = notifications.filter(n => !dismissedNotifs.includes(n.id));

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    { 
      group: "Marketplace_Core", 
      items: [
        { name: "Overview", icon: <LayoutDashboard />, href: "/dashboard" },
        { name: "Verify Farm", icon: <Satellite />, href: "/verify" },
        { name: "Marketplace", icon: <Gavel />, href: "/marketplace" },
        { name: "Admin_Portal", icon: <ShieldAlert />, href: "/admin", adminOnly: true },
      ]
    },
    {
      group: "Assets_Wallet",
      items: [
        { name: "Carbon Wallet", icon: <Wallet />, href: "/wallet" },
        { name: "Analytics", icon: <BarChart3 />, href: "/analytics" },
      ]
    }
  ];

  const isAdminRoute = pathname.startsWith('/admin');

  const filteredNavItems = navItems.map(group => {
    if (isAdminRoute) {
      if (group.group === "Marketplace_Core") {
        return {
          ...group,
          items: group.items.filter(item => item.name === "Overview" || item.name === "Admin_Portal")
        };
      }
      return { ...group, items: [] };
    }
    return group;
  }).filter(group => group.items.length > 0);

  const isActive = (path: string) => pathname === path;

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Mobile Overlay */}
      {!isSidebarOpen && !hideSidebar && (
        <button 
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-600/40 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Sidebar */}
      {!hideSidebar && (
        <motion.aside
          initial={false}
          animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="relative z-40 flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl overflow-hidden"
        >
        <div className="flex h-20 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-500 ring-1 ring-emerald-500/50 group-hover:scale-110 transition-transform">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white uppercase italic">GreenLedger</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-zinc-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {filteredNavItems.map((group) => (
            <div key={group.group} className="space-y-2">
              <h3 className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-4 font-mono">
                {group.group.replace("_", " ")}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  if (item.adminOnly && user?.email !== 'admin@greenledger.com' && !user?.email?.includes('admin')) {
                    return null;
                  }
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive(item.href)
                          ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20"
                          : "text-zinc-500 hover:bg-white/5 hover:text-zinc-200"
                      }`}
                    >
                      <span className={`transition-transform group-hover:scale-110 ${isActive(item.href) ? "text-emerald-400" : "text-zinc-500"}`}>
                        {React.cloneElement(item.icon as any, { className: "h-5 w-5" })}
                      </span>
                      {item.name}
                      {isActive(item.href) && (
                        <motion.div layoutId="activeNav" className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-2 bg-zinc-950/20">
          <button 
            onClick={() => setSettingsOpen(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition-all hover:bg-white/5 hover:text-zinc-200"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <button 
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-400/70 transition-all hover:bg-red-500/5 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </motion.aside>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between px-8 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && !hideSidebar && (
              <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 hover:text-white mr-2">
                <Menu className="h-6 w-6" />
              </button>
            )}
            <h2 className="text-lg font-black uppercase tracking-tighter text-white">
              {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!isNotifOpen)}
                className="relative text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
              >
                <Bell className="h-5 w-5" />
                {visibleNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white shadow-lg shadow-emerald-500/40 animate-pulse">
                    {visibleNotifications.length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-[380px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-900 shadow-2xl z-50"
                  >
                    <div className="border-b border-white/5 bg-zinc-950/50 p-6 flex items-center justify-between">
                      <h3 className="font-black uppercase tracking-tighter text-sm">Notifications</h3>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest">LIVE</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto py-2 scrollbar-hide">
                      {visibleNotifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                            <Bell className="h-6 w-6 text-zinc-600" />
                          </div>
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No New Alerts</p>
                        </div>
                      ) : (
                        visibleNotifications.map((n) => (
                          <div 
                            key={n.id} 
                            className="flex items-start gap-4 border-b border-white/5 p-5 hover:bg-white/5 transition-colors cursor-pointer group"
                          >
                            <div className={`mt-1 rounded-xl p-2.5 ${
                              n.type === 'auction' ? 'bg-blue-500/10 text-blue-400' :
                              n.type === 'credit' ? 'bg-emerald-500/10 text-emerald-400' :
                              n.type === 'alert' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-500/10 text-zinc-400'
                            }`}>
                              {n.type === 'auction' ? <Clock className="h-4 w-4" /> :
                               n.type === 'credit' ? <Fingerprint className="h-4 w-4" /> :
                               n.type === 'alert' ? <ShieldAlert className="h-4 w-4" /> : <Info className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-xs font-bold text-white uppercase tracking-tight">{n.title}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] font-medium text-zinc-600 group-hover:text-zinc-500 transition-colors">
                                    {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <button onClick={(e) => dismissNotification(n.id, e)} className="text-zinc-600 hover:text-red-500 transition-colors p-1 rounded hover:bg-white/10">
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                                {n.message}
                              </p>
                              {n.link && (
                                <Link 
                                  href={n.link} 
                                  className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400 transition-colors"
                                >
                                  View Details
                                  <ChevronRight className="h-3 w-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-4 bg-zinc-950/30 text-center border-t border-white/5">
                      <button 
                        onClick={clearAllNotifications}
                        className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-white transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white font-mono tracking-tighter">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</p>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className="h-1 w-1 rounded-full bg-emerald-500" />
                  <p className="text-[10px] font-black uppercase tracking-[0.1em] text-emerald-500/70">{user?.user_metadata?.role || 'Verified Partner'}</p>
                </div>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-800 p-0.5 shadow-xl shadow-emerald-500/10 group cursor-pointer active:scale-95 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-900">
                  <User className="h-5 w-5 text-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="relative">
          {children}
        </div>
      </main>

      {/* Settings Modal (Simplified) */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-900 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/5 p-8 bg-zinc-950/20">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Settings className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">System Settings</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Platform Node Configurations</p>
                  </div>
                </div>
                <button onClick={() => setSettingsOpen(false)} className="rounded-full p-2 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Security Suite</h4>
                    <div className="space-y-3">
                      <SettingsCard icon={<Fingerprint />} title="Biometric Node" active />
                      <SettingsCard icon={<ShieldAlert />} title="2FA Protection" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Network Protocols</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-3">Primary RPC Node</p>
                        <div className="p-4 rounded-2xl bg-zinc-950 font-mono text-[10px] text-emerald-500/70 border border-emerald-500/10 break-all leading-relaxed">
                          https://polygon-amoy.alchemy.com/v2/r019...
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.1em]">Mainnet_Linked: ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingsCard({ icon, title, active = false }: { icon: React.ReactNode, title: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${active ? 'bg-emerald-500/10 text-emerald-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
          {React.cloneElement(icon as any, { className: "h-4 w-4" })}
        </div>
        <span className="text-xs font-bold text-zinc-300 group-hover:text-white transition-colors">{title}</span>
      </div>
      <div className={`h-5 w-10 rounded-full p-1 transition-colors ${active ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
        <div className={`h-3 w-3 rounded-full transition-all ${active ? 'translate-x-5 bg-emerald-500' : 'bg-zinc-700'}`} />
      </div>
    </div>
  );
}
