import Link from "next/link";
import { ArrowRight, GraduationCap, School } from "lucide-react";

export default function AboutCta() {
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
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-white/3 pointer-events-none" />
      {/* Accent glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-160 h-60 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,172,211,0.12) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-28 text-center">

        <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/10 text-white/55 mb-8">
          Join Abjad Today
        </span>

        <h2
          className="font-extrabold text-white leading-[1.06] mb-5"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", letterSpacing: "-0.04em" }}
        >
          Ready to Transform Education Hiring{" "}
          <span style={{ color: "var(--brand-accent)" }}>in Saudi Arabia?</span>
        </h2>

        <p className="text-white/60 text-lg leading-relaxed max-w-xl mx-auto mb-14">
          Whether you&apos;re a teacher finding your next role or a school building a stronger
          team — Abjad connects you in minutes.
        </p>

        {/* Dual CTA */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-14">
          <Link
            href="/register?role=teacher"
            className="inline-flex items-center gap-2.5 bg-white font-bold text-sm px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-0.5"
            style={{ color: "var(--brand-primary-dark)" }}
          >
            <GraduationCap size={16} />
            I&apos;m a Teacher
          </Link>
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2.5 border border-white/30 bg-white/10 text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-white/20 transition-all"
          >
            <School size={16} />
            I&apos;m a School
          </Link>
        </div>

        {/* Tagline trio */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {[
            { dot: "var(--brand-accent)", text: "Teachers grow their careers." },
            { dot: "#a78bfa",             text: "Schools hire with confidence." },
            { dot: "#34d399",             text: "Students benefit from excellence." },
          ].map((p) => (
            <span
              key={p.text}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.dot }} />
              {p.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
