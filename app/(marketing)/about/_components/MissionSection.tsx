import Link from "next/link";
import { ArrowRight, Target, Lightbulb } from "lucide-react";

export default function MissionSection() {
  return (
    <section className="relative bg-[#f8fafc] py-24 overflow-hidden">
      <div
        className="absolute -top-40 -right-40 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — visual panel */}
          <div className="relative">
            {/* Main card */}
            <div
              className="relative rounded-3xl p-10 overflow-hidden"
              style={{ background: "var(--brand-gradient)" }}
            >
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/6 pointer-events-none" />
              <div className="absolute -top-6 -left-6 w-32 h-32 rounded-full bg-white/4 pointer-events-none" />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                  <Target size={26} className="text-white" strokeWidth={1.8} />
                </div>
                <p
                  className="text-white font-bold leading-snug mb-6"
                  style={{ fontSize: "clamp(1.2rem, 2.5vw, 1.7rem)" }}
                >
                  &ldquo;Ensure schools always have the right teachers and educators on time and ready to inspire.&rdquo;
                </p>
                <p className="text-white/55 text-sm font-semibold tracking-widest uppercase">
                  Our Purpose
                </p>
              </div>
            </div>

            {/* Floating stat pill */}
            <div className="absolute -bottom-5 -left-4 bg-white rounded-2xl px-5 py-4 shadow-xl border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "var(--brand-accent-light)" }}>
                <Lightbulb size={18} style={{ color: "var(--brand-accent)" }} strokeWidth={2} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Meaningful Placements</p>
                <p className="text-xs text-gray-400">Schools & educators aligned</p>
              </div>
            </div>
          </div>

          {/* Right — text */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
            >
              Our Mission
            </span>

            <h2
              className="font-extrabold text-gray-950 mb-6 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.03em" }}
            >
              Transforming School Hiring{" "}
              <span style={{ color: "var(--brand-accent)" }}>in Saudi Arabia</span>
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-4">
              To create a network of skilled educators equipped to seamlessly integrate into diverse
              learning environments.
            </p>

            <p className="text-gray-500 text-base leading-relaxed mb-6">
              To connect schools with skilled and adaptable educators who can seamlessly integrate into
              diverse learning environments. By facilitating reliable and meaningful placements, we ensure
              that schools receive professional teaching support while educators have opportunities to apply
              their expertise and make a positive impact on students&apos; learning experiences.
            </p>

            {/* Emphasis quote */}
            <div
              className="border-l-4 pl-5 py-2 mb-10 rounded-r-xl"
              style={{ borderColor: "var(--brand-accent)", backgroundColor: "var(--brand-accent-light)" }}
            >
              <p className="text-sm font-semibold text-gray-800 leading-relaxed">
                Our purpose is simple: Ensure schools always have the right teachers and educators —
                on time and ready to inspire.
              </p>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
            >
              Start Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
