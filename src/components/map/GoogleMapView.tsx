"use client";

import { useEffect, useRef, useState } from "react";

interface MapMarker {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  subtitle: string;
  link: string;
}

interface GoogleMapViewProps {
  center: [number, number];
  markers: MapMarker[];
  zoom?: number;
}

const markerColors: Record<string, string> = {
  hotels: "#3B82F6",
  attractions: "#F97316",
  emergency: "#EF4444",
  restaurants: "#EAB308",
  pharmacies: "#22C55E",
  all: "#39FF14",
};

export default function GoogleMapView({ center, markers, zoom = 12 }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Load Google Maps script
  useEffect(() => {
    if (typeof window !== "undefined" && !(window as any).google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&libraries=marker&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !(window as any).google?.maps) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: center[0], lng: center[1] },
      zoom,
      mapId: "disto-trip-dark",
      styles: [
        { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#8899aa" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#2a2a3e" }] },
        { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#666" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1b2a" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#39FF14" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1e2d3d" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8899aa" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2e1a" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#2a2a3e" }] },
      ],
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: true,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
  }, [mapLoaded]);

  // Update center
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: center[0], lng: center[1] });
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach((m) => (m.map = null));
    markersRef.current = [];

    const map = mapInstanceRef.current;

    markers.forEach((marker) => {
      const color = markerColors[marker.type] || markerColors.all;

      // Create custom marker element
      const pinEl = document.createElement("div");
      pinEl.style.width = "28px";
      pinEl.style.height = "28px";
      pinEl.style.borderRadius = "50%";
      pinEl.style.background = color;
      pinEl.style.border = "3px solid white";
      pinEl.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)";
      pinEl.style.cursor = "pointer";

      try {
        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: marker.latitude, lng: marker.longitude },
          map,
          title: marker.name,
          content: pinEl,
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="background:#1a1a1a;color:white;padding:12px;border-radius:12px;min-width:180px;font-family:Inter,sans-serif;">
              <p style="font-weight:600;font-size:13px;margin:0 0 4px">${marker.name}</p>
              <p style="color:#B0B0B0;font-size:11px;margin:0 0 8px">${marker.subtitle}</p>
              <a href="${marker.link}" style="color:#39FF14;font-size:11px;text-decoration:none;">View details</a>
              <span style="margin:0 6px;color:#333">|</span>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${marker.latitude},${marker.longitude}" target="_blank" rel="noopener noreferrer" style="color:#39FF14;font-size:11px;text-decoration:none;">Directions</a>
            </div>
          `,
        });

        advancedMarker.addListener("click", () => {
          infoWindow.open({ anchor: advancedMarker, map });
        });

        markersRef.current.push(advancedMarker);
      } catch {
        // Fallback to regular marker if AdvancedMarkerElement not available
        const regularMarker = new google.maps.Marker({
          position: { lat: marker.latitude, lng: marker.longitude },
          map,
          title: marker.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: color,
            fillOpacity: 1,
            strokeColor: "white",
            strokeWeight: 2,
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="background:#1a1a1a;color:white;padding:12px;border-radius:12px;min-width:180px;font-family:Inter,sans-serif;">
              <p style="font-weight:600;font-size:13px;margin:0 0 4px">${marker.name}</p>
              <p style="color:#B0B0B0;font-size:11px;margin:0 0 8px">${marker.subtitle}</p>
              <a href="${marker.link}" style="color:#39FF14;font-size:11px;text-decoration:none;">View details</a>
              <span style="margin:0 6px;color:#333">|</span>
              <a href="https://www.google.com/maps/dir/?api=1&destination=${marker.latitude},${marker.longitude}" target="_blank" rel="noopener noreferrer" style="color:#39FF14;font-size:11px;text-decoration:none;">Directions</a>
            </div>
          `,
        });

        regularMarker.addListener("click", () => {
          infoWindow.open({ anchor: regularMarker, map });
        });
      }
    });
  }, [markers, mapLoaded]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
          <p className="text-[#39FF14] text-sm animate-pulse">Loading Google Maps...</p>
        </div>
      )}
    </div>
  );
}
