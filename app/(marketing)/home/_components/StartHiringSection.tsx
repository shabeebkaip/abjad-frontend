"use client";

import Link from "next/link";
import { BadgeCheck, SlidersHorizontal, Clock3, Globe2, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const ICONS = [
  { icon: BadgeCheck, color: "#10b981" },
  { icon: SlidersHorizontal, color: "#6366f1" },
  { icon: Clock3, color: "#f59e0b" },
  { icon: Globe2, color: "var(--brand-accent)" },
];

export default function StartHiringSection() {
  const { t, isRTL } = useTranslation();
  const tiles = t.startHiring.tiles.map((tile, i) => ({ ...tile, ...ICONS[i] }));

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-28">

        {/* Full-width label strip */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1" style={{ background: "var(--brand-accent-light)" }} />
          <span
            className="text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            {t.startHiring.label}
          </span>
          <div className="h-px flex-1" style={{ background: "var(--brand-accent-light)" }} />
        </div>

        {/* Mosaic grid: headline tile + 4 benefit tiles + CTA tile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Headline tile — full width on mobile/tablet, 2 cols on desktop */}
          <div
            className="col-span-1 sm:col-span-2 rounded-3xl p-8 sm:p-10 relative overflow-hidden"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute -end-6 -bottom-6 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <h2
                className="font-extrabold text-white leading-[1.1] mb-4"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
              >
                {t.startHiring.headlinePre}{" "}
                <span style={{ color: "var(--brand-accent)" }}>Abjad</span> {t.startHiring.headlinePost}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg mb-8">
                {t.startHiring.sub}
              </p>
              <Link
                href="/register?role=school"
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-full transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                {t.startHiring.cta} <ArrowRight size={15} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
              </Link>
            </div>
          </div>

          {/* 4 benefit tiles */}
          {tiles.map((tile, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-gray-100 bg-[#f8fafc] p-7 hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <tile.icon size={20} style={{ color: tile.color }} strokeWidth={2} />
                <h3 className="text-sm font-bold text-gray-900">{tile.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{tile.desc}</p>
            </div>
          ))}

          {/* CTA tile */}
          <div
            className="rounded-3xl p-7 flex flex-col justify-between"
            style={{ backgroundColor: "var(--brand-accent-light)" }}
          >
            <p
              className="text-base font-bold leading-snug mb-6"
              style={{ color: "var(--brand-primary)" }}
            >
              {t.startHiring.ctaBoxText}
            </p>
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 self-start text-sm font-bold rounded-full px-5 py-2.5 text-white transition-all hover:scale-105"
              style={{ backgroundColor: "var(--brand-accent)" }}
            >
              {t.startHiring.ctaBoxButton} <ArrowRight size={15} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
