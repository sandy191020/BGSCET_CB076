"use client";

import { MapContainer, TileLayer, Marker, Rectangle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Fix for default marker icon issue in Leaflet + Next.js
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface LeafletMapProps {
  onCoordsSelect?: (lng: number, lat: number) => void;
}

function LocationMarker({ onCoordsSelect }: { onCoordsSelect?: (lng: number, lat: number) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      if (onCoordsSelect) {
        onCoordsSelect(e.latlng.lng, e.latlng.lat);
      }
    },
  });

  return position === null ? null : (
    <>
      <Marker position={position} icon={customIcon} />
      <Rectangle 
        bounds={[
          [position.lat - 0.005, position.lng - 0.005],
          [position.lat + 0.005, position.lng + 0.005]
        ]} 
        pathOptions={{ color: '#10b981', weight: 2, fillOpacity: 0.1 }}
      />
    </>
  );
}

export default function LeafletMap({ onCoordsSelect }: LeafletMapProps) {
  return (
    <MapContainer 
      center={[12.9716, 77.5946]} 
      zoom={13} 
      style={{ height: "100%", width: "100%" }}
      className="z-0 h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Optional Satellite Layer */}
      <TileLayer
        attribution='&copy; ESRI'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        opacity={0.5}
      />

      <LocationMarker onCoordsSelect={onCoordsSelect} />
    </MapContainer>
  );
}
