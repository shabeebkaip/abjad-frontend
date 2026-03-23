import Link from "next/link";
import { ArrowRight, X, Zap, ShieldCheck, Bell } from "lucide-react";

const hiringChallenges = [
  "Long hiring cycles that delay classroom readiness",
  "Limited access to verified, pre-screened teachers",
  "High turnover rates disrupting student progress",
];

const solutions = [
  {
    icon: Zap,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.1)",
    title: "Smart Matching System",
    desc: "Quickly connects schools with qualified teachers who meet their subject, level, and availability requirements.",
  },
  {
    icon: ShieldCheck,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    title: "Pre-Verified Profiles",
    desc: "Schools skip the screening stage — every teacher on Abjad has verified credentials, experience, and references.",
  },
  {
    icon: Bell,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    title: "Instant Notifications",
    desc: "Schools receive immediate alerts when a qualified teacher becomes available, cutting hiring time from weeks to days.",
  },
];

export default function TeachersForSchools() {
  return (
    <section className="bg-[#f8fafc] overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            For Schools
          </span>
          <span className="text-xs text-gray-400">Hire educators that fit your values</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Left */}
          <div className="lg:col-span-5">
            <h2
              className="font-extrabold text-gray-950 leading-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.04em" }}
            >
              Build a Strong{" "}
              <span style={{ color: "var(--brand-accent)" }}>Teaching Team</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              From kindergarten to high school, Abjad helps schools find passionate educators.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Instantly connect with certified teachers, substitute teachers, and experienced staff
              who can elevate classroom performance — all verified and ready to teach.
            </p>

            {/* Hiring challenges */}
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-4">
              Common Hiring Challenges:
            </p>
            <div className="space-y-3 mb-8">
              {hiringChallenges.map((c, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-xl border border-red-100 bg-red-50"
                >
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={11} className="text-red-500" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700 leading-snug">{c}</span>
                </div>
              ))}
            </div>

            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Post Jobs <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — Abjad's solutions */}
          <div className="lg:col-span-7">
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-6">
              Abjad&apos;s Solution:
            </p>
            <div className="space-y-5 mb-8">
              {solutions.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-5 hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: s.bg }}
                  >
                    <s.icon size={20} style={{ color: s.color }} strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-gray-950 font-bold text-sm mb-1.5">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Result badge */}
            <div
              className="rounded-2xl p-6"
              style={{ background: "var(--brand-gradient)" }}
            >
              <p className="text-xs font-black tracking-widest uppercase text-white/50 mb-2">
                The Result
              </p>
              <p className="text-white font-semibold text-sm leading-relaxed">
                Faster onboarding and minimal disruption to classes — schools report filling
                vacancies up to{" "}
                <span style={{ color: "var(--brand-accent)" }}>70% faster</span>{" "}
                than traditional recruitment methods.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
