const values = [
  {
    number: "01",
    accent: "#10b981",
    title: "Authenticity & Accuracy",
    desc: "Every educator profile is verified manually, ensuring schools receive trustworthy, compliant, and qualified candidates.",
  },
  {
    number: "02",
    accent: "#f59e0b",
    title: "Speed & Simplicity",
    desc: "Abjad eliminates delays and paperwork, enabling schools to hire educators or substitute teachers within minutes, not weeks.",
  },
  {
    number: "03",
    accent: "#a78bfa",
    title: "Quality & Development",
    desc: "We champion growth by matching schools with educators committed to continuous professional development and teaching excellence.",
  },
  {
    number: "04",
    accent: "var(--brand-accent)",
    title: "Collaboration & Connection",
    desc: "Abjad unites educators and institutions across Saudi Arabia in one powerful platform, making it easier than ever to discover opportunities, hire confidently, and build strong learning environments.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-[#f8fafc] overflow-hidden">

      {/* Full-width label bar */}
      <div
        className="border-b border-gray-200 px-6 lg:px-10 py-5"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            Our Values
          </span>
          <span className="text-xs text-gray-400">What Drives Abjad</span>
        </div>
      </div>

      {/* Bold headline */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-12">
        <h2
          className="font-extrabold text-gray-950 leading-[1.05] max-w-2xl"
          style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)", letterSpacing: "-0.04em" }}
        >
          Solving Real Challenges for Schools{" "}
          <span style={{ color: "var(--brand-accent)" }}>&amp; Educators</span>
        </h2>
      </div>

      {/* Values as alternating full-width rows */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-px bg-gray-200 rounded-3xl overflow-hidden shadow-sm">
          {values.map((v, i) => (
            <div
              key={i}
              className="group bg-white p-10 hover:bg-[#f8fafc] transition-colors duration-200 relative"
            >
              {/* Giant number */}
              <span
                className="block font-black leading-none mb-6 select-none transition-opacity duration-200"
                style={{ fontSize: "clamp(4rem, 7vw, 6rem)", color: v.accent, opacity: 0.15 }}
              >
                {v.number}
              </span>
              {/* Coloured top bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                style={{ background: `linear-gradient(90deg, ${v.accent}, transparent)` }}
              />
              <h3
                className="font-extrabold text-gray-900 mb-3 leading-tight"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.4rem)" }}
              >
                {v.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              {/* Small accent dot */}
              <div className="mt-6 w-4 h-1 rounded-full" style={{ backgroundColor: v.accent }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
