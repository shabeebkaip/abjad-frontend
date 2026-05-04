import { Globe, Award, ShieldCheck, Zap, RefreshCw } from "lucide-react";

const reasons = [
  {
    icon: Globe,
    iconColor: "var(--brand-accent)",
    iconBg: "rgba(0,172,211,0.1)",
    title: "Nationwide Coverage",
    desc: "We connect schools across the entire Kingdom of Saudi Arabia with qualified teachers and educators, ensuring dependable staffing support nationwide.",
  },
  {
    icon: Award,
    iconColor: "#6366f1",
    iconBg: "rgba(99,102,241,0.1)",
    title: "Proven Track Record",
    desc: "Our proven experience includes placing hundreds of teachers, substitute teachers, and professional educators in top schools throughout Saudi Arabia.",
  },
  {
    icon: ShieldCheck,
    iconColor: "#10b981",
    iconBg: "rgba(16,185,129,0.1)",
    title: "Thorough Screening",
    desc: "We follow a thorough screening process including background checks, credential verification, and trial teaching assignments to ensure every educator meets the highest standards.",
  },
  {
    icon: Zap,
    iconColor: "#f59e0b",
    iconBg: "rgba(245,158,11,0.1)",
    title: "Fast & Reliable Staffing",
    desc: "Schools trust us to deliver verified and reliable teaching staff quickly, especially for urgent substitute teacher needs across the Kingdom.",
  },
  {
    icon: RefreshCw,
    iconColor: "var(--brand-primary)",
    iconBg: "rgba(13,37,66,0.08)",
    title: "Continuous Opportunities",
    desc: "Educators and teachers on our platform gain continuous placement opportunities in international schools, high schools, and local institutions throughout Saudi Arabia.",
  },
];

export default function WhyReachUs() {
  return (
    <section className="bg-white py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Label bar */}
        <div className="flex items-center gap-4 mb-14">
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
          <span
            className="text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            Why Reach Us
          </span>
          <div className="h-px flex-1" style={{ background: "var(--brand-primary-light)" }} />
        </div>

        {/* Big headline */}
        <div className="grid lg:grid-cols-12 gap-6 mb-12 items-end">
          <h2
            className="lg:col-span-7 font-extrabold text-gray-950 leading-tight"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.04em" }}
          >
            Why Schools & Educators{" "}
            <span style={{ color: "var(--brand-accent)" }}>Trust Abjad</span>
          </h2>
          <p className="lg:col-span-5 text-gray-500 text-base leading-relaxed self-end">
            From Riyadh to Dammam, Abjad is the platform schools and educators rely on for
            fast, verified, and lasting placements across Saudi Arabia.
          </p>
        </div>

        {/* Divider rows */}
        <div className="divide-y divide-gray-100">
          {reasons.map((r, i) => (
            <div key={i} className="grid lg:grid-cols-12 gap-4 items-start py-8 group">
              {/* Icon */}
              <div className="lg:col-span-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: r.iconBg }}
                >
                  <r.icon size={18} style={{ color: r.iconColor }} strokeWidth={2} />
                </div>
              </div>

              {/* Title */}
              <h3
                className="lg:col-span-3 font-bold text-gray-900 text-base leading-snug"
              >
                {r.title}
              </h3>

              {/* Divider */}
              <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
                <div className="w-px h-8 bg-gray-200" />
              </div>

              {/* Desc */}
              <p className="lg:col-span-7 text-sm text-gray-500 leading-relaxed">
                {r.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
