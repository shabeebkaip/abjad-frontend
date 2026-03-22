import { Globe2, BadgeCheck, ShieldCheck, Clock3, Users2 } from "lucide-react";

const reasons = [
  {
    icon: Globe2,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Nationwide Coverage",
    desc: "We connect schools across the entire Kingdom of Saudi Arabia with qualified teachers and educators, ensuring dependable staffing support nationwide.",
  },
  {
    icon: Users2,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.08)",
    title: "Proven Track Record",
    desc: "Our proven experience includes placing hundreds of teachers, substitute teachers, and professional educators in top schools throughout Saudi Arabia.",
  },
  {
    icon: ShieldCheck,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Thorough Screening",
    desc: "We follow a thorough screening process, including background checks, credential verification, and trial teaching assignments, to ensure every educator meets the highest standards.",
  },
  {
    icon: Clock3,
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Fast & Reliable Staffing",
    desc: "Schools trust us to deliver verified and reliable teaching staff quickly — especially for urgent substitute teacher needs across the Kingdom.",
  },
  {
    icon: BadgeCheck,
    color: "var(--brand-primary)",
    bg: "rgba(13,37,66,0.07)",
    title: "Continuous Opportunities",
    desc: "Educators and teachers on our platform gain continuous placement opportunities in international schools, high schools, and local institutions throughout Saudi Arabia.",
  },
];

export default function WhyReachUs() {
  return (
    <section className="bg-[#f8fafc] py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            Why Reach Us
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Why Schools &amp; Educators{" "}
            <span style={{ color: "var(--brand-accent)" }}>Trust Abjad</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From Riyadh to Dammam, Abjad is the platform that schools and educators rely on for
            fast, verified, and lasting placements.
          </p>
        </div>

        {/* 5-card grid: 3 top + 2 bottom centered */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div
              key={i}
              className={`group bg-white rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${
                i === 3 ? "lg:col-start-1" : ""
              }`}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: r.bg }}
              >
                <r.icon size={22} style={{ color: r.color }} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{r.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
            </div>
          ))}
          {/* Empty spacer for 5-card grid centering on lg */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
