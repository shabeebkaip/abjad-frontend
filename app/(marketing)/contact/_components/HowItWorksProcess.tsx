import { Send, SearchCheck, CalendarCheck2, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Send,
    color: "var(--brand-accent)",
    bg: "rgba(0,172,211,0.10)",
    title: "Submit Your Information",
    desc: "Fill out our contact form below with your name, email, phone, role, and what you are looking for. Schools can describe their vacancy; educators can share availability and subject specialisation.",
    cta: null,
  },
  {
    number: "02",
    icon: SearchCheck,
    color: "#6366f1",
    bg: "#eef2ff",
    title: "Match & Review",
    desc: "Our team reviews your submission and begins matching schools with vetted substitute teachers or permanent educators based on curriculum, location, and urgency.",
    cta: null,
  },
  {
    number: "03",
    icon: CalendarCheck2,
    color: "#10b981",
    bg: "#ecfdf5",
    title: "Interview or Trial Assignment",
    desc: "We coordinate a brief interview or a trial day assignment to confirm compatibility before formalising any placement — ensuring confidence on both sides.",
    cta: null,
  },
  {
    number: "04",
    icon: Rocket,
    color: "#f59e0b",
    bg: "#fef3c7",
    title: "Start the Assignment",
    desc: "Once confirmed, the teacher or substitute teacher begins their placement. We remain available throughout to provide ongoing support to both schools and educators.",
    cta: null,
  },
];

export default function HowItWorksProcess() {
  return (
    <section className="bg-[#f8fafc] py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            The Process
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            How It Works —{" "}
            <span style={{ color: "var(--brand-accent)" }}>Step by Step</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            From your first message to a confirmed placement, our process is straightforward,
            fast, and designed to reduce friction for both schools and educators.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden lg:block absolute top-10 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-0.5 z-0"
            style={{ background: "linear-gradient(90deg, var(--brand-accent) 0%, #6366f1 100%)", opacity: 0.18 }}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                {/* Icon circle */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-200 relative"
                  style={{ backgroundColor: s.bg }}
                >
                  <s.icon size={28} style={{ color: s.color }} strokeWidth={1.8} />
                  <span
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center text-white shadow"
                    style={{ background: s.color }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA nudge */}
        <div className="mt-14 text-center">
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200"
            style={{ background: "var(--brand-gradient)" }}
          >
            Start — Submit Your Info
          </a>
        </div>
      </div>
    </section>
  );
}
