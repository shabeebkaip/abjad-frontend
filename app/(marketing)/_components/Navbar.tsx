"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const NAV_LINKS = [
  { label: "How It Works", labelAr: "كيف يعمل",   href: "#how-it-works" },
  { label: "For Schools",  labelAr: "للمدارس",     href: "#schools" },
  { label: "Testimonials", labelAr: "آراء العملاء", href: "#testimonials" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { lang, switchLang }      = useLanguage();
  const isAr                      = lang === "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Floating island navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none pt-4 px-4">
        <div
          className={`pointer-events-auto w-full max-w-5xl flex items-center justify-between px-4 py-2.5 rounded-2xl transition-all duration-300 ${
            scrolled
              ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/[0.08] border border-black/[0.06]"
              : "bg-white/75 backdrop-blur-md border border-black/[0.07] shadow-md shadow-black/[0.05]"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/ABJAD.png"
              alt="Abjad"
              width={88}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop — center links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 px-3.5 py-2 rounded-xl hover:bg-gray-50 transition-all"
              >
                {isAr ? l.labelAr : l.label}
              </a>
            ))}
          </nav>

          {/* Desktop — right side */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-0.5">
              <button
                onClick={() => switchLang("en")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => switchLang("ar")}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  lang === "ar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
                }`}
                style={{ fontFamily: "var(--font-almarai)" }}
              >
                عربي
              </button>
            </div>

            <div className="w-px h-4 bg-gray-200" />

            {/* Sign in */}
            <Link
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all"
            >
              {isAr ? "تسجيل الدخول" : "Sign in"}
            </Link>

            {/* Primary CTA */}
            <Link
              href="/register"
              className="text-sm font-bold text-white px-4 py-2 rounded-xl transition-all hover:opacity-90 hover:scale-[1.03] shadow-sm"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {isAr ? "ابدأ مجاناً" : "Get started"}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} className="text-gray-700" /> : <Menu size={20} className="text-gray-700" />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-0 z-40 pt-20 px-4 pointer-events-auto md:hidden">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <nav className="p-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center text-sm font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-brand-primary transition-colors"
                >
                  {isAr ? l.labelAr : l.label}
                </a>
              ))}
            </nav>
            <div className="px-3 pb-3 pt-1 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl border border-gray-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                {isAr ? "تسجيل الدخول" : "Sign in"}
              </Link>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
              className="text-center text-sm font-bold text-white py-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {isAr ? "ابدأ مجاناً" : "Get started"}
              </Link>
              {/* Language toggle */}
              <div className="flex items-center justify-center bg-gray-100 rounded-full p-0.5 mt-1">
                <button
                  onClick={() => switchLang("en")}
                  className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    lang === "en" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => switchLang("ar")}
                  className={`flex-1 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    lang === "ar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-400"
                  }`}
                  style={{ fontFamily: "var(--font-almarai)" }}
                >
                  عربي
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


const navLinks = [
  { label: "For Teachers", href: "#teachers" },
  { label: "For Schools", href: "#schools" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];
