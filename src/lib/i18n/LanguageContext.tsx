"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { translations, Locale, TranslationKey } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
  dir: "ltr",
});

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("disto-trip-lang");
  if (stored === "ar" || stored === "en") return stored;
  return "en";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Load saved language on mount
  useEffect(() => {
    const saved = getStoredLocale();
    if (saved !== "en") {
      setLocaleState(saved);
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
    localStorage.setItem("disto-trip-lang", newLocale);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[locale][key] || translations.en[key] || key;
    },
    [locale]
  );

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
