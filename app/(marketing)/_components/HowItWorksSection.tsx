import { Search, FileCheck, Handshake, BriefcaseBusiness, Filter, BadgeCheck } from "lucide-react";

const teacherSteps = [
  {
    icon: Search,
    title: "Create your profile",
    desc: "Add your qualifications, subjects, experience, and what makes you a great teacher.",
    step: "01",
  },
  {
    icon: Filter,
    title: "Browse & apply",
    desc: "Explore curated job listings matched to your profile. Filter by location, school type, and salary.",
    step: "02",
  },
  {
    icon: Handshake,
    title: "Get hired",
    desc: "Connect with schools, attend interviews, and land your dream teaching position.",
    step: "03",
  },
];

const schoolSteps = [
  {
    icon: BriefcaseBusiness,
    title: "Post your opening",
    desc: "List your vacancies with detailed requirements. It takes less than 5 minutes.",
    step: "01",
  },
  {
    icon: FileCheck,
    title: "Review candidates",
    desc: "Browse AI-matched teacher profiles ranked by relevance to your specific needs.",
    step: "02",
  },
  {
    icon: BadgeCheck,
    title: "Hire with confidence",
    desc: "Schedule interviews, check references, and make your hire — all in one place.",
    step: "03",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center mb-20">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "#e0f7f8", color: "#2bbdc5" }}
          >
            How it works
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
            Simple. Fast. Effective.
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Whether you&apos;re looking for a job or filling a position, Abjad gets you there in three easy steps.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* For Teachers */}
          <div id="teachers">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#e0f7f8" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#2bbdc5" strokeWidth="2">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Teachers</h3>
            </div>
            <div className="space-y-6">
              {teacherSteps.map((s, i) => (
                <div key={s.step} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: "#2bbdc5" }}
                    >
                      <s.icon size={20} color="white" />
                    </div>
                    {i < teacherSteps.length - 1 && (
                      <div className="w-px flex-1 mt-3" style={{ backgroundColor: "#e0f7f8", minHeight: "24px" }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: "#2bbdc5" }}>{s.step}</span>
                      <h4 className="font-semibold text-gray-900">{s.title}</h4>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Schools */}
          <div id="schools">
            <div className="flex items-center gap-3 mb-8">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#e0f7f8" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#2bbdc5" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">For Schools</h3>
            </div>
            <div className="space-y-6">
              {schoolSteps.map((s, i) => (
                <div key={s.step} className="flex gap-5">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: "#0e7a81" }}
                    >
                      <s.icon size={20} color="white" />
                    </div>
                    {i < schoolSteps.length - 1 && (
                      <div className="w-px flex-1 mt-3" style={{ backgroundColor: "#e0f7f8", minHeight: "24px" }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold" style={{ color: "#0e7a81" }}>{s.step}</span>
                      <h4 className="font-semibold text-gray-900">{s.title}</h4>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
