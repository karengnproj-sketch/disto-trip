"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import Link from "next/link";

interface MapMarker {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  subtitle: string;
  link: string;
}

interface MapViewProps {
  center: [number, number];
  markers: MapMarker[];
  zoom?: number;
}

// Custom marker icons
const createIcon = (color: string) =>
  new L.DivIcon({
    className: "",
    html: `<div style="
      width: 24px; height: 24px; border-radius: 50%;
      background: ${color}; border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });

const icons: Record<string, L.DivIcon> = {
  hotels: createIcon("#3B82F6"),
  attractions: createIcon("#F97316"),
  emergency: createIcon("#EF4444"),
  restaurants: createIcon("#EAB308"),
  pharmacies: createIcon("#22C55E"),
  all: createIcon("#39FF14"),
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapView({ center, markers, zoom = 11 }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full z-0"
      zoomControl={true}
      attributionControl={true}
    >
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          position={[marker.latitude, marker.longitude]}
          icon={icons[marker.type] || icons.all}
        >
          <Popup>
            <div className="text-sm min-w-[160px]">
              <p className="font-semibold text-white">{marker.name}</p>
              <p className="text-[#B0B0B0] text-xs mt-1">{marker.subtitle}</p>
              <Link
                href={marker.link}
                className="inline-block mt-2 text-xs text-[#39FF14] hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
