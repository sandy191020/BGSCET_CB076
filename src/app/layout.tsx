import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenLedger | Sustainable Farming on Blockchain",
  description: "Turning sustainable farming into tradeable carbon assets using AI and Blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className={`${inter.className} min-h-full bg-[#050505] text-white selection:bg-emerald-500/30`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
