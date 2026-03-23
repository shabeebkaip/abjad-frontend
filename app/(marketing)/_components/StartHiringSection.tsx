"use client";

import Link from "next/link";
import { BadgeCheck, SlidersHorizontal, Clock3, Globe2, ArrowRight } from "lucide-react";

const tiles = [
  {
    type: "benefit" as const,
    icon: BadgeCheck,
    color: "#10b981",
    title: "Verified Profiles",
    desc: "Every educator is manually vetted — credentials, references, and trial assignments confirmed before placement.",
  },
  {
    type: "benefit" as const,
    icon: SlidersHorizontal,
    color: "#6366f1",
    title: "AI-Powered Filters",
    desc: "Match by curriculum, subject, city, and availability. Find the right educator in seconds.",
  },
  {
    type: "benefit" as const,
    icon: Clock3,
    color: "#f59e0b",
    title: "Record-Speed Hiring",
    desc: "Fill permanent, temporary, or substitute positions faster than any traditional method.",
  },
  {
    type: "benefit" as const,
    icon: Globe2,
    color: "var(--brand-accent)",
    title: "Nationwide Network",
    desc: "Tap into educators across Riyadh, Jeddah, Dammam, and every corner of Saudi Arabia.",
  },
];

export default function StartHiringSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-28">

        {/* Full-width label strip */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1" style={{ background: "var(--brand-accent-light)" }} />
          <span
            className="text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            For Schools
          </span>
          <div className="h-px flex-1" style={{ background: "var(--brand-accent-light)" }} />
        </div>

        {/* Mosaic grid: headline tile + 4 benefit tiles + CTA tile */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Headline tile — spans 2 cols */}
          <div
            className="col-span-2 rounded-3xl p-10 relative overflow-hidden"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="relative z-10">
              <h2
                className="font-extrabold text-white leading-[1.1] mb-4"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
              >
                Start Hiring with{" "}
                <span style={{ color: "var(--brand-accent)" }}>Abjad</span> Today
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-lg mb-8">
                Access a growing database of certified educators and substitute teachers from Riyadh,
                Jeddah, Dammam, and beyond. Pre-screened and ready to join your school.
              </p>
              <Link
                href="/register?role=school"
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-full transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                Register Now <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* 4 benefit tiles */}
          {tiles.map((t, i) => (
            <div
              key={i}
              className="group rounded-3xl border border-gray-100 bg-[#f8fafc] p-7 hover:shadow-lg hover:border-gray-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <t.icon size={20} style={{ color: t.color }} strokeWidth={2} />
                <h3 className="text-sm font-bold text-gray-900">{t.title}</h3>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{t.desc}</p>
            </div>
          ))}

          {/* CTA tile */}
          <div
            className="rounded-3xl p-7 flex flex-col justify-between"
            style={{ backgroundColor: "var(--brand-accent-light)" }}
          >
            <p
              className="text-base font-bold leading-snug mb-6"
              style={{ color: "var(--brand-primary)" }}
            >
              Every great school starts with great teachers.
            </p>
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 self-start text-sm font-bold rounded-full px-5 py-2.5 text-white transition-all hover:scale-105"
              style={{ backgroundColor: "var(--brand-accent)" }}
            >
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
