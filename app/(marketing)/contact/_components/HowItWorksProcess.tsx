const steps = [
  {
    number: "01",
    color: "var(--brand-accent)",
    title: "Submit Your Information",
    desc: "Fill out our contact form below with your name, email, phone, role, and what you are looking for. Schools can describe their vacancy; educators can share availability and subject specialisation.",
  },
  {
    number: "02",
    color: "#6366f1",
    title: "Match & Review",
    desc: "Our team reviews your submission and begins matching schools with vetted substitute teachers or permanent educators based on curriculum, location, and urgency.",
  },
  {
    number: "03",
    color: "#10b981",
    title: "Interview or Trial Assignment",
    desc: "We coordinate a brief interview or a trial day assignment to confirm compatibility before formalising any placement — ensuring confidence on both sides.",
  },
  {
    number: "04",
    color: "#f59e0b",
    title: "Start the Assignment",
    desc: "Once confirmed, the teacher or substitute teacher begins their placement. We remain available throughout to provide ongoing support to both schools and educators.",
  },
];

export default function HowItWorksProcess() {
  return (
    <section
      className="py-24 overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-6 mb-16 items-end">
          <div className="lg:col-span-7">
            <p
              className="text-xs font-black tracking-widest uppercase mb-4"
              style={{ color: "var(--brand-accent)" }}
            >
              The Process
            </p>
            <h2
              className="font-extrabold text-white leading-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.04em" }}
            >
              How It Works —{" "}
              <span style={{ color: "var(--brand-accent)" }}>Step by Step</span>
            </h2>
          </div>
          <p className="lg:col-span-5 text-white/55 text-base leading-relaxed self-end">
            From your first message to a confirmed placement, our process is straightforward,
            fast, and designed to reduce friction for both schools and educators.
          </p>
        </div>

        {/* Vertical step rows */}
        <div className="space-y-0 divide-y divide-white/10">
          {steps.map((s, i) => (
            <div key={i} className="grid lg:grid-cols-12 gap-6 items-start py-10 group">

              {/* Giant number */}
              <div className="lg:col-span-2 flex items-center gap-4">
                <span
                  className="font-black leading-none select-none"
                  style={{
                    fontSize: "clamp(3rem, 5vw, 4rem)",
                    color: s.color,
                    opacity: 0.9,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {s.number}
                </span>
              </div>

              {/* Colored accent bar */}
              <div className="hidden lg:flex lg:col-span-1 flex-col items-center pt-3">
                <div className="w-0.5 h-10 rounded-full" style={{ backgroundColor: s.color, opacity: 0.4 }} />
              </div>

              {/* Title + desc */}
              <div className="lg:col-span-9">
                <h3
                  className="font-bold text-white text-lg mb-3 leading-snug"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm text-white/55 leading-relaxed max-w-2xl">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 pt-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/50 text-sm">
            Ready to get started? Submit your information and we will take it from there.
          </p>
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold text-white border border-white/20 hover:bg-white/10 transition-all"
          >
            Submit Your Info →
          </a>
        </div>
      </div>
    </section>
  );
}
