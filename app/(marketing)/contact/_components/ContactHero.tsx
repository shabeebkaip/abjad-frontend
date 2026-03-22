import Link from "next/link";
import { ArrowRight, Phone, Mail } from "lucide-react";

export default function ContactHero() {
  return (
    <section
      className="relative overflow-hidden pt-36 pb-0"
      style={{ background: "var(--brand-gradient)" }}
    >
      {/* Background decoration */}
      <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute top-1/2 -left-24 w-96 h-96 rounded-full bg-white/3 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-80 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(0,172,211,0.15) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-8">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          Matching Schools &amp; Educators Nationwide
        </div>

        {/* H1 */}
        <h1
          className="font-extrabold text-white leading-[1.06] mb-6"
          style={{ fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", letterSpacing: "-0.03em" }}
        >
          Contact Abjad: Hire Teachers &amp;{" "}
          <span style={{ color: "var(--brand-accent)" }}>Educators Easily</span>
        </h1>

        <p className="text-white/75 text-lg leading-relaxed mb-4 mx-auto" style={{ maxWidth: "56ch" }}>
          Connect your school with qualified substitute teachers and educators across Saudi Arabia.
        </p>

        <p className="text-white/55 text-base leading-relaxed mb-10 mx-auto" style={{ maxWidth: "68ch" }}>
          At Abjad, we specialize in connecting international schools, high schools, and local institutions
          throughout the Kingdom with vetted substitute teachers and professional educators. Whether
          you&apos;re a school searching for reliable teaching staff or an educator looking for short-term
          or long-term assignments, Abjad is your trusted platform for seamless hiring and placement
          across Saudi Arabia.
        </p>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
          <Link
            href="#contact-form"
            className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-3.5 rounded-full transition-all hover:shadow-2xl hover:shadow-black/25 hover:-translate-y-0.5"
            style={{ color: "var(--brand-primary-dark)" }}
          >
            Get Started <ArrowRight size={16} />
          </Link>
          <a
            href="tel:+966110000000"
            className="inline-flex items-center gap-2 bg-white/12 border border-white/25 text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/20 transition-all"
          >
            <Phone size={14} /> Call Us
          </a>
          <a
            href="mailto:hello@abjad.sa"
            className="inline-flex items-center gap-2 bg-white/12 border border-white/25 text-white font-semibold text-sm px-6 py-3.5 rounded-full hover:bg-white/20 transition-all"
          >
            <Mail size={14} /> Email Us
          </a>
        </div>
      </div>

      {/* Wave */}
      <div className="relative z-10 -mb-px">
        <svg viewBox="0 0 1440 70" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full block" style={{ height: "70px" }}>
          <path d="M0 70V40C360 5 720 70 1080 38C1260 20 1380 50 1440 40V70H0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
