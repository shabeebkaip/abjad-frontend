const reasons = [
  {
    num: "01",
    numColor: "var(--brand-accent)",
    title: "Nationwide Coverage",
    desc: "We connect schools across the entire Kingdom of Saudi Arabia with qualified teachers and educators, ensuring dependable staffing support nationwide.",
  },
  {
    num: "02",
    numColor: "#6366f1",
    title: "Proven Track Record",
    desc: "Our proven experience includes placing hundreds of teachers, substitute teachers, and professional educators in top schools throughout Saudi Arabia.",
  },
  {
    num: "03",
    numColor: "#10b981",
    title: "Thorough Screening",
    desc: "We follow a thorough screening process including background checks, credential verification, and trial teaching assignments to ensure every educator meets the highest standards.",
  },
  {
    num: "04",
    numColor: "#f59e0b",
    title: "Fast & Reliable Staffing",
    desc: "Schools trust us to deliver verified and reliable teaching staff quickly — especially for urgent substitute teacher needs across the Kingdom.",
  },
  {
    num: "05",
    numColor: "var(--brand-primary)",
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

        {/* Numbered divider rows */}
        <div className="divide-y divide-gray-100">
          {reasons.map((r, i) => (
            <div key={i} className="grid lg:grid-cols-12 gap-4 items-start py-8 group">
              {/* Number */}
              <span
                className="lg:col-span-1 font-black text-2xl leading-none select-none"
                style={{ color: r.numColor, fontVariantNumeric: "tabular-nums", opacity: 0.85 }}
              >
                {r.num}
              </span>

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
