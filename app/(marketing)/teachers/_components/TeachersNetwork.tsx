"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STAT_COLORS = ["var(--brand-accent)", "#10b981", "#a78bfa"];
const COMMUNITY_ACCENT = [true, true, true, false, false, false, false];

export default function TeachersNetwork() {
  const { t, isRTL } = useTranslation();
  const stats = t.teachersPage.network.stats.map((s, i) => ({ ...s, color: STAT_COLORS[i] }));
  const communities = t.teachersPage.network.communities.map((label, i) => ({ label, accent: COMMUNITY_ACCENT[i] }));

  return (
    <section
      className="relative overflow-hidden py-16 lg:py-28"
      style={{ background: "var(--brand-primary)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      {/* Vertical accent line */}
      <div
        className="absolute inset-y-0 end-1/3 w-px opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, var(--brand-accent), transparent)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div className="text-center mb-8 lg:mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/10 text-white/60 mb-6">
            {t.teachersPage.network.kicker}
          </span>
          <h2
            className="font-extrabold text-white leading-[1.1] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
          >
            {t.teachersPage.network.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.teachersPage.network.headlineAccent}</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed">
            {t.teachersPage.network.sub}
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/8 rounded-3xl overflow-hidden mb-8 lg:mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/4 px-4 py-6 sm:px-8 sm:py-10 text-center hover:bg-white/8 transition-colors">
              <div
                className="font-black text-white leading-none mb-2"
                style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-white/45 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Community list + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Community list */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-white/30 mb-5">
              {t.teachersPage.network.communityLabel}
            </p>
            <div className="space-y-2.5">
              {communities.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: c.accent ? "var(--brand-accent)" : "rgba(255,255,255,0.25)" }}
                  />
                  <span className="text-sm text-white/70">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white/6 border border-white/10 p-6 sm:p-10">
              <h3
                className="font-extrabold text-white leading-tight mb-4"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
              >
                {t.teachersPage.network.ctaHeadlinePre}{" "}
                <span style={{ color: "var(--brand-accent)" }}>{t.teachersPage.network.ctaHeadlineAccent}</span>
              </h3>
              <p className="text-white/55 text-sm leading-relaxed mb-8">
                {t.teachersPage.network.ctaBody}
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register?role=teacher"
                  className="flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-full text-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, var(--brand-accent) 0%, #0083a8 100%)" }}
                >
                  {t.teachersPage.network.ctaGetStarted} <ArrowRight size={15} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
                </Link>
                <Link
                  href="/register?role=school"
                  className="flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition-all"
                >
                  {t.teachersPage.network.ctaHireEducators}
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
