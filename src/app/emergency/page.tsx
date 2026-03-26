"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Shield, HeartPulse, Flame, BadgeAlert, Building2, Pill, Navigation, AlertTriangle } from "lucide-react";
import { emergencyNumbers, embassies, emergencyFacilities } from "@/data/emergency-numbers";
import { cities } from "@/data/seed-cities";
import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const iconMap: Record<string, React.ReactNode> = {
  shield: <Shield className="w-6 h-6" />,
  "heart-pulse": <HeartPulse className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
  badge: <BadgeAlert className="w-6 h-6" />,
  car: <Navigation className="w-6 h-6" />,
  phone: <Phone className="w-6 h-6" />,
};

const typeIcons: Record<string, React.ReactNode> = {
  hospital: <HeartPulse className="w-5 h-5" />,
  pharmacy: <Pill className="w-5 h-5" />,
  police: <Shield className="w-5 h-5" />,
  embassy: <Building2 className="w-5 h-5" />,
};

export default function EmergencyPage() {
  const [selectedCity, setSelectedCity] = useState("city-cairo");
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  const facilities = emergencyFacilities.filter((f) => f.city_id === selectedCity);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
      {/* SOS Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 mb-4 animate-pulse">
          <AlertTriangle className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
          <span className="text-red-500">{t("emergencySOS")}</span> {t("sos")}
        </h1>
        <p className="text-[#B0B0B0]">{t("emergencySubtitle")}</p>
      </motion.div>

      {/* Emergency Numbers */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-red-500" /> {t("emergencyNumbers")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emergencyNumbers.map((item) => (
            <a
              key={item.number}
              href={`tel:${item.number}`}
              className="flex items-center gap-3 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50 hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
            >
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all">
                {iconMap[item.icon]}
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{isAr ? item.name_ar : item.name}</p>
                <p className="text-red-500 text-lg font-bold">{item.number}</p>
              </div>
            </a>
          ))}
        </div>
      </motion.div>

      {/* Nearby Facilities */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#39FF14]" /> {t("nearbyFacilities")}
          </h2>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="py-2 px-4 bg-[#2a2a2a] border border-[#333] rounded-xl text-white text-sm focus:outline-none focus:border-[#39FF14]"
          >
            {cities.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {facilities.map((facility) => (
            <div key={facility.id} className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                facility.type === "hospital" ? "bg-red-500/20 text-red-500" :
                facility.type === "pharmacy" ? "bg-green-500/20 text-green-500" :
                facility.type === "police" ? "bg-blue-500/20 text-blue-500" :
                "bg-yellow-500/20 text-yellow-500"
              }`}>
                {typeIcons[facility.type]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{isAr && facility.name_ar ? facility.name_ar : facility.name}</p>
                <p className="text-[#666] text-xs">{facility.address}</p>
                {facility.is_24h && <span className="text-[#39FF14] text-xs font-medium">24 Hours</span>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {facility.phone && (
                  <a href={`tel:${facility.phone}`} className="w-10 h-10 rounded-full bg-[#39FF14]/20 flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                    <Phone className="w-4 h-4" />
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${facility.latitude},${facility.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Embassies */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-yellow-500" /> {t("embassiesInCairo")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {embassies.map((embassy) => (
            <div key={embassy.country} className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-2xl border border-[#333]/50">
              <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm">{embassy.country} Embassy</p>
                <p className="text-[#666] text-xs truncate">{embassy.address}</p>
              </div>
              <a href={`tel:${embassy.phone}`} className="w-10 h-10 rounded-full bg-[#39FF14]/20 flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all flex-shrink-0">
                <Phone className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Safety Tips */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 bg-[#1a1a1a] rounded-2xl border border-[#333]/50 p-6">
        <h2 className="text-xl font-bold text-white mb-4">{t("safetyTips")}</h2>
        <ul className="space-y-2 text-[#B0B0B0] text-sm">
          <li>- {t("tip1")}</li>
          <li>- {t("tip2")}</li>
          <li>- {t("tip3")}</li>
          <li>- {t("tip4")}</li>
          <li>- {t("tip5")}</li>
          <li>- {t("tip6")}</li>
        </ul>
      </motion.div>
    </div>
  );
}
