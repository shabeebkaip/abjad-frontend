"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserCircle2,
  Search,
  Handshake,
  BriefcaseBusiness,
  SlidersHorizontal,
  BadgeCheck,
  Clock3,
  Star,
  MapPin,
  Bell,
  Users,
  Sparkles,
} from "lucide-react";

const teacherSteps = [
  {
    icon: UserCircle2,
    step: "01",
    title: "Build your profile",
    desc: "Add your qualifications, subjects, teaching experience, and certifications. Your profile is your CV — no uploads needed.",
    pills: ["Subjects & grades", "Location preferences", "Salary range"],
  },
  {
    icon: Search,
    step: "02",
    title: "Discover matched roles",
    desc: "Browse roles curated for your profile. Filter by city, school type, curriculum, and contract type. Save searches and get alerts.",
    pills: ["Smart filters", "Saved searches", "Job alerts"],
  },
  {
    icon: Bell,
    step: "03",
    title: "Apply in one click",
    desc: "Your profile is always ready. Hit apply and your details go straight to the school — no cover letters, no forms to fill.",
    pills: ["Instant apply", "Track applications", "Interview scheduling"],
  },
  {
    icon: Handshake,
    step: "04",
    title: "Get hired & start",
    desc: "Chat with the school, accept an offer, and onboard — all inside Abjad. Most teachers hear back within 72 hours.",
    pills: ["In-app messaging", "Offer management", "Avg. 72h response"],
  },
];

const schoolSteps = [
  {
    icon: BriefcaseBusiness,
    step: "01",
    title: "Post your vacancy",
    desc: "Create a detailed job listing in under 5 minutes. Set the curriculum, grade level, location, and contract terms.",
    pills: ["5-min setup", "Multiple vacancies", "Draft & schedule"],
  },
  {
    icon: SlidersHorizontal,
    step: "02",
    title: "Get AI-ranked candidates",
    desc: "Our matching engine surfaces the most relevant teacher profiles for your role — ranked by subject fit, location, and experience.",
    pills: ["AI matching", "Relevance ranking", "Shortlist tools"],
  },
  {
    icon: Users,
    step: "03",
    title: "Review & interview",
    desc: "Browse candidate profiles, review qualifications, and schedule interviews directly in the platform. No back-and-forth emails.",
    pills: ["Profile deep-dives", "Integrated scheduling", "Panel notes"],
  },
  {
    icon: BadgeCheck,
    step: "04",
    title: "Hire with confidence",
    desc: "Extend offers, finalise contracts, and onboard your new hire — all from one dashboard. Every candidate is verified.",
    pills: ["Verified candidates", "Offer letters", "Onboarding checklist"],
  },
];

const teacherHighlights = [
  { icon: Clock3, label: "Avg. 3 days to first interview" },
  { icon: Star,   label: "4.9 / 5 teacher satisfaction" },
  { icon: MapPin, label: "Roles across all Saudi cities" },
];

const schoolHighlights = [
  { icon: Clock3,     label: "Fill a role in under 2 weeks" },
  { icon: Sparkles,   label: "AI-ranked candidate lists" },
  { icon: BadgeCheck, label: "100% verified teacher profiles" },
];

type Tab = "teachers" | "schools";

export default function HowItWorksSection() {
  const [tab, setTab] = useState<Tab>("teachers");

  const steps = tab === "teachers" ? teacherSteps : schoolSteps;
  const highlights = tab === "teachers" ? teacherHighlights : schoolHighlights;
  const ctaHref = tab === "teachers" ? "/register?role=teacher" : "/register?role=school";
  const ctaLabel = tab === "teachers" ? "Find teaching jobs →" : "Post a vacancy →";

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#f8fafc] py-28">

      {/* Decorative blobs */}
      <div
        className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(10,191,188,0.07) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(10,191,188,0.06) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: "rgba(10,191,188,0.1)", color: "#0ABFBC" }}
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#0ABFBC" }} />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#0ABFBC" }} />
            </span>
            How it works
          </span>

          <h2
            className="font-extrabold text-gray-950 tracking-tight mb-5"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
          >
            From sign-up to hired —{" "}
            <span style={{ color: "#0ABFBC" }}>in four steps</span>
          </h2>

          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            Whether you&apos;re a teacher looking for your next role or a school filling a vacancy, Abjad keeps it simple and fast.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-14">
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm">
            {(["teachers", "schools"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="relative px-7 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                style={
                  tab === t
                    ? { backgroundColor: "#0ABFBC", color: "#fff", boxShadow: "0 4px 14px rgba(10,191,188,0.35)" }
                    : { color: "#6b7280" }
                }
              >
                {t === "teachers" ? (
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    For Teachers
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    For Schools
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Step cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {steps.map((s, i) => (
            <div
              key={s.step}
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              {/* Faint watermark step number */}
              <span
                className="absolute -top-3 -right-1 text-8xl font-black select-none pointer-events-none leading-none"
                style={{ color: "rgba(10,191,188,0.06)" }}
              >
                {s.step}
              </span>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-200 group-hover:scale-105"
                style={{ backgroundColor: "rgba(10,191,188,0.1)" }}
              >
                <s.icon size={22} style={{ color: "#0ABFBC" }} strokeWidth={2} />
              </div>

              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#0ABFBC" }}>
                Step {s.step}
              </span>

              <h3 className="text-base font-bold text-gray-900 mt-1 mb-2 leading-snug">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{s.desc}</p>

              {/* Pill tags */}
              <div className="flex flex-wrap gap-1.5">
                {s.pills.map((pill) => (
                  <span
                    key={pill}
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full border"
                    style={{ borderColor: "rgba(10,191,188,0.2)", color: "#089E9B", backgroundColor: "rgba(10,191,188,0.05)" }}
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Connector arrow — desktop only, not on last card */}
              {i < steps.length - 1 && (
                <div
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-white hidden lg:flex items-center justify-center z-10"
                  style={{ borderColor: "rgba(10,191,188,0.3)" }}
                >
                  <svg viewBox="0 0 10 10" className="w-3 h-3" fill="none" stroke="#0ABFBC" strokeWidth="1.5">
                    <path d="M2 5h6M5 2l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Highlights strip */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(10,191,188,0.1)" }}
                >
                  <h.icon size={18} style={{ color: "#0ABFBC" }} strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{h.label}</span>
              </div>
            ))}
          </div>

          <Link
            href={ctaHref}
            className="shrink-0 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg whitespace-nowrap"
            style={{ backgroundColor: "#0ABFBC", boxShadow: "0 4px 16px rgba(10,191,188,0.3)" }}
          >
            {ctaLabel}
          </Link>
        </div>

      </div>

      {/* Wave into next section */}
      <div className="relative z-10 -mb-px mt-6">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: "60px" }}
        >
          <path d="M0 60V35C240 5 480 55 720 35C960 15 1200 50 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
