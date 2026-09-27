"use client";

import { Globe, Award, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const REASON_STYLES = [
  { icon: Globe, iconColor: "var(--brand-accent)", iconBg: "rgba(0,172,211,0.1)" },
  { icon: Award, iconColor: "#6366f1", iconBg: "rgba(99,102,241,0.1)" },
  { icon: ShieldCheck, iconColor: "#10b981", iconBg: "rgba(16,185,129,0.1)" },
  { icon: Zap, iconColor: "#f59e0b", iconBg: "rgba(245,158,11,0.1)" },
  { icon: RefreshCw, iconColor: "var(--brand-primary)", iconBg: "rgba(13,37,66,0.08)" },
];

export default function WhyReachUs() {
  const { t, isRTL } = useTranslation();
  const reasons = t.contactPage.whyReachUs.reasons.map((r, i) => ({ ...r, ...REASON_STYLES[i] }));

  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Label bar */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
          <span
            className="text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            {t.contactPage.whyReachUs.kicker}
          </span>
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
        </div>

        {/* Big headline */}
        <div className="grid lg:grid-cols-12 gap-6 mb-12 items-end">
          <h2
            className="lg:col-span-7 font-extrabold text-gray-950 leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
          >
            {t.contactPage.whyReachUs.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.contactPage.whyReachUs.headlineAccent}</span>
          </h2>
          <p className="lg:col-span-5 text-gray-500 text-base leading-relaxed self-end">
            {t.contactPage.whyReachUs.sub}
          </p>
        </div>

        {/* Divider rows */}
        <div className="divide-y divide-gray-100">
          {reasons.map((r, i) => (
            <div key={i} className="grid lg:grid-cols-12 gap-4 items-start py-8 group">
              {/* Icon */}
              <div className="lg:col-span-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: r.iconBg }}
                >
                  <r.icon size={18} style={{ color: r.iconColor }} strokeWidth={2} />
                </div>
              </div>

              {/* Title */}
              <h3
                className="lg:col-span-3 font-bold text-gray-900 text-base leading-snug"
              >
                {r.title}
              </h3>

              {/* Divider */}
              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <div className="w-px h-8 bg-gray-200" />
              </div>

              {/* Desc */}
              <p className="lg:col-span-7 text-sm text-gray-500 leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
