"use client";

import dynamic from "next/dynamic";

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
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      <LeafletMap onCoordsSelect={onCoordsSelect} />
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-mono text-emerald-500 backdrop-blur-md">
        ENGINE: LEAFLET_OSM
      </div>
    </div>
  );
}
