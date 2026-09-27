"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

const INITIAL_VISIBLE = 6;
const STAT_COLORS = ["var(--brand-accent)", "#10b981", "var(--brand-primary)"];

export default function TeachersFaq() {
  const { t, isRTL } = useTranslation();
  const faqs = t.teachersPage.faq.items;
  const statLabels = t.teachersPage.faq.statLabels.map((s, i) => ({ ...s, color: STAT_COLORS[i] }));
  const [open, setOpen] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const visibleFaqs = showAll ? faqs : faqs.slice(0, INITIAL_VISIBLE);
  const flip = { transform: isRTL ? "scaleX(-1)" : undefined };

  return (
    <section className="bg-[#f8fafc] overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            {t.teachersPage.faq.kicker}
          </span>
          <span className="text-xs text-gray-400">{faqs.length} {t.teachersPage.faq.questionsAnsweredLabel}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-12 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Start — accordion */}
          <div className="lg:col-span-8">
            <h2
              className="font-extrabold text-gray-950 mb-10"
              style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.teachersPage.faq.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.teachersPage.faq.headlineAccent}</span>
            </h2>

            <div className="divide-y divide-gray-200 border-y border-gray-200">
              {visibleFaqs.map((faq, i) => {
                const isOpen = open === i;
                return (
                  <div key={i}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="w-full flex items-start justify-between gap-6 py-5 text-start group"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors">
                        {faq.q}
                      </span>
                      <span
                        className="w-6 h-6 rounded-full border shrink-0 flex items-center justify-center text-sm font-bold transition-all duration-200 mt-0.5"
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
                      <div className="pb-5 pe-4 sm:pe-12">
                        <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Show more / less toggle */}
            <button
              type="button"
              onClick={() => { setShowAll(!showAll); if (showAll) setOpen(null); }}
              className="mt-6 flex items-center gap-2 text-sm font-semibold transition-colors hover:opacity-80"
              style={{ color: "var(--brand-accent)" }}
            >
              {showAll ? t.teachersPage.faq.showFewer : `${t.teachersPage.faq.showAllPre} ${faqs.length} ${t.teachersPage.faq.showAllPost}`}
              <span
                className="w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold transition-transform"
                style={{ borderColor: "var(--brand-accent)", transform: showAll ? "rotate(45deg)" : "none" }}
              >
                +
              </span>
            </button>

            {/* Inline CTA after FAQ */}
            <div
              className="mt-10 rounded-2xl p-5 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div>
                <p className="text-white font-bold mb-1">{t.teachersPage.faq.inlineCtaTitle}</p>
                <p className="text-white/55 text-sm">
                  {t.teachersPage.faq.inlineCtaBody}
                </p>
              </div>
              <Link
                href="/register?role=teacher"
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-full whitespace-nowrap transition-all hover:shadow-xl hover:-translate-y-0.5 shrink-0"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                {t.teachersPage.faq.inlineCtaButton} <ArrowRight size={15} style={flip} />
              </Link>
            </div>
          </div>

          {/* End — sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-5">

              {/* Quote card */}
              <div
                className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: "var(--brand-gradient)" }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-2 start-4 font-black text-white/8 leading-none select-none pointer-events-none"
                  style={{ fontSize: "6rem" }}
                >
                  &ldquo;
                </span>
                <div className="relative z-10">
                  <p className="text-white/80 text-sm leading-relaxed italic mb-4">
                    {t.teachersPage.faq.quoteText}
                  </p>
                  <span className="text-xs text-white/40">{t.teachersPage.faq.quoteAttribution}</span>
                </div>
              </div>

              {/* Stats panel */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
                {statLabels.map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{s.label}</span>
                    <span className="font-black text-sm" style={{ color: s.color }}>
                      {s.val}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 text-sm font-bold py-3.5 rounded-xl transition-all hover:shadow-lg text-white"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                {t.teachersPage.faq.stillQuestions} <ArrowRight size={14} style={flip} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
