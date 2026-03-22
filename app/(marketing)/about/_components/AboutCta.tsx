import Link from "next/link";
import { ArrowRight, GraduationCap, School } from "lucide-react";

export default function AboutCta() {
  return (
    <section className="bg-[#f8fafc] py-24">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">

        {/* Top "Empowering" block */}
        <div
          className="relative rounded-3xl p-10 lg:p-14 overflow-hidden mb-8"
          style={{ background: "var(--brand-gradient)" }}
        >
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/6 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/4 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 mb-5">
                For Every Educator & School
              </span>
              <h2
                className="font-extrabold text-white mb-4"
                style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)", letterSpacing: "-0.03em" }}
              >
                Empowering Teachers and Schools Across Saudi Arabia
              </h2>
              <p className="text-white/70 text-base leading-relaxed">
                Whether you are an educator seeking your next teaching role or a school leader searching
                for the right talent, Abjad connects you with opportunities that match your vision,
                values, and goals.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4">
              <Link
                href="/register?role=teacher"
                className="flex-1 flex items-center justify-center gap-2 bg-white font-bold text-sm px-6 py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 text-center"
                style={{ color: "var(--brand-primary-dark)" }}
              >
                <GraduationCap size={17} />
                I&apos;m a Teacher
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/register?role=school"
                className="flex-1 flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-bold text-sm px-6 py-4 rounded-2xl hover:bg-white/25 transition-all text-center"
              >
                <School size={17} />
                I&apos;m a School
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom "Join the Future" card */}
        <div className="bg-white rounded-3xl border border-gray-100 p-10 lg:p-14 text-center shadow-sm">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: "var(--brand-accent-light)", color: "var(--brand-accent)" }}
          >
            🇸🇦 Join the Future
          </span>

          <h2
            className="font-extrabold text-gray-950 mb-4"
            style={{ fontSize: "clamp(1.7rem, 3.5vw, 2.8rem)", letterSpacing: "-0.03em" }}
          >
            Join the Future of Education{" "}
            <span style={{ color: "var(--brand-accent)" }}>in Saudi Arabia</span>
          </h2>

          <p className="text-gray-500 text-base leading-relaxed mb-3 max-w-2xl mx-auto">
            From Riyadh schools to Jeddah and Dammam, Abjad&apos;s smart matching system connects talent
            with opportunity.
          </p>

          {/* Three pillars */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-gray-600 mb-10">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "var(--brand-accent)" }} />
              Teachers grow their careers.
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "var(--brand-primary)" }} />
              Schools hire with confidence.
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: "#10b981" }} />
              Students benefit from excellence.
            </span>
          </div>

          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white transition-all hover:scale-105 hover:shadow-lg"
            style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 6px 20px var(--brand-primary-glow)" }}
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  );
}
