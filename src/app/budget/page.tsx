"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, DollarSign, ArrowRightLeft, Plus, Trash2, MapPin, Clock, TrendingDown, Wallet, Navigation } from "lucide-react";
import { attractions } from "@/data/seed-attractions";
import { hotels } from "@/data/seed-hotels";
import { cities } from "@/data/seed-cities";
import Link from "next/link";

// Approximate exchange rates (can be updated via API later)
const exchangeRates: Record<string, { rate: number; symbol: string; name: string }> = {
  USD: { rate: 50.5, symbol: "$", name: "US Dollar" },
  EUR: { rate: 54.8, symbol: "\u20ac", name: "Euro" },
  GBP: { rate: 64.2, symbol: "\u00a3", name: "British Pound" },
  SAR: { rate: 13.5, symbol: "SAR", name: "Saudi Riyal" },
  AED: { rate: 13.8, symbol: "AED", name: "UAE Dirham" },
  CAD: { rate: 36.5, symbol: "C$", name: "Canadian Dollar" },
  AUD: { rate: 32.8, symbol: "A$", name: "Australian Dollar" },
};

interface TripItem {
  id: string;
  name: string;
  type: "hotel" | "attraction" | "transport" | "food" | "other";
  cost_egp: number;
  nights?: number;
  latitude?: number;
  longitude?: number;
}

const typicalCosts = {
  taxi_airport: { name: "Airport Taxi (Cairo)", cost: 400 },
  uber_city: { name: "Uber Ride (City)", cost: 80 },
  metro: { name: "Metro Ticket", cost: 8 },
  meal_local: { name: "Local Restaurant Meal", cost: 150 },
  meal_mid: { name: "Mid-Range Restaurant", cost: 400 },
  meal_fancy: { name: "Fine Dining", cost: 1200 },
  water_bottle: { name: "Water Bottle (1.5L)", cost: 15 },
  sim_card: { name: "Tourist SIM Card", cost: 200 },
  nile_cruise_day: { name: "Nile Dinner Cruise", cost: 800 },
  desert_safari: { name: "Desert Safari (half day)", cost: 600 },
};

