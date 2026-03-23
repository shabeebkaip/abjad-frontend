import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck, MapPin } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.1)",
    title: "Fast Matches",
    desc: "AI-powered matching connects teachers and schools within minutes — no waiting, no guesswork.",
  },
  {
    icon: ShieldCheck,
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    title: "Verified Profiles",
    desc: "Each teacher and school undergoes a simple but thorough screening process to ensure quality on both sides.",
  },
  {
    icon: MapPin,
    color: "#6366f1",
    bg: "rgba(99,102,241,0.1)",
    title: "Local Focus",
    desc: "Specialized for Riyadh schools, Jeddah schools, and Dammam schools — we know the Saudi education landscape.",
  },
];

export default function TeachersWhyChooseAbjad() {
  return (
    <section className="bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            Why Abjad
          </span>
          <span className="text-xs text-gray-400">Because education deserves better</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">

        {/* Headline */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2
            className="font-extrabold text-gray-950 leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
          >
            Why Schools and Teachers{" "}
            <span style={{ color: "var(--brand-accent)" }}>Choose Abjad</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Because education deserves better. We&apos;ve built a platform that respects the time,
            expertise, and goals of both teachers and schools.
          </p>
        </div>

        {/* 3 cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="rounded-3xl border border-gray-100 bg-[#f8fafc] p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: r.bg }}
              >
                <r.icon size={22} style={{ color: r.color }} strokeWidth={2} />
              </div>
              <h3 className="text-gray-950 font-bold text-base mb-3">{r.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 font-bold text-sm px-9 py-4 rounded-full text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "var(--brand-gradient)" }}
          >
            Start Hiring <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
