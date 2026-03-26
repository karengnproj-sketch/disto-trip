"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  CalendarDays,
  MessageSquare,
  Hotel,
  Compass,
  Shield,
  Wallet,
  Star,
  MapPin,
  Clock,
  ChevronRight,
  User,
  Bell,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const mockBookings = [
  {
    id: "my-bk-001",
    hotelName: "Marriott Mena House",
    hotelImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
    city: "Giza",
    checkIn: "2026-04-10",
    checkOut: "2026-04-14",
    nights: 4,
    status: "Confirmed" as const,
    total: 1000,
  },
  {
    id: "my-bk-002",
    hotelName: "Sofitel Winter Palace Luxor",
    hotelImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
    city: "Luxor",
    checkIn: "2026-05-01",
    checkOut: "2026-05-04",
    nights: 3,
    status: "Pending" as const,
    total: 600,
  },
];

const recentActivity = [
  { id: 1, action: "Booked a room at Marriott Mena House", time: "2 days ago", icon: CalendarDays, color: "#39FF14" },
  { id: 2, action: "Saved Blue Hole Dahab to favorites", time: "3 days ago", icon: Heart, color: "#00E676" },
  { id: 3, action: "Viewed Valley of the Kings", time: "5 days ago", icon: Compass, color: "#39FF14" },
  { id: 4, action: "Updated booking for Sofitel Winter Palace", time: "1 week ago", icon: CalendarDays, color: "#00E676" },
  { id: 5, action: "Saved Karnak Temple Complex", time: "1 week ago", icon: Heart, color: "#39FF14" },
];

const savedItems = [
  ...hotels.slice(0, 2).map((h) => ({
    id: h.id,
    name: h.name,
    image: h.image_urls[0],
    rating: h.rating,
    type: "Hotel" as const,
    city: cities.find((c) => c.id === h.city_id)?.name || "Egypt",
  })),
  ...attractions.slice(0, 2).map((a) => ({
    id: a.id,
    name: a.name,
    image: a.image_urls[0],
    rating: a.rating,
    type: "Attraction" as const,
    city: cities.find((c) => c.id === a.city_id)?.name || "Egypt",
  })),
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-green-500/20 text-green-400",
  Pending: "bg-yellow-500/20 text-yellow-400",
};

export default function DashboardPage() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const quickActions = [
    { label: isAr ? "تصفح الفنادق" : "Browse Hotels", href: "/hotels", icon: Hotel, color: "from-[#39FF14] to-[#00E676]" },
    { label: isAr ? "استكشف الخريطة" : "Explore Map", href: "/discover", icon: Compass, color: "from-blue-500 to-cyan-500" },
    { label: isAr ? "طوارئ SOS" : "Emergency SOS", href: "/emergency", icon: Shield, color: "from-red-500 to-orange-500" },
    { label: isAr ? "مخطط الميزانية" : "Budget Planner", href: "/budget", icon: Wallet, color: "from-purple-500 to-pink-500" },
  ];

  const userStats = [
    { label: isAr ? "الأماكن المحفوظة" : "Saved Places", value: 5, icon: Heart, color: "#39FF14" },
    { label: isAr ? "الحجوزات" : "Bookings", value: 2, icon: CalendarDays, color: "#00E676" },
    { label: isAr ? "التقييمات" : "Reviews", value: 0, icon: MessageSquare, color: "#39FF14" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#39FF14] to-[#00E676] flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-black" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-1">
              <span className="text-[#39FF14]">My</span> Dashboard
            </h1>
            <p className="text-[#B0B0B0] text-lg">Welcome back, Traveler! Here is your trip overview.</p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        {userStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5 hover:border-[#39FF14]/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="text-[#666] text-sm">{stat.label}</span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#39FF14]" /> Recent Activity
            </h2>
          </div>
          <div className="space-y-1">
            {recentActivity.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#2a2a2a]/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{item.action}</p>
                  <p className="text-[#666] text-xs">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6"
        >
          <h2 className="text-white font-semibold text-lg mb-5">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <Link
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#2a2a2a]/50 border border-[#333]/30 hover:border-[#39FF14]/30 transition-all duration-300 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                    <action.icon className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-[#B0B0B0] text-sm font-medium group-hover:text-white transition-colors flex-1">{action.label}</span>
                  <ChevronRight className="w-4 h-4 text-[#666] group-hover:text-[#39FF14] transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* My Bookings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-xl flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#39FF14]" /> My Bookings
          </h2>
          <Link href="/hotels" className="text-[#39FF14] text-sm font-medium hover:underline flex items-center gap-1">
            Book more <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockBookings.map((booking, i) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.05 }}
              className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 transition-all duration-300"
            >
              <div className="flex">
                <div className="w-32 flex-shrink-0">
                  <img src={booking.hotelImage} alt={booking.hotelName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold text-sm">{booking.hotelName}</h3>
                      <p className="text-[#666] text-xs flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {booking.city}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                      {booking.status === "Confirmed" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#B0B0B0] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {booking.checkIn} to {booking.checkOut}
                    </span>
                    <span>{booking.nights} nights</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#39FF14] font-bold text-sm">{formatPrice(booking.total)}</span>
                    <button className="text-[#B0B0B0] text-xs hover:text-white transition-colors">View Details</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Saved Places */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-xl flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#39FF14]" /> Saved Places
          </h2>
          <Link href="/attractions" className="text-[#39FF14] text-sm font-medium hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {savedItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              className="group bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 hover:shadow-lg hover:shadow-[#39FF14]/5 transition-all duration-300"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white">
                  {item.type}
                </div>
                <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                  <Heart className="w-4 h-4 text-[#39FF14] fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#666] flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.city}
                  </span>
                  <span className="text-[#39FF14] flex items-center gap-1 font-medium">
                    <Star className="w-3 h-3 fill-current" /> {item.rating}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
