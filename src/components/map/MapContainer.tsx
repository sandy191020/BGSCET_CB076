"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapContainerProps {
  onCoordsSelect?: (lng: number, lat: number) => void;
}

export function MapContainer({ onCoordsSelect }: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(77.5946); // Default Bangalore
  const [lat, setLat] = useState(12.9716);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Replace with actual Mapbox token
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false,
    });

    mapRef.current.on("click", (e: mapboxgl.MapMouseEvent) => {
      const { lng, lat } = e.lngLat;
      setLng(lng);
      setLat(lat);
      if (onCoordsSelect) {
        onCoordsSelect(lng, lat);
      }
    });

    return () => mapRef.current?.remove();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      <div ref={mapContainerRef} className="h-full w-full" />
      <div className="pointer-events-none absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-mono text-emerald-500 backdrop-blur-md">
        COORDS: {lat.toFixed(4)}, {lng.toFixed(4)}
      </div>
    </div>
  );
}
