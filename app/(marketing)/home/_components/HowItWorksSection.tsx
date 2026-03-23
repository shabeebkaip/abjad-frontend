import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    accent: "var(--brand-accent)",
    title: "Verified Profiles Ready to Place",
    desc: "Every educator on Abjad is manually verified with credential checks, reference reviews, and trial assignments — so schools can hire with zero risk.",
  },
  {
    num: "02",
    accent: "#a78bfa",
    title: "Smart AI Matching",
    desc: "Our platform analyses curriculum requirements, location, and availability to instantly surface the right educator for the right school — every time.",
  },
  {
    num: "03",
    accent: "#34d399",
    title: "Nationwide Support",
    desc: "From Riyadh to Dammam to Jeddah, Abjad covers every region of Saudi Arabia — giving international schools, high schools, and private academies direct access to talent.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Large decorative number watermark */}
      <div
        className="absolute -right-8 top-1/2 -translate-y-1/2 text-[18rem] font-black leading-none select-none pointer-events-none opacity-[0.04] text-white"
      >
        02
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-28">

        {/* Top: label + headline side by side on desktop */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5 bg-white/10 text-white/70">
              How Abjad Works
            </span>
            <h2
              className="font-extrabold text-white leading-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: "-0.04em" }}
            >
              Streamlined Hiring for{" "}
              <span style={{ color: "var(--brand-accent)" }}>Every School</span>
            </h2>
          </div>
          <p className="text-white/55 text-base leading-relaxed max-w-sm lg:text-right">
            Whether you search for full-time teachers, part-time educators, or substitute teachers —
            Abjad brings the entire Kingdom together on one powerful platform.
          </p>
        </div>

        {/* 3 numbered step tiles */}
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {steps.map((s, i) => (
            <div
              key={i}
              className="relative group rounded-3xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 overflow-hidden"
            >
              {/* Giant step number */}
              <span
                className="block font-black leading-none mb-6 select-none"
                style={{ fontSize: "clamp(3.5rem, 6vw, 5rem)", color: s.accent, opacity: 0.9 }}
              >
                {s.num}
              </span>
              <h3 className="text-base font-bold text-white mb-3">{s.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{s.desc}</p>
              {/* Bottom accent line on hover */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${s.accent}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Body text + CTA row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 border-t border-white/10 pt-10">
          <p className="text-white/50 text-sm leading-relaxed max-w-lg">
            Designed to support schools nationwide — Abjad goes beyond Riyadh, Jeddah, and Dammam,
            serving institutions across every region of Saudi Arabia.
          </p>
          <Link
            href="/register?role=school"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "var(--brand-accent)", color: "#fff" }}
          >
            Start Hiring <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
