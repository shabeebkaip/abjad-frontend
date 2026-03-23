import Link from "next/link";
import { ArrowRight, X, Clock } from "lucide-react";

const painPoints = [
  "Difficulty finding jobs that match your qualifications and subject expertise",
  "Slow hiring response from schools leaves you waiting without answers",
  "Limited visibility for substitute teachers in a competitive market",
  "No flexibility — rigid schedules that don't suit your lifestyle",
];

const flexBenefits = [
  { label: "Part-time & full-time roles", color: "var(--brand-accent)" },
  { label: "Substitute teaching slots", color: "#10b981" },
  { label: "Flexible morning or afternoon shifts", color: "#a78bfa" },
  { label: "Remote & hybrid opportunities", color: "#f59e0b" },
];

export default function TeachersOpportunities() {
  return (
    <section className="relative bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            For Teachers
          </span>
          <span className="text-xs text-gray-400">Abjad puts your career first</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left — headline + pain points */}
          <div>
            <h2
              className="font-extrabold text-gray-950 leading-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.04em" }}
            >
              Shape the Future:{" "}
              <span style={{ color: "var(--brand-accent)" }}>One Class at a Time</span>
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-3">
              Whether you&apos;re a full-time teacher or a substitute teacher seeking new classrooms,
              Abjad helps you match with schools that value your skills.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed mb-10">
              Discover opportunities in Riyadh, Jeddah, or Dammam schools tailored to your
              expertise and goals — and enjoy the flexibility to work on your terms.
            </p>

            {/* Pain points */}
            <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-4">
              We solve the real challenges teachers face:
            </p>
            <div className="space-y-3">
              {painPoints.map((p, i) => (
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

          {/* Right — solution card + flexible hours */}
          <div className="lg:pt-16">
            {/* Flexible hours card */}
            <div
              className="rounded-3xl p-10 relative overflow-hidden mb-5"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-white/10 text-white/60 mb-6">
                  Flexible Opportunities
                </span>
                <h3
                  className="font-extrabold text-white leading-tight mb-3"
                  style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
                >
                  Work on{" "}
                  <span style={{ color: "var(--brand-accent)" }}>Your Schedule</span>
                </h3>
                <p className="text-white/60 text-sm mb-6 leading-relaxed">
                  Abjad supports teachers who want flexibility — choose the hours, days, and
                  schools that fit your lifestyle without compromising career growth.
                </p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {flexBenefits.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-2.5 rounded-xl bg-white/8 px-3.5 py-3"
                    >
                      <Clock size={13} style={{ color: b.color }} className="shrink-0" />
                      <span className="text-white/70 text-xs font-medium">{b.label}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register?role=teacher"
                  className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3 rounded-full transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                  style={{ color: "var(--brand-primary-dark)" }}
                >
                  Explore Roles <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Quick-win badge */}
            <div
              className="rounded-2xl p-5 border"
              style={{ borderColor: "var(--brand-accent-light)", backgroundColor: "var(--brand-accent-light)" }}
            >
              <p className="text-sm font-semibold leading-snug" style={{ color: "var(--brand-primary)" }}>
                Teachers on Abjad receive their first interview invitation within{" "}
                <span style={{ color: "var(--brand-accent)" }}>72 hours</span>{" "}
                of completing their profile.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
