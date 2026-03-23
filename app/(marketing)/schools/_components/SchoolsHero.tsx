import Link from "next/link";
import { ArrowRight, School, GraduationCap, Users } from "lucide-react";

export default function SchoolsHero() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col lg:flex-row">

      {/* ── Left: dark navy content panel ── */}
      <div
        className="relative flex-1 flex flex-col justify-center px-8 py-36 lg:px-16 lg:py-44 lg:w-1/2"
        style={{ background: "var(--brand-gradient)" }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        {/* Decorative blurs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/4 pointer-events-none" />
        <div className="absolute -bottom-16 -right-10 w-60 h-60 rounded-full bg-white/3 pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-8">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
            </span>
            Hiring Platform for Saudi Schools
          </div>

          <h1
            className="font-extrabold text-white leading-[1.06] mb-6"
            style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)", letterSpacing: "-0.03em" }}
          >
            Abjad: The Easiest Way to{" "}
            <span style={{ color: "var(--brand-accent)" }}>Hire Teachers</span>{" "}
            in Saudi Arabia
          </h1>

          <p className="text-white/70 text-lg leading-relaxed mb-3 max-w-lg">
            Find qualified teachers, substitute teachers, and educators for your school instantly.
          </p>

          <p className="text-white/50 text-sm leading-relaxed mb-10 max-w-lg">
            Whether you manage an international school, a private institution, or a national education
            network anywhere in Saudi Arabia, Abjad connects you with experienced educators ready to
            start right away.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5 text-white"
              style={{ backgroundColor: "var(--brand-accent)" }}
            >
              Start Hiring <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/85 font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/18 transition-all"
            >
              Talk to Us
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right: light panel with stat cards ── */}
      <div className="relative flex-1 flex items-center justify-center bg-[#eef5fb] px-8 py-16 lg:px-12">
        {/* Soft radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,172,211,0.08) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 w-full max-w-sm flex flex-col gap-4">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              <School size={22} className="text-white" />
            </div>
            <div>
              <div className="font-black text-gray-950 text-2xl leading-none mb-1">500+</div>
              <div className="text-gray-500 text-xs font-medium">Schools Across Saudi Arabia</div>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "var(--brand-accent-light)" }}
            >
              <GraduationCap size={22} style={{ color: "var(--brand-accent)" }} />
            </div>
            <div>
              <div className="font-black text-gray-950 text-2xl leading-none mb-1">5,000+</div>
              <div className="text-gray-500 text-xs font-medium">Verified Educators Ready to Place</div>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50">
              <Users size={22} className="text-emerald-500" />
            </div>
            <div>
              <div className="font-black text-gray-950 text-2xl leading-none mb-1">70%</div>
              <div className="text-gray-500 text-xs font-medium">Faster Hiring Than Traditional Methods</div>
            </div>
          </div>

          {/* Serving badge */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{ backgroundColor: "var(--brand-primary-light)" }}
          >
            <p className="text-sm font-semibold leading-snug" style={{ color: "var(--brand-primary)" }}>
              Serving international schools, private institutions &amp; national networks across the Kingdom
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
