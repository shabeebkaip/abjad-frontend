"use client";

import Link from "next/link";
import { Building2, GraduationCap, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STAT_COLORS = ["var(--brand-accent)", "#a78bfa", "#34d399"];

export default function StatsSection() {
  const { t, isRTL } = useTranslation();

  return (
    <section id="schools" className="relative overflow-hidden bg-[#f8fafc]">

      {/* ── Stats banner — full bleed accent strip ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--brand-primary)" }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-14">
          <div className="grid grid-cols-3 gap-0 divide-x divide-white/10">
            {t.stats.map((s, i) => (
              <div key={i} className="text-center px-2 sm:px-6">
                <div
                  className="font-black mb-1 leading-none"
                  style={{ fontSize: "clamp(2.8rem, 6vw, 4.5rem)", color: STAT_COLORS[i] }}
                >
                  {s.value}
                </div>
                <div className="text-white/50 text-xs font-medium tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-24">

        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            {t.whyAbjad.label}
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            {t.whyAbjad.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.whyAbjad.headlineAccent}</span>{" "}
            {t.whyAbjad.headlinePost}
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t.whyAbjad.sub}
          </p>
        </div>

        {/* Checkerboard comparison — alternating bg */}
        <div className="rounded-3xl overflow-hidden border border-gray-200 shadow-sm">

          {/* Row 1: Schools (dark) */}
          <div
            className="grid lg:grid-cols-2"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="p-10 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building2 size={20} className="text-white" />
                </div>
                <span className="text-white/60 text-xs font-bold tracking-widest uppercase">{t.whyAbjad.schools.badge}</span>
              </div>
              <h3
                className="font-extrabold text-white mb-4 leading-tight"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
              >
                {t.whyAbjad.schools.headlineLine1}<br />{t.whyAbjad.schools.headlineLine2}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                {t.whyAbjad.schools.body}
              </p>
              <Link
                href="/register?role=school"
                className="inline-flex items-center gap-2 self-start text-sm font-bold text-white rounded-full px-5 py-2.5 border border-white/30 hover:bg-white/15 transition-all"
              >
                {t.whyAbjad.schools.cta} <ArrowRight size={14} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
              </Link>
            </div>
            <div className="p-10 lg:p-12 flex flex-col gap-4 justify-center border-t lg:border-t-0 lg:border-s border-white/10">
              {t.whyAbjad.schools.bullets.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--brand-accent)" }}
                  />
                  <span className="text-white/75 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Teachers (light) */}
          <div className="grid lg:grid-cols-2 bg-white">
            <div className="p-10 lg:p-12 flex flex-col gap-4 justify-center border-b lg:border-b-0 lg:border-e border-gray-100 order-2 lg:order-1">
              {t.whyAbjad.teachers.bullets.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="p-10 lg:p-12 flex flex-col justify-center order-1 lg:order-2">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "var(--brand-primary-light)" }}
                >
                  <GraduationCap size={20} style={{ color: "var(--brand-primary)" }} />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--brand-primary)" }}>{t.whyAbjad.teachers.badge}</span>
              </div>
              <h3
                className="font-extrabold text-gray-950 mb-4 leading-tight"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}
              >
                {t.whyAbjad.teachers.headlineLine1}<br />{t.whyAbjad.teachers.headlineLine2}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                {t.whyAbjad.teachers.body}
              </p>
              <Link
                href="/register?role=teacher"
                className="inline-flex items-center gap-2 self-start text-sm font-bold text-white rounded-full px-5 py-2.5 transition-all hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 4px 14px var(--brand-primary-glow)" }}
              >
                {t.whyAbjad.teachers.cta} <ArrowRight size={14} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
