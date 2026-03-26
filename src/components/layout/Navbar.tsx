"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MapPin, Shield, Wallet, Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/discover", label: t("discover") },
    { href: "/hotels", label: t("hotels") },
    { href: "/attractions", label: t("attractions") },
    { href: "/budget", label: locale === "en" ? "Budget" : "الميزانية", icon: Wallet },
    { href: "/emergency", label: t("emergency"), icon: Shield },
  ];

  const toggleLanguage = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#333]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#39FF14] to-[#00E676] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-black" />
            </div>
            <span className="text-xl font-display font-bold">
              <span className="text-[#39FF14]">Disto</span>
              <span className="text-white">-Trip</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#39FF14]/10 text-[#39FF14]"
                      : "text-[#B0B0B0] hover:text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {link.icon && <link.icon className="w-3.5 h-3.5" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Side: Language Toggle + Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#333] text-xs font-medium text-[#B0B0B0] hover:text-[#39FF14] hover:border-[#39FF14]/50 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {locale === "en" ? "عربي" : "EN"}
            </button>

            <Link
              href="/auth/login"
              className="px-4 py-2 text-sm font-medium text-[#B0B0B0] hover:text-white transition-colors"
            >
              {t("login")}
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black rounded-full hover:shadow-lg hover:shadow-[#39FF14]/25 transition-all duration-300 hover:scale-105"
            >
              {t("signup")}
            </Link>
          </div>

          {/* Mobile: Language + Menu */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-[#333] text-xs font-medium text-[#B0B0B0] hover:text-[#39FF14] transition-all"
            >
              <Globe className="w-3 h-3" />
              {locale === "en" ? "عربي" : "EN"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-[#B0B0B0] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-[#333]/50">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-[#39FF14]/10 text-[#39FF14]"
                      : "text-[#B0B0B0] hover:text-white hover:bg-[#2a2a2a]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                  </span>
                </Link>
              );
            })}
            <div className="pt-4 border-t border-[#333]/50 flex gap-3">
              <Link
                href="/auth/login"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 text-center text-sm font-medium border border-[#333] rounded-xl text-[#B0B0B0] hover:text-white transition-colors"
              >
                {t("login")}
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-3 text-center text-sm font-semibold bg-gradient-to-r from-[#39FF14] to-[#00E676] text-black rounded-xl"
              >
                {t("signup")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
