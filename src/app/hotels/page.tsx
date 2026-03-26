"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Wifi, Waves, Dumbbell, UtensilsCrossed, Car, ChevronDown, ExternalLink } from "lucide-react";
import { hotels } from "@/data/seed-hotels";
import { cities } from "@/data/seed-cities";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-3.5 h-3.5" />,
  pool: <Waves className="w-3.5 h-3.5" />,
  gym: <Dumbbell className="w-3.5 h-3.5" />,
  restaurant: <UtensilsCrossed className="w-3.5 h-3.5" />,
  parking: <Car className="w-3.5 h-3.5" />,
};

function HotelsContent() {
  const searchParams = useSearchParams();
  const initialCity = searchParams.get("city") || "";

  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState(initialCity);
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [priceFilter, setPriceFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = useMemo(() => {
    let result = [...hotels];
    if (search) result = result.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));
    if (cityFilter) result = result.filter((h) => {
      const city = cities.find((c) => c.id === h.city_id);
      return city?.slug === cityFilter;
    });
    if (starFilter) result = result.filter((h) => h.star_rating === starFilter);
    if (priceFilter) result = result.filter((h) => h.price_range === priceFilter);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price_low") result.sort((a, b) => a.price_per_night_usd - b.price_per_night_usd);
    else if (sortBy === "price_high") result.sort((a, b) => b.price_per_night_usd - a.price_per_night_usd);
    return result;
  }, [search, cityFilter, starFilter, priceFilter, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-[#39FF14]">Book</span> Your Hotel Now
        </h1>
        <p className="text-[#B0B0B0] text-lg">Enjoy more than 50,000 Hotels in Egypt</p>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
            <input type="text" placeholder="Search hotels..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] transition-colors text-sm" />
          </div>
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
            className="py-3 px-4 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14] appearance-none cursor-pointer">
            <option value="">All Cities</option>
            {cities.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={starFilter?.toString() || ""} onChange={(e) => setStarFilter(e.target.value ? Number(e.target.value) : null)}
            className="py-3 px-4 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14] appearance-none cursor-pointer">
            <option value="">All Stars</option>
            {[5, 4, 3, 2].map((s) => <option key={s} value={s}>{s} Stars</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="py-3 px-4 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14] appearance-none cursor-pointer">
            <option value="rating">Sort by Rating</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
          </select>
        </div>
      </motion.div>

      {/* Results Count */}
      <p className="text-[#666] text-sm mb-6">{filtered.length} hotels found</p>

      {/* Hotel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hotel, i) => {
          const city = cities.find((c) => c.id === hotel.city_id);
          return (
            <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="group bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/5 transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={hotel.image_urls[0]} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                    {hotel.price_range}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 bg-[#39FF14]/90 rounded-full text-xs font-bold text-black">
                    {formatPrice(hotel.price_per_night_usd)}/night
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white text-base leading-tight flex-1 mr-2">{hotel.name}</h3>
                    <div className="flex items-center gap-1 text-[#39FF14] text-sm font-medium flex-shrink-0">
                      <Star className="w-3.5 h-3.5 fill-current" /> {hotel.rating}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[#B0B0B0] text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{city?.name || "Egypt"}</span>
                    <span className="mx-1">·</span>
                    <span>{"★".repeat(hotel.star_rating)} {hotel.star_rating}-star</span>
                  </div>

                  <p className="text-[#666] text-xs line-clamp-2 mb-4">{hotel.description}</p>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.slice(0, 5).map((amenity) => (
                      <span key={amenity} className="flex items-center gap-1 px-2 py-1 bg-[#2a2a2a] rounded-lg text-[10px] text-[#B0B0B0]">
                        {amenityIcons[amenity] || null}
                        {amenity.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>

                  {/* Book Button */}
                  <Link
                    href={`/book?hotel=${hotel.id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 hover:scale-[1.02] transition-all duration-300 text-sm"
                  >
                    Book Now <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#666] text-lg">No hotels found matching your criteria.</p>
          <button onClick={() => { setSearch(""); setCityFilter(""); setStarFilter(null); setPriceFilter(""); }}
            className="mt-4 text-[#39FF14] hover:underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center text-[#666]">Loading...</div>}>
      <HotelsContent />
    </Suspense>
  );
}
