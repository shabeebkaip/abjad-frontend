import Link from "next/link";
import { ArrowRight } from "lucide-react";

const team = [
  {
    initials: "SA",
    name: "Dr. Sumaya Alyusuf",
    title: "Educational Consultant",
    color: "var(--brand-primary)",
    accent: "rgba(13,37,66,0.08)",
    border: "rgba(13,37,66,0.18)",
    bandColor: "#0D2542",
    bio: "With over three decades of leadership in school transformation and international education, Dr. Sumaya Alyusuf has guided institutions toward academic excellence. Her initiatives have elevated performance standards and improved teaching outcomes across Saudi Arabia's schools, shaping future-ready learning environments.",
    tag: "30+ Years Experience",
  },
  {
    initials: "MA",
    name: "Muna Alyusuf",
    title: "Executive Coach",
    color: "#6366f1",
    accent: "#eef2ff",
    border: "rgba(99,102,241,0.22)",
    bandColor: "#6366f1",
    bio: "Muna Alyusuf specializes in teacher development, organizational training, and leadership growth. Through Abjad, she empowers substitute teachers and institutions to reach higher teaching quality and leadership success, fostering measurable improvement across all educational levels.",
    tag: "Leadership & Development",
  },
  {
    initials: "BA",
    name: "Bushra Alyusuf",
    title: "Education Consultant",
    color: "#10b981",
    accent: "#ecfdf5",
    border: "rgba(16,185,129,0.22)",
    bandColor: "#10b981",
    bio: "Collaborating closely with the Saudi Ministry of Education, Bushra Alyusuf ensures schools and substitute teachers meet performance and regulatory standards. Her dedication drives educational institutions to achieve better outcomes and sustained excellence across the Kingdom.",
    tag: "Ministry of Education",
  },
  {
    initials: "MH",
    name: "Maha Alyusuf",
    title: "HR & Staffing Specialist",
    color: "#f59e0b",
    accent: "#fef3c7",
    border: "rgba(245,158,11,0.22)",
    bandColor: "#f59e0b",
    bio: "Maha Alyusuf leads teacher recruitment, training, and performance management with proven success in workforce optimization. Her focus on KPIs, recruitment frameworks, and operational excellence ensures that every school and teacher within Abjad experiences measurable, ongoing success.",
    tag: "Recruitment & KPIs",
  },
];

export default function TeamSection() {
  return (
    <section className="relative bg-white overflow-hidden">

      {/* ── Dark header strip — creates a clear chapter break from #f8fafc Values ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "var(--brand-gradient)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <span className="inline-block text-xs font-black tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-white/10 text-white/50 mb-5">
                Our Team
              </span>
              <h2
                className="font-extrabold text-white leading-tight"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
              >
                Meet the Experts{" "}
                <span style={{ color: "var(--brand-accent)" }}>Behind Abjad</span>
              </h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Seasoned educators, coaches, and HR specialists dedicated to transforming school
              hiring across Saudi Arabia.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2 × 2 card grid ── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              {/* Coloured top band */}
              <div className="h-1.5" style={{ backgroundColor: member.bandColor }} />

              <div className="p-8">
                {/* Avatar + identity row */}
                <div className="flex items-start gap-5 mb-5">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center font-extrabold text-lg shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{
                      backgroundColor: member.accent,
                      color: member.color,
                      border: `2px solid ${member.border}`,
                    }}
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{member.name}</h3>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: member.color }}>
                      {member.title}
                    </p>
                    <span
                      className="inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: member.accent, color: member.color }}
                    >
                      {member.tag}
                    </span>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-5">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-[1.03] hover:shadow-lg"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            Work With Us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
