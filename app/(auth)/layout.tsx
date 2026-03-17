import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";

export const metadata: Metadata = {
  title: "Abjad – Auth",
};

const STATS = [
  { value: "12k+", label: "Teachers placed" },
  { value: "800+", label: "Partner schools" },
  { value: "72h",  label: "Avg. time to offer" },
];



export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      <LanguageToggle />
      {/* ── Left brand panel ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col">
        {/* Base gradient — deep navy to dark indigo */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(145deg, #071729 0%, #0D2542 40%, #1a1f4e 100%)" }}
        />

        {/* Fine dot grid — accent-tinted, very subtle */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,172,211,0.18) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            opacity: 0.5,
          }}
        />

        {/* Sky-blue accent glow — top left */}
        <div
          className="absolute -top-32 -left-32 w-125 h-125 rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,172,211,0.18) 0%, transparent 65%)" }}
        />
        {/* Indigo glow — bottom right */}
        <div
          className="absolute -bottom-40 -right-20 w-105 h-105 rounded-full blur-[100px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(68,72,130,0.45) 0%, transparent 65%)" }}
        />
        {/* Soft sky glow — mid panel */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(0,172,211,0.06) 0%, transparent 70%)" }}
        />

        {/* Floating rings — accent-tinted */}
        <div className="absolute top-16 right-16 w-36 h-36 rounded-full" style={{ border: "1px solid rgba(0,172,211,0.12)" }} />
        <div className="absolute top-24 right-24 w-18 h-18 rounded-full" style={{ border: "1px solid rgba(0,172,211,0.08)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-14 py-14">
          {/* Logo */}
          <Link href="/" className="w-fit">
            <Image
              src="/ABJAD.png"
              alt="Abjad"
              width={140}
              height={42}
              className="h-10 w-auto object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              priority
            />
          </Link>

          {/* Centre copy */}
          <div className="flex-1 flex flex-col justify-center max-w-xs">

            <h1 className="text-[2.6rem] font-bold text-white leading-[1.1] tracking-tight mb-5">
              Where Great<br />
              <span style={{ color: "var(--brand-accent)" }}>Teachers</span><br />
              Meet Schools
            </h1>

            <p className="text-sm leading-relaxed mb-12" style={{ color: "rgba(255,255,255,0.45)" }}>
              Saudi Arabia&apos;s education hiring platform — built for teachers and schools across the Kingdom.
            </p>

            {/* Minimal stat row */}
            <div className="flex items-center gap-8">
              {STATS.map((s, i) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>{s.label}</p>
                  {i < STATS.length - 1 && (
                    <div className="hidden" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom testimonial — minimal */}
          <div className="pb-2">
            <div
              className="h-px mb-6"
              style={{ background: "linear-gradient(90deg, rgba(0,172,211,0.20), transparent)" }}
            />
            <p className="text-sm leading-relaxed italic mb-4" style={{ color: "rgba(255,255,255,0.55)" }}>
              &ldquo;Found my ideal role in Riyadh within two weeks.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                style={{ backgroundColor: "rgba(0,172,211,0.20)", border: "1px solid rgba(0,172,211,0.30)" }}
              >
                S
              </div>
              <div>
                <p className="text-white text-xs font-medium">Sara Al-Harbi</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Mathematics Teacher · Riyadh</p>
              </div>
              <div className="ml-auto flex gap-px">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-xs">★</span>
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
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, var(--brand-accent) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Top-right brand accent blob */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--brand-accent-glow) 0%, transparent 70%)" }}
        />

        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
          <Link href="/">
            <Image
              src="/ABJAD.png"
              alt="Abjad"
              width={100}
              height={30}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>
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

