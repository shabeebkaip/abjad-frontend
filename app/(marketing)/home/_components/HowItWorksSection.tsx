"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Globe } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const ICONS = [
  { icon: ShieldCheck, accent: "#00ACD3" },
  { icon: Sparkles, accent: "#a78bfa" },
  { icon: Globe, accent: "#34d399" },
];

export default function HowItWorksSection() {
  const { t, isRTL } = useTranslation();
  const steps = t.howItWorks.steps.map((step, i) => ({ ...step, ...ICONS[i] }));

  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Large decorative number watermark */}
      <div
        className="absolute -end-8 top-1/2 -translate-y-1/2 text-[18rem] font-black leading-none select-none pointer-events-none opacity-[0.04] text-white"
      >
        02
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-28">

        {/* Top: label + headline side by side on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 bg-white/10 text-white/70">
              {t.howItWorks.label}
            </span>
            <h2
              className="font-extrabold text-white leading-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.howItWorks.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.howItWorks.headlineAccent}</span>
            </h2>
          </div>
          <p className="text-white/55 text-base leading-relaxed max-w-sm lg:text-end">
            {t.howItWorks.sub}
          </p>
        </div>

        {/* 3 step tiles */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative group rounded-3xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 overflow-hidden flex flex-col items-center text-center md:items-start md:text-start"
            >
              {/* Step icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                style={{ backgroundColor: `${s.accent}22` }}
              >
                <s.icon size={28} style={{ color: s.accent }} strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-bold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="flex flex-col items-start gap-4 border-t border-white/10 pt-10">
          <h3 className="text-xl font-bold text-white leading-snug">
            {t.howItWorks.ctaHeadline}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-lg">
            <strong className="text-white/80">{t.howItWorks.ctaBodyBold}</strong> {t.howItWorks.ctaBodyRest}
          </p>
          <Link
            href="/register?role=school"
            className="mt-2 shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "var(--brand-accent)", color: "#fff" }}
          >
            {t.howItWorks.ctaButton} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
          </Link>
        </div>
      </div>
    </section>
  );
}
