import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  "International School Teachers",
  "Private School Teachers",
  "Substitute Teachers",
  "High School Teachers",
  "English & Math Instructors",
  "Early Childhood Educators",
  "Private Tutors",
];

const categoryStyles = [
  { bg: "rgba(0,172,211,0.10)",   color: "var(--brand-accent)",   border: "rgba(0,172,211,0.22)"  },
  { bg: "rgba(99,102,241,0.10)",  color: "#6366f1",               border: "rgba(99,102,241,0.22)" },
  { bg: "rgba(16,185,129,0.10)",  color: "#10b981",               border: "rgba(16,185,129,0.22)" },
  { bg: "rgba(245,158,11,0.10)",  color: "#f59e0b",               border: "rgba(245,158,11,0.22)" },
  { bg: "rgba(167,139,250,0.10)", color: "#a78bfa",               border: "rgba(167,139,250,0.22)"},
  { bg: "rgba(52,211,153,0.10)",  color: "#34d399",               border: "rgba(52,211,153,0.22)" },
  { bg: "rgba(13,37,66,0.08)",    color: "var(--brand-primary)",  border: "rgba(13,37,66,0.15)"   },
];

export default function SchoolsTalentPool() {
  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-28">

        {/* Editorial header — 12-col grid */}
        <div className="grid lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-5">
            <div
              className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-5"
              style={{ color: "var(--brand-accent)" }}
            >
              <span className="w-5 h-0.5 inline-block rounded" style={{ backgroundColor: "var(--brand-accent)" }} />
              Trusted Kingdom-Wide
            </div>
            <h2
              className="font-extrabold text-gray-950 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.8rem)", letterSpacing: "-0.04em" }}
            >
              The Kingdom&apos;s Most Trusted Platform for{" "}
              <span style={{ color: "var(--brand-accent)" }}>Hiring Teachers</span>
            </h2>
          </div>
          <div className="lg:col-span-7 flex flex-col justify-center gap-4">
            <p className="text-gray-600 text-base leading-relaxed">
              Abjad is trusted by leading schools across Saudi Arabia, connecting institutions with a
              nationwide network of highly qualified educators, teachers, and academic professionals.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              From international academies to private institutions and growing educational networks,
              schools across the Kingdom rely on Abjad to fill classrooms quickly with the right talent.
              Our platform brings together bilingual educators, STEM specialists, licensed substitute
              teachers, subject-matter experts, and early childhood professionals — all fully prepared
              to teach on short notice and support learning outcomes across the Kingdom.
            </p>
          </div>
        </div>

        {/* Talent category pills + CTA */}
        <div className="border-t border-gray-100 pt-16">
          <p className="text-xs font-black tracking-widest uppercase text-gray-400 mb-8 text-center">
            Featured Talent Categories
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-14">
            {categories.map((cat, i) => {
              const s = categoryStyles[i % categoryStyles.length];
              return (
                <span
                  key={cat}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border"
                  style={{ backgroundColor: s.bg, color: s.color, borderColor: s.border }}
                >
                  {cat}
                </span>
              );
            })}
          </div>

          {/* Dark CTA banner */}
          <div
            className="rounded-3xl p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div>
              <h3
                className="font-extrabold text-white mb-2"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)" }}
              >
                Ready to Hire Qualified Educators in Saudi Arabia?
              </h3>
              <p className="text-white/55 text-sm">
                Connect with thousands of vetted teachers and educators available across the Kingdom.
              </p>
            </div>
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-full whitespace-nowrap transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 shrink-0"
              style={{ color: "var(--brand-primary-dark)" }}
            >
              Get Started <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
