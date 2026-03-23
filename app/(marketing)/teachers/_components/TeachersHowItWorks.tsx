import Link from "next/link";
import { ArrowRight, UserPlus, BellRing, Handshake } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    desc: "Build a free, verified teacher profile in minutes — highlight your subjects, experience, and curriculum expertise.",
  },
  {
    num: "02",
    icon: BellRing,
    title: "Get Matched Instantly",
    desc: "Receive instant job alerts from verified schools across Saudi Arabia that match your skills and availability.",
  },
  {
    num: "03",
    icon: Handshake,
    title: "Apply & Get Hired",
    desc: "Apply with one click, interview directly through the platform, and start teaching faster than ever before.",
  },
];

export default function TeachersHowItWorks() {
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
                How It Works
              </span>
              <h2
                className="font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
              >
                Simple.{" "}
                <span style={{ color: "var(--brand-accent)" }}>Smart.</span>
                {" "}Seamless.
              </h2>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              Abjad connects schools and qualified teachers instantly — from posting jobs to hiring
              verified educators near you.
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
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon size={16} style={{ color: "var(--brand-accent)" }} strokeWidth={2} />
                    <h3 className="text-white font-bold text-base">{s.title}</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-black tracking-widest uppercase mb-4" style={{ color: "var(--brand-accent)" }}>
              Abjad for Everyone
            </p>
            <h3
              className="font-extrabold text-gray-950 leading-tight mb-4"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", letterSpacing: "-0.03em" }}
            >
              Whether You&apos;re Managing a High School or an International School
            </h3>
          </div>
          <div className="space-y-4">
            <p className="text-gray-600 text-base leading-relaxed">
              Abjad connects schools and qualified teachers instantly. Whether you&apos;re managing a
              high school or an international school, our system simplifies the hiring process —
              from posting jobs to hiring verified educators near you.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 rounded-full text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
