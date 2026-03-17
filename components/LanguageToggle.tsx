"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

export const LanguageToggle = () => {
  const { lang, switchLang } = useLanguage();

  return (
    <div className="fixed top-4 end-4 z-50 flex rounded-full border border-brand-primary/30 bg-white/80 backdrop-blur-sm p-1 shadow-sm">
      <button
        onClick={() => switchLang("en")}
        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
          lang === "en"
            ? "bg-brand-primary text-white font-semibold"
            : "text-gray-500 hover:text-gray-800"
        }`}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        EN
      </button>
      <button
        onClick={() => switchLang("ar")}
        className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
          lang === "ar"
            ? "bg-brand-primary text-white font-semibold"
            : "text-gray-500 hover:text-gray-800"
        }`}
        style={{ fontFamily: "'Almarai', sans-serif" }}
      >
        عربي
      </button>
    </div>
  );
};
