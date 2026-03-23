import Link from "next/link";
import { ArrowRight } from "lucide-react";

const team = [
  {
    initials: "SA",
    name: "Dr. Sumaya Alyusuf",
    title: "Educational Consultant",
    color: "var(--brand-primary)",
    accent: "rgba(13,37,66,0.08)",
    border: "rgba(13,37,66,0.15)",
    bio: "With over three decades of leadership in school transformation and international education, Dr. Sumaya Alyusuf has guided institutions toward academic excellence. Her initiatives have elevated performance standards and improved teaching outcomes across Saudi Arabia's schools, shaping future-ready learning environments.",
    tag: "30+ Years Experience",
  },
  {
    initials: "MA",
    name: "Muna Alyusuf",
    title: "Executive Coach",
    color: "#6366f1",
    accent: "#eef2ff",
    border: "rgba(99,102,241,0.2)",
    bio: "Muna Alyusuf specializes in teacher development, organizational training, and leadership growth. Through Abjad, she empowers substitute teachers and institutions to reach higher teaching quality and leadership success, fostering measurable improvement across all educational levels.",
    tag: "Leadership & Development",
  },
  {
    initials: "BA",
    name: "Bushra Alyusuf",
    title: "Education Consultant",
    color: "#10b981",
    accent: "#ecfdf5",
    border: "rgba(16,185,129,0.2)",
    bio: "Collaborating closely with the Saudi Ministry of Education, Bushra Alyusuf ensures schools and substitute teachers meet performance and regulatory standards. Her dedication drives educational institutions to achieve better outcomes and sustained excellence across the Kingdom.",
    tag: "Ministry of Education",
  },
  {
    initials: "MH",
    name: "Maha Alyusuf",
    title: "HR & Staffing Specialist",
    color: "#f59e0b",
    accent: "#fef3c7",
    border: "rgba(245,158,11,0.2)",
    bio: "Maha Alyusuf leads teacher recruitment, training, and performance management with proven success in workforce optimization. Her focus on KPIs, recruitment frameworks, and operational excellence ensures that every school and teacher within Abjad experiences measurable, ongoing success.",
    tag: "Recruitment & KPIs",
  },
];

export default function TeamSection() {
  return (
    <section className="relative bg-[#f8fafc] overflow-hidden">

      {/* Section header with side-rule treatment */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-24 pb-14">
        <div className="flex items-end gap-8 mb-2">
          <div>
            <span
              className="inline-block text-xs font-black tracking-widest uppercase mb-3"
              style={{ color: "var(--brand-accent)" }}
            >
              Our Team
            </span>
            <h2
              className="font-extrabold text-gray-950 leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
            >
              Meet the Experts{" "}
              <span style={{ color: "var(--brand-accent)" }}>Behind Abjad</span>
            </h2>
          </div>
          <div className="hidden lg:block h-px flex-1 mb-4" style={{ background: "linear-gradient(90deg, var(--brand-accent), transparent)" }} />
        </div>
        <p className="text-gray-500 text-base max-w-xl">
          Seasoned educators, coaches, and HR specialists dedicated to transforming school
          hiring across Saudi Arabia.
        </p>
      </div>

      {/* Horizontal scrolling/stacked members */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-24">
        <div className="flex flex-col divide-y divide-gray-200">
          {team.map((member, i) => (
            <div
              key={i}
              className="group grid lg:grid-cols-12 gap-6 py-10 items-start"
            >
              {/* Avatar + meta — 3 cols */}
              <div className="lg:col-span-3 flex items-center gap-5 lg:flex-col lg:items-start">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl shrink-0 group-hover:scale-105 transition-transform duration-200"
                  style={{ backgroundColor: member.accent, color: member.color, border: `2px solid ${member.border}` }}
                >
                  {member.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{member.name}</h3>
                  <p className="text-sm font-semibold mt-0.5" style={{ color: member.color }}>{member.title}</p>
                  <span
                    className="inline-block mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{ backgroundColor: member.accent, color: member.color }}
                  >
                    {member.tag}
                  </span>
                </div>
              </div>

              {/* Vertical rule */}
              <div className="hidden lg:flex lg:col-span-1 justify-center">
                <div className="w-px h-full min-h-12 rounded-full" style={{ backgroundColor: member.border }} />
              </div>

              {/* Bio — 8 cols */}
              <div className="lg:col-span-8">
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
          >
            Meet Us <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
