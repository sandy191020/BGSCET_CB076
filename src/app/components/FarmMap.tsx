"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import type { Farm } from "../../../lib/types";

interface FarmMapProps {
  selectedFarm: Farm | null;
  onFarmSelect?: (farm: Farm) => void;
  className?: string;
  verificationStep?: "idle" | "verifying" | "verified" | "minting" | "minted";
  ndviScore?: number;
}

// We use Leaflet via the react-leaflet wrappers already installed
// This component renders a satellite tile map with a farm polygon overlay.
export function FarmMap({ selectedFarm, onFarmSelect, className = "", verificationStep = "idle", ndviScore }: FarmMapProps) {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    Promise.all([
      import("leaflet"),
      import("react-leaflet"),
    ]).then(([L, RL]) => {
      // Fix Leaflet default icon path issue in Next.js
      delete (L.default.Icon.Default.prototype as any)._getIconUrl;
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setMapComponents({ L: L.default, ...RL });
      setIsLoaded(true);
    });
  }, []);

  const polygonPositions: [number, number][] = useMemo(() => {
    return selectedFarm?.coordinates?.polygon
      ? selectedFarm.coordinates.polygon.map(([lng, lat]) => [lat, lng])
      : [];
  }, [selectedFarm]);

  // Calculate bounding box for the scanner/heatmap
  const bounds: [[number, number], [number, number]] | null = useMemo(() => {
    if (polygonPositions.length > 0) {
      const lats = polygonPositions.map(p => p[0]);
      const lngs = polygonPositions.map(p => p[1]);
      return [
        [Math.min(...lats) - 0.001, Math.min(...lngs) - 0.001],
        [Math.max(...lats) + 0.001, Math.max(...lngs) + 0.001]
      ];
    }
    return null;
  }, [polygonPositions]);

  if (!isLoaded || !MapComponents) {
    return (
      <div className={`flex items-center justify-center bg-zinc-900 rounded-2xl border border-white/10 ${className}`}>
        <div className="text-center space-y-2">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin mx-auto" />
          <p className="text-xs text-zinc-500 font-mono">Loading satellite map...</p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Polygon, Marker, Popup, useMap, SVGOverlay } = MapComponents;

  const center: [number, number] = selectedFarm
    ? [selectedFarm.coordinates.lat, selectedFarm.coordinates.lng]
    : [12.5266, 76.8950]; // Default: Mandya, Karnataka

  const FlyToFarm = ({ farm }: { farm: Farm | null }) => {
    const map = useMap();
    useEffect(() => {
      if (farm) {
        map.flyTo(
          [farm.coordinates.lat, farm.coordinates.lng],
          14,
          { duration: 1.5, easeLinearity: 0.25 }
        );
      }
    }, [farm, map]);
    return null;
  };

  // Determine Polygon Color based on state
  let polygonColor = "#10b981"; // Default Emerald
  let polygonOpacity = 0.2;
  
  if (verificationStep === "verifying") {
    polygonColor = "#3b82f6"; // Blue scanning
    polygonOpacity = 0.4;
  } else if (verificationStep !== "idle" && ndviScore !== undefined) {
    // NDVI Color Scale (Red -> Yellow -> Green)
    if (ndviScore >= 0.7) {
      polygonColor = "#10b981"; // High NDVI: Green
    } else if (ndviScore >= 0.4) {
      polygonColor = "#eab308"; // Med NDVI: Yellow
    } else {
      polygonColor = "#ef4444"; // Low NDVI: Red
    }
    polygonOpacity = 0.6; // Darker to show "data" layer
  }

  return (
    <div className={`relative rounded-2xl overflow-hidden border border-white/10 ${className}`}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Satellite tile layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        {/* Street names overlay */}
        <TileLayer
          url="https://stamen-tiles.a.ssl.fastly.net/toner-labels/{z}/{x}/{y}.png"
          opacity={0.3}
          maxZoom={19}
        />

        {/* Farm polygon */}
        {polygonPositions.length > 0 && (
          <Polygon
            positions={polygonPositions}
            pathOptions={{
              color: polygonColor,
              fillColor: polygonColor,
              fillOpacity: polygonOpacity,
              weight: verificationStep === "verifying" ? 3 : 2,
              dashArray: verificationStep === "verifying" ? "10, 10" : "6, 4",
              className: verificationStep === "verifying" ? "animate-pulse" : "transition-all duration-1000"
            }}
          />
        )}

        {/* Heatmap Overlay */}
        {(verificationStep !== "idle" && verificationStep !== "verifying" && bounds) && (
          <SVGOverlay bounds={bounds} zIndex={10}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', opacity: 0.8 }}>
              <defs>
                <radialGradient id="heatmap-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={polygonColor} stopOpacity="0.6" />
                  <stop offset="40%" stopColor={polygonColor} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={polygonColor} stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100" height="100" fill="url(#heatmap-grad)" />
              {/* Organic heat blobs without heavy SVG filters for compatibility */}
              <circle cx="30" cy="30" r="30" fill={polygonColor} opacity="0.4" />
              <circle cx="70" cy="65" r="35" fill={polygonColor} opacity="0.3" />
              <circle cx="45" cy="80" r="25" fill={polygonColor} opacity="0.5" />
            </svg>
          </SVGOverlay>
        )}

        {/* Farm center marker */}
        {selectedFarm && (
          <Marker position={[selectedFarm.coordinates.lat, selectedFarm.coordinates.lng]}>
            <Popup className="farm-popup">
              <div className="text-xs font-mono bg-zinc-900 text-white p-2 rounded">
                <div className="font-bold text-emerald-400">{selectedFarm.name}</div>
                <div className="text-zinc-400 mt-1">{selectedFarm.sizeAcres} acres</div>
                {selectedFarm.ndviScore && (
                  <div className="text-emerald-300 mt-0.5">NDVI: {selectedFarm.ndviScore}</div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        <FlyToFarm farm={selectedFarm} />
      </MapContainer>

      {/* Fixed UI Scanner Overlay (Doesn't scale with zoom) */}
      {verificationStep === "verifying" && (
        <div className="absolute inset-0 z-[500] pointer-events-none flex items-center justify-center">
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 border-2 border-blue-500/50 bg-blue-500/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            <div className="absolute w-full h-[1px] bg-blue-400/50" />
            <div className="absolute w-[1px] h-full bg-blue-400/50" />
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-blue-400/30 animate-pulse" />
            
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
          </div>
        </div>
      )}

      {/* Map overlay stats */}
      {selectedFarm && (
        <div className="absolute bottom-4 left-4 z-[1000] glass rounded-xl p-3 space-y-2 backdrop-blur-md bg-black/40 border border-white/10">
          <div className="space-y-1">
            <div className="text-xs font-mono text-zinc-400">
              <span className="text-emerald-400">LAT</span> {selectedFarm.coordinates.lat.toFixed(4)}
            </div>
            <div className="text-xs font-mono text-zinc-400">
              <span className="text-emerald-400">LNG</span> {selectedFarm.coordinates.lng.toFixed(4)}
            </div>
            <div className="text-xs font-mono text-zinc-400">
              <span className="text-emerald-400">AREA</span> {selectedFarm.sizeAcres} acres
            </div>
          </div>
          
          {/* NDVI Display */}
          {(verificationStep !== "idle" && verificationStep !== "verifying" && ndviScore !== undefined) && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-[10px] font-bold text-zinc-500 mb-1">SENTINEL-2 NDVI DATA</div>
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${ndviScore >= 0.7 ? 'bg-emerald-500' : ndviScore >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-sm font-mono text-white">{ndviScore.toFixed(3)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Satellite badge */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col items-end gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-black/60 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
          <div className={`h-1.5 w-1.5 rounded-full ${verificationStep === "verifying" ? "bg-blue-400 animate-ping" : "bg-emerald-400 animate-pulse"}`} />
          <span className="text-xs font-mono text-zinc-300">
            {verificationStep === "verifying" ? "DOWNLOADING L2A..." : "LIVE SAT"}
          </span>
        </div>
        
        {verificationStep === "verifying" && (
          <div className="flex items-center gap-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 px-3 py-1.5 backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <span className="text-[10px] font-mono font-bold text-blue-300 animate-pulse">ANALYZING MULTISPECTRAL DATA</span>
          </div>
        )}
      </div>
    </div>
  );
}
