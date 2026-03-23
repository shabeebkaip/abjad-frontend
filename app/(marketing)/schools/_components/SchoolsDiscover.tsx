import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const regions = [
  { label: "Leading schools across Saudi Arabia",              accent: true  },
  { label: "International and bilingual schools nationwide",   accent: true  },
  { label: "Private schools, academies, and high schools hiring now", accent: true },
  { label: "Western Province — Jeddah, Makkah, Madinah",      accent: false },
  { label: "Eastern Province — Dammam, Khobar, Dhahran",      accent: false },
  { label: "Central Region — Riyadh, Al Kharj, Qassim",       accent: false },
  { label: "Northern & Southern Regions and beyond",           accent: false },
];

export default function SchoolsDiscover() {
  return (
    <section
      className="relative overflow-hidden py-28"
      style={{ background: "var(--brand-primary)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      {/* Vertical accent line */}
      <div
        className="absolute inset-y-0 right-1/3 w-px opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, var(--brand-accent), transparent)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — content */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase mb-6 px-3.5 py-1.5 rounded-full bg-white/10 text-white/60"
            >
              <MapPin size={12} />
              Nationwide Network
            </div>
            <h2
              className="font-extrabold text-white leading-[1.1] mb-6"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
            >
              Discover Teaching Opportunities Across{" "}
              <span style={{ color: "var(--brand-accent)" }}>Saudi Arabia</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed mb-4">
              Connecting Educators With Schools Hiring Right Now, Anywhere in the Kingdom.
            </p>
            <p className="text-white/45 text-sm leading-relaxed mb-10">
              Whether you&apos;re an educator ready to take your next career step or a school searching
              for exceptional teaching talent, Abjad streamlines the process — fast, easy, and fully
              aligned with the needs of Saudi Arabia&apos;s expanding education sector.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 text-white"
              style={{ backgroundColor: "var(--brand-accent)" }}
            >
              Search Now <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right — region list */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-white/30 mb-5">
              Connect with educators from:
            </p>
            <div className="space-y-2.5">
              {regions.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: r.accent ? "var(--brand-accent)" : "rgba(255,255,255,0.25)" }}
                  />
                  <span className="text-sm text-white/70">{r.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
