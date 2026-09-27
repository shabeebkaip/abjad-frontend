"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const REGION_ACCENT = [true, true, true, false, false, false, false];

export default function SchoolsDiscover() {
  const { t, isRTL } = useTranslation();
  const regions = t.schoolsPage.discover.regions.map((label, i) => ({ label, accent: REGION_ACCENT[i] }));

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Start — content */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-6 px-3.5 py-1.5 rounded-full bg-white/10 text-white/60"
            >
              <MapPin size={12} />
              {t.schoolsPage.discover.badge}
            </div>
            <h2
              className="font-extrabold text-white leading-[1.1] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.schoolsPage.discover.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.discover.headlineAccent}</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-4">
              {t.schoolsPage.discover.sub1}
            </p>
            <p className="text-white/45 text-sm leading-relaxed mb-10">
              {t.schoolsPage.discover.sub2}
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 text-white"
              style={{ backgroundColor: "var(--brand-accent)" }}
            >
              {t.schoolsPage.discover.cta} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
            </Link>
          </div>

          {/* End — region list */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-white/30 mb-5">
              {t.schoolsPage.discover.regionsLabel}
            </p>
            <div className="space-y-2.5">
              {regions.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: r.accent ? "var(--brand-accent)" : "rgba(255,255,255,0.25)" }}
                  />
                  <span className="text-sm text-white/70">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
