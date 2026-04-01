"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-20 text-center">
       <div className="space-y-4">
          <div className="h-10 w-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Redirecting to ROOT_TERMINAL...</p>
       </div>
    </div>
  );
}
