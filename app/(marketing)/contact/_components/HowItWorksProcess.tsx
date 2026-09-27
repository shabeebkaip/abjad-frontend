"use client";

import { ArrowRight, FileText, Search, Video, PlayCircle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const STEP_STYLES = [
  { icon: FileText, color: "var(--brand-accent)" },
  { icon: Search, color: "#6366f1" },
  { icon: Video, color: "#10b981" },
  { icon: PlayCircle, color: "#f59e0b" },
];

export default function HowItWorksProcess() {
  const { t, isRTL } = useTranslation();
  const steps = t.contactPage.howItWorks.steps.map((s, i) => ({ ...s, ...STEP_STYLES[i] }));

  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 mb-16 items-end">
          <div className="lg:col-span-7">
            <p
              className="text-xs font-black tracking-widest uppercase mb-4"
              style={{ color: "var(--brand-accent)" }}
            >
              {t.contactPage.howItWorks.kicker}
            </p>
            <h2
              className="font-extrabold text-white leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.contactPage.howItWorks.headlinePre}
              <br />
              <span style={{ color: "var(--brand-accent)" }}>{t.contactPage.howItWorks.headlineAccent}</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-white/55 text-base leading-relaxed self-end">
            {t.contactPage.howItWorks.sub}
          </p>
        </div>

        {/* Vertical step rows */}
        <div className="space-y-0 divide-y divide-white/10">
          {steps.map((s, i) => (
            <div key={i} className="grid lg:grid-cols-12 gap-6 items-start py-10 group">

              {/* Icon */}
              <div className="lg:col-span-2 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${s.color}22` }}
                >
                  <s.icon size={26} style={{ color: s.color }} strokeWidth={1.8} />
                </div>
              </div>

              {/* Colored accent bar */}
              <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-3">
                <div className="w-0.5 h-10 rounded-full" style={{ backgroundColor: s.color, opacity: 0.4 }} />
              </div>

              {/* Title + desc */}
              <div className="lg:col-span-9">
                <h3
                  className="font-bold text-white text-lg mb-3 leading-snug"
                  style={{ letterSpacing: isRTL ? "0" : "-0.02em" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed max-w-2xl">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/50 text-sm">
            {t.contactPage.howItWorks.ctaText}
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all"
          >
            {t.contactPage.howItWorks.ctaButton} <ArrowRight size={15} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
          </a>
        </div>
      </div>
    </section>
  );
}
