import {
  ShieldCheck,
  Zap,
  Globe2,
  Star,
  BellRing,
  LineChart,
  Users2,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified profiles",
    desc: "Every teacher and school goes through identity and credential verification before joining.",
    color: "#2bbdc5",
    bg: "#e0f7f8",
  },
  {
    icon: Zap,
    title: "Smart matching",
    desc: "Our algorithm pairs teachers with jobs based on subject, experience, location, and preferences.",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    icon: Globe2,
    title: "Region-wide reach",
    desc: "Opportunities across the Gulf region — Saudi Arabia, UAE, Kuwait, and beyond.",
    color: "#6366f1",
    bg: "#eef2ff",
  },
  {
    icon: BellRing,
    title: "Instant notifications",
    desc: "Get real-time alerts when new matching jobs are posted or schools view your profile.",
    color: "#ec4899",
    bg: "#fdf2f8",
  },
  {
    icon: LineChart,
    title: "Analytics dashboard",
    desc: "Schools see how their listings perform. Teachers track application statuses live.",
    color: "#0e7a81",
    bg: "#f0fdfe",
  },
  {
    icon: Users2,
    title: "Collaboration tools",
    desc: "Built-in messaging, interview scheduling, and document sharing — no extra tools needed.",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
  {
    icon: Star,
    title: "Ratings & reviews",
    desc: "Transparent feedback system so the best teachers and schools naturally stand out.",
    color: "#f97316",
    bg: "#fff7ed",
  },
  {
    icon: Lock,
    title: "Privacy first",
    desc: "Your data is yours. Full GDPR compliance and granular privacy controls built in.",
    color: "#10b981",
    bg: "#ecfdf5",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-28 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "#e0f7f8", color: "#2bbdc5" }}
          >
            Why Abjad
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Built specifically for the education sector — not a generic job board bolted on.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: f.bg }}
              >
                <f.icon size={20} style={{ color: f.color }} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
