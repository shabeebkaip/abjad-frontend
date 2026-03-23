import Link from "next/link";
import { ArrowRight } from "lucide-react";

const stats = [
  { value: "2,000+", label: "Verified Teachers",      color: "var(--brand-accent)"   },
  { value: "500+",   label: "Active Schools",          color: "#10b981"               },
  { value: "3-Day",  label: "Average Match Time",      color: "#a78bfa"               },
];

const communities = [
  { label: "International & bilingual school teachers",         accent: true  },
  { label: "Substitute teachers across all grade levels",       accent: true  },
  { label: "Full-time subject specialists and department heads", accent: true  },
  { label: "Western Province — Jeddah, Makkah, Madinah",       accent: false },
  { label: "Eastern Province — Dammam, Khobar, Dhahran",       accent: false },
  { label: "Central Region — Riyadh, Al Kharj, Qassim",        accent: false },
  { label: "Northern & Southern Regions and beyond",            accent: false },
];

export default function TeachersNetwork() {
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

        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/10 text-white/60 mb-6">
            Join the Abjad Network
          </span>
          <h2
            className="font-extrabold text-white leading-[1.1] mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
          >
            Connecting Thousands of Teachers and Schools{" "}
            <span style={{ color: "var(--brand-accent)" }}>Across Saudi Arabia</span>
          </h2>
          <p className="text-white/55 text-base leading-relaxed">
            Join a growing community shaping the future of education. From international schools
            to local academies, Abjad helps make every hiring and teaching experience smoother,
            faster, and more rewarding.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-px bg-white/8 rounded-3xl overflow-hidden mb-16">
          {stats.map((s) => (
            <div key={s.label} className="bg-white/4 px-8 py-10 text-center hover:bg-white/8 transition-colors">
              <div
                className="font-black text-white leading-none mb-2"
                style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-white/45 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Community list + CTA */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Community list */}
          <div>
            <p className="text-xs font-black tracking-widest uppercase text-white/30 mb-5">
              Our growing community includes:
            </p>
            <div className="space-y-2.5">
              {communities.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-xl border border-white/8 bg-white/4 hover:bg-white/8 transition-colors"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: c.accent ? "var(--brand-accent)" : "rgba(255,255,255,0.25)" }}
                  />
                  <span className="text-sm text-white/70">{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl bg-white/6 border border-white/10 p-10">
              <h3
                className="font-extrabold text-white leading-tight mb-4"
                style={{ fontSize: "clamp(1.4rem, 2.5vw, 2rem)" }}
              >
                Ready to Join the{" "}
                <span style={{ color: "var(--brand-accent)" }}>Movement?</span>
              </h3>
              <p className="text-white/55 text-sm leading-relaxed mb-8">
                Whether you&apos;re an educator looking for your next classroom or a school searching
                for exceptional talent — Abjad is your partner across Saudi Arabia.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/register?role=teacher"
                  className="flex items-center justify-center gap-2 font-bold text-sm py-3.5 rounded-full text-white transition-all hover:shadow-xl hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, var(--brand-accent) 0%, #0083a8 100%)" }}
                >
                  Get Started <ArrowRight size={15} />
                </Link>
                <Link
                  href="/register?role=school"
                  className="flex items-center justify-center gap-2 font-semibold text-sm py-3.5 rounded-full border border-white/20 text-white/70 hover:bg-white/10 transition-all"
                >
                  Hire Educators
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
