import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="relative bg-white overflow-hidden">

      {/* Thin top rule */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--brand-accent) 50%, transparent)" }} />

      {/* Full-bleed editorial split */}
      <div className="grid lg:grid-cols-2 min-h-130">

        {/* Left — brand-gradient panel with large pullquote */}
        <div
          className="relative flex flex-col justify-center px-10 py-20 lg:px-16 overflow-hidden"
          style={{ background: "var(--brand-gradient)" }}
        >
          {/* Giant opening quote mark */}
          <span
            className="absolute top-6 left-8 font-black leading-none select-none text-white/8"
            style={{ fontSize: "12rem", lineHeight: 1 }}
          >
            &ldquo;
          </span>
          <div className="relative z-10">
            <span className="inline-block text-xs font-black tracking-widest uppercase mb-5 px-3.5 py-1.5 rounded-full bg-white/10 text-white/60">
              Our Mission
            </span>
            <blockquote
              className="font-extrabold text-white leading-[1.15] mb-6"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-0.03em" }}
            >
              Ensure schools always have the right teachers — on time and ready to inspire.
            </blockquote>
            <p className="text-white/55 text-sm leading-relaxed max-w-sm">
              — The founding principle behind every placement Abjad facilitates across Saudi Arabia.
            </p>
          </div>
        </div>

        {/* Right — editorial text content */}
        <div className="flex flex-col justify-center px-10 py-20 lg:px-16 bg-[#f8fafc]">
          <h2
            className="font-extrabold text-gray-950 mb-6 leading-tight"
            style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", letterSpacing: "-0.04em" }}
          >
            Transforming School Hiring{" "}
            <span style={{ color: "var(--brand-accent)" }}>in Saudi Arabia</span>
          </h2>

          <p className="text-gray-600 text-base leading-relaxed mb-4">
            To connect schools with skilled and adaptable educators who seamlessly integrate into
            diverse learning environments — from international curricula to Ministry-aligned high school
            departments.
          </p>

          <p className="text-gray-500 text-base leading-relaxed mb-10">
            By facilitating reliable and meaningful placements, we ensure schools receive professional
            teaching support while educators apply their expertise and make a positive impact on
            students&apos; learning experiences.
          </p>

          {/* Three micro-stats */}
          <div className="flex gap-8 mb-10 pt-6 border-t border-gray-200">
            {[
              { val: "Hundreds", label: "Educators placed" },
              { val: "KSA-wide", label: "Schools served" },
              { val: "24–48 hrs", label: "Average response" },
            ].map((s) => (
              <div key={s.val}>
                <div className="font-extrabold text-gray-900 text-base">{s.val}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 self-start px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
          >
            Start Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
