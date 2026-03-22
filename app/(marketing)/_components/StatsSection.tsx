"use client";

import Link from "next/link";
import { Building2, GraduationCap, ArrowRight, Zap, BadgeCheck, Globe2 } from "lucide-react";

export default function StatsSection() {
  return (
    <section id="schools" className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            Why Abjad
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            The{" "}
            <span style={{ color: "var(--brand-accent)" }}>Smarter Way</span>{" "}
            to Connect
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Abjad transforms education hiring in Saudi Arabia by connecting schools with top teachers
            and educators. With intelligent matching, real-time updates, and nationwide reach, Abjad
            streamlines how educators get discovered and how schools hire.
          </p>
        </div>

        {/* Two-column comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          {/* For Schools */}
          <div
            className="relative rounded-3xl p-8 overflow-hidden"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5">
                <Building2 size={22} className="text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">For Schools</h3>
              <ul className="space-y-3 mb-8">
                {["Efficient recruitment", "Verified educators", "Simple onboarding"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/85 text-sm">
                    <BadgeCheck size={16} className="text-white/70 shrink-0" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/register?role=school"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:gap-3 transition-all"
              >
                Get Started <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* For Teachers */}
          <div className="rounded-3xl p-8 bg-white border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ backgroundColor: "var(--brand-primary-light)" }}>
              <GraduationCap size={22} style={{ color: "var(--brand-primary)" }} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">For Teachers</h3>
            <ul className="space-y-3 mb-8">
              {["Flexible roles", "International school options", "Fast applications"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-600 text-sm">
                  <BadgeCheck size={16} style={{ color: "var(--brand-primary)" }} className="shrink-0" strokeWidth={2} />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/register?role=teacher"
              className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
              style={{ color: "var(--brand-primary)" }}
            >
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Zap, color: "#f59e0b", bg: "#fef3c7", stat: "70%", label: "Shorter recruitment time" },
            { icon: BadgeCheck, color: "#10b981", bg: "#ecfdf5", stat: "100%", label: "Verified profiles" },
            { icon: Globe2, color: "#6366f1", bg: "#eef2ff", stat: "KSA", label: "Nationwide coverage" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} strokeWidth={2} />
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">{s.stat}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
