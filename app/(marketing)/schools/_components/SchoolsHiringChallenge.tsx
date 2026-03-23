import Link from "next/link";
import { ArrowRight, X, CheckCircle2 } from "lucide-react";

const problems = [
  "Endless screening that delays classes",
  "Difficulty finding substitute teachers or qualified educators on short notice",
  "Growing competition among schools for top teaching talent across Saudi Arabia",
  "Limited visibility for your job postings in a nationwide market",
];

export default function SchoolsHiringChallenge() {
  return (
    <section className="relative bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            The Challenge
          </span>
          <span className="text-xs text-gray-400">Abjad solves what slows schools down</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — headline + problem cards */}
          <div>
            <h2
              className="font-extrabold text-gray-950 leading-tight mb-6"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.04em" }}
            >
              Hire Teachers Who Match{" "}
              <span style={{ color: "var(--brand-accent)" }}>Your School&apos;s Standards</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-4">
              Recruiting teachers and educators in Saudi Arabia should not be complicated.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Abjad simplifies the entire hiring process; connecting schools across the Kingdom with
              verified educators, including substitute teachers, part-time instructors, and full-time
              professionals ready to join classrooms anywhere in Saudi Arabia.
            </p>

            {/* Problem list */}
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-4">
              We are problem solvers:
            </p>
            <div className="space-y-3">
              {problems.map((p, i) => (
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

          {/* Right — solution card + stat badge */}
          <div className="lg:pt-16">
            {/* Solution card */}
            <div
              className="rounded-3xl p-10 relative overflow-hidden mb-5"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-white/10 text-white/60 mb-6">
                  The Solution
                </span>
                <h3
                  className="font-extrabold text-white leading-tight mb-5"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                >
                  Abjad helps schools hire{" "}
                  <span style={{ color: "var(--brand-accent)" }}>better, faster, smarter.</span>
                </h3>
                <div className="space-y-3 mb-8">
                  {[
                    "Smart AI matching to verified educators",
                    "Nationwide reach across all KSA regions",
                    "Real-time substitutes for urgent needs",
                  ].map((s) => (
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
                  Post Jobs <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Quick-win badge */}
            <div
              className="rounded-2xl p-5 border"
              style={{ borderColor: "var(--brand-accent-light)", backgroundColor: "var(--brand-accent-light)" }}
            >
              <p className="text-sm font-semibold leading-snug" style={{ color: "var(--brand-primary)" }}>
                Schools using Abjad report filling vacancies up to{" "}
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
