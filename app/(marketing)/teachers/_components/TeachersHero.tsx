"use client";

import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle2, Clock, Building2, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const CARD_STYLES = [
  { bgColor: "var(--brand-accent)", tagBg: "rgba(16,185,129,0.15)", tagColor: "#34d399" },
  { bgColor: "#7c3aed", tagBg: "rgba(245,158,11,0.15)", tagColor: "#f59e0b" },
  { bgColor: "#0891b2", tagBg: "rgba(239,68,68,0.15)", tagColor: "#f87171" },
];

// ponytail: initials derived from the localized school name so Arabic names get Arabic initials
function getInitials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("");
}

export default function TeachersHero() {
  const { t, isRTL } = useTranslation();
  const opportunities = t.teachersPage.hero.opportunities.map((o, i) => ({ ...o, ...CARD_STYLES[i], initials: getInitials(o.school) }));
  const flip = { transform: isRTL ? "scaleX(-1)" : undefined };

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* Accent glow — top start */}
      <div
        className="absolute -top-40 -start-40 w-160 h-160 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.14) 0%, transparent 65%)" }}
      />
      {/* Purple glow — bottom end */}
      <div
        className="absolute -bottom-32 end-0 w-120 h-120 rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)" }}
      />
      {/* Diagonal accent sweep */}
      <div
        className="absolute top-0 end-0 w-1/2 h-full pointer-events-none opacity-[0.04]"
        style={{ background: `linear-gradient(${isRTL ? "225deg" : "135deg"}, transparent 40%, var(--brand-accent) 100%)` }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-16 sm:pt-24 lg:pt-28 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Start: Content ── */}
          <div className="lg:col-span-5 pb-10 lg:pb-24">
            {/* Live pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/8 text-white/70 text-xs font-bold tracking-widest uppercase mb-6 sm:mb-10">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              {t.teachersPage.hero.badge}
            </div>

            <h1
              className="font-extrabold text-white leading-[1.06] mb-5"
              style={{ fontSize: "clamp(2.6rem, 4.8vw, 4rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.teachersPage.hero.headlinePre}{" "}
              <span
                className="relative inline-block"
                style={{ color: "var(--brand-accent)" }}
              >
                {t.teachersPage.hero.headlineAccent}
                <span
                  className="absolute -bottom-1 left-0 right-0 h-0.75 rounded-full opacity-50"
                  style={{ background: "var(--brand-accent)" }}
                />
              </span>
              {" "}{t.teachersPage.hero.headlinePost}
            </h1>

            <p className="text-white/75 text-base font-semibold mb-3">
              {t.teachersPage.hero.tagline}
            </p>

            <p className="text-white/55 text-sm leading-relaxed mb-10 max-w-md">
              {t.teachersPage.hero.sub}
            </p>

            <div className="flex items-center gap-3 flex-wrap mb-8 sm:mb-14">
              <Link
                href="/register?role=teacher"
                className="inline-flex items-center gap-2.5 font-bold text-sm px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5 text-white"
                style={{ background: "linear-gradient(135deg, var(--brand-accent) 0%, #0083a8 100%)" }}
              >
                {t.teachersPage.hero.ctaJoin} <ArrowRight size={15} style={flip} />
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2.5 border border-white/20 bg-white/8 text-white/80 font-semibold text-sm px-7 py-4 rounded-full hover:bg-white/14 transition-all"
              >
                {t.teachersPage.hero.ctaBrowse}
              </Link>
            </div>

            {/* Trust anchors */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {t.teachersPage.hero.trustAnchors.map((a) => (
                <span key={a} className="flex items-center gap-2 text-xs font-semibold text-white/50">
                  <CheckCircle2 size={13} style={{ color: "var(--brand-accent)" }} />
                  {a}
                </span>
              ))}
            </div>
          </div>

          {/* ── End: Job listing mockup ── */}
          <div className="lg:col-span-7 flex flex-col pb-10 lg:pb-24">

            {/* Search bar */}
            <div className="bg-white/8 border border-white/12 rounded-2xl px-5 py-4 flex items-center gap-3 mb-4 backdrop-blur-sm">
              <Building2 size={16} className="text-white/40 shrink-0" />
              <span className="text-white/35 text-sm flex-1">{t.teachersPage.hero.searchPlaceholder}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-medium">{t.teachersPage.hero.openingsBadge}</span>
                <div
                  className="h-5 w-px"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                />
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "var(--brand-accent)", color: "white" }}
                >
                  {t.teachersPage.hero.searchButton}
                </span>
              </div>
            </div>

            {/* Job cards */}
            <div className="flex flex-col gap-3">
              {opportunities.map((o, i) => (
                <div
                  key={i}
                  className={`group relative rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm px-6 py-5 flex items-center gap-5 transition-all cursor-pointer ${
                    i < 2 ? "hover:bg-white/10 hover:border-white/18" : "select-none"
                  }`}
                >
                  {/* Locked overlay for 3rd card */}
                  {i === 2 && (
                    <Link href="/register?role=teacher" className="absolute inset-0 rounded-2xl backdrop-blur-[2px] bg-linear-to-b from-transparent via-(--brand-primary)/60 to-(--brand-primary)/90 z-10 flex items-center justify-center group/lock">
                      <span className="text-xs font-bold px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white/60 flex items-center gap-1.5 group-hover/lock:bg-white/20 group-hover/lock:text-white/90 transition-all">
                        {t.teachersPage.hero.lockedCta} <ArrowUpRight size={12} style={flip} />
                      </span>
                    </Link>
                  )}
                  {/* School avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-xs shrink-0"
                    style={{ background: o.bgColor }}
                  >
                    {o.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-white text-sm">{o.role}</span>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: o.tagBg, color: o.tagColor }}
                      >
                        {o.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/45 flex-wrap">
                      <span>{o.school}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {o.location}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      <span>{o.type}</span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {o.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/8 text-white/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Curriculum + action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-white/40">{o.curriculum}</span>
                    <button className="text-xs font-bold px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:bg-white/10 transition-all group-hover:border-white/30">
                      {t.teachersPage.hero.applyNow}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* More count */}
            <div className="mt-3 flex items-center justify-center gap-2 py-3">
              <Clock size={11} className="text-white/25" />
              <span className="text-xs text-white/30 font-medium">{t.teachersPage.hero.moreCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="relative z-10 border-t border-white/8 mt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            {t.teachersPage.hero.stats.map((s) => (
              <div key={s.label} className="px-3 py-5 sm:px-8 sm:py-7 text-center">
                <div
                  className="font-black text-white leading-none mb-1.5"
                  style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-white/40 text-xs font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
