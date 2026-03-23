import Link from "next/link";
import { ArrowRight, MapPin, Star, CheckCircle2, Clock, Search } from "lucide-react";

const educators = [
  {
    initials: "SM",
    bgColor: "var(--brand-accent)",
    name: "Sara Mohammed",
    subject: "English Literature",
    experience: "8 yrs exp",
    location: "Riyadh",
    rating: "4.9",
    tag: "Available Now",
    tagBg: "rgba(16,185,129,0.15)",
    tagColor: "#34d399",
    subjects: ["IGCSE", "A-Level"],
  },
  {
    initials: "KA",
    bgColor: "#7c3aed",
    name: "Khalid Al-Rashidi",
    subject: "Mathematics",
    experience: "12 yrs exp",
    location: "Jeddah",
    rating: "4.8",
    tag: "Top Rated",
    tagBg: "rgba(245,158,11,0.15)",
    tagColor: "#f59e0b",
    subjects: ["IB", "SAT Prep"],
  },
  {
    initials: "LH",
    bgColor: "#0891b2",
    name: "Layla Hassan",
    subject: "Science & Biology",
    experience: "5 yrs exp",
    location: "Dammam",
    rating: "5.0",
    tag: "Verified",
    tagBg: "rgba(0,172,211,0.15)",
    tagColor: "var(--brand-accent)",
    subjects: ["AP Science", "IB"],
  },
];

const stats = [
  { value: "500+", label: "Partner Schools" },
  { value: "5,000+", label: "Verified Educators" },
  { value: "24–48h", label: "Average Hire Time" },
  { value: "70%", label: "Faster Than Traditional" },
];

export default function SchoolsHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* Accent glow — top left */}
      <div
        className="absolute -top-40 -left-40 w-160 h-160 rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.14) 0%, transparent 65%)" }}
      />
      {/* Purple glow — bottom right */}
      <div
        className="absolute -bottom-32 right-0 w-120 h-120 rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)" }}
      />
      {/* Diagonal accent sweep */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.04]"
        style={{ background: "linear-gradient(135deg, transparent 40%, var(--brand-accent) 100%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-0">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* ── Left: Content ── */}
          <div className="lg:col-span-5 pb-24">
            {/* Live pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/8 text-white/70 text-xs font-bold tracking-widest uppercase mb-10">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
              Hiring Platform for Saudi Schools
            </div>

            <h1
              className="font-extrabold text-white leading-[1.06] mb-7"
              style={{ fontSize: "clamp(2.6rem, 4.8vw, 4rem)", letterSpacing: "-0.04em" }}
            >
              Hire Qualified{" "}
              <span
                className="relative inline-block"
                style={{ color: "var(--brand-accent)" }}
              >
                Teachers
                {/* Underline accent */}
                <span
                  className="absolute -bottom-1 left-0 right-0 h-0.75 rounded-full opacity-50"
                  style={{ background: "var(--brand-accent)" }}
                />
              </span>
              {" "}in Hours,{" "}
              <br className="hidden lg:block" />
              Not Weeks.
            </h1>

            <p className="text-white/60 text-base leading-relaxed mb-10 max-w-md">
              Browse thousands of verified educators across Saudi Arabia — from substitute teachers
              to permanent hires — and make an offer the same day.
            </p>

            <div className="flex items-center gap-3 flex-wrap mb-14">
              <Link
                href="/register?role=school"
                className="inline-flex items-center gap-2.5 font-bold text-sm px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-0.5 text-white"
                style={{ background: "linear-gradient(135deg, var(--brand-accent) 0%, #0083a8 100%)" }}
              >
                Start Hiring Free <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 border border-white/20 bg-white/8 text-white/80 font-semibold text-sm px-7 py-4 rounded-full hover:bg-white/14 transition-all"
              >
                Request a Demo
              </Link>
            </div>

            {/* Trust anchors */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {[
                "No recruitment fees",
                "Vetted & verified profiles",
                "Post a job in 2 minutes",
              ].map((t) => (
                <span key={t} className="flex items-center gap-2 text-xs font-semibold text-white/50">
                  <CheckCircle2 size={13} style={{ color: "var(--brand-accent)" }} />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Platform UI mockup ── */}
          <div className="lg:col-span-7 flex flex-col pb-24">

            {/* Fake search/filter bar */}
            <div className="bg-white/8 border border-white/12 rounded-2xl px-5 py-4 flex items-center gap-3 mb-4 backdrop-blur-sm">
              <Search size={16} className="text-white/40 shrink-0" />
              <span className="text-white/35 text-sm flex-1">Search by subject, city, or curriculum…</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/50 font-medium">5,000+ results</span>
                <div
                  className="h-5 w-px"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                />
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: "var(--brand-accent)", color: "white" }}
                >
                  Filter
                </span>
              </div>
            </div>

            {/* Educator cards — first 2 full, 3rd locked */}
            <div className="flex flex-col gap-3">
              {educators.map((e, i) => (
                <div
                  key={i}
                  className={`group relative rounded-2xl border border-white/10 bg-white/6 backdrop-blur-sm px-6 py-5 flex items-center gap-5 transition-all cursor-pointer ${
                    i < 2 ? "hover:bg-white/10 hover:border-white/18" : "select-none pointer-events-none"
                  }`}
                >
                  {/* Locked overlay for 3rd card */}
                  {i === 2 && (
                    <div className="absolute inset-0 rounded-2xl backdrop-blur-[2px] bg-linear-to-b from-transparent via-(--brand-primary)/60 to-(--brand-primary)/90 z-10 flex items-center justify-center">
                      <span className="text-xs font-bold px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white/60">
                        Sign up to see all educators
                      </span>
                    </div>
                  )}
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-white text-sm shrink-0"
                    style={{ background: e.bgColor }}
                  >
                    {e.initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-bold text-white text-sm">{e.name}</span>
                      <span
                        className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: e.tagBg, color: e.tagColor }}
                      >
                        {e.tag}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/45 flex-wrap">
                      <span>{e.subject}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      <span>{e.experience}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {e.location}
                      </span>
                    </div>
                    <div className="flex gap-1.5 mt-2">
                      {e.subjects.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/8 text-white/50"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rating + action */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-bold text-white/70">{e.rating}</span>
                    </div>
                    <button
                      className="text-xs font-bold px-4 py-1.5 rounded-full border border-white/20 text-white/60 hover:bg-white/10 transition-all group-hover:border-white/30"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* More educators count */}
            <div className="mt-3 flex items-center justify-center gap-2 py-3">
              <Clock size={11} className="text-white/25" />
              <span className="text-xs text-white/30 font-medium">4,997 more verified educators available</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="relative z-10 border-t border-white/8 mt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            {stats.map((s) => (
              <div key={s.label} className="px-8 py-7 text-center">
                <div
                  className="font-black text-white leading-none mb-1.5"
                  style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
                >
                  {s.value}
                </div>
                <div className="text-white/40 text-xs font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
