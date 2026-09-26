"use client";

import { ShieldCheck, Zap, Star, Users } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const VALUE_ICONS = [
  { icon: ShieldCheck, accent: "#10b981", bg: "rgba(16,185,129,0.08)" },
  { icon: Zap, accent: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  { icon: Star, accent: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  { icon: Users, accent: "var(--brand-accent)", bg: "rgba(0,172,211,0.08)" },
];

export default function ValuesSection() {
  const { t } = useTranslation();
  const values = t.about.values.items.map((v, i) => ({ ...v, ...VALUE_ICONS[i] }));

  return (
    <section className="overflow-hidden">

      {/* Top accent strip — bridges from dark VisionAndWhy section */}
      <div
        className="h-0.75 w-full"
        style={{ background: "linear-gradient(90deg, var(--brand-accent), var(--brand-primary-light) 70%)" }}
      />

      {/* Label strip */}
      <div className="bg-[#f8fafc] border-b border-gray-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            {t.about.values.kicker}
          </span>
          <span className="text-xs text-gray-400">{t.about.values.kickerSub}</span>
        </div>
      </div>

      <div className="bg-[#f8fafc] max-w-6xl mx-auto px-6 lg:px-10 py-24">

        {/* Headline + intro */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <h2
              className="font-extrabold text-gray-950 leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.04em" }}
            >
              {t.about.values.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.about.values.headlineAccent}</span>
            </h2>
          </div>
          <div className="lg:col-span-2 flex items-end">
            <p className="text-gray-500 text-base leading-relaxed">
              {t.about.values.sub}
            </p>
          </div>
        </div>

        {/* 2 × 2 value cards with colored border */}
        <div className="grid md:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Accent border */}
              <div
                className="absolute start-0 top-0 bottom-0 w-0.75 rounded-s-2xl"
                style={{ backgroundColor: v.accent }}
              />
              <div className="p-8 text-center">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto"
                  style={{ backgroundColor: v.bg }}
                >
                  <v.icon size={22} style={{ color: v.accent }} strokeWidth={2} />
                </div>
                <h3
                  className="font-extrabold text-gray-900 leading-tight mb-3"
                  style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
