import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden"
      style={{ background: "var(--brand-gradient)" }}>

      {/* Decorative circles */}
      <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/4 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-175 h-175 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(0,172,211,0.12) 0%, transparent 65%)" }} />

      {/* Dot grid overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-10 pt-36 pb-20 text-center">

        {/* Location badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white/80 text-xs font-semibold tracking-widest uppercase mb-10">
          <MapPin size={12} />
          Riyadh · Jeddah · Dammam — Saudi Arabia
        </div>

        {/* Eyebrow label */}
        <p className="text-white/50 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
          About
        </p>

        {/* Logo */}
        <div className="flex justify-center mb-5">
          <Image
            src="/ABJAD.png"
            alt="Abjad"
            width={260}
            height={78}
            className="h-16 w-auto object-contain brightness-0 invert"
            priority
          />
        </div>

        {/* Headline */}
        <h1
          className="font-bold text-white/85 mb-8 leading-snug"
          style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)" }}
        >
          Empowering Education Excellence
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-16 bg-white/20 rounded-full" />
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--brand-accent)" }} />
          <span className="h-px w-16 bg-white/20 rounded-full" />
        </div>

        {/* Sub-headline */}
        <p className="text-white/70 text-lg leading-relaxed mx-auto mb-5" style={{ maxWidth: "52ch" }}>
          Abjad connects teachers, substitute teachers, and schools across Riyadh, Jeddah, and Dammam,
          building a future where education staffing is faster, smarter, and more reliable.
        </p>

        <p className="text-white/50 text-base leading-relaxed mx-auto mb-12" style={{ maxWidth: "58ch" }}>
          From international schools to high schools and community learning centers, Abjad bridges
          the gap between qualified educators and institutions that value excellence.
        </p>

        {/* CTA */}
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-white font-bold text-sm px-8 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-0.5"
          style={{ color: "var(--brand-primary-dark)" }}
        >
          Join Today <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

