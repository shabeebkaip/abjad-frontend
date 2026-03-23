import Link from "next/link";
import { ArrowRight } from "lucide-react";

const highlights = [
  {
    num: "01",
    color: "var(--brand-accent)",
    title: "A Local Saudi Platform Built for All Schools",
    desc: "Designed to meet the unique hiring needs of Saudi Arabia's education system, from major cities to smaller regions.",
  },
  {
    num: "02",
    color: "#6366f1",
    title: "Verified Teacher & Educator Matching",
    desc: "Every teacher and educator is vetted to ensure your school connects only with qualified, trusted professionals.",
  },
  {
    num: "03",
    color: "#10b981",
    title: "A Growing Community of Active Educators",
    desc: "Join thousands of dedicated educators across Saudi Arabia ready to engage, apply, and support your institution's growth.",
  },
  {
    num: "04",
    color: "#f59e0b",
    title: "Built for Rapid Teacher Placement",
    desc: "Ideal for schools that need fast, accurate hiring — saving time, effort, and administrative resources.",
  },
];

export default function SchoolsVsJobBoards() {
  return (
    <section className="bg-white overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-accent)" }}
          >
            vs General Job Boards
          </span>
          <span className="text-xs text-gray-400">Education-first · Saudi-focused</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">

        {/* Headline */}
        <div className="text-center mb-16">
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
          >
            Why Abjad{" "}
            <span style={{ color: "var(--brand-accent)" }}>Outperforms</span>{" "}
            Job Boards
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Unlike general hiring platforms, Abjad focuses entirely on education in Saudi Arabia —
            making it the most relevant and fastest way to connect schools and teachers.
          </p>
        </div>

        {/* 4-panel grid with gap-px on gray background for dividers */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 rounded-3xl overflow-hidden mb-12">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="bg-white p-8 hover:bg-[#f8fafc] transition-colors"
            >
              <div
                className="text-4xl font-black mb-5 leading-none"
                style={{ color: h.color }}
              >
                {h.num}
              </div>
              <div
                className="h-0.5 w-8 rounded-full mb-5"
                style={{ backgroundColor: h.color }}
              />
              <h3 className="text-gray-950 font-bold text-sm leading-snug mb-3">{h.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/register?role=school"
            className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full text-white transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Try Abjad <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
