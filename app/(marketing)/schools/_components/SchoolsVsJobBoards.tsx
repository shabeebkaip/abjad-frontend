"use client";

import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Users, Zap } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const HIGHLIGHT_STYLES = [
  { icon: Building2, color: "var(--brand-accent)" },
  { icon: ShieldCheck, color: "#6366f1" },
  { icon: Users, color: "#10b981" },
  { icon: Zap, color: "#f59e0b" },
];

export default function SchoolsVsJobBoards() {
  const { t, isRTL } = useTranslation();
  const highlights = t.schoolsPage.vsJobBoards.highlights.map((h, i) => ({ ...h, ...HIGHLIGHT_STYLES[i] }));

  return (
    <section className="bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            {t.schoolsPage.vsJobBoards.kicker}
          </span>
          <span className="text-xs text-gray-400">{t.schoolsPage.vsJobBoards.kickerSub}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-24">

        {/* Headline */}
        <div className="text-center mb-16">
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
          >
            {t.schoolsPage.vsJobBoards.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.vsJobBoards.headlineAccent}</span>{" "}
            {t.schoolsPage.vsJobBoards.headlinePost}
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            {t.schoolsPage.vsJobBoards.sub}
          </p>
        </div>

        {/* 4-panel grid with gap-px on gray background for dividers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-3xl overflow-hidden mb-12">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white p-5 sm:p-8 hover:bg-[#f8fafc] transition-colors text-center"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto"
                style={{ backgroundColor: `${h.color}18` }}
              >
                <h.icon size={22} style={{ color: h.color }} strokeWidth={2} />
              </div>
              <div
                className="h-0.5 w-8 rounded-full mb-5 mx-auto"
                style={{ backgroundColor: h.color }}
              />
              <h3 className="text-gray-950 font-bold text-sm leading-snug mb-3">{h.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            {t.schoolsPage.vsJobBoards.cta} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
