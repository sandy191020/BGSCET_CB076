import { MapContainer, TileLayer, Marker, Rectangle, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

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
  searchPoint?: [number, number] | null;
  isSatellite?: boolean;
}

function MapController({ searchPoint }: { searchPoint?: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (searchPoint) {
      map.flyTo(searchPoint, 16);
    }
  }, [searchPoint, map]);
  return null;
}

function LocationMarker({ 
  onCoordsSelect, 
  initialPosition 
}: { 
  onCoordsSelect?: (lng: number, lat: number) => void;
  initialPosition?: [number, number] | null;
}) {
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPosition ? L.latLng(initialPosition[0], initialPosition[1]) : null
  );
  
  useEffect(() => {
    if (initialPosition) {
      const newPos = L.latLng(initialPosition[0], initialPosition[1]);
      setPosition(newPos);
      if (onCoordsSelect) {
        onCoordsSelect(newPos.lng, newPos.lat);
      }
    }
  }, [initialPosition]);

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
          [position.lat - 0.002, position.lng - 0.002],
          [position.lat + 0.002, position.lng + 0.002]
        ]} 
        pathOptions={{ color: '#10b981', weight: 2, fillOpacity: 0.15, dashArray: '5, 5' }}
      />
    </>
  );
}

export default function LeafletMap({ onCoordsSelect, searchPoint, isSatellite }: LeafletMapProps) {
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
      
      {isSatellite && (
        <TileLayer
          attribution='&copy; ESRI Satellite'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      )}

      <MapController searchPoint={searchPoint} />
      <LocationMarker onCoordsSelect={onCoordsSelect} initialPosition={searchPoint} />
    </MapContainer>
  );
}
