"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { AuctionBanner } from "./AuctionBanner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes where we want to hide the global navbar and banner
  const isAppPage = pathname?.startsWith("/dashboard") || 
                    pathname?.startsWith("/admin") || 
                    pathname?.startsWith("/marketplace") || 
                    pathname?.startsWith("/verify") || 
                    pathname?.startsWith("/auction/");

  return (
    <>
      {!isAppPage && (
        <>
          <Navbar />
          <AuctionBanner />
        </>
      )}
      <main className={!isAppPage ? "pt-16" : ""}>{children}</main>
    </>
  );
}
