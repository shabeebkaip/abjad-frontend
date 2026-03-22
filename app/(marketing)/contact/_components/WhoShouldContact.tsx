import { Building2, Briefcase, GraduationCap, ClipboardList } from "lucide-react";

const schoolNeeds = [
  { icon: ClipboardList, text: "Need to fill an urgent substitute teacher vacancy quickly" },
  { icon: Building2, text: "Looking to hire permanent teachers for private or international schools" },
  { icon: Briefcase, text: "Seeking vetted educators who meet NEOM, MOE, or international curriculum standards" },
];

const teacherNeeds = [
  { icon: GraduationCap, text: "A teacher or substitute teacher seeking placements in Saudi schools" },
  { icon: Building2, text: "An international educator interested in relocating or remote opportunities" },
  { icon: ClipboardList, text: "A specialist educator seeking part-time or project-based assignments" },
];

export default function WhoShouldContact() {
  return (
    <section className="py-24 overflow-hidden" style={{ background: "var(--brand-gradient)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 bg-white/10 text-white/70"
          >
            Who Should Reach Out
          </span>
          <h2
            className="font-extrabold text-white mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Is Abjad{" "}
            <span style={{ color: "var(--brand-accent)" }}>Right for You?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Whether you run a school or you are an educator, Abjad has a direct path for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Schools card */}
          <div className="bg-white/6 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
              style={{ backgroundColor: "var(--brand-accent-light)" }}
            >
              <Building2 size={22} style={{ color: "var(--brand-accent)" }} strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Schools &amp; Administrators</h3>
            <p className="text-white/50 text-sm mb-7">
              Contact us if you are a school principal, HR manager, hiring team lead, or administrator who:
            </p>
            <ul className="space-y-4">
              {schoolNeeds.map((n, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--brand-accent-light)" }}
                  >
                    <n.icon size={14} style={{ color: "var(--brand-accent)" }} strokeWidth={2} />
                  </span>
                  <span className="text-sm text-white/70 leading-relaxed">{n.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Teachers card */}
          <div className="bg-white/6 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-indigo-500/20"
            >
              <GraduationCap size={22} className="text-indigo-300" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Teachers &amp; Substitute Teachers</h3>
            <p className="text-white/50 text-sm mb-7">
              Contact us if you are an educator looking for new opportunities and you are:
            </p>
            <ul className="space-y-4">
              {teacherNeeds.map((n, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 bg-indigo-500/20">
                    <n.icon size={14} className="text-indigo-300" strokeWidth={2} />
                  </span>
                  <span className="text-sm text-white/70 leading-relaxed">{n.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
