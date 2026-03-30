"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Hotel, Compass, Shield, ChevronRight, Star, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cities } from "@/data/seed-cities";
import { attractions } from "@/data/seed-attractions";
import { hotels } from "@/data/seed-hotels";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const { t, locale } = useLanguage();
  const topAttractions = attractions.slice(0, 4);
  const isAr = locale === "ar";

  const interests = [
    { name: t("food"), emoji: "🍽️", color: "from-orange-500 to-red-500", href: "/attractions?category=food" },
    { name: t("trips"), emoji: "✈️", color: "from-blue-500 to-cyan-500", href: "/attractions?category=adventure" },
    { name: t("culture"), emoji: "🎭", color: "from-purple-500 to-pink-500", href: "/attractions?category=cultural" },
    { name: t("history"), emoji: "🏛️", color: "from-amber-500 to-yellow-500", href: "/attractions?category=historical" },
    { name: t("nature"), emoji: "🌿", color: "from-green-500 to-emerald-500", href: "/attractions?category=nature" },
    { name: isAr ? "رياضات مائية" : "Water Sports", emoji: "🤿", color: "from-cyan-500 to-blue-500", href: "/attractions?category=water_sports" },
  ];

  // Search across all data
  const searchResults = searchQuery.length > 1
    ? [
        ...cities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(c => ({ type: "city" as const, name: c.name, href: `/hotels?city=${c.slug}`, sub: "City" })),
        ...hotels.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase())).map(h => ({ type: "hotel" as const, name: h.name, href: "/hotels", sub: "Hotel" })),
        ...attractions.filter(a => a.name.toLowerCase().includes(searchQuery.toLowerCase())).map(a => ({ type: "attraction" as const, name: a.name, href: `/attractions/${a.id}`, sub: a.category })),
      ].slice(0, 8)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/95 to-[#0a0a0a]" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        {/* Animated Glow */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#39FF14]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#00E676]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 italic"
          >
            <span className="text-[#39FF14]">{t("heroTitle1")}</span>{" "}
            <span className="text-white">{t("heroTitle2")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-[#B0B0B0] text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            {t("heroSubtitle")}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="relative max-w-xl mx-auto"
          >
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] group-focus-within:text-[#39FF14] transition-colors z-10" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#333]/50 rounded-2xl text-white placeholder-[#666] focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/20 transition-all text-sm md:text-base"
              />
            </form>
            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden z-50 shadow-2xl">
                {searchResults.map((r, i) => (
                  <Link
                    key={i}
                    href={r.href}
                    onClick={() => { setShowResults(false); setSearchQuery(""); }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-[#2a2a2a] transition-colors border-b border-[#333]/30 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-[#39FF14]" />
                      <span className="text-white text-sm">{r.name}</span>
                    </div>
                    <span className="text-[#666] text-xs capitalize">{r.sub}</span>
                  </Link>
                ))}
                <div className="px-4 py-2 bg-[#0f0f0f] text-[#666] text-xs text-center">
                  Press Enter to search all results
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {[
              { label: "Hotels", icon: Hotel, href: "/hotels" },
              { label: "Discover", icon: Compass, href: "/discover" },
              { label: "Emergency", icon: Shield, href: "/emergency" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2a2a2a]/80 backdrop-blur-sm border border-[#333]/50 rounded-full text-sm text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-all duration-300"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-[#666]/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 rounded-full bg-[#39FF14]" />
          </div>
        </motion.div>
      </section>

      {/* Featured Banner */}
      <section className="px-4 py-12 max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#39FF14]/20 to-[#00E676]/10 border border-[#39FF14]/20 p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=400"
                alt="Pyramids of Giza"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                {t("findThings")}{" "}
                <span className="text-[#39FF14]">{t("egypt")}</span>
              </h2>
              <p className="text-[#B0B0B0] mb-6">
                {t("exclusiveOffers")}
              </p>
              <Link href="/hotels" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white rounded-full font-semibold hover:bg-[#2a2a2a] transition-all">
                {t("clickHere")} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Popular Destinations */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {t("popularDestinations")} <span className="bg-gradient-to-r from-[#39FF14] to-[#00E676] bg-clip-text text-transparent">{t("destinations")}</span>
          </h2>
          <p className="text-[#B0B0B0] max-w-2xl mx-auto">
            {t("destinationsSubtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((city, i) => (
            <motion.div key={city.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Link href={`/hotels?city=${city.slug}`} className="group relative block aspect-[4/5] rounded-2xl overflow-hidden">
                <img src={city.image_url} alt={city.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-lg font-bold text-white">{isAr ? city.name_ar : city.name}</h3>
                  <p className="text-sm text-[#B0B0B0] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {isAr ? city.name : city.name_ar}
                  </p>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-8 rounded-full bg-[#39FF14] flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-black" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Attractions */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">{t("topAttractions")}</h2>
            <p className="text-[#B0B0B0]">{t("mustVisit")}</p>
          </div>
          <Link href="/attractions" className="text-[#39FF14] text-sm font-medium hover:underline flex items-center gap-1">
            {t("clickForMore")} <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topAttractions.map((attr, i) => (
            <motion.div key={attr.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Link href={`/attractions/${attr.id}`} className="group block bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={attr.image_urls[0]} alt={attr.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">{attr.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-[#B0B0B0]">
                    <span className="flex items-center gap-1 text-[#39FF14]">
                      <Star className="w-3 h-3 fill-current" /> {attr.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {attr.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {(attr.review_count / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Find by Interest */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-10">
          <h2 className="text-[#39FF14] font-bold text-lg mb-2">{t("findByInterest")}</h2>
          <p className="text-[#B0B0B0]">{t("whateverInto")}</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {interests.map((interest, i) => (
            <motion.div key={interest.name} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
              <Link href={interest.href} className="group relative block aspect-square rounded-2xl overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${interest.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl mb-2">{interest.emoji}</span>
                  <span className="text-white font-bold text-lg">{interest.name}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Book Your Trip CTA */}
      <section className="px-4 py-16">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1920')", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 py-20 px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">{t("bookYourTrip")}</h2>
            <p className="text-[#B0B0B0] text-lg mb-8 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" /> {t("bookCTA")}
            </p>
            <Link href="/hotels" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-bold rounded-full text-lg hover:shadow-lg hover:shadow-[#39FF14]/25 hover:scale-105 transition-all duration-300">
              {t("startExploring")} <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* About Us */}
      <section className="px-4 py-16 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              {t("aboutUs")} <span className="bg-gradient-to-r from-[#39FF14] to-[#00E676] bg-clip-text text-transparent">{t("us")}</span>
            </h2>
            <div className="space-y-4 text-[#B0B0B0] leading-relaxed">
              <p className="font-semibold text-white text-lg">{t("atDistoTrip")}</p>
              <p>{t("aboutText1")}</p>
              <p>{t("aboutText2")}</p>
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="rounded-3xl overflow-hidden aspect-[4/3]">
            <img src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800" alt="Egyptian sunset" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
