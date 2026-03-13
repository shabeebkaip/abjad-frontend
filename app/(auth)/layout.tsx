import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, BadgeCheck, MousePointerClick, type LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Abjad – Auth",
};

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Sparkles,
    title: "Smart Matching",
    desc: "Tell us your subject, grade level, and location — we surface roles that genuinely fit you.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Schools",
    desc: "Every institution on Abjad is reviewed and approved before posting a single vacancy.",
  },
  {
    icon: MousePointerClick,
    title: "One-Click Apply",
    desc: "Your profile is your CV. Apply to any job in seconds, track every application in one place.",
  },
];



export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ── Left brand panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(145deg, #0e8f96 0%, #2bbdc5 45%, #1aa6ae 100%)" }}
        />

        {/* Subtle dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        {/* Cross/plus grid overlay — matches hero */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Blur blobs */}
        <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-100 h-100 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: "#ffffff" }} />
        <div className="absolute bottom-10 -left-10 w-72 h-72 rounded-full opacity-15 blur-3xl" style={{ backgroundColor: "#0a5c62" }} />

        {/* Floating rings */}
        <div className="absolute top-16 right-16 w-32 h-32 rounded-full border border-white/15" />
        <div className="absolute top-24 right-24 w-16 h-16 rounded-full border border-white/10" />
        <div className="absolute bottom-28 left-10 w-24 h-24 rounded-full border border-white/10" />
        <div className="absolute bottom-36 left-16 w-10 h-10 rounded-full border border-white/15" />

        {/* Small scattered dots */}
        <div className="absolute top-1/3 right-8 w-2 h-2 rounded-full bg-white/25" />
        <div className="absolute top-1/3 right-14 w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="absolute top-2/3 left-8 w-2 h-2 rounded-full bg-white/25" />
        <div className="absolute top-2/3 left-16 w-1 h-1 rounded-full bg-white/20" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 py-14">
          {/* Logo */}
          <div>
            <Image
              src="/ABJAD.png"
              alt="Abjad"
              width={140}
              height={42}
              className="h-10 w-auto object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              priority
            />
          </div>

          {/* Centre copy */}
          <div className="flex-1 flex flex-col justify-center max-w-sm">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-3.5 py-1.5 rounded-full mb-8 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              Saudi Arabia&apos;s #1 Education Hiring Platform
            </div>

            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
              Where Great<br />
              <span className="text-white/75">Teachers Meet</span><br />
              Great Schools
            </h1>

            <p className="text-white/70 text-base leading-relaxed">
              Join thousands of educators building meaningful careers across the Kingdom.
            </p>

            {/* Feature cards */}
            <div className="mt-10 space-y-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="flex items-start gap-3.5 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-3.5 hover:bg-white/15 transition-colors"
                >
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white/15 shrink-0">
                    <f.icon size={15} className="text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{f.title}</p>
                    <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5">
            <p className="text-white/90 text-sm leading-relaxed italic mb-3">
              &ldquo;I found my ideal teaching position at an international school in Riyadh within two weeks of joining Abjad.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <div>
                <p className="text-white font-medium text-xs">Sara Al-Harbi</p>
                <p className="text-white/50 text-xs">Mathematics Teacher · Riyadh</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-300 text-sm">★</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto relative">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #2bbdc5 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Top-right cyan accent blob */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, #2bbdc525 0%, transparent 70%)" }}
        />

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
          <Image
            src="/ABJAD.png"
            alt="Abjad"
            width={100}
            height={30}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>

        {/* Form centred */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 relative z-10">
          <div className="w-full max-w-sm">
            {children}

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-4">Trusted by educators and institutions across the Kingdom</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-base">🔒</span> Secure & private
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-base">✅</span> Verified schools only
                </div>
                <div className="w-px h-3 bg-gray-200" />
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="text-base">🇸🇦</span> Built for KSA
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-slate-400 pb-6 px-6 relative z-10">
          © {new Date().getFullYear()} Abjad · Built in Saudi Arabia 🇸🇦
        </p>
      </div>
    </div>
  );
}

