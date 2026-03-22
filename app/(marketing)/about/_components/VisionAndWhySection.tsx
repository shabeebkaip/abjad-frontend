import { Eye, Users2, BookOpen, TrendingUp } from "lucide-react";

const whyFeatures = [
  {
    icon: TrendingUp,
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Streamline Hiring",
    desc: "Reduce time-to-hire with smart matching and verified educator profiles ready for immediate placement.",
  },
  {
    icon: Users2,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Ensure Accurate Placement",
    desc: "Precision matching ensures every educator placed is the right fit for the school's curriculum and culture.",
  },
  {
    icon: BookOpen,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Support Professional Development",
    desc: "Abjad champions continuous growth — connecting educators with institutions that invest in excellence.",
  },
];

export default function VisionAndWhySection() {
  return (
    <>
      {/* ── Vision Section ── */}
      <section className="relative bg-white py-24 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(0,172,211,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 text-center">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            <Eye size={12} />
            Our Vision
          </span>

          <h2
            className="font-extrabold text-gray-950 mb-6 leading-tight"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", letterSpacing: "-0.03em" }}
          >
            Empowering Educators &amp; Elevating Education{" "}
            <span style={{ color: "var(--brand-accent)" }}>Across Saudi Arabia</span>
          </h2>

          {/* Vision quote */}
          <div
            className="relative inline-block rounded-3xl px-10 py-8 mx-auto max-w-2xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            <div className="absolute -top-3 left-10 text-5xl font-black text-white/20 leading-none select-none">
              &ldquo;
            </div>
            <p className="text-white/90 text-lg font-medium leading-relaxed relative z-10">
              To become a trusted partner to private and international schools, ensuring every classroom
              remains active and engaging.
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Abjad Leads ── */}
      <section className="relative bg-[#f8fafc] py-24 overflow-hidden">
        <div
          className="absolute -bottom-32 -left-32 w-125 h-125 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">
          <div className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
            >
              Why Abjad Leads
            </span>
            <h2
              className="font-extrabold text-gray-950 mb-4"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
            >
              More Than a Hiring Platform —{" "}
              <span style={{ color: "var(--brand-primary)" }}>A Nationwide Community</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-3xl mx-auto">
              Abjad is more than a hiring platform; it is a nationwide community of educators, substitute
              teachers, specialists, and institutions working together to advance the future of learning.
            </p>
          </div>

          {/* 3-column feature cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {whyFeatures.map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon size={22} style={{ color: f.color }} strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* For educators callout */}
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <p className="text-gray-600 text-base leading-relaxed text-center max-w-3xl mx-auto">
              For educators, Abjad makes it easy to discover roles that match your skills, values, and
              growth ambitions — from private schools to national educational institutions across the
              Kingdom of Saudi Arabia.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
