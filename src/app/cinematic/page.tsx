"use client";

import { CinematicDemo } from "@/components/CinematicDemo";
import { useRouter } from "next/navigation";

export default function CinematicPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black">
      <CinematicDemo 
        isOpen={true} 
        onClose={() => router.push("/")} 
      />
    </div>
  );
}
