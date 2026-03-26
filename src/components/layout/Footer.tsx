"use client";

import Link from "next/link";
import { MapPin, Globe, Camera, PlayCircle, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Footer() {
  const { t, locale } = useLanguage();
  const isAr = locale === "ar";

  return (
    <footer className="bg-[#0f0f0f] border-t border-[#333]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00E676] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-display font-bold">
                <span className="text-[#39FF14]">Disto</span>
                <span className="text-white">-Trip</span>
              </span>
            </Link>
            <p className="text-[#888] text-sm leading-relaxed">
              {isAr
                ? "رفيقك المثالي للسفر واستكشاف مصر. اكتشف الفنادق والمعالم وتنقل بثقة."
                : "Your ultimate travel companion for exploring Egypt. Discover hotels, attractions, and navigate with confidence."}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t("explore")}</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/hotels", en: "Hotels", ar: "الفنادق" },
                { href: "/attractions", en: "Attractions", ar: "المعالم" },
                { href: "/discover", en: "Discover Map", ar: "اكتشف الخريطة" },
                { href: "/budget", en: "Budget Planner", ar: "مخطط الميزانية" },
                { href: "/emergency", en: "Emergency SOS", ar: "طوارئ SOS" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[#888] hover:text-[#39FF14] transition-colors">
                    {isAr ? item.ar : item.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-white mb-4">{isAr ? "الوجهات" : "Destinations"}</h4>
            <ul className="space-y-2.5">
              {[
                { slug: "cairo", en: "Cairo", ar: "القاهرة" },
                { slug: "giza", en: "Giza", ar: "الجيزة" },
                { slug: "luxor", en: "Luxor", ar: "الأقصر" },
                { slug: "hurghada", en: "Hurghada", ar: "الغردقة" },
                { slug: "sharm-el-sheikh", en: "Sharm El Sheikh", ar: "شرم الشيخ" },
                { slug: "alexandria", en: "Alexandria", ar: "الإسكندرية" },
              ].map((city) => (
                <li key={city.slug}>
                  <Link href={`/hotels?city=${city.slug}`} className="text-sm text-[#888] hover:text-[#39FF14] transition-colors">
                    {isAr ? city.ar : city.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t("support")}</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/about", en: "About Us", ar: "من نحن" },
                { href: "/complaint", en: "File a Complaint", ar: "تقديم شكوى" },
                { href: "/auth/signup", en: "Create Account", ar: "إنشاء حساب" },
                { href: "/auth/login", en: "Login", ar: "تسجيل دخول" },
              ].map((item) => (
                <li key={item.href + item.en}>
                  <Link href={item.href} className="text-sm text-[#888] hover:text-[#39FF14] transition-colors">
                    {isAr ? item.ar : item.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#333]/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#555]">
            &copy; {new Date().getFullYear()} Disto-Trip. {t("allRights")}
          </p>
          <p className="text-sm text-[#555]">
            {t("madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
