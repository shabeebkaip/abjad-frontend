"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const NAV_LINKS = [
  { label: "Home",    labelAr: "الرئيسية",  href: "/"        },
  { label: "About",   labelAr: "من نحن",    href: "/about"   },
  { label: "Contact", labelAr: "تواصل معنا", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const { lang, switchLang }      = useLanguage();
  const pathname                  = usePathname();
  const isAr                      = lang === "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* ── Navbar: floating island → full-width on scroll ── */}
      <header
        className="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-500 ease-in-out"
        style={{ paddingTop: scrolled ? "0" : "1rem", paddingLeft: scrolled ? "0" : "1rem", paddingRight: scrolled ? "0" : "1rem" }}
      >
        <div
          className="pointer-events-auto w-full transition-all duration-500 ease-in-out"
          style={{
            maxWidth: scrolled ? "100%" : "64rem",
            borderRadius: scrolled ? "0" : "1rem",
            backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.75)",
            backdropFilter: "blur(20px)",
            boxShadow: scrolled
              ? "0 1px 0 0 rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)"
              : "0 4px 20px rgba(0,0,0,0.05)",
            border: scrolled ? "none" : "1px solid rgba(0,0,0,0.07)",
            borderBottom: scrolled ? "1px solid rgba(0,0,0,0.07)" : undefined,
          }}
        >
          {/* Inner container — always max-w-6xl centered */}
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
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
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium px-3.5 py-2 rounded-xl transition-all ${
                    active
                      ? "text-gray-900 bg-gray-100 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {isAr ? l.labelAr : l.label}
                  {active && (
                    <span
                      className="block h-0.5 rounded-full mt-0.5 mx-auto w-4"
                      style={{ backgroundColor: "var(--brand-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
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
          </div>{/* end inner container */}
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-x-0 top-0 z-40 pt-20 px-4 pointer-events-auto md:hidden">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
            <nav className="p-3">
              {NAV_LINKS.map((l) => {
                const active = isActive(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center text-sm font-medium px-4 py-3 rounded-xl transition-colors ${
                      active
                        ? "bg-gray-50 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                    style={active ? { color: "var(--brand-primary)" } : {}}
                  >
                    {isAr ? l.labelAr : l.label}
                    {active && (
                      <span
                        className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--brand-accent)" }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 pb-3 pt-1 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-center text-sm font-medium text-gray-700 py-2.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors"
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
