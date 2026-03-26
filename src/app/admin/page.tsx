"use client";

import { useState, useEffect } from "react";
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
  UserCog,
  MessageSquareWarning,
  Ban,
  Eye,
  AlertTriangle,
  X,
  Send,
  Save,
} from "lucide-react";
import Link from "next/link";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { formatPrice } from "@/lib/utils/format";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

type Tab = "hotels" | "attractions" | "cities" | "bookings" | "users" | "complaints";

const mockBookings = [
  { id: "bk-001", guest: "Ahmed Hassan", hotel: "Marriott Mena House", checkIn: "2026-04-10", checkOut: "2026-04-14", status: "Pending", total: 1000 },
  { id: "bk-002", guest: "Sarah Miller", hotel: "Four Seasons Hotel Cairo at Nile Plaza", checkIn: "2026-04-05", checkOut: "2026-04-08", status: "Confirmed", total: 1200 },
  { id: "bk-003", guest: "James Wilson", hotel: "Sofitel Winter Palace Luxor", checkIn: "2026-04-15", checkOut: "2026-04-18", status: "Pending", total: 600 },
  { id: "bk-004", guest: "Fatma Ali", hotel: "Jaz Mirabel Beach Resort", checkIn: "2026-03-28", checkOut: "2026-04-02", status: "Cancelled", total: 750 },
  { id: "bk-005", guest: "Omar Khaled", hotel: "Hilton Hurghada Resort", checkIn: "2026-04-20", checkOut: "2026-04-25", status: "Pending", total: 650 },
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

const complaintStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  in_review: "bg-blue-500/20 text-blue-400",
  forwarded: "bg-purple-500/20 text-purple-400",
  resolved: "bg-green-500/20 text-green-400",
  dismissed: "bg-[#666]/20 text-[#666]",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("hotels");
  const { user, isAdmin, loading } = useAuth();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Live data from Supabase
  const [liveUsers, setLiveUsers] = useState<any[]>([]);
  const [liveComplaints, setLiveComplaints] = useState<any[]>([]);

  // Bookings local state
  const [bookings, setBookings] = useState(mockBookings);

  // Modal states
  const [hotelModal, setHotelModal] = useState<{ open: boolean; mode: "add" | "edit"; data: any }>({ open: false, mode: "add", data: null });
  const [attractionModal, setAttractionModal] = useState<{ open: boolean; mode: "add" | "edit"; data: any }>({ open: false, mode: "add", data: null });
  const [cityModal, setCityModal] = useState<{ open: boolean; mode: "add" | "edit"; data: any }>({ open: false, mode: "add", data: null });
  const [complaintModal, setComplaintModal] = useState<{ open: boolean; data: any }>({ open: false, data: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; type: string; id: string; name: string }>({ open: false, type: "", id: "", name: "" });

  // Complaint review state
  const [complaintNotes, setComplaintNotes] = useState("");
  const [complaintStatus, setComplaintStatus] = useState("pending");

  // Form states
  const [hotelForm, setHotelForm] = useState({ name: "", city_id: "", star_rating: 5, price_per_night_usd: 0, amenities: "" });
  const [attractionForm, setAttractionForm] = useState({ name: "", category: "", entry_fee_usd: 0, duration_hours: 1, description: "" });
  const [cityForm, setCityForm] = useState({ name: "", name_ar: "", description: "", latitude: 0, longitude: 0 });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Load real data from Supabase
  useEffect(() => {
    if (!isAdmin) return;
    const supabase = createClient();
    supabase.from("profiles").select("*").then(({ data }) => {
      if (data && data.length > 0) {
        setLiveUsers(data.map((u: any) => ({
          id: u.id,
          name: u.full_name || "User",
          email: u.id.slice(0, 8) + "...",
          role: u.role || "user",
          status: u.is_banned ? "banned" : "active",
          joined: new Date(u.created_at).toISOString().split("T")[0],
        })));
      }
    });
    supabase.from("complaints").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data && data.length > 0) {
        setLiveComplaints(data.map((c: any) => ({
          id: c.id,
          user: c.user_name || "Anonymous",
          email: c.user_email || "",
          category: c.category,
          subject: c.subject,
          description: c.description || "",
          status: c.status,
          admin_notes: c.admin_notes || "",
          date: new Date(c.created_at).toISOString().split("T")[0],
          location: c.location || "",
        })));
      }
    });
  }, [isAdmin]);

  const handleBanUser = async (userId: string, currentlyBanned: boolean) => {
    setActionLoading(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({ is_banned: !currentlyBanned }).eq("id", userId);
    setLiveUsers(prev => prev.map(u => u.id === userId ? { ...u, status: currentlyBanned ? "active" : "banned" } : u));
    setActionLoading(null);
    showToast(currentlyBanned ? "User unbanned" : "User banned");
  };

  const handleMakeAdmin = async (userId: string) => {
    setActionLoading(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({ role: "admin" }).eq("id", userId);
    setLiveUsers(prev => prev.map(u => u.id === userId ? { ...u, role: "admin" } : u));
    setActionLoading(null);
    showToast("User promoted to admin");
  };

  const handleSaveComplaint = async () => {
    if (!complaintModal.data) return;
    setActionLoading(complaintModal.data.id);
    const supabase = createClient();
    await supabase.from("complaints").update({
      status: complaintStatus,
      admin_notes: complaintNotes,
      updated_at: new Date().toISOString(),
    }).eq("id", complaintModal.data.id);
    setLiveComplaints(prev => prev.map(c =>
      c.id === complaintModal.data.id ? { ...c, status: complaintStatus, admin_notes: complaintNotes } : c
    ));
    setActionLoading(null);
    showToast("Complaint updated successfully");
    setComplaintModal({ open: false, data: null });
  };

  const handleForwardComplaint = async () => {
    if (!complaintModal.data) return;
    setActionLoading(complaintModal.data.id);
    const supabase = createClient();
    await supabase.from("complaints").update({
      status: "forwarded",
      admin_notes: complaintNotes,
      updated_at: new Date().toISOString(),
    }).eq("id", complaintModal.data.id);
    setLiveComplaints(prev => prev.map(c =>
      c.id === complaintModal.data.id ? { ...c, status: "forwarded", admin_notes: complaintNotes } : c
    ));
    setComplaintStatus("forwarded");
    setActionLoading(null);
    showToast("Complaint forwarded to authorities");
  };

  const openComplaintReview = (complaint: any) => {
    setComplaintModal({ open: true, data: complaint });
    setComplaintNotes(complaint.admin_notes || "");
    setComplaintStatus(complaint.status);
  };

  const handleBookingAction = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    showToast(`Booking ${newStatus.toLowerCase()}`);
  };

  const openHotelEdit = (hotel: any) => {
    setHotelForm({
      name: hotel.name,
      city_id: hotel.city_id,
      star_rating: hotel.star_rating,
      price_per_night_usd: hotel.price_per_night_usd,
      amenities: hotel.amenities?.join(", ") || "",
    });
    setHotelModal({ open: true, mode: "edit", data: hotel });
  };

  const openHotelAdd = () => {
    setHotelForm({ name: "", city_id: "", star_rating: 5, price_per_night_usd: 0, amenities: "" });
    setHotelModal({ open: true, mode: "add", data: null });
  };

  const openAttractionEdit = (attr: any) => {
    setAttractionForm({
      name: attr.name,
      category: attr.category,
      entry_fee_usd: attr.entry_fee_usd,
      duration_hours: attr.duration_hours,
      description: attr.description,
    });
    setAttractionModal({ open: true, mode: "edit", data: attr });
  };

  const openAttractionAdd = () => {
    setAttractionForm({ name: "", category: "", entry_fee_usd: 0, duration_hours: 1, description: "" });
    setAttractionModal({ open: true, mode: "add", data: null });
  };

  const openCityEdit = (city: any) => {
    setCityForm({
      name: city.name,
      name_ar: city.name_ar,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
    });
    setCityModal({ open: true, mode: "edit", data: city });
  };

  const openCityAdd = () => {
    setCityForm({ name: "", name_ar: "", description: "", latitude: 0, longitude: 0 });
    setCityModal({ open: true, mode: "add", data: null });
  };

  const handleDeleteConfirm = () => {
    showToast(`${deleteConfirm.type} "${deleteConfirm.name}" deleted`);
    setDeleteConfirm({ open: false, type: "", id: "", name: "" });
  };

  // Auth guard
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
    { label: "Pending Bookings", value: bookings.filter((b) => b.status === "Pending").length, icon: Clock, color: "#00E676" },
  ];

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "hotels", label: "Hotels", icon: <Hotel className="w-4 h-4" /> },
    { key: "attractions", label: "Attractions", icon: <Landmark className="w-4 h-4" /> },
    { key: "cities", label: "Cities", icon: <MapPin className="w-4 h-4" /> },
    { key: "bookings", label: "Bookings", icon: <Clock className="w-4 h-4" /> },
    { key: "users", label: "Users", icon: <UserCog className="w-4 h-4" /> },
    { key: "complaints", label: "Complaints", icon: <MessageSquareWarning className="w-4 h-4" /> },
  ];

  const getCityName = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    return city?.name || "Unknown";
  };

  // Reusable modal overlay
  const ModalOverlay = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-[#333] rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg text-[#666] hover:text-white hover:bg-[#2a2a2a] transition-colors">
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] px-5 py-3 bg-[#39FF14] text-black font-semibold rounded-xl shadow-lg shadow-[#39FF14]/25 animate-pulse text-sm">
          {toast}
        </div>
      )}

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
              <span className="text-[#39FF14]">Admin</span> Dashboard
            </h1>
            <p className="text-[#B0B0B0] text-lg">Manage your content, bookings, and listings</p>
          </div>
          <button
            onClick={() => {
              if (activeTab === "hotels") openHotelAdd();
              else if (activeTab === "attractions") openAttractionAdd();
              else if (activeTab === "cities") openCityAdd();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 hover:scale-[1.02] transition-all duration-300 text-sm"
          >
            <Plus className="w-4 h-4" /> Add New
          </button>
        </div>

        {/* Admin documentation links */}
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5 hover:border-[#39FF14]/30 transition-all duration-300">
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              activeTab === tab.key
                ? "bg-[#39FF14] text-black"
                : "bg-[#1a1a1a] text-[#B0B0B0] border border-[#333]/50 hover:border-[#39FF14]/30 hover:text-white"
            }`}>
            {tab.icon}
            {tab.label}
            {tab.key === "complaints" && liveComplaints.filter(c => c.status === "pending").length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {liveComplaints.filter(c => c.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden">

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
                    <td className="px-6 py-4"><span className="text-yellow-400">{"★".repeat(hotel.star_rating)}</span></td>
                    <td className="px-6 py-4 text-[#39FF14] font-medium">{formatPrice(hotel.price_per_night_usd)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-white">
                        <Star className="w-3.5 h-3.5 text-[#39FF14] fill-current" /> {hotel.rating}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openHotelEdit(hotel)} className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-[#39FF14] hover:bg-[#333] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm({ open: true, type: "Hotel", id: hotel.id, name: hotel.name })} className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-red-400 hover:bg-[#333] transition-colors">
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
                        <button onClick={() => openAttractionEdit(attr)} className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-[#39FF14] hover:bg-[#333] transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm({ open: true, type: "Attraction", id: attr.id, name: attr.name })} className="p-2 rounded-lg bg-[#2a2a2a] text-[#B0B0B0] hover:text-red-400 hover:bg-[#333] transition-colors">
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
              <motion.div key={city.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-[#2a2a2a] rounded-xl border border-[#333]/50 overflow-hidden hover:border-[#39FF14]/30 transition-all duration-300">
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
                      <button onClick={() => openCityEdit(city)} className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#B0B0B0] hover:text-[#39FF14] transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteConfirm({ open: true, type: "City", id: city.id, name: city.name })} className="p-1.5 rounded-lg bg-[#1a1a1a] text-[#B0B0B0] hover:text-red-400 transition-colors">
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
                {bookings.map((booking) => (
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
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status] || ""}`}>
                        {statusIcons[booking.status]}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === "Pending" && (
                          <>
                            <button onClick={() => handleBookingAction(booking.id, "Confirmed")} className="px-3 py-1.5 text-[10px] font-medium bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Confirm
                            </button>
                            <button onClick={() => handleBookingAction(booking.id, "Cancelled")} className="px-3 py-1.5 text-[10px] font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Cancel
                            </button>
                          </>
                        )}
                        {booking.status === "Confirmed" && (
                          <span className="text-[10px] text-[#666]">Confirmed</span>
                        )}
                        {booking.status === "Cancelled" && (
                          <span className="text-[10px] text-[#666]">Cancelled</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <p className="text-[#B0B0B0] text-sm">{liveUsers.length} users found</p>
            </div>
            <div className="space-y-3">
              {liveUsers.length === 0 && (
                <div className="text-center py-12 text-[#666]">
                  <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No users loaded yet</p>
                </div>
              )}
              {liveUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-4 bg-[#0a0a0a] rounded-xl border border-[#333]/30">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    u.role === "admin" ? "bg-[#FFB300]/20 text-[#FFB300]" : "bg-[#39FF14]/20 text-[#39FF14]"
                  }`}>
                    {u.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className="text-[#666] text-xs">{u.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    u.role === "admin" ? "bg-[#FFB300]/20 text-[#FFB300]" : "bg-[#39FF14]/20 text-[#39FF14]"
                  }`}>
                    {u.role.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    u.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}>
                    {u.status.toUpperCase()}
                  </span>
                  <p className="text-[#666] text-xs hidden md:block">{u.joined}</p>
                  <div className="flex items-center gap-2">
                    {u.role !== "admin" && (
                      <>
                        <button onClick={() => handleMakeAdmin(u.id)} disabled={actionLoading === u.id}
                          className="px-3 py-1.5 text-[10px] font-medium bg-[#FFB300]/10 text-[#FFB300] rounded-lg hover:bg-[#FFB300]/20 transition-all disabled:opacity-50">
                          {actionLoading === u.id ? "..." : "Make Admin"}
                        </button>
                        <button onClick={() => handleBanUser(u.id, u.status === "banned")} disabled={actionLoading === u.id}
                          className={`px-3 py-1.5 text-[10px] font-medium rounded-lg transition-all disabled:opacity-50 ${
                            u.status === "banned" ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          }`}>
                          {actionLoading === u.id ? "..." : u.status === "banned" ? "Unban" : "Ban"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complaints Tab */}
        {activeTab === "complaints" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <p className="text-[#B0B0B0] text-sm">{liveComplaints.length} complaints</p>
            </div>
            {liveComplaints.length === 0 && (
              <div className="text-center py-12 text-[#666]">
                <MessageSquareWarning className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p>No complaints yet</p>
              </div>
            )}
            <div className="space-y-3">
              {liveComplaints.map((complaint) => (
                <div key={complaint.id} className="p-4 bg-[#0a0a0a] rounded-xl border border-[#333]/30">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF4444]/20 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-[#FF4444]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white text-sm font-semibold">{complaint.subject}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${complaintStatusColors[complaint.status] || ""}`}>
                          {complaint.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#666] mb-2">
                        <span>{complaint.user} ({complaint.email})</span>
                        <span>{complaint.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {complaint.location}</span>
                      </div>
                      <span className="px-2 py-1 bg-[#2a2a2a] rounded-lg text-[10px] text-[#B0B0B0]">{complaint.category}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => openComplaintReview(complaint)}
                        className="px-3 py-1.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-all flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Footer Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between mt-6 text-[#666] text-xs">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4" />
          <span>Disto-Trip Admin Panel</span>
        </div>
        <span>Last updated: March 26, 2026</span>
      </motion.div>

      {/* ========== MODALS ========== */}

      {/* Complaint Review Modal */}
      {complaintModal.open && complaintModal.data && (
        <ModalOverlay onClose={() => setComplaintModal({ open: false, data: null })}>
          <h2 className="text-xl font-bold text-white mb-4 pr-8">Complaint Review</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#666] text-xs block mb-1">Name</label>
                <p className="text-white text-sm bg-[#0a0a0a] rounded-lg px-3 py-2">{complaintModal.data.user}</p>
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Email</label>
                <p className="text-white text-sm bg-[#0a0a0a] rounded-lg px-3 py-2">{complaintModal.data.email}</p>
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Category</label>
                <p className="text-white text-sm bg-[#0a0a0a] rounded-lg px-3 py-2 capitalize">{complaintModal.data.category}</p>
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Location</label>
                <p className="text-white text-sm bg-[#0a0a0a] rounded-lg px-3 py-2">{complaintModal.data.location || "N/A"}</p>
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Date</label>
                <p className="text-white text-sm bg-[#0a0a0a] rounded-lg px-3 py-2">{complaintModal.data.date}</p>
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Current Status</label>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${complaintStatusColors[complaintModal.data.status] || ""}`}>
                  {complaintModal.data.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Subject</label>
              <p className="text-white text-sm bg-[#0a0a0a] rounded-lg px-3 py-2">{complaintModal.data.subject}</p>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Description</label>
              <p className="text-[#B0B0B0] text-sm bg-[#0a0a0a] rounded-lg px-3 py-2 min-h-[60px]">
                {complaintModal.data.description || "No description provided"}
              </p>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Update Status</label>
              <select value={complaintStatus} onChange={(e) => setComplaintStatus(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50">
                <option value="pending">Pending</option>
                <option value="in_review">In Review</option>
                <option value="forwarded">Forwarded</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Admin Notes</label>
              <textarea value={complaintNotes} onChange={(e) => setComplaintNotes(e.target.value)} rows={3} placeholder="Add your notes here..."
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 resize-none placeholder:text-[#666]" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={handleSaveComplaint} disabled={actionLoading === complaintModal.data.id}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all text-sm disabled:opacity-50">
                <Save className="w-4 h-4" /> {actionLoading === complaintModal.data.id ? "Saving..." : "Save Changes"}
              </button>
              <button onClick={handleForwardComplaint} disabled={actionLoading === complaintModal.data.id || complaintStatus === "forwarded"}
                className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/10 text-purple-400 font-medium rounded-xl hover:bg-purple-500/20 transition-all text-sm disabled:opacity-50">
                <Send className="w-4 h-4" /> Forward to Authorities
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Hotel Edit/Add Modal */}
      {hotelModal.open && (
        <ModalOverlay onClose={() => setHotelModal({ open: false, mode: "add", data: null })}>
          <h2 className="text-xl font-bold text-white mb-4 pr-8">{hotelModal.mode === "edit" ? "Edit Hotel" : "Add New Hotel"}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[#666] text-xs block mb-1">Name</label>
              <input type="text" value={hotelForm.name} onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 placeholder:text-[#666]" placeholder="Hotel name" />
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">City</label>
              <select value={hotelForm.city_id} onChange={(e) => setHotelForm({ ...hotelForm, city_id: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50">
                <option value="">Select city</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#666] text-xs block mb-1">Star Rating</label>
                <input type="number" min={1} max={5} value={hotelForm.star_rating} onChange={(e) => setHotelForm({ ...hotelForm, star_rating: Number(e.target.value) })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50" />
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Price per Night (USD)</label>
                <input type="number" min={0} value={hotelForm.price_per_night_usd} onChange={(e) => setHotelForm({ ...hotelForm, price_per_night_usd: Number(e.target.value) })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50" />
              </div>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Amenities (comma separated)</label>
              <input type="text" value={hotelForm.amenities} onChange={(e) => setHotelForm({ ...hotelForm, amenities: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 placeholder:text-[#666]" placeholder="wifi, pool, spa, gym" />
            </div>
            <button onClick={() => { showToast(hotelModal.mode === "edit" ? "Hotel updated successfully" : "Hotel added successfully"); setHotelModal({ open: false, mode: "add", data: null }); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all text-sm">
              <Save className="w-4 h-4" /> {hotelModal.mode === "edit" ? "Save Changes" : "Add Hotel"}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* Attraction Edit/Add Modal */}
      {attractionModal.open && (
        <ModalOverlay onClose={() => setAttractionModal({ open: false, mode: "add", data: null })}>
          <h2 className="text-xl font-bold text-white mb-4 pr-8">{attractionModal.mode === "edit" ? "Edit Attraction" : "Add New Attraction"}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-[#666] text-xs block mb-1">Name</label>
              <input type="text" value={attractionForm.name} onChange={(e) => setAttractionForm({ ...attractionForm, name: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 placeholder:text-[#666]" placeholder="Attraction name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#666] text-xs block mb-1">Category</label>
                <input type="text" value={attractionForm.category} onChange={(e) => setAttractionForm({ ...attractionForm, category: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 placeholder:text-[#666]" placeholder="historical, nature, etc." />
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Entry Fee (USD)</label>
                <input type="number" min={0} value={attractionForm.entry_fee_usd} onChange={(e) => setAttractionForm({ ...attractionForm, entry_fee_usd: Number(e.target.value) })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50" />
              </div>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Duration (hours)</label>
              <input type="number" min={0.5} step={0.5} value={attractionForm.duration_hours} onChange={(e) => setAttractionForm({ ...attractionForm, duration_hours: Number(e.target.value) })}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50" />
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Description</label>
              <textarea value={attractionForm.description} onChange={(e) => setAttractionForm({ ...attractionForm, description: e.target.value })} rows={3}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 resize-none placeholder:text-[#666]" placeholder="Describe the attraction" />
            </div>
            <button onClick={() => { showToast(attractionModal.mode === "edit" ? "Attraction updated" : "Attraction added"); setAttractionModal({ open: false, mode: "add", data: null }); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all text-sm">
              <Save className="w-4 h-4" /> {attractionModal.mode === "edit" ? "Save Changes" : "Add Attraction"}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* City Edit/Add Modal */}
      {cityModal.open && (
        <ModalOverlay onClose={() => setCityModal({ open: false, mode: "add", data: null })}>
          <h2 className="text-xl font-bold text-white mb-4 pr-8">{cityModal.mode === "edit" ? "Edit City" : "Add New City"}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#666] text-xs block mb-1">Name</label>
                <input type="text" value={cityForm.name} onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 placeholder:text-[#666]" placeholder="City name" />
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Arabic Name</label>
                <input type="text" value={cityForm.name_ar} onChange={(e) => setCityForm({ ...cityForm, name_ar: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 placeholder:text-[#666]" placeholder="Arabic name" dir="rtl" />
              </div>
            </div>
            <div>
              <label className="text-[#666] text-xs block mb-1">Description</label>
              <textarea value={cityForm.description} onChange={(e) => setCityForm({ ...cityForm, description: e.target.value })} rows={3}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50 resize-none placeholder:text-[#666]" placeholder="Describe the city" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[#666] text-xs block mb-1">Latitude</label>
                <input type="number" step="0.0001" value={cityForm.latitude} onChange={(e) => setCityForm({ ...cityForm, latitude: Number(e.target.value) })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50" />
              </div>
              <div>
                <label className="text-[#666] text-xs block mb-1">Longitude</label>
                <input type="number" step="0.0001" value={cityForm.longitude} onChange={(e) => setCityForm({ ...cityForm, longitude: Number(e.target.value) })}
                  className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#39FF14]/50" />
              </div>
            </div>
            <button onClick={() => { showToast(cityModal.mode === "edit" ? "City updated" : "City added"); setCityModal({ open: false, mode: "add", data: null }); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all text-sm">
              <Save className="w-4 h-4" /> {cityModal.mode === "edit" ? "Save Changes" : "Add City"}
            </button>
          </div>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.open && (
        <ModalOverlay onClose={() => setDeleteConfirm({ open: false, type: "", id: "", name: "" })}>
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Delete {deleteConfirm.type}?</h2>
            <p className="text-[#666] text-sm mb-6">
              Are you sure you want to delete &quot;{deleteConfirm.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setDeleteConfirm({ open: false, type: "", id: "", name: "" })}
                className="flex-1 px-4 py-2.5 bg-[#2a2a2a] text-[#B0B0B0] font-medium rounded-xl hover:bg-[#333] transition-all text-sm">
                Cancel
              </button>
              <button onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2.5 bg-red-500/20 text-red-400 font-medium rounded-xl hover:bg-red-500/30 transition-all text-sm">
                Delete
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}
