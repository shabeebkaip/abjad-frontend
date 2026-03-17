"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, GraduationCap, School } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const navLinks = [
  { label: "For Teachers", href: "#teachers" },
  { label: "For Schools", href: "#schools" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Testimonials", href: "#testimonials" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, switchLang } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-linear-to-b from-black/30 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <Image
            src="/ABJAD.png"
            alt="Abjad"
            width={120}
            height={36}
            className="h-9 w-auto object-contain transition-all duration-300 group-hover:scale-105"
            style={{ filter: scrolled ? "none" : "brightness(0) invert(1)" }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`text-sm font-medium px-3.5 py-2 rounded-xl transition-all hover:text-brand-primary ${
                scrolled
                  ? "text-slate-600 hover:bg-slate-50"
                  : "text-white/85 hover:bg-white/10"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2.5">
          <Link
            href="/login"
            className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${
              scrolled
                ? "text-slate-700 hover:bg-slate-100"
                : "text-white/90 hover:bg-white/10"
            }`}
          >
            Sign in
          </Link>
          {/* Language toggle */}
          <div className={`flex rounded-full border p-0.5 transition-all ${
            scrolled ? "border-slate-200 bg-white" : "border-white/30 bg-white/10"
          }`}>
            <button
              onClick={() => switchLang("en")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                lang === "en"
                  ? scrolled ? "bg-brand-primary text-white" : "bg-white text-brand-primary-dark"
                  : scrolled ? "text-slate-500 hover:text-slate-800" : "text-white/70 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("ar")}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                lang === "ar"
                  ? scrolled ? "bg-brand-primary text-white" : "bg-white text-brand-primary-dark"
                  : scrolled ? "text-slate-500 hover:text-slate-800" : "text-white/70 hover:text-white"
              }`}
              style={{ fontFamily: "var(--font-almarai)" }}
            >
              عربي
            </button>
          </div>
          <div className={`w-px h-4 ${ scrolled ? "bg-slate-200" : "bg-white/20"}`} />
          <Link
            href="/register?role=teacher"
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:-translate-y-px ${
              scrolled
                ? "bg-brand-primary text-white"
                : "bg-white text-brand-primary-dark"
            }`}
          >
            <GraduationCap size={15} />
            For Teachers
          </Link>
          <Link
            href="/register?role=school"
            className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl border transition-all hover:-translate-y-px ${
              scrolled
                ? "border-brand-primary text-brand-primary hover:bg-(--brand-primary)/5"
                : "border-white/50 text-white hover:bg-white/10"
            }`}
          >
            <School size={15} />
            For Schools
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={22} color={scrolled ? "#111" : "#fff"} />
          ) : (
            <Menu size={22} color={scrolled ? "#111" : "#fff"} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 pt-4 pb-6">
          <nav className="space-y-1 mb-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center text-sm font-medium text-slate-700 px-3 py-2.5 rounded-xl hover:bg-slate-50 hover:text-brand-primary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              className="text-center text-sm font-medium text-slate-700 py-2.5 rounded-xl border border-slate-200 hover:border-brand-primary hover:text-brand-primary transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register?role=teacher"
              className="flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-white py-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              <GraduationCap size={14} /> Get Started
            </Link>
          </div>
          {/* Language toggle */}
          <div className="mt-3 flex rounded-full border border-slate-200 bg-white p-0.5 w-fit mx-auto">
            <button
              onClick={() => switchLang("en")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                lang === "en" ? "bg-brand-primary text-white" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("ar")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                lang === "ar" ? "bg-brand-primary text-white" : "text-slate-500 hover:text-slate-800"
              }`}
              style={{ fontFamily: "var(--font-almarai)" }}
            >
              عربي
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
