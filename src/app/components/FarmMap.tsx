"use client";

import { useEffect, useRef, useState } from "react";
import type { Farm } from "../../../lib/types";

interface FarmMapProps {
  selectedFarm: Farm | null;
  onFarmSelect?: (farm: Farm) => void;
  className?: string;
}

// We use Leaflet via the react-leaflet wrappers already installed
// This component renders a satellite tile map with a farm polygon overlay.
export function FarmMap({ selectedFarm, onFarmSelect, className = "" }: FarmMapProps) {
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

  const { MapContainer, TileLayer, Polygon, Marker, Popup, useMap } = MapComponents;

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

  const polygonPositions: [number, number][] = selectedFarm?.coordinates?.polygon
    ? selectedFarm.coordinates.polygon.map(([lng, lat]) => [lat, lng])
    : [];

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
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.2,
              weight: 2,
              dashArray: "6, 4",
            }}
          />
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

      {/* Map overlay stats */}
      {selectedFarm && (
        <div className="absolute bottom-4 left-4 z-[1000] glass rounded-xl p-3 space-y-1">
          <div className="text-xs font-mono text-zinc-400">
            <span className="text-emerald-400">LAT</span> {selectedFarm.coordinates.lat.toFixed(4)}
          </div>
          <div className="text-xs font-mono text-zinc-400">
            <span className="text-emerald-400">LNG</span> {selectedFarm.coordinates.lng.toFixed(4)}
          </div>
          <div className="text-xs font-mono text-zinc-400">
            <span className="text-emerald-400">SIZE</span> {selectedFarm.sizeAcres} acres
          </div>
        </div>
      )}

      {/* Satellite badge */}
      <div className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 rounded-full bg-black/60 border border-white/10 px-3 py-1.5 backdrop-blur-sm">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono text-zinc-300">LIVE SAT</span>
      </div>
    </div>
  );
}
