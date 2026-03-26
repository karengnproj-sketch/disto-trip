"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, DollarSign, Users, ExternalLink, Navigation, ArrowLeft, Info, Car, Train } from "lucide-react";
import Link from "next/link";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { formatPrice, getCategoryLabel, getCategoryEmoji } from "@/lib/utils/format";
import { estimateCrowdLevel } from "@/lib/utils/crowd-estimator";
import { estimateTransportCosts } from "@/lib/utils/transport";
import { useGeolocation } from "@/hooks/useGeolocation";
import dynamic from "next/dynamic";

const WeatherWidget = dynamic(() => import("@/components/shared/WeatherWidget"), { ssr: false });
import { getDistance } from "@/lib/utils/distance";
import { useState, useEffect } from "react";

interface WikiData {
  extract: string;
  thumbnail?: string;
}

export default function AttractionDetailPage() {
  const params = useParams();
  const attraction = attractions.find((a) => a.id === params.id);
  const city = attraction ? cities.find((c) => c.id === attraction.city_id) : null;
  const crowd = attraction ? estimateCrowdLevel(attraction.crowd_data) : null;
  const geo = useGeolocation();
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [wikiLoading, setWikiLoading] = useState(false);

  const distanceKm = attraction && geo.latitude
    ? getDistance(geo.latitude, geo.longitude!, attraction.latitude, attraction.longitude)
    : null;
  const transportOptions = distanceKm ? estimateTransportCosts(distanceKm) : [];

  useEffect(() => {
    if (!attraction?.wikipedia_slug) return;
    setWikiLoading(true);
    fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(attraction.wikipedia_slug)}`
    )
      .then((res) => res.json())
      .then((data) => {
        setWikiData({
          extract: data.extract || "",
          thumbnail: data.thumbnail?.source,
        });
      })
      .catch(() => {})
      .finally(() => setWikiLoading(false));
  }, [attraction?.wikipedia_slug]);

  if (!attraction) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <p className="text-[#666] text-lg mb-4">Attraction not found</p>
        <Link href="/attractions" className="text-[#39FF14] hover:underline">Back to Attractions</Link>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}`;

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Image */}
      <div className="relative h-[40vh] md:h-[50vh]">
        <img src={attraction.image_urls[0]} alt={attraction.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
        <Link href="/attractions" className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm hover:bg-black/70 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        {crowd && (
          <div className="absolute top-4 right-4 z-10 px-4 py-2 rounded-full text-sm font-bold" style={{ backgroundColor: crowd.color + "30", color: crowd.color }}>
            {crowd.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Title Card */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 text-xs text-[#B0B0B0] mb-3">
              <span className="px-3 py-1 bg-[#2a2a2a] rounded-full">
                {getCategoryEmoji(attraction.category)} {getCategoryLabel(attraction.category)}
              </span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {city?.name}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{attraction.name}</h1>
            <p className="text-[#B0B0B0] text-sm mb-2">{attraction.name_ar}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-[#B0B0B0] mb-6">
              <span className="flex items-center gap-1 text-[#39FF14]"><Star className="w-4 h-4 fill-current" /> {attraction.rating} <span className="text-[#666]">({attraction.review_count.toLocaleString()} reviews)</span></span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {attraction.duration_hours} hours</span>
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {attraction.entry_fee_usd === 0 ? "Free Entry" : formatPrice(attraction.entry_fee_usd)}</span>
            </div>

            <p className="text-[#B0B0B0] leading-relaxed mb-6">{attraction.description}</p>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {attraction.ticket_url ? (
                <a href={attraction.ticket_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 hover:scale-[1.02] transition-all text-sm">
                  Get Tickets <ExternalLink className="w-4 h-4" />
                </a>
              ) : (
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name + " Egypt")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 hover:scale-[1.02] transition-all text-sm">
                  View on Google Maps <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-[#39FF14] text-[#39FF14] font-semibold rounded-xl hover:bg-[#39FF14] hover:text-black transition-all text-sm">
                <Navigation className="w-4 h-4" /> Navigate Here
              </a>
            </div>
          </div>

          {/* Weather at this location */}
          <div className="mb-6">
            <WeatherWidget city={city?.name || "Cairo"} />
          </div>

          {/* Wikipedia Landmark Explainer */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 md:p-8 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Info className="w-5 h-5 text-[#39FF14]" /> Landmark Guide
            </h2>
            {wikiLoading ? (
              <div className="space-y-3">
                <div className="h-4 bg-[#2a2a2a] rounded animate-pulse w-full" />
                <div className="h-4 bg-[#2a2a2a] rounded animate-pulse w-3/4" />
                <div className="h-4 bg-[#2a2a2a] rounded animate-pulse w-5/6" />
              </div>
            ) : wikiData ? (
              <div className="flex flex-col md:flex-row gap-6">
                {wikiData.thumbnail && (
                  <img src={wikiData.thumbnail} alt={attraction.name} className="w-full md:w-48 h-48 object-cover rounded-xl flex-shrink-0" />
                )}
                <div>
                  <p className="text-[#B0B0B0] leading-relaxed text-sm">{wikiData.extract}</p>
                  <a href={`https://en.wikipedia.org/wiki/${attraction.wikipedia_slug}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-4 text-[#39FF14] text-sm hover:underline">
                    Read more on Wikipedia <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-[#666] text-sm">No additional information available.</p>
            )}
          </div>

          {/* Opening Hours */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Opening Hours</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(attraction.opening_hours).map(([day, hours]) => (
                <div key={day} className="bg-[#2a2a2a] rounded-xl p-3 text-center">
                  <p className="text-xs text-[#666] uppercase mb-1">{day}</p>
                  <p className="text-sm text-white font-medium">{hours}</p>
                </div>
              ))}
            </div>
          </div>

          {/* How to Get There + Transport Estimates */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 md:p-8 mb-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <Car className="w-5 h-5 text-[#39FF14]" /> How to Get There
            </h2>
            {distanceKm !== null && (
              <p className="text-[#B0B0B0] text-sm mb-4">
                Approximately {distanceKm < 1 ? `${Math.round(distanceKm * 1000)}m` : `${distanceKm.toFixed(1)}km`} from your location
              </p>
            )}

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden mb-4 border border-[#333]">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${attraction.latitude},${attraction.longitude}&zoom=15&maptype=roadmap`}
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>

            <div className="flex gap-3 mb-4">
              <a href={`https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-sm text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
                <MapPin className="w-4 h-4" /> Open in Google Maps
              </a>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${attraction.latitude},${attraction.longitude}&travelmode=driving`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-sm text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
                <Navigation className="w-4 h-4" /> Get Directions
              </a>
            </div>

            {/* Transport Options */}
            {transportOptions.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-[#666] font-medium">Estimated transport costs:</p>
                {transportOptions.map((opt) => (
                  <div key={opt.type} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center">
                      {opt.type === "metro" ? <Train className="w-5 h-5 text-[#39FF14]" /> : <Car className="w-5 h-5 text-[#39FF14]" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{opt.name_en}</p>
                      <p className="text-[#666] text-xs">{opt.notes_en}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#39FF14] text-sm font-bold">
                        {opt.cost_egp_min === 0 ? "Free" : `${opt.cost_egp_min}-${opt.cost_egp_max} EGP`}
                      </p>
                      <p className="text-[#666] text-xs">{opt.duration_min} min</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
