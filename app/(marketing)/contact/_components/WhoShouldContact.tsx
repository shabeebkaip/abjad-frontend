const schoolNeeds = [
  "Need to fill an urgent substitute teacher vacancy quickly",
  "Looking to hire permanent teachers for private or international schools",
  "Seeking vetted educators who meet NEOM, MOE, or international curriculum standards",
];

const teacherNeeds = [
  "A teacher or substitute teacher seeking placements in Saudi schools",
  "An international educator interested in relocating or remote opportunities",
  "A specialist educator seeking part-time or project-based assignments",
];

export default function WhoShouldContact() {
  return (
    <section className="overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-115">

        {/* Schools — dark navy */}
        <div
          className="flex flex-col justify-center px-10 py-20 lg:px-16"
          style={{ background: "var(--brand-primary)" }}
        >
          <p
            className="text-xs font-black tracking-widest uppercase mb-6"
            style={{ color: "var(--brand-accent)" }}
          >
            Schools & Administrators
          </p>
          <h2
            className="font-extrabold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", letterSpacing: "-0.04em" }}
          >
            Reach out if your school needs teaching talent — fast.
          </h2>
          <p className="text-white/50 text-sm mb-8">
            Ideal for principals, HR managers, and hiring administrators who:
          </p>
          <ul className="space-y-5">
            {schoolNeeds.map((t, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ backgroundColor: "var(--brand-accent)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-white/70 leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Teachers — light */}
        <div className="flex flex-col justify-center px-10 py-20 lg:px-16 bg-[#f8fafc]">
          <p
            className="text-xs font-black tracking-widest uppercase mb-6"
            style={{ color: "var(--brand-primary)" }}
          >
            Teachers & Substitute Teachers
          </p>
          <h2
            className="font-extrabold leading-tight mb-4"
            style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.2rem)", letterSpacing: "-0.04em", color: "var(--brand-primary)" }}
          >
            Reach out if you are an educator ready for your next placement.
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Ideal for educators looking for new opportunities and who are:
          </p>
          <ul className="space-y-5">
            {teacherNeeds.map((t, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  className="w-5 h-5 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-black text-white"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm text-gray-600 leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
