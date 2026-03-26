"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Plane, Hotel, Landmark, MapPin, Plus, Trash2, ChevronDown, ChevronUp,
  Navigation, Clock, DollarSign, Calendar, Share2, Car, Sun, Moon,
  Coffee, UtensilsCrossed, Camera, Wallet, ExternalLink, Copy, Check,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { hotels } from "@/data/seed-hotels";
import { attractions } from "@/data/seed-attractions";
import { cities } from "@/data/seed-cities";
import { airports } from "@/lib/utils/transport";
import { estimateTransportCosts } from "@/lib/utils/transport";
import { getDistance } from "@/lib/utils/distance";

interface ItineraryItem {
  id: string;
  type: "flight" | "hotel" | "attraction" | "transport" | "meal" | "free";
  name: string;
  time: string;
  cost_egp: number;
  notes: string;
  latitude?: number;
  longitude?: number;
}

interface DayPlan {
  id: string;
  date: string;
  label: string;
  items: ItineraryItem[];
  expanded: boolean;
}

const mealCosts = { breakfast: 100, lunch: 250, dinner: 400 };
const USD_TO_EGP = 50.5;

export default function PlannerPage() {
  const { locale } = useLanguage();
  const isAr = locale === "ar";

  const [tripName, setTripName] = useState(isAr ? "رحلتي إلى مصر" : "My Egypt Trip");
  const [arrivalAirport, setArrivalAirport] = useState("cairo");
  const [startDate, setStartDate] = useState("");
  const [numDays, setNumDays] = useState(5);
  const [days, setDays] = useState<DayPlan[]>([]);
  const [showAddMenu, setShowAddMenu] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  // Generate days
  const generateDays = () => {
    if (!startDate) return;
    const newDays: DayPlan[] = [];
    for (let i = 0; i < numDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      newDays.push({
        id: `day-${i}`,
        date: dateStr,
        label: i === 0 ? (isAr ? "يوم الوصول" : "Arrival Day") : i === numDays - 1 ? (isAr ? "يوم المغادرة" : "Departure Day") : `${isAr ? "اليوم" : "Day"} ${i + 1}`,
        items: i === 0 ? [
          { id: `arrival-${Date.now()}`, type: "flight", name: isAr ? "الوصول إلى المطار" : `Arrive at ${airports[arrivalAirport as keyof typeof airports]?.name || "Cairo Airport"}`, time: "10:00", cost_egp: 0, notes: isAr ? "احصل على الأمتعة وتأشيرة الدخول" : "Collect luggage, get visa on arrival" },
          { id: `taxi-${Date.now()}`, type: "transport", name: isAr ? "تاكسي من المطار إلى الفندق" : "Taxi from airport to hotel", time: "11:30", cost_egp: 400, notes: isAr ? "استخدم أوبر أو كريم" : "Use Uber or Careem app" },
          { id: `lunch-${Date.now()}`, type: "meal", name: isAr ? "غداء" : "Lunch", time: "13:00", cost_egp: mealCosts.lunch, notes: "" },
        ] : [],
        expanded: i === 0,
      });
    }
    setDays(newDays);
  };

  const addItem = (dayId: string, item: ItineraryItem) => {
    setDays(prev => prev.map(d =>
      d.id === dayId ? { ...d, items: [...d.items, item] } : d
    ));
    setShowAddMenu(null);
  };

  const removeItem = (dayId: string, itemId: string) => {
    setDays(prev => prev.map(d =>
      d.id === dayId ? { ...d, items: d.items.filter(i => i.id !== itemId) } : d
    ));
  };

  const toggleDay = (dayId: string) => {
    setDays(prev => prev.map(d =>
      d.id === dayId ? { ...d, expanded: !d.expanded } : d
    ));
  };

  const totalCost = days.reduce((sum, d) => sum + d.items.reduce((s, i) => s + i.cost_egp, 0), 0);

  const itemIcons: Record<string, React.ReactNode> = {
    flight: <Plane className="w-4 h-4" />,
    hotel: <Hotel className="w-4 h-4" />,
    attraction: <Camera className="w-4 h-4" />,
    transport: <Car className="w-4 h-4" />,
    meal: <UtensilsCrossed className="w-4 h-4" />,
    free: <Coffee className="w-4 h-4" />,
  };

  const itemColors: Record<string, string> = {
    flight: "bg-blue-500/20 text-blue-400",
    hotel: "bg-purple-500/20 text-purple-400",
    attraction: "bg-orange-500/20 text-orange-400",
    transport: "bg-cyan-500/20 text-cyan-400",
    meal: "bg-yellow-500/20 text-yellow-400",
    free: "bg-green-500/20 text-green-400",
  };

  const handleShare = () => {
    const text = `${tripName}\n\n` + days.map(d =>
      `${d.label} (${d.date}):\n` + d.items.map(i => `  ${i.time} - ${i.name} (${i.cost_egp} EGP)`).join("\n")
    ).join("\n\n") + `\n\nTotal: ${totalCost.toLocaleString()} EGP ($${Math.round(totalCost / USD_TO_EGP)})`;

    if (navigator.share) {
      navigator.share({ title: tripName, text });
    } else {
      navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          <span className="text-[#39FF14]">{isAr ? "خطط" : "Plan"}</span> {isAr ? "رحلتك" : "Your Trip"}
        </h1>
        <p className="text-[#B0B0B0] text-lg mb-8">
          {isAr ? "خطط رحلتك يوماً بيوم مع تقدير التكاليف" : "Plan your Egypt trip day by day with cost estimates"}
        </p>

        {/* Trip Setup */}
        {days.length === 0 && (
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6 mb-8">
            <h2 className="text-lg font-bold text-white mb-4">{isAr ? "إعداد الرحلة" : "Trip Setup"}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white mb-2">{isAr ? "اسم الرحلة" : "Trip Name"}</label>
                <input type="text" value={tripName} onChange={e => setTripName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]" />
              </div>
              <div>
                <label className="block text-sm text-white mb-2">{isAr ? "مطار الوصول" : "Arrival Airport"}</label>
                <select value={arrivalAirport} onChange={e => setArrivalAirport(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]">
                  {Object.entries(airports).map(([key, ap]) => (
                    <option key={key} value={key}>{isAr ? ap.name_ar : ap.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-white mb-2">{isAr ? "تاريخ الوصول" : "Arrival Date"}</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]" />
              </div>
              <div>
                <label className="block text-sm text-white mb-2">{isAr ? "عدد الأيام" : "Number of Days"}</label>
                <select value={numDays} onChange={e => setNumDays(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]">
                  {[3,4,5,6,7,8,9,10,14,21].map(n => <option key={n} value={n}>{n} {isAr ? "أيام" : "days"}</option>)}
                </select>
              </div>
            </div>
            <button onClick={generateDays} disabled={!startDate}
              className="w-full py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all disabled:opacity-50">
              {isAr ? "إنشاء خطة الرحلة" : "Generate Trip Plan"}
            </button>
          </div>
        )}

        {/* Cost Summary */}
        {days.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-[#333]/50 px-5 py-3 flex items-center gap-3">
              <Wallet className="w-5 h-5 text-[#39FF14]" />
              <div>
                <p className="text-xs text-[#666]">{isAr ? "التكلفة الإجمالية" : "Total Cost"}</p>
                <p className="text-lg font-bold text-[#39FF14]">{totalCost.toLocaleString()} EGP</p>
                <p className="text-xs text-[#888]">${Math.round(totalCost / USD_TO_EGP)}</p>
              </div>
            </div>
            <div className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-[#333]/50 px-5 py-3 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-[#666]">{isAr ? "المدة" : "Duration"}</p>
                <p className="text-lg font-bold text-white">{numDays} {isAr ? "أيام" : "days"}</p>
              </div>
            </div>
            <button onClick={handleShare}
              className="bg-[#1a1a1a]/60 backdrop-blur-xl rounded-2xl border border-[#333]/50 px-5 py-3 flex items-center gap-2 text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
              {shared ? <Check className="w-4 h-4 text-[#39FF14]" /> : <Share2 className="w-4 h-4" />}
              <span className="text-sm">{shared ? (isAr ? "تم النسخ!" : "Copied!") : (isAr ? "مشاركة" : "Share")}</span>
            </button>
          </div>
        )}

        {/* Day Plans */}
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day.id} className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 overflow-hidden">
              {/* Day Header */}
              <button onClick={() => toggleDay(day.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-[#2a2a2a]/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#39FF14]/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#39FF14]" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{day.label}</h3>
                    <p className="text-[#666] text-xs">{day.date} - {day.items.length} {isAr ? "أنشطة" : "activities"} - {day.items.reduce((s, i) => s + i.cost_egp, 0).toLocaleString()} EGP</p>
                  </div>
                </div>
                {day.expanded ? <ChevronUp className="w-5 h-5 text-[#666]" /> : <ChevronDown className="w-5 h-5 text-[#666]" />}
              </button>

              {/* Day Items */}
              {day.expanded && (
                <div className="px-5 pb-5">
                  <div className="space-y-2 mb-4">
                    {day.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${itemColors[item.type]}`}>
                          {itemIcons[item.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[#39FF14] text-xs font-mono">{item.time}</span>
                            <span className="text-white text-sm font-medium truncate">{item.name}</span>
                          </div>
                          {item.notes && <p className="text-[#666] text-xs mt-0.5">{item.notes}</p>}
                        </div>
                        <div className="text-right flex-shrink-0 flex items-center gap-2">
                          {item.cost_egp > 0 && <span className="text-[#39FF14] text-xs font-semibold">{item.cost_egp} EGP</span>}
                          {item.latitude && (
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-[#666] hover:text-[#39FF14] transition-colors">
                              <Navigation className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button onClick={() => removeItem(day.id, item.id)} className="text-[#666] hover:text-[#FF4444] transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Item */}
                  <div className="relative">
                    <button onClick={() => setShowAddMenu(showAddMenu === day.id ? null : day.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-[#333] rounded-xl text-xs text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/30 transition-all">
                      <Plus className="w-3.5 h-3.5" /> {isAr ? "إضافة نشاط" : "Add Activity"}
                    </button>

                    {showAddMenu === day.id && (
                      <div className="absolute left-0 top-full mt-2 w-80 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                        {/* Hotels */}
                        <div className="p-3 border-b border-[#333]">
                          <p className="text-xs text-[#666] font-medium mb-2">{isAr ? "فنادق" : "Hotels"}</p>
                          {hotels.slice(0, 4).map(h => (
                            <button key={h.id} onClick={() => addItem(day.id, {
                              id: `${h.id}-${Date.now()}`, type: "hotel", name: h.name, time: "14:00",
                              cost_egp: Math.round(h.price_per_night_usd * USD_TO_EGP), notes: `${h.star_rating} star`,
                              latitude: h.latitude, longitude: h.longitude,
                            })} className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-xs text-[#B0B0B0] flex justify-between">
                              <span className="truncate flex-1">{h.name}</span>
                              <span className="text-[#39FF14] ml-2">{Math.round(h.price_per_night_usd * USD_TO_EGP).toLocaleString()} EGP</span>
                            </button>
                          ))}
                        </div>
                        {/* Attractions */}
                        <div className="p-3 border-b border-[#333]">
                          <p className="text-xs text-[#666] font-medium mb-2">{isAr ? "معالم سياحية" : "Attractions"}</p>
                          {attractions.slice(0, 6).map(a => (
                            <button key={a.id} onClick={() => addItem(day.id, {
                              id: `${a.id}-${Date.now()}`, type: "attraction", name: a.name, time: "09:00",
                              cost_egp: Math.round(a.entry_fee_usd * USD_TO_EGP), notes: `${a.duration_hours}h`,
                              latitude: a.latitude, longitude: a.longitude,
                            })} className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-xs text-[#B0B0B0] flex justify-between">
                              <span className="truncate flex-1">{a.name}</span>
                              <span className="text-[#39FF14] ml-2">{a.entry_fee_usd === 0 ? "Free" : `${Math.round(a.entry_fee_usd * USD_TO_EGP)} EGP`}</span>
                            </button>
                          ))}
                        </div>
                        {/* Quick Add */}
                        <div className="p-3">
                          <p className="text-xs text-[#666] font-medium mb-2">{isAr ? "إضافة سريعة" : "Quick Add"}</p>
                          {[
                            { name: isAr ? "فطور" : "Breakfast", type: "meal" as const, cost: 100, time: "08:00" },
                            { name: isAr ? "غداء" : "Lunch", type: "meal" as const, cost: 250, time: "13:00" },
                            { name: isAr ? "عشاء" : "Dinner", type: "meal" as const, cost: 400, time: "20:00" },
                            { name: isAr ? "تاكسي / أوبر" : "Taxi / Uber", type: "transport" as const, cost: 150, time: "12:00" },
                            { name: isAr ? "وقت حر" : "Free Time", type: "free" as const, cost: 0, time: "15:00" },
                          ].map((q, qi) => (
                            <button key={qi} onClick={() => addItem(day.id, {
                              id: `quick-${qi}-${Date.now()}`, type: q.type, name: q.name, time: q.time,
                              cost_egp: q.cost, notes: "",
                            })} className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-xs text-[#B0B0B0] flex justify-between">
                              <span>{q.name}</span>
                              <span className="text-[#39FF14]">{q.cost === 0 ? "Free" : `${q.cost} EGP`}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        {days.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setDays([])}
              className="px-6 py-3 border border-[#333] text-[#B0B0B0] rounded-xl hover:text-white transition-all text-sm">
              {isAr ? "إعادة ضبط" : "Reset Plan"}
            </button>
            <Link href="/budget"
              className="px-6 py-3 border border-[#39FF14]/30 text-[#39FF14] rounded-xl hover:bg-[#39FF14]/10 transition-all text-sm flex items-center gap-2">
              <Wallet className="w-4 h-4" /> {isAr ? "مخطط الميزانية" : "Budget Planner"}
            </Link>
            <Link href="/hotels"
              className="px-6 py-3 bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black font-semibold rounded-xl hover:shadow-lg transition-all text-sm flex items-center gap-2">
              <Hotel className="w-4 h-4" /> {isAr ? "تصفح الفنادق" : "Browse Hotels"}
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
