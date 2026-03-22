"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Zap, BadgeCheck, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

/* Floating tags that drift slowly in the background */
const TAGS_EN = [
  "Math Teacher", "Science", "Riyadh", "Jeddah", "English Teacher",
  "Primary School", "Secondary", "Arabic", "Physics", "Biology",
  "Special Needs", "Dammam", "PE Teacher", "Art", "Music",
  "Full-Time", "Part-Time", "International", "STEM", "IGCSE",
  "IB Curriculum", "Khobar", "History", "Chemistry", "Kindergarten",
];
const TAGS_AR = [
  "معلم رياضيات", "علوم", "الرياض", "جدة", "معلم لغة إنجليزية",
  "مرحلة ابتدائية", "مرحلة ثانوية", "لغة عربية", "فيزياء", "أحياء",
  "تربية خاصة", "الدمام", "معلم تربية بدنية", "فنون", "موسيقى",
  "دوام كامل", "دوام جزئي", "مدارس دولية", "STEM", "IGCSE",
  "مناهج IB", "الخبر", "تاريخ", "كيمياء", "رياض أطفال",
];

interface TagProps { label: string; style: React.CSSProperties }

function FloatingTag({ label, style }: TagProps) {
  return (
    <span
      className="absolute px-3.5 py-1.5 rounded-full text-sm font-medium border select-none pointer-events-none whitespace-nowrap"
      style={{
        color: "var(--brand-primary)",
        borderColor: "rgba(0,172,211,0.25)",
        backgroundColor: "rgba(0,172,211,0.06)",
        ...style,
      }}
    >
      {label}
    </span>
  );
}

export default function HeroSection() {
  const { t, isRTL } = useTranslation();
  const tags = isRTL ? TAGS_AR : TAGS_EN;

  /* Subtle parallax on mouse move */
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const { innerWidth: W, innerHeight: H } = window;
      const dx = (e.clientX / W - 0.5) * 18;
      const dy = (e.clientY / H - 0.5) * 12;
      bgRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Tag positions — deterministic so SSR matches client */
  const tagPositions: React.CSSProperties[] = [
    { top: "8%",  left: "4%" },
    { top: "14%", left: "62%" },
    { top: "6%",  left: "78%" },
    { top: "22%", left: "88%" },
    { top: "34%", left: "2%" },
    { top: "28%", left: "72%" },
    { top: "48%", left: "90%" },
    { top: "55%", left: "5%" },
    { top: "62%", left: "68%" },
    { top: "70%", left: "18%" },
    { top: "76%", left: "82%" },
    { top: "82%", left: "38%" },
    { top: "88%", left: "60%" },
    { top: "18%", left: "28%" },
    { top: "42%", left: "78%" },
    { top: "58%", left: "44%" },
    { top: "72%", left: "3%"  },
    { top: "10%", left: "44%" },
    { top: "36%", left: "52%" },
    { top: "64%", left: "84%" },
    { top: "80%", left: "12%" },
    { top: "90%", left: "72%" },
    { top: "46%", left: "20%" },
    { top: "26%", left: "8%"  },
    { top: "50%", left: "56%" },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">

      {/* ── Floating tags layer ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform transition-transform duration-120 ease-out"
        aria-hidden="true"
      >
        {tags.map((label, i) => (
          <FloatingTag key={i} label={label} style={tagPositions[i] ?? { top: "50%", left: "50%" }} />
        ))}
      </div>

      {/* Radial vignette — fades tags toward center so headline reads clean */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 65% 70% at 50% 46%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 55%, transparent 100%)",
        }}
      />

      {/* ── Main content — centered ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-12">

        {/* Live badge */}
        <div className="fade-in-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-8"
          style={{ borderColor: "rgba(13,37,66,0.25)", color: "var(--brand-primary)", backgroundColor: "rgba(13,37,66,0.06)" }}>
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          Empower Schools, Empower Educators
        </div>

        {/* Headline */}
        <h1
          className="fade-in-up-2 font-extrabold text-gray-950 leading-[1.06] mb-6 max-w-4xl"
          style={{
            fontSize: "clamp(2.6rem, 6vw, 5rem)",
            letterSpacing: isRTL ? "0" : "-0.03em",
          }}
        >
          Connect with the{" "}
          <span style={{ color: "var(--brand-accent)" }}>Best Teachers</span>{" "}
          <br className="hidden sm:block" />
          <span className="relative inline-block">
            and Schools in Saudi Arabia
            <svg
              className="absolute -bottom-2 inset-s-0 w-full"
              viewBox="0 0 300 12"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M2 8 Q75 2 150 7 Q225 12 298 5"
                stroke="var(--brand-accent)"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="fade-in-up-3 text-gray-500 text-lg leading-relaxed mb-10"
          style={{ maxWidth: "52ch" }}
        >
          Whether you are an educator or an international school in Riyadh, Jeddah, or Dammam, Abjad helps you find the perfect match instantly.
        </p>

        {/* CTA buttons */}
        <div className="fade-in-up-4 flex items-center gap-4 flex-wrap justify-center mb-16">
          <Link
            href="/register"
            className="px-8 py-3.5 rounded-full font-bold text-base text-white transition-all duration-200 hover:scale-105 hover:shadow-xl shadow-lg"
            style={{ backgroundColor: "var(--brand-primary)", boxShadow: "0 8px 24px var(--brand-primary-glow)" }}
          >
            Join Now
          </Link>
        </div>

        {/* Value props */}
        <div className="fade-in-up-5 flex items-center gap-px rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
          {(isRTL ? [
            { icon: <Zap size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "توظيف في أيام",      sub: "لا أشهر من الانتظار" },
            { icon: <BadgeCheck size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "مدارس موثّقة فقط", sub: "كل مدرسة تمر بمراجعتنا" },
            { icon: <SlidersHorizontal size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "توافق دقيق",    sub: "حسب مادتك ومدينتك" },
          ] : [
            { icon: <Zap size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "Hired in days",         sub: "Not months of waiting" },
            { icon: <BadgeCheck size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "Verified schools",  sub: "Every school is reviewed" },
            { icon: <SlidersHorizontal size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "Precise matching", sub: "By subject, grade & city" },
          ]).map((p, i) => (
            <div
              key={i}
              className={`flex flex-col items-center text-center px-7 py-5 ${
                i < 2 ? "border-e border-gray-100" : ""
              }`}
            >
              <div className="mb-2">{p.icon}</div>
              <span className="text-sm font-bold text-gray-800 whitespace-nowrap">{p.title}</span>
              <span className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{p.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Wave into next section ── */}
      <div className="relative z-10 -mb-px">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: "60px" }}
        >
          <path d="M0 60V30C360 0 720 60 1080 30C1260 15 1380 30 1440 30V60H0Z" fill="#f8fafc" />
        </svg>
      </div>
    </section>
  );
}
