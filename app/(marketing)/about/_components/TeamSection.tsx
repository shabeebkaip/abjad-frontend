import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";

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
    <section className="relative bg-white py-24 overflow-hidden">
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, var(--brand-accent), transparent)" }}
      />
      <div
        className="absolute -top-32 right-0 w-100 h-100 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            <Award size={12} />
            Our Team
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Meet the Experts{" "}
            <span style={{ color: "var(--brand-accent)" }}>Behind Abjad</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A team of seasoned educators, coaches, and HR specialists dedicated to transforming
            school hiring across Saudi Arabia.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {team.map((member, i) => (
            <div
              key={i}
              className="group relative bg-[#f8fafc] rounded-3xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
            >
              {/* Subtle top accent line */}
              <div
                className="absolute top-0 inset-x-6 h-0.5 rounded-full"
                style={{ backgroundColor: member.color, opacity: 0.6 }}
              />

              {/* Avatar */}
              <div className="mb-5 mt-2">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-sm"
                  style={{ backgroundColor: member.accent, color: member.color, border: `1.5px solid ${member.border}` }}
                >
                  {member.initials}
                </div>
              </div>

              {/* Name & title */}
              <h3 className="text-base font-bold text-gray-900 leading-snug mb-1">{member.name}</h3>
              <p className="text-sm font-semibold mb-3" style={{ color: member.color }}>{member.title}</p>

              {/* Tag pill */}
              <span
                className="self-start text-xs font-medium px-3 py-1 rounded-full mb-4"
                style={{ backgroundColor: member.accent, color: member.color }}
              >
                {member.tag}
              </span>

              {/* Bio */}
              <p className="text-xs text-gray-500 leading-relaxed flex-1">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Meet Us CTA */}
        <div className="text-center">
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
