"use client";

import Link from "next/link";
import { BadgeCheck, MapPin, UserCircle2, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const ICONS = [
  { icon: BadgeCheck, color: "#10b981", bg: "#f0fdf4" },
  { icon: MapPin, color: "var(--brand-accent)", bg: "rgba(0,172,211,0.08)" },
  { icon: UserCircle2, color: "#6366f1", bg: "#eef2ff" },
];

export default function FeaturesSection() {
  const { t, isRTL } = useTranslation();
  const features = t.features.items.map((item, i) => ({ ...item, ...ICONS[i] }));

  return (
    <section id="teachers" className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16 lg:py-28">

        {/* Full-width label strip */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
          <span
            className="text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full"
            style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
          >
            {t.features.label}
          </span>
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
        </div>

        {/* Two-col asymmetric layout */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* Start — sticky headline block (2 cols) */}
          <div className="lg:col-span-2 lg:sticky lg:top-32">
            <h2
              className="font-extrabold text-gray-950 mb-6 leading-[1.1]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.features.headlinePre}{" "}
              <span
                className="relative inline-block"
                style={{ color: "var(--brand-primary)" }}
              >
                {t.features.headlineAccent}
                <span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ background: "var(--brand-accent)" }}
                />
              </span>{" "}
              {t.features.headlinePost}
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-8">
              {t.features.sub}
            </p>

            <Link
              href="/register?role=teacher"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
            >
              {t.features.cta} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
            </Link>
          </div>

          {/* End — stacked feature rows (3 cols) */}
          <div className="lg:col-span-3 flex flex-col divide-y divide-gray-100">
            {features.map((f, i) => (
              <div
                key={i}
                className="group flex items-start gap-6 py-8 first:pt-0"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon size={18} style={{ color: f.color }} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
