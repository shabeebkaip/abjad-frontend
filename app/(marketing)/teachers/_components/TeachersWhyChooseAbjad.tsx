"use client";

import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const REASON_STYLES = [
  { icon: Zap, color: "var(--brand-accent)", bg: "rgba(0,172,211,0.1)" },
  { icon: ShieldCheck, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  { icon: MapPin, color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
];

export default function TeachersWhyChooseAbjad() {
  const { t, isRTL } = useTranslation();
  const reasons = t.teachersPage.whyChoose.reasons.map((r, i) => ({ ...r, ...REASON_STYLES[i] }));

  return (
    <section className="bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            {t.teachersPage.whyChoose.kicker}
          </span>
          <span className="text-xs text-gray-400">{t.teachersPage.whyChoose.kickerSub}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 sm:py-24">

        {/* Headline */}
        <div className="text-center mb-8 lg:mb-16 max-w-2xl mx-auto">
          <h2
            className="font-extrabold text-gray-950 leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
          >
            {t.teachersPage.whyChoose.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.teachersPage.whyChoose.headlineAccent}</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            {t.teachersPage.whyChoose.sub}
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="rounded-3xl border border-gray-100 bg-[#f8fafc] p-5 sm:p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto"
                style={{ backgroundColor: r.bg }}
              >
                <r.icon size={22} style={{ color: r.color }} strokeWidth={2} />
              </div>
              <h3 className="text-gray-950 font-bold text-base mb-3">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 font-bold text-sm px-9 py-4 rounded-full text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "var(--brand-gradient)" }}
          >
            {t.teachersPage.whyChoose.cta} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
