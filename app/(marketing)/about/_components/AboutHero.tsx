import Link from "next/link";
import { ArrowRight, GraduationCap, School, Clock4 } from "lucide-react";

const stats = [
  { icon: GraduationCap, iconColor: "var(--brand-accent)", bg: "rgba(0,172,211,0.12)", val: "5,000+", label: "Verified Educators in Network" },
  { icon: School,        iconColor: "#a78bfa",             bg: "rgba(167,139,250,0.12)", val: "500+",   label: "Schools Across Saudi Arabia" },
  { icon: Clock4,        iconColor: "#34d399",             bg: "rgba(52,211,153,0.12)", val: "24–48h", label: "Average Placement Response" },
];

export default function AboutHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      {/* Decorative blurs */}
      <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-white/3 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-0 w-full">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center pb-20">

          {/* ── Left column — headline + CTAs ── */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-8">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              Riyadh · Jeddah · Dammam
            </div>

            <p className="text-white/35 text-xs font-black tracking-[0.22em] uppercase mb-3">
              About Abjad
            </p>

            <h1
              className="font-extrabold text-white leading-[1.04] mb-7"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 4.4rem)", letterSpacing: "-0.04em" }}
            >
              Empowering<br />
              Education<br />
              <span style={{ color: "var(--brand-accent)" }}>Excellence</span>
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-10 max-w-[48ch]">
              Abjad connects teachers, substitute teachers, and schools across Saudi Arabia —
              building a future where education staffing is faster, smarter, and more reliable.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                Join Today <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 font-semibold text-sm px-7 py-4 rounded-full hover:bg-white/18 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </div>

          {/* ── Right column — stat cards ── */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {stats.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-5 rounded-2xl px-6 py-5 border border-white/10 bg-white/6"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: s.bg }}
                >
                  <s.icon size={20} style={{ color: s.iconColor }} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-black text-white text-xl leading-none mb-1">{s.val}</div>
                  <div className="text-white/40 text-xs leading-tight">{s.label}</div>
                </div>
              </div>
            ))}

            {/* Brand tagline card */}
            <div className="rounded-2xl px-6 py-5 border border-white/8 bg-white/4">
              <p className="text-white/50 text-xs leading-relaxed">
                From international schools to high schools — Abjad bridges the gap between qualified educators and institutions that value excellence across Saudi Arabia.
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom stat bar — visual bridge to next section ── */}
        <div className="grid grid-cols-3 border-t border-white/10">
          {[
            { val: "KSA",  label: "Nationwide coverage" },
            { val: "100%", label: "Verified educator profiles" },
            { val: "70%",  label: "Faster than traditional hiring" },
          ].map((s, i) => (
            <div
              key={i}
              className={`px-8 py-6 text-center ${i < 2 ? "border-r border-white/10" : ""}`}
            >
              <div
                className="font-black text-xl leading-none mb-1"
                style={{ color: "var(--brand-accent)" }}
              >
                {s.val}
              </div>
              <div className="text-white/30 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

