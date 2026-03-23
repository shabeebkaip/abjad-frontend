const whyItems = [
  {
    num: "01",
    color: "#f59e0b",
    title: "Streamline Hiring",
    desc: "Reduce time-to-hire with smart matching and verified educator profiles ready for immediate placement across Saudi Arabia.",
  },
  {
    num: "02",
    color: "var(--brand-accent)",
    title: "Ensure Accurate Placement",
    desc: "Precision matching ensures every educator placed is the right fit for the school's curriculum, culture, and community.",
  },
  {
    num: "03",
    color: "#34d399",
    title: "Support Professional Development",
    desc: "Abjad champions continuous growth — connecting educators with institutions that invest in excellence and long-term careers.",
  },
];

export default function VisionAndWhySection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "var(--brand-primary)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      {/* Large watermark */}
      <div
        className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none overflow-hidden"
        style={{ fontSize: "22rem", fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,0.02)" }}
      >
        VISION
      </div>
      {/* Vertical accent line */}
      <div
        className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px opacity-10 pointer-events-none"
        style={{ background: "linear-gradient(180deg, transparent, var(--brand-accent), transparent)" }}
      />

      {/* ── Vision Statement ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-10 py-24 text-center border-b border-white/10">
        <span className="inline-block text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-white/8 text-white/50 mb-8">
          Our Vision
        </span>

        <h2
          className="font-extrabold text-white leading-[1.08] mb-10"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.04em" }}
        >
          Empowering Educators &amp; Elevating Education{" "}
          <span style={{ color: "var(--brand-accent)" }}>Across Saudi Arabia</span>
        </h2>

        <div
          className="inline-block border-t border-b py-8 px-4 max-w-2xl"
          style={{ borderColor: "rgba(255,255,255,0.12)" }}
        >
          <p className="text-white/70 text-xl font-medium leading-relaxed italic">
            &ldquo;To become a trusted partner to private and international schools,
            ensuring every classroom remains active and engaging.&rdquo;
          </p>
        </div>
      </div>

      {/* ── Why Abjad Leads — same dark section ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-14 pb-10">
        <div className="flex items-center justify-between mb-8">
          <span className="text-xs font-black tracking-widest uppercase text-white/30">
            Why Abjad Leads
          </span>
          <span className="text-xs text-white/20">A Nationwide Community</span>
        </div>

        <div className="flex flex-col divide-y divide-white/8">
          {whyItems.map((item, i) => (
            <div
              key={i}
              className="group grid md:grid-cols-12 gap-6 py-10 items-center"
            >
              <div className="md:col-span-1">
                <span
                  className="text-4xl font-black leading-none"
                  style={{ color: item.color, opacity: 0.65 }}
                >
                  {item.num}
                </span>
              </div>
              <div className="md:col-span-4">
                <h3 className="text-white font-bold text-base">{item.title}</h3>
              </div>
              <div className="hidden md:block md:col-span-1">
                <div className="h-px w-full" style={{ background: `${item.color}28` }} />
              </div>
              <div className="md:col-span-6">
                <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom educator callout */}
        <div className="mt-2 mb-14 p-5 rounded-2xl border border-white/8 bg-white/4">
          <p className="text-white/50 text-sm leading-relaxed text-center max-w-2xl mx-auto">
            For educators, Abjad makes it easy to discover roles that match your skills, values, and growth
            ambitions — from private schools to national educational institutions across the Kingdom of Saudi Arabia.
          </p>
        </div>
      </div>
    </section>
  );
}
