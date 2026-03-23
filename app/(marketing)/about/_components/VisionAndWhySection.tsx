import { TrendingUp, Users2, BookOpen } from "lucide-react";

const whyItems = [
  {
    num: "①",
    color: "#f59e0b",
    title: "Streamline Hiring",
    desc: "Reduce time-to-hire with smart matching and verified educator profiles ready for immediate placement.",
  },
  {
    num: "②",
    color: "#6366f1",
    title: "Ensure Accurate Placement",
    desc: "Precision matching ensures every educator placed is the right fit for the school's curriculum and culture.",
  },
  {
    num: "③",
    color: "#10b981",
    title: "Support Professional Development",
    desc: "Abjad champions continuous growth — connecting educators with institutions that invest in excellence.",
  },
];

export default function VisionAndWhySection() {
  return (
    <>
      {/* ── Vision — full-bleed dark manifesto ── */}
      <section
        className="relative overflow-hidden py-28 px-6"
        style={{ background: "var(--brand-primary)" }}
      >
        {/* Diagonal accent rule */}
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-px opacity-10"
          style={{ background: "linear-gradient(180deg, transparent, var(--brand-accent), transparent)" }}
        />
        {/* Large watermark */}
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center pointer-events-none select-none"
          style={{ fontSize: "20rem", fontWeight: 900, lineHeight: 1, color: "rgba(255,255,255,0.02)", overflow: "hidden" }}
        >
          VISION
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-black tracking-widest uppercase mb-8 px-4 py-1.5 rounded-full bg-white/8 text-white/50">
            Our Vision
          </span>

          <h2
            className="font-extrabold text-white leading-[1.1] mb-8"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.04em" }}
          >
            Empowering Educators &amp; Elevating Education{" "}
            <span style={{ color: "var(--brand-accent)" }}>Across Saudi Arabia</span>
          </h2>

          {/* Vision statement — typographic treatment */}
          <div
            className="inline-block border-t border-b py-8 px-4 max-w-2xl"
            style={{ borderColor: "rgba(255,255,255,0.12)" }}
          >
            <p className="text-white/70 text-xl font-medium leading-relaxed italic">
              &ldquo;To become a trusted partner to private and international schools, ensuring every
              classroom remains active and engaging.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* ── Why Abjad Leads — horizontal numbered strip ── */}
      <section className="bg-white">
        {/* Section label strip */}
        <div
          className="border-b border-gray-100 px-6 lg:px-10 py-5"
          style={{ maxWidth: "none" }}
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <span
              className="text-xs font-black tracking-widest uppercase"
              style={{ color: "var(--brand-primary)" }}
            >
              Why Abjad Leads
            </span>
            <span className="text-xs text-gray-400">A Nationwide Community</span>
          </div>
        </div>

        {/* Three items as horizontal divider rows */}
        <div className="max-w-6xl mx-auto px-6 lg:px-10 divide-y divide-gray-100">
          {whyItems.map((item, i) => (
            <div
              key={i}
              className="group grid md:grid-cols-12 gap-6 py-10 items-center"
            >
              {/* Large coloured number */}
              <div className="md:col-span-1 flex items-center">
                <span
                  className="text-3xl font-black"
                  style={{ color: item.color }}
                >
                  {item.num}
                </span>
              </div>
              {/* Title */}
              <div className="md:col-span-4">
                <h3
                  className="text-lg font-bold text-gray-950 group-hover:text-brand-primary transition-colors"
                >
                  {item.title}
                </h3>
              </div>
              {/* Divider */}
              <div className="hidden md:block md:col-span-1">
                <div className="h-px w-full" style={{ background: `${item.color}40` }} />
              </div>
              {/* Desc */}
              <div className="md:col-span-6">
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Educators callout — accent background */}
        <div
          className="px-6 lg:px-10 py-8"
          style={{ backgroundColor: "var(--brand-accent-light)" }}
        >
          <p
            className="max-w-3xl mx-auto text-center text-sm font-medium leading-relaxed"
            style={{ color: "var(--brand-primary)" }}
          >
            For educators, Abjad makes it easy to discover roles that match your skills, values, and growth
            ambitions — from private schools to national educational institutions across the Kingdom of Saudi Arabia.
          </p>
        </div>
      </section>
    </>
  );
}