export default function BudgetPage() {
  const [currency, setCurrency] = useState("USD");
  const [convertAmount, setConvertAmount] = useState("");
  const [convertDirection, setConvertDirection] = useState<"to_egp" | "from_egp">("to_egp");
  const [budgetEGP, setBudgetEGP] = useState(15000);
  const [tripItems, setTripItems] = useState<TripItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const rate = exchangeRates[currency]?.rate || 50.5;
  const symbol = exchangeRates[currency]?.symbol || "$";

  const converted = convertAmount
    ? convertDirection === "to_egp"
      ? (parseFloat(convertAmount) * rate).toFixed(0)
      : (parseFloat(convertAmount) / rate).toFixed(2)
    : "";

  const totalSpent = tripItems.reduce((sum, item) => sum + item.cost_egp * (item.nights || 1), 0);
  const remaining = budgetEGP - totalSpent;

  const addHotel = (hotel: typeof hotels[0], nights: number) => {
    const costEGP = hotel.price_per_night_usd * rate;
    setTripItems([...tripItems, {
      id: `${hotel.id}-${Date.now()}`,
      name: hotel.name,
      type: "hotel",
      cost_egp: Math.round(costEGP),
      nights,
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    }]);
  };

  const addAttraction = (attr: typeof attractions[0]) => {
    const costEGP = attr.entry_fee_usd * rate;
    setTripItems([...tripItems, {
      id: `${attr.id}-${Date.now()}`,
      name: attr.name,
      type: "attraction",
      cost_egp: Math.round(costEGP),
      latitude: attr.latitude,
      longitude: attr.longitude,
    }]);
  };

  const addTypicalCost = (key: string) => {
    const item = typicalCosts[key as keyof typeof typicalCosts];
    setTripItems([...tripItems, {
      id: `${key}-${Date.now()}`,
      name: item.name,
      type: "other",
      cost_egp: item.cost,
    }]);
  };

  const removeItem = (id: string) => {
    setTripItems(tripItems.filter((i) => i.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          <span className="text-[#39FF14]">Budget</span> Planner
        </h1>
        <p className="text-[#B0B0B0] text-lg">Plan your Egyptian trip budget and convert currencies</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Currency Converter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#39FF14]" /> Currency Converter
          </h2>

          <select value={currency} onChange={(e) => setCurrency(e.target.value)}
            className="w-full py-3 px-4 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm mb-4 focus:outline-none focus:border-[#39FF14]">
            {Object.entries(exchangeRates).map(([code, { name, symbol }]) => (
              <option key={code} value={code}>{symbol} {code} — {name}</option>
            ))}
          </select>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-[#666] mb-1 block">
                  {convertDirection === "to_egp" ? `${currency}` : "EGP"}
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]"
                />
              </div>
              <button onClick={() => setConvertDirection(d => d === "to_egp" ? "from_egp" : "to_egp")}
                className="mt-5 w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#333] flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                <ArrowRightLeft className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <label className="text-xs text-[#666] mb-1 block">
                  {convertDirection === "to_egp" ? "EGP" : `${currency}`}
                </label>
                <div className="w-full px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-xl text-[#39FF14] text-sm font-semibold">
                  {converted ? (convertDirection === "to_egp" ? `${Number(converted).toLocaleString()} EGP` : `${symbol}${converted}`) : "—"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-[#0a0a0a] rounded-xl">
            <p className="text-xs text-[#666]">Exchange Rate</p>
            <p className="text-sm text-white font-medium">1 {currency} = {rate.toFixed(1)} EGP</p>
          </div>

          {/* Quick conversions */}
          <div className="mt-4 space-y-2">
            <p className="text-xs text-[#666] font-medium">Quick Convert</p>
            {[50, 100, 500, 1000].map((amt) => (
              <div key={amt} className="flex items-center justify-between text-xs">
                <span className="text-[#B0B0B0]">{symbol}{amt}</span>
                <span className="text-white font-medium">{(amt * rate).toLocaleString()} EGP</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Budget Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6">

          {/* Budget Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5 text-center">
              <p className="text-xs text-[#666] mb-1">Budget</p>
              <p className="text-2xl font-bold text-[#39FF14]">{budgetEGP.toLocaleString()}</p>
              <p className="text-xs text-[#666]">EGP</p>
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={budgetEGP}
                onChange={(e) => setBudgetEGP(Number(e.target.value))}
                className="w-full mt-2 accent-[#39FF14]"
              />
              <p className="text-xs text-[#B0B0B0] mt-1">{symbol}{(budgetEGP / rate).toFixed(0)}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5 text-center">
              <p className="text-xs text-[#666] mb-1">Estimated Cost</p>
              <p className="text-2xl font-bold text-[#FFB300]">{totalSpent.toLocaleString()}</p>
              <p className="text-xs text-[#666]">EGP</p>
              <p className="text-xs text-[#B0B0B0] mt-3">{symbol}{(totalSpent / rate).toFixed(0)}</p>
            </div>
            <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-5 text-center">
              <p className="text-xs text-[#666] mb-1">Remaining</p>
              <p className={`text-2xl font-bold ${remaining >= 0 ? "text-[#00E676]" : "text-[#FF4444]"}`}>{remaining.toLocaleString()}</p>
              <p className="text-xs text-[#666]">EGP</p>
              <p className="text-xs text-[#B0B0B0] mt-3">{symbol}{(remaining / rate).toFixed(0)}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-4">
            <div className="flex justify-between text-xs text-[#666] mb-2">
              <span>Budget Used</span>
              <span>{budgetEGP > 0 ? Math.min(100, Math.round((totalSpent / budgetEGP) * 100)) : 0}%</span>
            </div>
            <div className="h-3 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalSpent / budgetEGP > 0.9 ? "bg-[#FF4444]" : totalSpent / budgetEGP > 0.7 ? "bg-[#FFB300]" : "bg-[#39FF14]"
                }`}
                style={{ width: `${Math.min(100, (totalSpent / budgetEGP) * 100)}%` }}
              />
            </div>
          </div>

          {/* Trip Items */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#39FF14]" /> Trip Expenses
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#39FF14] text-black font-semibold rounded-xl text-sm hover:bg-[#00E676] transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Expense
                </button>

                {showAddMenu && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-[#333]">
                      <p className="text-xs text-[#666] font-medium mb-2">Hotels (per night)</p>
                      {hotels.slice(0, 5).map((h) => (
                        <button key={h.id} onClick={() => { addHotel(h, 1); setShowAddMenu(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-xs text-[#B0B0B0] flex justify-between">
                          <span className="truncate flex-1">{h.name}</span>
                          <span className="text-[#39FF14] ml-2">{Math.round(h.price_per_night_usd * rate).toLocaleString()} EGP</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-3 border-b border-[#333]">
                      <p className="text-xs text-[#666] font-medium mb-2">Attractions</p>
                      {attractions.filter(a => a.entry_fee_usd > 0).slice(0, 5).map((a) => (
                        <button key={a.id} onClick={() => { addAttraction(a); setShowAddMenu(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-xs text-[#B0B0B0] flex justify-between">
                          <span className="truncate flex-1">{a.name}</span>
                          <span className="text-[#39FF14] ml-2">{Math.round(a.entry_fee_usd * rate).toLocaleString()} EGP</span>
                        </button>
                      ))}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-[#666] font-medium mb-2">Typical Costs</p>
                      {Object.entries(typicalCosts).map(([key, item]) => (
                        <button key={key} onClick={() => { addTypicalCost(key); setShowAddMenu(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-[#2a2a2a] rounded-lg text-xs text-[#B0B0B0] flex justify-between">
                          <span>{item.name}</span>
                          <span className="text-[#39FF14]">{item.cost.toLocaleString()} EGP</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {tripItems.length === 0 ? (
              <div className="text-center py-8">
                <Calculator className="w-10 h-10 text-[#333] mx-auto mb-3" />
                <p className="text-[#666] text-sm">No expenses added yet</p>
                <p className="text-[#666] text-xs mt-1">Click &quot;Add Expense&quot; to start planning your budget</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tripItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-[#0a0a0a] rounded-xl">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      item.type === "hotel" ? "bg-blue-500/20 text-blue-400" :
                      item.type === "attraction" ? "bg-orange-500/20 text-orange-400" :
                      "bg-purple-500/20 text-purple-400"
                    }`}>
                      {item.type === "hotel" ? "H" : item.type === "attraction" ? "A" : "O"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{item.name}</p>
                      <p className="text-[#666] text-xs">{item.type}{item.nights ? ` · ${item.nights} night${item.nights > 1 ? "s" : ""}` : ""}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-white text-sm font-semibold">{(item.cost_egp * (item.nights || 1)).toLocaleString()} EGP</p>
                      <p className="text-[#666] text-xs">{symbol}{((item.cost_egp * (item.nights || 1)) / rate).toFixed(0)}</p>
                    </div>
                    {item.latitude && item.longitude && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#666] hover:text-[#39FF14] transition-colors"
                        title="Get directions"
                      >
                        <Navigation className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => removeItem(item.id)} className="text-[#666] hover:text-[#FF4444] transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Typical Daily Costs */}
          <div className="bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-[#FFB300]" /> Typical Daily Budget in Egypt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Budget Traveler", daily_egp: 800, desc: "Hostels, street food, public transport" },
                { label: "Mid-Range", daily_egp: 2500, desc: "3-4★ hotels, restaurants, taxis" },
                { label: "Luxury", daily_egp: 8000, desc: "5★ resorts, fine dining, private tours" },
              ].map((tier) => (
                <div key={tier.label} className="bg-[#0a0a0a] rounded-xl p-4 text-center">
                  <p className="text-xs text-[#666] mb-1">{tier.label}</p>
                  <p className="text-xl font-bold text-white">{tier.daily_egp.toLocaleString()} EGP</p>
                  <p className="text-xs text-[#39FF14]">{symbol}{(tier.daily_egp / rate).toFixed(0)} / day</p>
                  <p className="text-xs text-[#666] mt-2">{tier.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
