"use client";

import Link from "next/link";
import { BadgeCheck, SlidersHorizontal, Clock3, Globe2, ArrowRight } from "lucide-react";

const benefits = [
  {
    icon: BadgeCheck,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "View Detailed Educator Profiles",
    desc: "View detailed teacher and educator profiles with verified credentials.",
  },
  {
    icon: SlidersHorizontal,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "AI-Powered Filters",
    desc: "Use AI-powered filters to find educators who match your school's curriculum and values.",
  },
  {
    icon: Clock3,
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Fill Positions in Record Time",
    desc: "Fill permanent, temporary, or substitute positions in record time.",
  },
  {
    icon: Globe2,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.08)",
    title: "Nationwide & Beyond",
    desc: "Connect with qualified teachers and educators across Saudi Arabia and beyond.",
  },
];

export default function StartHiringSection() {
  return (
    <section className="relative overflow-hidden py-24 bg-[#f8fafc]">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(0,172,211,0.06) 0%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        {/* Top block */}
        <div className="grid lg:grid-cols-2 gap-14 items-start mb-16">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
            >
              For Schools
            </span>
            <h2
              className="font-extrabold text-gray-950 mb-4 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              Start Hiring with{" "}
              <span style={{ color: "var(--brand-accent)" }}>Abjad</span> Today
            </h2>
            <p className="text-xl font-semibold text-gray-700 mb-4">
              Access a Pool of Qualified Teachers Instantly
            </p>
            <p className="text-gray-500 text-base leading-relaxed">
              A large network of verified teachers and educators across Saudi Arabia that are pre-screened
              and are ready to join your school. Register now and start hiring smarter, faster, and more
              efficiently with Abjad.
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Abjad gives your school direct access to a growing database of certified educators, teachers,
              and substitute teachers (مترجم) from Riyadh, Jeddah, Dammam, and beyond. Whether you&apos;re an
              international school, a high school, or a private academy, Abjad makes recruitment seamless
              from job posting to final hire.
            </p>
            <p className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">
              Key Benefits for Schools
            </p>
            <ul className="space-y-2.5">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600 text-sm">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: b.bg }}
                  >
                    <b.icon size={14} style={{ color: b.color }} strokeWidth={2.5} />
                  </div>
                  {b.desc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom gradient CTA card */}
        <div
          className="relative rounded-3xl p-10 lg:p-14 overflow-hidden text-center"
          style={{ background: "var(--brand-gradient)" }}
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/8 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/8 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Take the Next Step Toward Better Talent
            </h3>
            <p className="text-white/75 text-base mb-2">
              Give your school access to top educators and elevate the learning experience for students
              across the Kingdom.
            </p>
            <p className="text-white/60 text-sm mb-8">
              Start with Abjad today and connect with qualified educators across Saudi Arabia.
            </p>
            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
              style={{ color: "var(--brand-primary-dark)" }}
            >
              Register Now <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
