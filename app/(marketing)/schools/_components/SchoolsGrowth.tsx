const growthItems = [
  {
    color: "#10b981",
    bg: "#f0fdf4",
    tag: "Zero Shortages",
    title: "Eliminate Teacher Shortages with Verified Educators",
    desc: "Fill staffing gaps fast with a network of trusted, pre-screened educators available across Saudi Arabia, ensuring your classrooms never go underserved.",
  },
  {
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.07)",
    tag: "70% Faster",
    title: "Hire 70% Faster Than Traditional Recruitment",
    desc: "Skip slow, outdated hiring methods. Abjad accelerates recruitment workflows, helping your school secure the right educators in record time.",
  },
  {
    color: "#6366f1",
    bg: "rgba(99,102,241,0.07)",
    tag: "Better Outcomes",
    title: "Improve Classroom Stability & Student Success",
    desc: "Maintain consistent learning experiences with reliable substitutes and full-time educators, boosting student satisfaction, academic continuity, and teaching quality.",
  },
  {
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
    tag: "Kingdom-Wide",
    title: "Access a Kingdom-Wide Talent Pool of Qualified Educators",
    desc: "Connect directly with experienced teachers, substitutes, and specialists already in Saudi Arabia, reducing onboarding delays and ensuring cultural and regulatory alignment.",
  },
];

export default function SchoolsGrowth() {
  return (
    <section className="relative bg-[#f8fafc] overflow-hidden">

      {/* Label strip */}
      <div className="border-b border-gray-100 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            School Growth
          </span>
          <span className="text-xs text-gray-400">Transforming staffing into a strength</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-24">

        {/* Section header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2
            className="font-extrabold text-gray-950 leading-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.8rem)", letterSpacing: "-0.04em" }}
          >
            Empower Your School&apos;s Growth with{" "}
            <span style={{ color: "var(--brand-accent)" }}>Abjad</span>
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Transforming how schools across Saudi Arabia solve staffing challenges, enhance classroom
            performance, and build stronger academic environments.
          </p>
        </div>

        {/* 2 × 2 grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {growthItems.map((item, i) => (
            <div
              key={i}
              className="rounded-3xl bg-white border border-gray-100 p-8 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Check circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: item.bg }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8l3.5 3.5L13 5"
                      stroke={item.color}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <span
                    className="inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    {item.tag}
                  </span>
                  <h3 className="text-gray-950 font-bold text-base leading-snug">{item.title}</h3>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed pl-13">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
