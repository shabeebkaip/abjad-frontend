"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "@/lib/auth/AuthContext";
import authApi from "@/lib/api/auth";

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

const applyLang = (newLang: Lang) => {
  localStorage.setItem("abjad_lang", newLang);
  document.documentElement.lang = newLang;
  document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  document.documentElement.setAttribute("data-lang", newLang);
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en"); // SSR-safe default
  // AuthProvider wraps LanguageProvider (see app/layout.tsx), so this is safe.
  const { user, isAuthenticated } = useAuthContext();

  useEffect(() => {
    // Sync React state with what the inline script already applied
    const detected = detectLang();
    setLang(detected);
  }, []);

  // Server-stored preference wins once the account loads (login, session
  // restore on refresh) — PROJECT_PLAN_PANEL_I18N.md Decision 1. This runs
  // whenever the authenticated user's stored language changes/loads and
  // overrides whatever localStorage/browser-detection guessed pre-login.
  useEffect(() => {
    if (!isAuthenticated) return;
    const serverLang = user?.language;
    if (serverLang !== "ar" && serverLang !== "en") return;
    setLang(serverLang);
    applyLang(serverLang);
  }, [isAuthenticated, user?.language]);

  const switchLang = (newLang: Lang) => {
    setLang(newLang);
    applyLang(newLang);
    // Fire-and-forget account persistence — never block the visual switch on
    // the network call, and fail silently if it errors (same pattern as
    // other soft preferences in this codebase, e.g. "Remember this device").
    if (isAuthenticated) {
      authApi.updateLanguage(newLang).catch(() => {});
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, switchLang, isRTL: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
