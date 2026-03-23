import Link from "next/link";
import { ArrowRight, GraduationCap, School } from "lucide-react";

export default function AboutCta() {
  return (
    <section className="bg-white overflow-hidden">

      {/* Split-screen full-bleed CTA */}
      <div className="grid lg:grid-cols-2 min-h-105">

        {/* Left — Teacher side, dark navy */}
        <div
          className="relative flex flex-col justify-center px-10 py-20 lg:px-16 overflow-hidden"
          style={{ background: "var(--brand-primary)" }}
        >
          <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-white/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-white/50">For Teachers</span>
            </div>
            <h2
              className="font-extrabold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.04em" }}
            >
              Your Next Teaching Role Starts Here
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm">
              Whether you are an experienced educator or a substitute teacher, Abjad connects
              you to the right school in Riyadh, Jeddah, or Dammam.
            </p>
            <Link
              href="/register?role=teacher"
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-7 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5"
              style={{ color: "var(--brand-primary-dark)" }}
            >
              I&apos;m a Teacher <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right — School side, accent */}
        <div
          className="relative flex flex-col justify-center px-10 py-20 lg:px-16 overflow-hidden"
          style={{ background: "var(--brand-gradient)" }}
        >
          <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-white/4 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <School size={20} className="text-white" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-white/50">For Schools</span>
            </div>
            <h2
              className="font-extrabold text-white leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.04em" }}
            >
              Find Verified Educators Across Saudi Arabia
            </h2>
            <p className="text-white/55 text-sm leading-relaxed mb-8 max-w-sm">
              From substitute teachers to permanent hires — access a vetted pool of educators
              ready to join your school immediately.
            </p>
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-bold text-sm px-7 py-3.5 rounded-full hover:bg-white/25 transition-all"
            >
              I&apos;m a School <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom — Saudi focus bar */}
      <div
        className="px-6 lg:px-10 py-6"
        style={{ backgroundColor: "var(--brand-primary-light)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-2 text-sm font-semibold">
          {[
            { dot: "var(--brand-accent)", text: "Teachers grow their careers." },
            { dot: "var(--brand-primary)", text: "Schools hire with confidence." },
            { dot: "#10b981", text: "Students benefit from excellence." },
          ].map((p) => (
            <span key={p.text} className="flex items-center gap-2" style={{ color: "var(--brand-primary)" }}>
              <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ backgroundColor: p.dot }} />
              {p.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
