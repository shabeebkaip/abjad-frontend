"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ContactFaq() {
  const { t, isRTL } = useTranslation();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#f8fafc] py-24 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 mb-14 items-end">
          <div className="lg:col-span-8">
            <div
              className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-4"
              style={{ color: "var(--brand-accent)" }}
            >
              <span className="w-6 h-0.5 inline-block rounded" style={{ backgroundColor: "var(--brand-accent)" }} />
              {t.contactPage.faq.kicker}
            </div>
            <h2
              className="font-extrabold text-gray-950 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.contactPage.faq.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.contactPage.faq.headlineAccent}</span>
            </h2>
          </div>
          <p className="lg:col-span-4 text-gray-500 text-sm leading-relaxed self-end">
            {t.contactPage.faq.sub}
          </p>
        </div>

        {/* Accordion rows */}
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {t.contactPage.faq.items.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-6 text-start group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                    {faq.q}
                  </span>
                  <span
                    className="w-7 h-7 rounded-full border shrink-0 flex items-center justify-center text-base font-bold transition-all duration-200 mt-0.5"
                    style={{
                      borderColor: isOpen ? "var(--brand-accent)" : "#d1d5db",
                      color: isOpen ? "var(--brand-accent)" : "#6b7280",
                      backgroundColor: isOpen ? "var(--brand-accent-light)" : "transparent",
                    }}
                  >
                    {isOpen ? "×" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 ps-0 pe-14">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
