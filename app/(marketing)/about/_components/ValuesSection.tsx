import { ShieldCheck, Zap, Star, Users } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    accent: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    title: "Authenticity & Accuracy",
    desc: "Every educator profile is verified manually, ensuring schools receive trustworthy, compliant, and qualified candidates.",
  },
  {
    icon: Zap,
    accent: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Speed & Simplicity",
    desc: "Abjad eliminates delays and paperwork, enabling schools to hire educators or substitute teachers within minutes, not weeks.",
  },
  {
    icon: Star,
    accent: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    title: "Quality & Development",
    desc: "We champion growth by matching schools with educators committed to continuous professional development and teaching excellence.",
  },
  {
    icon: Users,
    accent: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.08)",
    title: "Collaboration & Connection",
    desc: "Abjad unites educators and institutions across Saudi Arabia in one powerful platform, making it easier to discover opportunities and build learning environments.",
  },
];

export default function ValuesSection() {
  return (
    <section className="overflow-hidden">

      {/* Top accent strip — bridges from dark VisionAndWhy section */}
      <div
        className="h-0.75 w-full"
        style={{ background: "linear-gradient(90deg, var(--brand-accent), var(--brand-primary-light) 70%)" }}
      />

      {/* Label strip */}
      <div className="bg-[#f8fafc] border-b border-gray-200 px-6 lg:px-10 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "var(--brand-primary)" }}
          >
            Our Values
          </span>
          <span className="text-xs text-gray-400">What drives Abjad</span>
        </div>
      </div>

      <div className="bg-[#f8fafc] max-w-6xl mx-auto px-6 lg:px-10 py-24">

        {/* Headline + intro */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-1">
            <h2
              className="font-extrabold text-gray-950 leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.2rem)", letterSpacing: "-0.04em" }}
            >
              Solving Real Challenges for Schools{" "}
              <span style={{ color: "var(--brand-accent)" }}>&amp; Educators</span>
            </h2>
          </div>
          <div className="lg:col-span-2 flex items-end">
            <p className="text-gray-500 text-base leading-relaxed">
              Every value at Abjad is rooted in a commitment to excellence for schools, educators,
              and students across Saudi Arabia. These aren&apos;t just words, they drive every
              decision we make.
            </p>
          </div>
        </div>

        {/* 2 × 2 value cards with left colored border */}
        <div className="grid md:grid-cols-2 gap-5">
          {values.map((v, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              {/* Left accent border */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.75 rounded-l-2xl"
                style={{ backgroundColor: v.accent }}
              />
              <div className="pl-8 pr-8 pt-8 pb-8 text-center">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto"
                  style={{ backgroundColor: v.bg }}
                >
                  <v.icon size={22} style={{ color: v.accent }} strokeWidth={2} />
                </div>
                <h3
                  className="font-extrabold text-gray-900 leading-tight mb-3"
                  style={{ fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
