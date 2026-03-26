"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Clock, Hotel, Landmark, Navigation, ExternalLink } from "lucide-react";
import Link from "next/link";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { useLanguage } from "@/lib/i18n/LanguageContext";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const q = query.toLowerCase();

  const matchedCities = cities.filter(c =>
    c.name.toLowerCase().includes(q) || c.name_ar.includes(query) || c.description.toLowerCase().includes(q)
  );
  const matchedHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(q) || (h.name_ar && h.name_ar.includes(query)) || h.description.toLowerCase().includes(q)
  );
  const matchedAttractions = attractions.filter(a =>
    a.name.toLowerCase().includes(q) || (a.name_ar && a.name_ar.includes(query)) || a.description.toLowerCase().includes(q)
  );

  const totalResults = matchedCities.length + matchedHotels.length + matchedAttractions.length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          {isAr ? "نتائج البحث" : "Search Results"}
        </h1>
        <p className="text-[#B0B0B0] mb-8">
          {totalResults} {isAr ? "نتيجة لـ" : "results for"} &quot;{query}&quot;
        </p>

        {/* Cities */}
        {matchedCities.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#39FF14]" /> {isAr ? "المدن" : "Cities"} ({matchedCities.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {matchedCities.map(city => (
                <Link key={city.id} href={`/hotels?city=${city.slug}`}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img src={city.image_url} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <h3 className="text-white font-bold">{isAr ? city.name_ar : city.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hotels */}
        {matchedHotels.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Hotel className="w-5 h-5 text-blue-400" /> {isAr ? "الفنادق" : "Hotels"} ({matchedHotels.length})
            </h2>
            <div className="space-y-3">
              {matchedHotels.map(hotel => (
                <div key={hotel.id} className="flex gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50 hover:border-[#39FF14]/30 transition-all">
                  <img src={hotel.image_urls[0]} alt={hotel.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{isAr && hotel.name_ar ? hotel.name_ar : hotel.name}</h3>
                    <p className="text-[#666] text-xs mt-1">{"*".repeat(hotel.star_rating)} - {hotel.price_range} - <span className="text-[#39FF14]">{hotel.rating}</span></p>
                    <p className="text-[#888] text-xs mt-1 line-clamp-1">{hotel.description}</p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link href={`/book?hotel=${hotel.id}`} className="px-4 py-2 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black text-xs font-semibold rounded-lg">
                      {isAr ? "احجز" : "Book"}
                    </Link>
                    <a href={`https://www.google.com/maps?q=${hotel.latitude},${hotel.longitude}`} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#2a2a2a] border border-[#333] text-xs text-[#B0B0B0] rounded-lg text-center hover:text-[#39FF14] transition-colors">
                      {isAr ? "خريطة" : "Map"}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attractions */}
        {matchedAttractions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-orange-400" /> {isAr ? "المعالم" : "Attractions"} ({matchedAttractions.length})
            </h2>
            <div className="space-y-3">
              {matchedAttractions.map(attr => (
                <Link key={attr.id} href={`/attractions/${attr.id}`}
                  className="flex gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50 hover:border-[#39FF14]/30 transition-all">
                  <img src={attr.image_urls[0]} alt={attr.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{isAr && attr.name_ar ? attr.name_ar : attr.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#666] mt-1">
                      <span className="text-[#39FF14]"><Star className="w-3 h-3 inline" /> {attr.rating}</span>
                      <span><Clock className="w-3 h-3 inline" /> {attr.duration_hours}h</span>
                      <span>{attr.entry_fee_usd === 0 ? (isAr ? "مجاني" : "Free") : `$${attr.entry_fee_usd}`}</span>
                    </div>
                    <p className="text-[#888] text-xs mt-1 line-clamp-1">{attr.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {totalResults === 0 && (
          <div className="text-center py-20">
            <Search className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-[#666] text-lg">{isAr ? "لم يتم العثور على نتائج" : "No results found"}</p>
            <p className="text-[#555] text-sm mt-2">{isAr ? "جرب كلمات بحث مختلفة" : "Try different search terms"}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-[#666]">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
