"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const ITEM_STYLES = [
  { color: "#10b981", bg: "#f0fdf4" },
  { color: "var(--brand-accent)", bg: "rgba(0,172,211,0.07)" },
  { color: "#6366f1", bg: "rgba(99,102,241,0.07)" },
  { color: "#f59e0b", bg: "rgba(245,158,11,0.07)" },
];

export default function SchoolsGrowth() {
  const { t, isRTL } = useTranslation();
  const growthItems = t.schoolsPage.growth.items.map((item, i) => ({ ...item, ...ITEM_STYLES[i] }));

  return (
    <section className="relative bg-[#f8fafc] overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            {t.schoolsPage.growth.kicker}
          </span>
          <span className="text-xs text-gray-400">{t.schoolsPage.growth.kickerSub}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-24">

        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2
            className="font-extrabold text-gray-950 leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
          >
            {t.schoolsPage.growth.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.growth.headlineAccent}</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            {t.schoolsPage.growth.sub}
          </p>
        </div>

        {/* 2 × 2 grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {growthItems.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Check circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: item.bg }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke={item.color}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    {item.tag}
                  </span>
                  <h3 className="text-gray-950 font-bold text-base leading-snug">{item.title}</h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed ps-0 sm:ps-13">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
