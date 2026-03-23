"use client";

import Link from "next/link";
import { BadgeCheck, MapPin, UserCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    num: "A",
    icon: BadgeCheck,
    color: "#10b981",
    title: "Access Verified Job Openings",
    desc: "Browse only verified, active openings at international, private, and high schools nationwide — no noise, no expired listings.",
  },
  {
    num: "B",
    icon: MapPin,
    color: "var(--brand-accent)",
    title: "Apply Directly to Schools Near You",
    desc: "Filter by city, curriculum, and role type. Apply to Riyadh, Jeddah, and Dammam schools in minutes.",
  },
  {
    num: "C",
    icon: UserCircle2,
    color: "#6366f1",
    title: "Build Your Professional Profile",
    desc: "Create a standout educator profile with your qualifications, specialisations, and availability — and get discovered by schools actively hiring.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="teachers" className="relative overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-28">

        {/* Full-width label strip */}
        <div className="flex items-center gap-4 mb-12">
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
          <span
            className="text-xs font-black tracking-widest uppercase px-5 py-2 rounded-full"
            style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
          >
            For Teachers
          </span>
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
        </div>

        {/* Two-col asymmetric layout */}
        <div className="grid lg:grid-cols-5 gap-12 items-start">

          {/* Left — sticky headline block (2 cols) */}
          <div className="lg:col-span-2 lg:sticky lg:top-32">
            <h2
              className="font-extrabold text-gray-950 mb-6 leading-[1.1]"
              style={{ fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)", letterSpacing: "-0.04em" }}
            >
              Find Your{" "}
              <span
                className="relative inline-block"
                style={{ color: "var(--brand-primary)" }}
              >
                Perfect
                <span
                  className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
                  style={{ background: "var(--brand-accent)" }}
                />
              </span>{" "}
              Teaching Role Today
            </h2>

            <p className="text-gray-500 text-base leading-relaxed mb-8">
              Whether you are an experienced educator or a substitute teacher seeking flexible
              opportunities, Abjad connects you to top schools in Riyadh, Jeddah, and Dammam.
            </p>

            <Link
              href="/register?role=teacher"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
            >
              Apply Now <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — stacked feature rows (3 cols) */}
          <div className="lg:col-span-3 flex flex-col divide-y divide-gray-100">
            {features.map((f, i) => (
              <div
                key={i}
                className="group flex items-start gap-6 py-8 first:pt-0"
              >
                {/* Large letter */}
                <span
                  className="text-5xl font-black leading-none shrink-0 mt-1 transition-colors duration-200"
                  style={{ color: i === 0 ? "#f0fdf4" : i === 1 ? "rgba(0,172,211,0.08)" : "#eef2ff" }}
                >
                  <span style={{ WebkitTextStroke: `2px ${f.color}`, color: "transparent" }}>
                    {f.num}
                  </span>
                </span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <f.icon size={16} style={{ color: f.color }} strokeWidth={2.5} />
                    <h3 className="text-sm font-bold text-gray-900">{f.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
