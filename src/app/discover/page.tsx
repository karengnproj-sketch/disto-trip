"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Hotel, Landmark, Shield, MapPin, Search, Layers, UtensilsCrossed, Pill, Building } from "lucide-react";
import dynamic from "next/dynamic";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { emergencyFacilities } from "@/data/emergency-numbers";
import { cities } from "@/data/seed-cities";
import { fetchNearbyPOIs, OverpassPOI } from "@/lib/api/overpass";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const MapComponent = dynamic(() => import("@/components/map/MapView"), { ssr: false });

type Category = "all" | "hotels" | "attractions" | "emergency" | "restaurants" | "pharmacies";

interface Marker {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  subtitle: string;
  link: string;
}

export default function DiscoverPage() {
  const [category, setCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("cairo");
  const [livePOIs, setLivePOIs] = useState<OverpassPOI[]>([]);
  const [loadingPOIs, setLoadingPOIs] = useState(false);
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const cityData = cities.find((c) => c.slug === selectedCity);
  const center: [number, number] = cityData
    ? [cityData.latitude, cityData.longitude]
    : [30.0444, 31.2357];

  // Fetch live POIs when city or category changes
  useEffect(() => {
    if (category !== "restaurants" && category !== "pharmacies") {
      setLivePOIs([]);
      return;
    }
    setLoadingPOIs(true);
    fetchNearbyPOIs(center[0], center[1], category, 5000, 40)
      .then(setLivePOIs)
      .finally(() => setLoadingPOIs(false));
  }, [selectedCity, category, center[0], center[1]]);

  const markers = useMemo(() => {
    const allMarkers: Marker[] = [];

    // Live POIs from Overpass
    if (category === "restaurants" || category === "pharmacies") {
      livePOIs.forEach((poi) => {
        allMarkers.push({
          id: poi.id,
          name: poi.name,
          type: poi.category,
          latitude: poi.latitude,
          longitude: poi.longitude,
          subtitle: poi.type.replace(/_/g, " "),
          link: `https://www.google.com/maps/search/?api=1&query=${poi.latitude},${poi.longitude}`,
        });
      });
    }

    if (category === "all" || category === "hotels") {
      hotels.forEach((h) => {
        allMarkers.push({
          id: h.id, name: h.name, type: "hotels",
          latitude: h.latitude, longitude: h.longitude,
          subtitle: `${h.star_rating}★ · ${h.price_range} · ${h.rating}⭐`,
          link: `/hotels`,
        });
      });
    }

    if (category === "all" || category === "attractions") {
      attractions.forEach((a) => {
        allMarkers.push({
          id: a.id, name: a.name, type: "attractions",
          latitude: a.latitude, longitude: a.longitude,
          subtitle: `${a.category} · ${a.rating}⭐`,
          link: `/attractions/${a.id}`,
        });
      });
    }

    if (category === "all" || category === "emergency") {
      emergencyFacilities.forEach((e) => {
        allMarkers.push({
          id: e.id, name: e.name, type: "emergency",
          latitude: e.latitude, longitude: e.longitude,
          subtitle: `${e.type} · ${e.is_24h ? "24h" : ""}`,
          link: `/emergency`,
        });
      });
    }

    if (search) {
      return allMarkers.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    }
    return allMarkers;
  }, [category, search, livePOIs]);

  const categoryButtons = [
    { value: "all" as Category, label: isAr ? "الكل" : "All", icon: Layers },
    { value: "hotels" as Category, label: t("hotels"), icon: Hotel },
    { value: "attractions" as Category, label: t("attractions"), icon: Landmark },
    { value: "restaurants" as Category, label: isAr ? "مطاعم ومقاهي" : "Food & Cafes", icon: UtensilsCrossed },
    { value: "pharmacies" as Category, label: isAr ? "صيدليات" : "Pharmacies", icon: Pill },
    { value: "emergency" as Category, label: t("emergency"), icon: Shield },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-[#1a1a1a] border-b border-[#333]/50 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
              <input type="text" placeholder={t("searchPlaces")} value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors" />
            </div>

            <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2.5 px-4 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]">
              {cities.map((c) => <option key={c.id} value={c.slug}>{isAr ? c.name_ar : c.name}</option>)}
            </select>

            <div className="flex gap-2 flex-wrap justify-center">
              {categoryButtons.map((btn) => (
                <button key={btn.value} onClick={() => setCategory(btn.value)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                    category === btn.value ? "bg-[#39FF14] text-black" : "bg-[#2a2a2a] text-[#B0B0B0] hover:text-white hover:bg-[#333]"
                  }`}>
                  <btn.icon className="w-3.5 h-3.5" />
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ height: "calc(100vh - 130px)" }}>
        <MapComponent center={center} markers={markers} zoom={selectedCity === "cairo" || selectedCity === "giza" ? 12 : 11} />

        {/* Loading indicator for live POIs */}
        {loadingPOIs && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-4 py-2 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#39FF14]/30 rounded-xl">
            <p className="text-xs text-[#39FF14] animate-pulse">{isAr ? "جاري تحميل البيانات من OpenStreetMap..." : "Loading live data from OpenStreetMap..."}</p>
          </div>
        )}

        <div className="absolute bottom-6 left-4 z-[1000] bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#333] rounded-xl p-3">
          <p className="text-xs font-medium text-white mb-2">{isAr ? "دليل الرموز" : "Legend"}</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[#B0B0B0]"><div className="w-3 h-3 rounded-full bg-blue-500" /> {t("hotels")}</div>
            <div className="flex items-center gap-2 text-xs text-[#B0B0B0]"><div className="w-3 h-3 rounded-full bg-orange-500" /> {t("attractions")}</div>
            <div className="flex items-center gap-2 text-xs text-[#B0B0B0]"><div className="w-3 h-3 rounded-full bg-yellow-500" /> {isAr ? "مطاعم ومقاهي" : "Food & Cafes"}</div>
            <div className="flex items-center gap-2 text-xs text-[#B0B0B0]"><div className="w-3 h-3 rounded-full bg-green-500" /> {isAr ? "صيدليات" : "Pharmacies"}</div>
            <div className="flex items-center gap-2 text-xs text-[#B0B0B0]"><div className="w-3 h-3 rounded-full bg-red-500" /> {t("emergency")}</div>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-[1000] px-4 py-2 bg-[#1a1a1a]/90 backdrop-blur-sm border border-[#333] rounded-xl">
          <p className="text-xs text-[#B0B0B0]">
            <span className="text-[#39FF14] font-bold">{markers.length}</span> {t("placesFound")}
          </p>
        </div>
      </div>
    </div>
  );
}
