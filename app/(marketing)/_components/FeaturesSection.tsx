"use client";

import Link from "next/link";
import { BadgeCheck, MapPin, UserCircle2, ArrowRight } from "lucide-react";

const features = [
  {
    icon: BadgeCheck,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Access Verified Job Openings",
    desc: "Access verified job openings at international schools.",
  },
  {
    icon: MapPin,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.08)",
    title: "Apply Directly to Schools Near You",
    desc: "Apply directly to schools near you.",
  },
  {
    icon: UserCircle2,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Build Your Professional Profile",
    desc: "Build your professional profile and get noticed instantly.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="teachers" className="relative overflow-hidden bg-white py-24">
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none opacity-40"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left – feature cards */}
          <div className="flex flex-col gap-5 order-2 lg:order-1">
            {features.map((f, i) => (
              <div
                key={i}
                className="group flex items-start gap-5 bg-[#f8fafc] rounded-2xl border border-gray-100 p-6 hover:border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5"
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

          {/* Right – text */}
          <div className="order-1 lg:order-2">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
            >
              For Teachers
            </span>

            <h2
              className="font-extrabold text-gray-950 mb-6 leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              Find Your Perfect{" "}
              <span style={{ color: "var(--brand-primary)" }}>Teaching Role</span>{" "}
              Today
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-10">
              Whether you are an experienced educator or a substitute teacher looking for flexible
              opportunities, Abjad connects you to the top Riyadh, Jeddah, and Dammam schools.
              Discover new positions that align with your passion and expertise.
            </p>

            <Link
              href="/register?role=teacher"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
            >
              Apply Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
