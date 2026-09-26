"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface LanguageToggleProps {
  /**
   * "floating" (default) = marketing/auth pages' fixed top-4 end-4 pill.
   * "inline" = sits inline inside a flex row (panel header icon cluster) —
   * DESIGN_SPEC "RTL — Teacher/School Panels" §3.4. Same visual pill style,
   * smaller (text-xs) since header real estate is tighter, no fixed
   * positioning so it composes naturally in both LTR and RTL flex rows.
   */
  variant?: "floating" | "inline";
}

export const LanguageToggle = ({ variant = "floating" }: LanguageToggleProps) => {
  const { lang, switchLang } = useLanguage();

  const wrapperCls =
    variant === "inline"
      ? "flex rounded-full border border-brand-primary/30 bg-white/80 backdrop-blur-sm p-0.5 shadow-sm"
      : "fixed top-4 end-4 z-50 flex rounded-full border border-brand-primary/30 bg-white/80 backdrop-blur-sm p-1 shadow-sm";
  const btnCls = variant === "inline" ? "px-2.5 py-1 text-xs" : "px-3 py-1 text-sm";

  return (
    <div className={wrapperCls}>
      <button
        type="button"
        onClick={() => switchLang("en")}
        aria-pressed={lang === "en"}
        aria-label="Switch to English"
        className={`${btnCls} rounded-full transition-all duration-200 ${
          lang === "en"
            ? "bg-brand-primary text-white font-semibold"
            : "text-gray-500 hover:text-gray-800"
        }`}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => switchLang("ar")}
        aria-pressed={lang === "ar"}
        aria-label="التبديل إلى العربية"
        className={`${btnCls} rounded-full transition-all duration-200 ${
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
