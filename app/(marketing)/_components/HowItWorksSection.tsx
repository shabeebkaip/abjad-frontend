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
        style={{ background: "radial-gradient(circle, rgba(10,191,188,0.06) 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(10,191,188,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10">

        {/* ── Section header ── */}
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

        {/* ── Tab switcher ── */}
        <div className="flex justify-center mb-16">
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

        {/* ── Timeline stepper ── */}
        <div className="relative">
          {/* Vertical spine — desktop only */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden lg:block"
            style={{ background: "linear-gradient(to bottom, transparent, rgba(10,191,188,0.25) 10%, rgba(10,191,188,0.25) 90%, transparent)" }}
          />

          <div className="space-y-16 lg:space-y-0">
            {steps.map((s, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={s.step}
                  className={`relative flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-0 lg:mb-20 ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content side */}
                  <div className={`flex-1 ${isEven ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                    <span
                      className="inline-block text-xs font-bold tracking-widest uppercase mb-2"
                      style={{ color: "#0ABFBC" }}
                    >
                      Step {s.step}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-sm lg:max-w-none">
                      {s.desc}
                    </p>
                    <div className={`flex flex-wrap gap-1.5 ${isEven ? "lg:justify-end" : ""}`}>
                      {s.pills.map((pill) => (
                        <span
                          key={pill}
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            color: "#089E9B",
                            backgroundColor: "rgba(10,191,188,0.08)",
                          }}
                        >
                          {pill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Centre node */}
                  <div className="hidden lg:flex flex-col items-center shrink-0 relative z-10">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md"
                      style={{ backgroundColor: "#0ABFBC" }}
                    >
                      <s.icon size={24} color="white" strokeWidth={1.8} />
                    </div>
                    {/* Big faint step number behind node */}
                    <span
                      className="absolute -z-10 text-7xl font-black select-none leading-none"
                      style={{ color: "rgba(10,191,188,0.07)", top: "-18px" }}
                    >
                      {s.step}
                    </span>
                  </div>

                  {/* Mobile: icon inline */}
                  <div className="flex lg:hidden items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm mt-0.5"
                      style={{ backgroundColor: "#0ABFBC" }}
                    >
                      <s.icon size={20} color="white" strokeWidth={1.8} />
                    </div>
                    <div className="-mt-0.5 lg:hidden">
                      {/* content rendered above already; this div intentionally empty on mobile to avoid duplication */}
                    </div>
                  </div>

                  {/* Empty flex-1 for the other side (desktop only) */}
                  <div className="hidden lg:block flex-1" />
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Highlights strip ── */}
        <div className="mt-16 pt-10 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            {highlights.map((h) => (
              <div key={h.label} className="flex items-center gap-2.5">
                <h.icon size={16} style={{ color: "#0ABFBC" }} strokeWidth={2} />
                <span className="text-sm font-semibold text-gray-600">{h.label}</span>
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

      {/* ── Wave into next section ── */}
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
