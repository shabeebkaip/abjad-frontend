"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const CATEGORY_STYLES = [
  { bg: "rgba(0,172,211,0.10)", color: "var(--brand-accent)", border: "rgba(0,172,211,0.22)" },
  { bg: "rgba(99,102,241,0.10)", color: "#6366f1", border: "rgba(99,102,241,0.22)" },
  { bg: "rgba(16,185,129,0.10)", color: "#10b981", border: "rgba(16,185,129,0.22)" },
  { bg: "rgba(245,158,11,0.10)", color: "#f59e0b", border: "rgba(245,158,11,0.22)" },
  { bg: "rgba(167,139,250,0.10)", color: "#a78bfa", border: "rgba(167,139,250,0.22)" },
  { bg: "rgba(52,211,153,0.10)", color: "#34d399", border: "rgba(52,211,153,0.22)" },
  { bg: "rgba(13,37,66,0.08)", color: "var(--brand-primary)", border: "rgba(13,37,66,0.15)" },
];

export default function SchoolsTalentPool() {
  const { t, isRTL } = useTranslation();
  const categories = t.schoolsPage.talentPool.categories.map((cat, i) => ({ cat, ...CATEGORY_STYLES[i] }));

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-28">

        {/* Editorial header — 12-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 mb-12 lg:mb-20">
          <div className="lg:col-span-5">
            <div
              className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-5"
              style={{ color: "var(--brand-accent)" }}
            >
              <span className="w-5 h-0.5 inline-block rounded" style={{ backgroundColor: "var(--brand-accent)" }} />
              {t.schoolsPage.talentPool.kicker}
            </div>
            <h2
              className="font-extrabold text-gray-950 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.schoolsPage.talentPool.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.talentPool.headlineAccent}</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center gap-4">
            <p className="text-gray-600 text-base leading-relaxed">
              {t.schoolsPage.talentPool.body1}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t.schoolsPage.talentPool.body2}
            </p>
          </div>
        </div>

        {/* Talent category pills + CTA */}
        <div className="border-t border-gray-100 pt-16">
          <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-8 text-center">
            {t.schoolsPage.talentPool.categoriesLabel}
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-14">
            {categories.map((s) => (
              <span
                key={s.cat}
                className="px-5 py-2.5 rounded-full text-sm font-semibold border"
                style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
              >
                {s.cat}
              </span>
            ))}
          </div>

          {/* Dark CTA banner */}
          <div
            className="rounded-3xl p-7 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div>
              <h3
                className="font-extrabold text-white mb-2"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
              >
                {t.schoolsPage.talentPool.ctaHeadline}
              </h3>
              <p className="text-white/55 text-sm">
                {t.schoolsPage.talentPool.ctaBody}
              </p>
            </div>
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-full whitespace-nowrap transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 shrink-0"
              style={{ color: "var(--brand-primary-dark)" }}
            >
              {t.schoolsPage.talentPool.ctaButton} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
