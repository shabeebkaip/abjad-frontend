"use client";

import Link from "next/link";
import { ArrowRight, X, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function SchoolsHiringChallenge() {
  const { t, isRTL } = useTranslation();

  return (
    <section className="relative bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            {t.schoolsPage.hiringChallenge.kicker}
          </span>
          <span className="text-xs text-gray-400">{t.schoolsPage.hiringChallenge.kickerSub}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-14 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Start — headline + problem cards */}
          <div>
            <h2
              className="font-extrabold text-gray-950 leading-tight mb-6"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: isRTL ? "0" : "-0.04em" }}
            >
              {t.schoolsPage.hiringChallenge.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.hiringChallenge.headlineAccent}</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              {t.schoolsPage.hiringChallenge.sub1}
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              {t.schoolsPage.hiringChallenge.sub2}
            </p>

            {/* Problem list */}
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-4">
              {t.schoolsPage.hiringChallenge.problemsLabel}
            </p>
            <div className="space-y-3">
              {t.schoolsPage.hiringChallenge.problems.map((p, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-red-100 bg-red-50"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} className="text-red-500" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700 leading-snug">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* End — solution card + stat badge */}
          <div className="lg:pt-16">
            {/* Solution card */}
            <div
              className="rounded-3xl p-7 sm:p-10 relative overflow-hidden mb-5"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div className="absolute -bottom-10 -end-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-white/10 text-white/60 mb-6">
                  {t.schoolsPage.hiringChallenge.solutionBadge}
                </span>
                <h3
                  className="font-extrabold text-white leading-tight mb-5"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                >
                  {t.schoolsPage.hiringChallenge.solutionHeadlinePre}{" "}
                  <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.hiringChallenge.solutionHeadlineAccent}</span>
                </h3>
                <div className="space-y-3 mb-8">
                  {t.schoolsPage.hiringChallenge.solutionPoints.map((s) => (
                    <div key={s} className="flex items-center gap-3">
                      <CheckCircle2 size={16} style={{ color: "var(--brand-accent)" }} className="shrink-0" />
                      <span className="text-white/70 text-sm">{s}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register?role=school"
                  className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-full transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                  style={{ color: "var(--brand-primary-dark)" }}
                >
                  {t.schoolsPage.hiringChallenge.ctaPost} <ArrowRight size={15} style={{ transform: isRTL ? "scaleX(-1)" : undefined }} />
                </Link>
              </div>
            </div>

            {/* Quick-win badge */}
            <div
              className="rounded-2xl p-5 border"
              style={{ borderColor: "var(--brand-accent-light)", backgroundColor: "var(--brand-accent-light)" }}
            >
              <p className="text-sm font-semibold leading-snug" style={{ color: "var(--brand-primary)" }}>
                {t.schoolsPage.hiringChallenge.quickWinPre}{" "}
                <span style={{ color: "var(--brand-accent)" }}>{t.schoolsPage.hiringChallenge.quickWinHighlight}</span>{" "}
                {t.schoolsPage.hiringChallenge.quickWinPost}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
