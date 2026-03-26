"use client";

import { useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock, DollarSign, Users, ExternalLink, ChevronRight, Loader2, Navigation, Landmark as LandmarkIcon } from "lucide-react";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { formatPrice, getCategoryLabel, getCategoryEmoji } from "@/lib/utils/format";
import { estimateCrowdLevel } from "@/lib/utils/crowd-estimator";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function AttractionsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const categories = [
    { value: "", label: t("all") },
    { value: "historical", label: t("historical") },
    { value: "cultural", label: t("cultural") },
    { value: "adventure", label: t("adventure") },
    { value: "water_sports", label: t("waterSports") },
    { value: "nature", label: t("nature") },
    { value: "food", label: t("foodDining") },
  ];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("rating");
  const [liveAttractions, setLiveAttractions] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [showLive, setShowLive] = useState(false);

  const loadLiveAttractions = () => {
    setLoadingLive(true);
    // Fetch attractions + historic sites for Cairo area (biggest concentration)
    Promise.all([
      fetch("/api/places?lat=30.0444&lon=31.2357&type=attractions&radius=30000").then(r => r.json()),
      fetch("/api/places?lat=30.0444&lon=31.2357&type=historic&radius=30000").then(r => r.json()),
      fetch("/api/places?lat=25.6872&lon=32.6396&type=attractions&radius=20000").then(r => r.json()),
      fetch("/api/places?lat=27.2579&lon=33.8116&type=attractions&radius=20000").then(r => r.json()),
    ])
      .then(([cairo, historic, luxor, hurghada]) => {
        const all = [...(cairo.places || []), ...(historic.places || []), ...(luxor.places || []), ...(hurghada.places || [])];
        // Dedupe by id
        const unique = Array.from(new Map(all.map((p: any) => [p.id, p])).values());
        setLiveAttractions(unique);
        setShowLive(true);
      })
      .catch(() => {})
      .finally(() => setLoadingLive(false));
  };

  const filtered = useMemo(() => {
    let result = [...attractions];
    if (search) result = result.filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));
    if (category) result = result.filter((a) => a.category === category);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_low") result.sort((a, b) => a.entry_fee_usd - b.entry_fee_usd);
    return result;
  }, [search, category, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          {t("exploreAttractions")} <span className="text-[#39FF14]">{t("attractionsTitle")}</span>
        </h1>
        <p className="text-[#B0B0B0] text-lg">{t("attractionsSubtitle")}</p>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input type="text" placeholder={t("searchAttractions")} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors text-sm" />
        </div>
      </motion.div>

      {/* Category Tabs */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button key={cat.value} onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              category === cat.value
                ? "bg-[#39FF14] text-black"
                : "bg-[#1a1a1a] text-[#B0B0B0] border border-[#333] hover:border-[#39FF14]/50 hover:text-[#39FF14]"
            }`}>
            {cat.label}
          </button>
        ))}
      </motion.div>

      <p className="text-[#666] text-sm mb-6">{filtered.length} {t("attractionsFound")}</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((attr, i) => {
          const city = cities.find((c) => c.id === attr.city_id);
          const crowd = estimateCrowdLevel(attr.crowd_data);
          return (
            <motion.div key={attr.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/attractions/${attr.id}`} className="group block bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/5 transition-all duration-300">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={attr.image_urls[0]} alt={attr.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    {getCategoryEmoji(attr.category)} {getCategoryLabel(attr.category)}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10" style={{ backgroundColor: crowd.color + "30", color: crowd.color }}>
                    {crowd.label}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white text-base mb-2">{isAr && attr.name_ar ? attr.name_ar : attr.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-[#B0B0B0] mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {city?.name}</span>
                    <span className="flex items-center gap-1 text-[#39FF14]"><Star className="w-3 h-3 fill-current" /> {attr.rating}</span>
                  </div>
                  <p className="text-[#666] text-xs line-clamp-2 mb-4">{attr.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-[#B0B0B0]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {attr.duration_hours}h</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {attr.entry_fee_usd === 0 ? "Free" : formatPrice(attr.entry_fee_usd)}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Load More from OpenStreetMap */}
      <div className="mt-10 text-center">
        {!showLive ? (
          <button onClick={loadLiveAttractions} disabled={loadingLive}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] border border-[#39FF14]/30 text-[#39FF14] font-semibold rounded-2xl hover:bg-[#39FF14]/10 transition-all disabled:opacity-50">
            {loadingLive ? <Loader2 className="w-5 h-5 animate-spin" /> : <LandmarkIcon className="w-5 h-5" />}
            {loadingLive
              ? (isAr ? "جاري التحميل..." : "Loading real attractions...")
              : (isAr ? "تحميل المزيد من المعالم من OpenStreetMap" : "Load More Attractions from OpenStreetMap")}
          </button>
        ) : null}

        {showLive && liveAttractions.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white text-left">
                {isAr ? `${liveAttractions.length} معلم من OpenStreetMap` : `${liveAttractions.length} Attractions from OpenStreetMap`}
              </h2>
              <span className="text-xs text-[#666] bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#333]">Live Data</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveAttractions.map((a: any, i: number) => {
                const attrImages = [
                  "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800",
                  "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800",
                  "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800",
                  "https://images.unsplash.com/photo-1568322445389-f64b0f36ecd4?w=800",
                  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
                  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
                ];
                const img = attrImages[i % attrImages.length];

                return (
                  <div key={a.id} className="group bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/5 transition-all duration-300">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img src={img} alt={a.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white capitalize">
                        {a.type?.replace(/_/g, " ")}
                      </div>
                      <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500/90 rounded-full text-[10px] font-bold text-white">
                        OSM
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-white text-base mb-2">{isAr && a.name_ar ? a.name_ar : a.name}</h3>
                      {a.address && <p className="text-[#888] text-xs mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.address}</p>}
                      {a.opening_hours && <p className="text-[#888] text-xs mb-3 flex items-center gap-1"><Clock className="w-3 h-3" /> {a.opening_hours}</p>}
                      <div className="flex gap-2">
                        <a href={`https://www.google.com/maps?q=${a.latitude},${a.longitude}`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#2a2a2a] border border-[#333] rounded-xl text-xs text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
                          <MapPin className="w-3 h-3" /> {isAr ? "الخريطة" : "Map"}
                        </a>
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${a.latitude},${a.longitude}`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl text-xs hover:shadow-lg transition-all">
                          <Navigation className="w-3 h-3" /> {isAr ? "اتجاهات" : "Directions"}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AttractionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-[#666]">Loading...</div>}>
      <AttractionsContent />
    </Suspense>
  );
}
