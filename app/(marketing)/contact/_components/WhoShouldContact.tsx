"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

export default function WhoShouldContact() {
  const { t } = useTranslation();

  return (
    <section className="overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-115">

        {/* Schools — dark navy */}
        <div
          className="flex flex-col justify-center px-10 py-20 lg:px-16"
          style={{ background: "var(--brand-primary)" }}
        >
          <p
            className="text-xs font-black tracking-widest uppercase mb-6"
            style={{ color: "var(--brand-accent)" }}
          >
            {t.contactPage.whoShouldContact.schoolsBadge}
          </p>
          <h2
            className="font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", letterSpacing: "-0.04em" }}
          >
            {t.contactPage.whoShouldContact.schoolsHeadline}
          </h2>
          <p className="text-white/50 text-sm mb-8">
            {t.contactPage.whoShouldContact.schoolsSub}
          </p>
          <ul className="space-y-5">
            {t.contactPage.whoShouldContact.schoolsNeeds.map((need, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ backgroundColor: "var(--brand-accent)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-white/70 leading-relaxed">{need}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Teachers — light */}
        <div className="flex flex-col justify-center px-10 py-20 lg:px-16 bg-[#f8fafc]">
          <p
            className="text-xs font-black tracking-widest uppercase mb-6"
            style={{ color: "var(--brand-primary)" }}
          >
            {t.contactPage.whoShouldContact.teachersBadge}
          </p>
          <h2
            className="font-extrabold leading-tight mb-4"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", letterSpacing: "-0.04em", color: "var(--brand-primary)" }}
          >
            {t.contactPage.whoShouldContact.teachersHeadline}
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            {t.contactPage.whoShouldContact.teachersSub}
          </p>
          <ul className="space-y-5">
            {t.contactPage.whoShouldContact.teachersNeeds.map((need, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 leading-relaxed">{need}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
