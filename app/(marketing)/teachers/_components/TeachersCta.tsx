import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TeachersCta() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/3 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-28 text-center">
        <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/10 text-white/55 mb-8">
          Join Abjad Today
        </span>

        <h2
          className="font-extrabold text-white leading-[1.08] mb-4"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em" }}
        >
          Your Next Classroom Awaits —{" "}
          <span style={{ color: "var(--brand-accent)" }}>Join Abjad Today</span>
        </h2>

        <p className="text-white/60 text-lg leading-relaxed mb-3 max-w-xl mx-auto">
          Whether you&apos;re an educator ready to inspire or a school ready to grow, Abjad is your
          partner in connecting talent and opportunity across Saudi Arabia.
        </p>
        <p className="text-white/40 text-sm mb-12 max-w-lg mx-auto">
          Join thousands of teachers and hundreds of schools already using Abjad to simplify
          hiring and discover teaching opportunities across the Kingdom.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            href="/register?role=teacher"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-9 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-0.5"
            style={{ color: "var(--brand-primary-dark)" }}
          >
            Sign Up <ArrowRight size={16} />
          </Link>
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 bg-white/12 border border-white/25 text-white font-semibold text-sm px-7 py-4 rounded-full hover:bg-white/20 transition-all"
          >
            Hire Educators
          </Link>
        </div>
      </div>
    </section>
  );
}
