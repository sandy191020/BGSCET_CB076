"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Search, Loader2, Navigation, Layers } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#121212] text-emerald-500">
      INITIALIZING_OSM_LAYER...
    </div>
  ),
});

interface MapContainerProps {
  onCoordsSelect?: (lng: number, lat: number) => void;
}

export function MapContainer({ onCoordsSelect }: MapContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchPoint, setSearchPoint] = useState<[number, number] | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setSearchPoint([parseFloat(lat), parseFloat(lon)]);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSearchPoint([latitude, longitude]);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      {/* Search Overlay */}
      <div className="absolute left-1/2 top-4 z-[1000] flex w-full max-w-md -translate-x-1/2 items-center gap-2 px-4">
        <form 
          onSubmit={handleSearch}
          className="group relative flex flex-1 items-center overflow-hidden rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl transition-all focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20"
        >
          <input
            type="text"
            placeholder="Search farm location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full bg-transparent px-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          <button 
            type="submit"
            disabled={isSearching}
            className="flex h-10 w-10 items-center justify-center bg-white/5 hover:bg-white/10 disabled:opacity-50"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
            ) : (
              <Search className="h-4 w-4 text-emerald-500" />
            )}
          </button>
        </form>

        {/* Locate Me Button */}
        <button
          onClick={handleLocateMe}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black/60 border border-white/10 backdrop-blur-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all text-emerald-500"
          title="Locate Me"
        >
          <Navigation className="h-4 w-4 fill-emerald-500/20" />
        </button>
        {/* Satellite Toggle */}
        <button
          onClick={() => setIsSatellite(!isSatellite)}
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 backdrop-blur-xl transition-all ${
            isSatellite ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400" : "bg-black/60 text-zinc-400 hover:text-white"
          }`}
          title="Toggle Satellite View"
        >
          <Layers className="h-4 w-4" />
        </button>
      </div>

      <LeafletMap onCoordsSelect={onCoordsSelect} searchPoint={searchPoint} isSatellite={isSatellite} />
      
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-mono text-emerald-500 backdrop-blur-md">
        ENGINE: LEAFLET_AI_SEARCH
      </div>
    </div>
  );
}
