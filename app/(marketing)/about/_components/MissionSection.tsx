"use client";

import Link from "next/link";
import { ArrowRight, Target, ShieldCheck, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const PILLAR_ICONS = [
  { icon: Target, iconColor: "var(--brand-accent)", iconBg: "rgba(0,172,211,0.1)" },
  { icon: ShieldCheck, iconColor: "#10b981", iconBg: "rgba(16,185,129,0.1)" },
  { icon: Globe, iconColor: "#a78bfa", iconBg: "rgba(167,139,250,0.1)" },
];

export default function MissionSection() {
  const { t, isRTL } = useTranslation();
  const pillars = t.about.mission.pillars.map((p, i) => ({ ...p, ...PILLAR_ICONS[i] }));

  return (
    <section className="relative bg-white overflow-hidden">

      {/* Top accent strip — bridges from dark hero */}
      <div className="h-0.75 w-full" style={{ background: "linear-gradient(90deg, var(--brand-accent), transparent 70%)" }} />

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            {t.about.mission.kicker}
          </span>
          <span className="text-xs text-gray-400">{t.about.mission.kickerSub}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Start — pullquote + stats ── */}
          <div className="relative">
            {/* Ghost quote mark */}
            <span
              className="absolute -top-6 -start-4 font-black leading-none select-none pointer-events-none text-gray-100"
              style={{ fontSize: "14rem", lineHeight: 1 }}
            >
              &ldquo;
            </span>
            <div className="relative z-10">
              <blockquote
                className="font-extrabold text-gray-950 leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
              >
                {t.about.mission.quote}
              </blockquote>
              <p className="text-gray-400 text-sm mb-12">
                {t.about.mission.quoteAttribution}
              </p>

              {/* Micro-stats row */}
              <div className="flex gap-8 pt-8 border-t border-gray-100">
                {t.about.mission.microStats.map((s) => (
                  <div key={s.val}>
                    <div className="font-extrabold text-gray-900 text-base leading-none mb-1">{s.val}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── End — narrative + pillars ── */}
          <div>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              {t.about.mission.narrative}
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {pillars.map((p, i) => (
                <div
                  key={i}
                  className="flex gap-5 p-5 rounded-xl bg-[#f8fafc] border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: p.iconBg }}
                  >
                    <p.icon size={16} style={{ color: p.iconColor }} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 self-start font-bold text-sm px-7 py-3.5 rounded-full text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {t.about.mission.cta} <ArrowRight size={15} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
