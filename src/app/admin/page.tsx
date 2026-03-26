"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Hotel,
  Landmark,
  MapPin,
  Star,
  Users,
  Clock,
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  GitBranch,
  ExternalLink,
  ShieldCheck,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { formatPrice } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";

type Tab = "hotels" | "attractions" | "cities" | "bookings";

const mockBookings = [
  {
    id: "bk-001",
    guest: "Ahmed Hassan",
    hotel: "Marriott Mena House",
    checkIn: "2026-04-10",
    checkOut: "2026-04-14",
    status: "Pending" as const,
    total: 1000,
  },
  {
    id: "bk-002",
    guest: "Sarah Miller",
    hotel: "Four Seasons Hotel Cairo at Nile Plaza",
    checkIn: "2026-04-05",
    checkOut: "2026-04-08",
    status: "Confirmed" as const,
    total: 1200,
  },
  {
    id: "bk-003",
    guest: "James Wilson",
    hotel: "Sofitel Winter Palace Luxor",
    checkIn: "2026-04-15",
    checkOut: "2026-04-18",
    status: "Pending" as const,
    total: 600,
  },
  {
    id: "bk-004",
    guest: "Fatma Ali",
    hotel: "Jaz Mirabel Beach Resort",
    checkIn: "2026-03-28",
    checkOut: "2026-04-02",
    status: "Cancelled" as const,
    total: 750,
  },
  {
    id: "bk-005",
    guest: "Omar Khaled",
    hotel: "Hilton Hurghada Resort",
    checkIn: "2026-04-20",
    checkOut: "2026-04-25",
    status: "Pending" as const,
    total: 650,
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-yellow-500/20 text-yellow-400",
  Confirmed: "bg-green-500/20 text-green-400",
  Cancelled: "bg-red-500/20 text-red-400",
};

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <AlertCircle className="w-3.5 h-3.5" />,
  Confirmed: <CheckCircle className="w-3.5 h-3.5" />,
  Cancelled: <XCircle className="w-3.5 h-3.5" />,
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("hotels");
  const { user, isAdmin, loading } = useAuth();

  // Auth guard - only admins can access
  if (loading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center text-[#666]">Loading...</div>;
  }
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <Shield className="w-16 h-16 text-[#FF4444] mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-[#666] mb-6">You need admin privileges to access this page.</p>
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl">
          Go Home
        </Link>
      </div>
    );
  }

  const stats = [
    { label: "Total Hotels", value: hotels.length, icon: Hotel, color: "#39FF14" },
    { label: "Total Attractions", value: attractions.length, icon: Landmark, color: "#00E676" },
    { label: "Total Cities", value: cities.length, icon: MapPin, color: "#39FF14" },
    { label: "Pending Bookings", value: mockBookings.filter((b) => b.status === "Pending").length, icon: Clock, color: "#00E676" },
  ];

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "hotels", label: "Hotels", icon: <Hotel className="w-4 h-4" /> },
    { key: "attractions", label: "Attractions", icon: <Landmark className="w-4 h-4" /> },
    { key: "cities", label: "Cities", icon: <MapPin className="w-4 h-4" /> },
    { key: "bookings", label: "Bookings", icon: <Users className="w-4 h-4" /> },
  ];

  const getCityName = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    return city?.name || "Unknown";
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              <span className="text-[#39FF14]">Admin</span> Dashboard
            </h1>
            <p className="text-[#B0B0B0] text-lg">Manage your content, bookings, and listings</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 hover:scale-[1.02] transition-all duration-300 text-sm">
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Admin-only documentation links */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/design-system.html" target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333]/50 rounded-xl text-xs font-medium text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
            <FileText className="w-3.5 h-3.5" /> Design System
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="/uml-diagrams.html" target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333]/50 rounded-xl text-xs font-medium text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
            <GitBranch className="w-3.5 h-3.5" /> UML Diagrams
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link href="https://github.com/karengnproj-sketch/disto-trip" target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#333]/50 rounded-xl text-xs font-medium text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
            <ShieldCheck className="w-3.5 h-3.5" /> GitHub Repo
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5 hover:border-[#39FF14]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[#666] text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-6 overflow-x-auto pb-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#39FF14] text-black"
                : "bg-[#1a1a1a] text-[#B0B0B0] border border-[#333]/50 hover:border-[#39FF14]/30 hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden"
      >
        {/* Hotels Tab */}
        {activeTab === "hotels" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]/50">
                  <th className="text-left text-[#666] font-medium px-6 py-4">Hotel Name</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">City</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Stars</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Price/Night</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Rating</th>
                  <th className="text-right text-[#666] font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="border-b border-[#333]/30 hover:bg-[#2a2a2a]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={hotel.image_urls[0]} alt={hotel.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-white font-medium">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#B0B0B0]">{getCityName(hotel.city_id)}</td>
                    <td className="px-6 py-4">
                      <span className="text-yellow-400">{"★".repeat(hotel.star_rating)}</span>
                    </td>
                    <td className="px-6 py-4 text-[#39FF14] font-medium">{formatPrice(hotel.price_per_night_usd)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white">
                        <Star className="w-3.5 h-3.5 text-[#39FF14] fill-current" /> {hotel.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-[#39FF14] hover:bg-[#333] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-red-400 hover:bg-[#333] transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Attractions Tab */}
        {activeTab === "attractions" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]/50">
                  <th className="text-left text-[#666] font-medium px-6 py-4">Attraction</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">City</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Category</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Entry Fee</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Rating</th>
                  <th className="text-right text-[#666] font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attractions.map((attr) => (
                  <tr key={attr.id} className="border-b border-[#333]/30 hover:bg-[#2a2a2a]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={attr.image_urls[0]} alt={attr.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="text-white font-medium">{attr.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#B0B0B0]">{getCityName(attr.city_id)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-[#2a2a2a] rounded-lg text-[#B0B0B0] text-xs capitalize">{attr.category.replace(/_/g, " ")}</span>
                    </td>
                    <td className="px-6 py-4 text-[#39FF14] font-medium">
                      {attr.entry_fee_usd === 0 ? "Free" : formatPrice(attr.entry_fee_usd)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white">
                        <Star className="w-3.5 h-3.5 text-[#39FF14] fill-current" /> {attr.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-[#39FF14] hover:bg-[#333] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-red-400 hover:bg-[#333] transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === "cities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {cities.map((city, i) => (
              <motion.div
                key={city.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-[#2a2a2a] rounded-xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 transition-all duration-300"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={city.image_url} alt={city.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-semibold">{city.name}</h3>
                    <span className="text-[#666] text-xs">{city.name_ar}</span>
                  </div>
                  <p className="text-[#666] text-xs line-clamp-2 mb-3">{city.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#B0B0B0] text-xs flex items-center gap-1">
                      <Hotel className="w-3 h-3" /> {hotels.filter((h) => h.city_id === city.id).length} hotels
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#B0B0B0] hover:text-[#39FF14] transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#B0B0B0] hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#333]/50">
                  <th className="text-left text-[#666] font-medium px-6 py-4">Guest</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Hotel</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Check-in</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Check-out</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Total</th>
                  <th className="text-left text-[#666] font-medium px-6 py-4">Status</th>
                  <th className="text-right text-[#666] font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-[#333]/30 hover:bg-[#2a2a2a]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#39FF14] font-semibold text-xs">
                          {booking.guest.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span className="text-white font-medium">{booking.guest}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#B0B0B0] max-w-[200px] truncate">{booking.hotel}</td>
                    <td className="px-6 py-4 text-[#B0B0B0]">{booking.checkIn}</td>
                    <td className="px-6 py-4 text-[#B0B0B0]">{booking.checkOut}</td>
                    <td className="px-6 py-4 text-[#39FF14] font-medium">{formatPrice(booking.total)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                        {statusIcons[booking.status]}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === "Pending" && (
                          <>
                            <button className="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-between mt-6 text-[#666] text-xs"
      >
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span>Disto-Trip Admin Panel</span>
        </div>
        <span>Last updated: March 26, 2026</span>
      </motion.div>
    </div>
  );
}
