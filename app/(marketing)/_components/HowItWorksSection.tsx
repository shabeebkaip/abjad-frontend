"use client";

import Link from "next/link";
import { CheckCircle2, Zap, Globe2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: CheckCircle2,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Verified Profiles Ready to Place",
    desc: "Verified teacher profiles are ready for immediate placement.",
  },
  {
    icon: Zap,
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Smart AI Matching",
    desc: "Smart AI matching for schools near you.",
  },
  {
    icon: Globe2,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Nationwide Support",
    desc: "Support for international and local schools across Saudi Arabia.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#f8fafc] py-24">
      <div
        className="absolute -top-40 -left-40 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – text */}
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
            >
              How Abjad Works
            </span>

            <h2
              className="font-extrabold text-gray-950 mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              Streamlined Hiring for{" "}
              <span style={{ color: "var(--brand-accent)" }}>Every School</span>
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-4">
              We streamline hiring from kindergarten to high school, ensuring schools can fill vacancies
              faster, easier, and more efficiently than traditional recruitment methods. Whether you&apos;re
              searching for full-time teachers, part-time educators, or reliable substitute teachers,
              Abjad brings the entire Kingdom together on one powerful platform.
            </p>

            <p className="text-gray-500 text-base leading-relaxed mb-10">
              Designed to support schools nationwide, Abjad goes beyond major cities like Riyadh, Jeddah,
              and Dammam, helping institutions across every region of Saudi Arabia find the talent they
              need to deliver quality education.
            </p>

            <Link
              href="/register?role=school"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
            >
              Start Hiring <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right – feature cards */}
          <div className="flex flex-col gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group flex items-start gap-5 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon size={22} style={{ color: f.color }} strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="relative z-10 -mb-px mt-16">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full block" style={{ height: "60px" }}>
          <path d="M0 60V35C240 5 480 55 720 35C960 15 1200 50 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
