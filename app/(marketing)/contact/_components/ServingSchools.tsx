import { MapPin } from "lucide-react";

const regions = [
  {
    city: "Riyadh",
    desc: "Private, international & high school networks across the capital region",
    tag: "Capital Region",
  },
  {
    city: "Jeddah",
    desc: "International curriculum schools, bilingual institutions & corporate academies",
    tag: "Western Province",
  },
  {
    city: "Dammam",
    desc: "Oil sector schools, ARAMCO communities & private schools in the Eastern Province",
    tag: "Eastern Province",
  },
  {
    city: "International Schools",
    desc: "British, American, IB, & SABIS curriculum schools across Saudi Arabia",
    tag: "All Regions",
  },
  {
    city: "High School Departments",
    desc: "Ministry-aligned high school departments requiring specialist subject teachers",
    tag: "Nationwide",
  },
  {
    city: "Private Networks",
    desc: "Private school groups seeking reliable substitute teacher pools on demand",
    tag: "All Provinces",
  },
];

export default function ServingSchools() {
  return (
    <section className="bg-[#f8fafc] py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            Where We Operate
          </span>
          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}
          >
            Serving Schools{" "}
            <span style={{ color: "var(--brand-accent)" }}>Across the Kingdom</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Abjad connects educators with schools throughout Saudi Arabia — from major cities to
            national school networks of every type.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((r, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: "var(--brand-accent-light)" }}
                >
                  <MapPin size={18} style={{ color: "var(--brand-accent)" }} strokeWidth={2} />
                </div>
                <div>
                  <span
                    className="text-[10px] font-bold tracking-widest uppercase rounded-full px-2 py-0.5 mb-2 inline-block"
                    style={{ backgroundColor: "var(--brand-primary-light)", color: "var(--brand-primary)" }}
                  >
                    {r.tag}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{r.city}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEO-friendly paragraph */}
        <p className="mt-12 text-center text-sm text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Whether you are an international school in Riyadh looking for a certified substitute
          teacher on short notice, a private school network in Jeddah expanding your permanent
          faculty, or an ARAMCO community school in Dammam seeking a specialist educator — Abjad
          is your trusted hiring partner across all of Saudi Arabia.
        </p>
      </div>
    </section>
  );
}
