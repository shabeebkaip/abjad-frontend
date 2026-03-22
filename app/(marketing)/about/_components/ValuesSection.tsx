import { BadgeCheck, Zap, Star, Globe2 } from "lucide-react";

const values = [
  {
    number: "01",
    icon: BadgeCheck,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Authenticity & Accuracy",
    desc: "Every educator profile is verified manually, ensuring schools receive trustworthy, compliant, and qualified candidates.",
  },
  {
    number: "02",
    icon: Zap,
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Speed & Simplicity",
    desc: "Abjad eliminates delays and paperwork, enabling schools to hire educators or substitute teachers within minutes, not weeks.",
  },
  {
    number: "03",
    icon: Star,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Quality & Development",
    desc: "We champion growth by matching schools with educators committed to continuous professional development and teaching excellence.",
  },
  {
    number: "04",
    icon: Globe2,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.08)",
    title: "Collaboration & Connection",
    desc: "Abjad unites educators and institutions across Saudi Arabia in one powerful platform, making it easier than ever to discover opportunities, hire confidently, and build strong learning environments.",
  },
];

export default function ValuesSection() {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full bg-white/3 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/3 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 mb-4">
            Our Values
          </span>
          <h2
            className="font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Solving Real Challenges for Schools &amp;{" "}
            <span style={{ color: "var(--brand-accent)" }}>Educators</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Across Saudi Arabia
          </p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative bg-white/7 hover:bg-white/11 border border-white/10 rounded-3xl p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20"
            >
              {/* Number watermark */}
              <span
                className="absolute top-6 right-7 text-6xl font-black leading-none select-none pointer-events-none"
                style={{ color: "rgba(255,255,255,0.05)" }}
              >
                {v.number}
              </span>

              <div className="relative z-10 flex items-start gap-5">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: v.bg }}
                >
                  <v.icon size={22} style={{ color: v.color }} strokeWidth={2} />
                </div>

                <div>
                  {/* Number badge */}
                  <span className="text-xs font-bold tracking-widest text-white/40 uppercase mb-2 block">
                    {v.number}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{v.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{v.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wave */}
      <div className="relative z-10 -mb-px mt-16">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full block" style={{ height: "70px" }}>
          <path d="M0 70V45C360 10 720 70 1080 40C1260 22 1380 55 1440 40V70H0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
