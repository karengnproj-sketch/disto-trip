"use client";

import { motion } from "framer-motion";
import { User, Heart, Settings, LogOut, MapPin, Star, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { createClient } from "@/lib/supabase/client";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const { locale, setLocale } = useLanguage();
  const isAr = locale === "ar";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!authLoading && !user) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <User className="w-16 h-16 text-[#333] mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">{isAr ? "يجب تسجيل الدخول" : "Please Log In"}</h1>
        <p className="text-[#666] mb-6">{isAr ? "تحتاج لتسجيل الدخول لعرض ملفك الشخصي" : "You need to be logged in to view your profile"}</p>
        <Link href="/auth/login" className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl">
          {isAr ? "تسجيل الدخول" : "Log In"}
        </Link>
      </div>
    );
  }
  const [activeTab, setActiveTab] = useState<"saved" | "settings">("saved");

  // Mock saved places for demo
  const savedHotels = hotels.slice(0, 2);
  const savedAttractions = attractions.slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00E676] mx-auto mb-4 flex items-center justify-center">
          <User className="w-12 h-12 text-black" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">{user?.name || (isAr ? "مسافر" : "Traveler")}</h1>
        <p className="text-[#B0B0B0] text-sm">Welcome to your Disto-Trip profile</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => setActiveTab("saved")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "saved" ? "bg-[#39FF14] text-black" : "bg-[#1a1a1a] text-[#B0B0B0] border border-[#333]"
          }`}>
          <Heart className="w-4 h-4" /> Saved Places
        </button>
        <button onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
            activeTab === "settings" ? "bg-[#39FF14] text-black" : "bg-[#1a1a1a] text-[#B0B0B0] border border-[#333]"
          }`}>
          <Settings className="w-4 h-4" /> Settings
        </button>
      </div>

      {/* Saved Places Tab */}
      {activeTab === "saved" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-bold text-white mb-4">Saved Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {savedHotels.map((hotel) => (
              <div key={hotel.id} className="flex gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50">
                <img src={hotel.image_urls[0]} alt={hotel.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{hotel.name}</h3>
                  <p className="text-[#666] text-xs flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {hotel.address}</p>
                  <p className="text-[#39FF14] text-xs flex items-center gap-1 mt-1"><Star className="w-3 h-3 fill-current" /> {hotel.rating}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-white mb-4">Saved Attractions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedAttractions.map((attr) => (
              <Link key={attr.id} href={`/attractions/${attr.id}`} className="flex gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50 hover:border-[#39FF14]/30 transition-all">
                <img src={attr.image_urls[0]} alt={attr.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-sm truncate">{attr.name}</h3>
                  <p className="text-[#666] text-xs mt-1">{attr.category}</p>
                  <p className="text-[#39FF14] text-xs flex items-center gap-1 mt-1"><Star className="w-3 h-3 fill-current" /> {attr.rating}</p>
                </div>
              </Link>
            ))}
          </div>

          {savedHotels.length === 0 && savedAttractions.length === 0 && (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-[#333] mx-auto mb-4" />
              <p className="text-[#666]">No saved places yet</p>
              <Link href="/discover" className="text-[#39FF14] text-sm hover:underline mt-2 inline-block">Start exploring</Link>
            </div>
          )}
        </motion.div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-[#39FF14]" />
              <div>
                <p className="text-white text-sm font-medium">Language</p>
                <p className="text-[#666] text-xs">Choose your preferred language</p>
              </div>
            </div>
            <select value={locale} onChange={(e) => setLocale(e.target.value as "en" | "ar")}
              className="py-2 px-3 bg-[#2a2a2a] border border-[#333] rounded-lg text-white text-sm">
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          <button onClick={handleLogout} className="flex items-center gap-3 w-full p-4 bg-[#1a1a1a] rounded-2xl border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">{isAr ? "تسجيل الخروج" : "Log Out"}</span>
          </button>
        </motion.div>
      )}
    </div>
  );
}
