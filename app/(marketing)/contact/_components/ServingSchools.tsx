"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ServingSchools() {
  const { t, isRTL } = useTranslation();

  return (
    <section className="bg-[#f8fafc] py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            {t.contactPage.servingSchools.badge}
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.03em" }}
          >
            {t.contactPage.servingSchools.headlinePre}{" "}
            <span style={{ color: "var(--brand-accent)" }}>{t.contactPage.servingSchools.headlineAccent}</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {t.contactPage.servingSchools.sub}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.contactPage.servingSchools.regions.map((r, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
            >
              <span
                className="text-[10px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5 mb-3 inline-block"
                style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
              >
                {r.tag}
              </span>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{r.city}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        {/* SEO-friendly paragraph */}
        <p className="mt-12 text-center text-sm text-gray-400 max-w-3xl mx-auto leading-relaxed">
          {t.contactPage.servingSchools.seoParagraph}
        </p>
      </div>
    </section>
  );
}
