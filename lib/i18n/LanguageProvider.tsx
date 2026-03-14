"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "ar";

interface LanguageContextType {
  lang: Lang;
  switchLang: (lang: Lang) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  switchLang: () => {},
  isRTL: false,
});

const detectLang = (): Lang => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("abjad_lang") as Lang | null;
  if (saved === "ar" || saved === "en") return saved;
  return navigator.language.startsWith("ar") ? "ar" : "en";
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en"); // SSR-safe default

  useEffect(() => {
    // Sync React state with what the inline script already applied
    const detected = detectLang();
    setLang(detected);
  }, []);

  const switchLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("abjad_lang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.setAttribute("data-lang", newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
