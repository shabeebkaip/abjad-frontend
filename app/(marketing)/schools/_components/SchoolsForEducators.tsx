import Link from "next/link";
import { ArrowRight, User, Search, BellRing, LayoutDashboard } from "lucide-react";

const benefits = [
  {
    icon: User,
    color: "var(--brand-accent)",
    title: "Free Professional Profile",
    desc: "Create a free profile and get discovered by top schools across Saudi Arabia.",
  },
  {
    icon: Search,
    color: "#a78bfa",
    title: "Verified Job Openings",
    desc: "Access verified job listings from trusted, reputable institutions only.",
  },
  {
    icon: BellRing,
    color: "#34d399",
    title: "Instant Alerts",
    desc: "Receive instant alerts when new teaching and substitute positions open.",
  },
  {
    icon: LayoutDashboard,
    color: "#f59e0b",
    title: "Easy Dashboard",
    desc: "Apply quickly and track all your applications in one easy-to-use dashboard.",
  },
];

export default function SchoolsForEducators() {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Large watermark */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none"
        style={{ fontSize: "18rem", lineHeight: 1, color: "rgba(255,255,255,0.02)" }}
      >
        EDUCATORS
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-10 items-end mb-16">
          <div>
            <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-white/10 text-white/60 mb-5">
              For Educators
            </span>
            <h2
              className="font-extrabold text-white leading-[1.1]"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
            >
              Why Educators Across Saudi Arabia{" "}
              <span style={{ color: "var(--brand-accent)" }}>Choose Abjad</span>
            </h2>
          </div>
          <p className="text-white/55 text-base leading-relaxed max-w-md">
            Abjad is designed to help teachers, substitute teachers, and educators get hired faster,
            with tools built specifically for today&apos;s job market.
          </p>
        </div>

        {/* Benefit tiles */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl p-7 border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                <b.icon size={20} style={{ color: b.color }} strokeWidth={2} />
              </div>
              <h3 className="text-white font-bold text-sm mb-2">{b.title}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/register?role=teacher"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
            style={{ color: "var(--brand-primary-dark)" }}
          >
            Join as an Educator <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
