import Link from "next/link";
import { ArrowRight } from "lucide-react";

const pillars = [
  {
    n: "01",
    title: "Right Teacher, Right School",
    desc: "Precision matching — every educator placed is the exact fit for the school's curriculum, culture, and needs.",
  },
  {
    n: "02",
    title: "Professional & Verified",
    desc: "Every profile is manually vetted with credential checks, reference reviews, and trial assignments before placement.",
  },
  {
    n: "03",
    title: "Nationwide Reach",
    desc: "From Riyadh to Dammam, we cover every region of Saudi Arabia with qualified educators ready to start.",
  },
];

export default function MissionSection() {
  return (
    <section className="relative bg-white overflow-hidden">

      {/* Top accent strip — bridges from dark hero */}
      <div className="h-0.75 w-full" style={{ background: "linear-gradient(90deg, var(--brand-accent), transparent 70%)" }} />

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            Our Mission
          </span>
          <span className="text-xs text-gray-400">What drives every placement</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left — pullquote + stats ── */}
          <div className="relative">
            {/* Ghost quote mark */}
            <span
              className="absolute -top-6 -left-4 font-black leading-none select-none pointer-events-none text-gray-100"
              style={{ fontSize: "14rem", lineHeight: 1 }}
            >
              &ldquo;
            </span>
            <div className="relative z-10">
              <blockquote
                className="font-extrabold text-gray-950 leading-[1.1] mb-5"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.7rem)", letterSpacing: "-0.04em" }}
              >
                Ensure schools always have the right teachers — on time and ready to inspire.
              </blockquote>
              <p className="text-gray-400 text-sm mb-12">
                — The founding principle behind every placement Abjad facilitates
              </p>

              {/* Micro-stats row */}
              <div className="flex gap-8 pt-8 border-t border-gray-100">
                {[
                  { val: "Hundreds", label: "Educators placed" },
                  { val: "KSA-wide", label: "Schools served" },
                  { val: "24–48 hrs", label: "Avg response" },
                ].map((s) => (
                  <div key={s.val}>
                    <div className="font-extrabold text-gray-900 text-base leading-none mb-1">{s.val}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right — narrative + pillars ── */}
          <div>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Abjad connects schools with skilled and adaptable educators who seamlessly integrate
              into diverse learning environments — from international curricula to Ministry-aligned
              high school departments. By facilitating reliable placements, we ensure schools receive
              professional teaching support while educators make a positive impact on students.
            </p>

            <div className="flex flex-col gap-3 mb-10">
              {pillars.map((p) => (
                <div
                  key={p.n}
                  className="flex gap-5 p-5 rounded-xl bg-[#f8fafc] border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
                >
                  <span
                    className="text-2xl font-black leading-none shrink-0 mt-0.5"
                    style={{ color: "var(--brand-accent)", opacity: 0.5 }}
                  >
                    {p.n}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 self-start font-bold text-sm px-7 py-3.5 rounded-full text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Start Now <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
