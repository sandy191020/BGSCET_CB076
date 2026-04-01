"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { AuctionBanner } from "./AuctionBanner";
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/blockchain/config';

const queryClient = new QueryClient();

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define routes where we want to hide the global navbar and banner
  const isAppPage = pathname?.startsWith("/dashboard") || 
                    pathname?.startsWith("/admin") || 
                    pathname?.startsWith("/marketplace") || 
                    pathname?.startsWith("/verify") || 
                    pathname?.startsWith("/track") || 
                    pathname?.startsWith("/auction/");

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <>
          {!isAppPage && (
            <>
              <Navbar />
              <AuctionBanner />
            </>
          )}
          <main className={!isAppPage ? "pt-16" : ""}>{children}</main>
        </>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
