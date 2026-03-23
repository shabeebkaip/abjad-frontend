import Link from "next/link";
import { ArrowRight, Bell, Lock, UserCheck, Zap } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Post Your Vacancies",
    desc: "From preschool to high school — list your teaching openings in minutes.",
  },
  {
    num: "02",
    title: "Get Instant Matches",
    desc: "Receive qualified teacher candidates across Saudi Arabia immediately.",
  },
  {
    num: "03",
    title: "Interview & Hire",
    desc: "Interview and hire directly through the platform — fast, secure, seamless.",
  },
];

const features = [
  {
    icon: UserCheck,
    color: "#10b981",
    bg: "#f0fdf4",
    title: "Verified Profiles",
    desc: "Complete credentials, references, and vetting confirmed before placement.",
  },
  {
    icon: Bell,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.08)",
    title: "Instant Notifications",
    desc: "Real-time alerts for nearby qualified candidates the moment you post.",
  },
  {
    icon: Lock,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    title: "School-Only Access",
    desc: "Secure, school-only access to all applications and candidate portfolios.",
  },
  {
    icon: Zap,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Faster Matching",
    desc: "AI-powered teacher matching for record-speed, confident hiring decisions.",
  },
];

export default function SchoolsSimpleHiring() {
  return (
    <section className="bg-[#f8fafc] overflow-hidden">

      {/* ── Steps strip — dark navy ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--brand-primary)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        {/* Large watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden"
          style={{ fontSize: "18rem", fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,0.02)" }}
        >
          03
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/10 text-white/60 mb-4">
                For Schools
              </span>
              <h2
                className="font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
              >
                Simple Hiring,{" "}
                <span style={{ color: "var(--brand-accent)" }}>Strong Results</span>
              </h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Post your teaching vacancies from preschool to high school and get instant matches.
            </p>
          </div>

          {/* 3 steps */}
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {steps.map((s) => (
              <div key={s.num} className="px-8 py-10 flex items-start gap-5">
                <span
                  className="text-4xl font-black leading-none shrink-0 mt-1"
                  style={{ color: "var(--brand-accent)", opacity: 0.55 }}
                >
                  {s.num}
                </span>
                <div>
                  <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feature cards ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20">
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs font-black tracking-widest uppercase text-gray-400 px-4">
            Why Schools Use Abjad
          </span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: f.bg }}
              >
                <f.icon size={20} style={{ color: f.color }} strokeWidth={2} />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5 text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Hire Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
