"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Zap, BadgeCheck, SlidersHorizontal, GraduationCap, School, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PHOTOS, usePhotoAlt } from "../../_components/PhotoStrip";

/* Floating background tags = primary search keywords (client feedback R1 §1.3) */
const TAGS_EN = [
  "Substitute Teachers", "Teaching Jobs Riyadh", "Teaching Jobs Jeddah", "Teaching Jobs Dammam", "Qualified Educators",
  "Private National Schools", "Private International Schools", "Teacher Recruitment KSA", "Hire Teachers", "Continuity in Learning",
  "IB Curriculum", "IGCSE", "American Curriculum", "British Curriculum", "Math Teachers",
  "Science Teachers", "English Teachers", "Arabic Teachers", "Verified Profiles", "Smart Matching",
  "Full-Time Teachers", "Short-Term Cover", "Early Years", "Special Needs", "Saudi Teachers",
];
const TAGS_AR = [
  "المعلمون البدلاء", "وظائف تدريس الرياض", "وظائف تدريس جدة", "وظائف تدريس الدمام", "معلمون مؤهلون",
  "المدارس الأهلية", "المدارس الدولية الخاصة", "توظيف المعلمين", "وظّف معلمين", "استمرارية التعليم",
  "منهج IB", "IGCSE", "المنهج الأمريكي", "المنهج البريطاني", "معلمو الرياضيات",
  "معلمو العلوم", "معلمو اللغة الإنجليزية", "معلمو اللغة العربية", "ملفات موثّقة", "مطابقة ذكية",
  "معلمون بدوام كامل", "تغطية قصيرة المدى", "الطفولة المبكرة", "التربية الخاصة", "معلمون سعوديون",
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
  const alt = usePhotoAlt();
  const flip = { transform: isRTL ? "scaleX(-1)" : undefined };

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
    <section className="relative sm:min-h-screen flex flex-col overflow-hidden bg-background">

      {/* ── Floating tags layer ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform transition-transform duration-120 ease-out opacity-40 sm:opacity-50"
        aria-hidden="true"
      >
        {tags.map((label, i) => (
          <FloatingTag key={i} label={label} style={tagPositions[i] ?? { top: "50%", left: "50%" }} />
        ))}
      </div>

      {/* Radial vignette — mobile: full-width strong coverage; desktop: soft elliptic */}
      <div
        className="absolute inset-0 pointer-events-none sm:hidden"
        style={{
          background: "radial-gradient(ellipse 120% 75% at 50% 46%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 55%, rgba(255,255,255,0.80) 80%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none hidden sm:block"
        style={{
          background: "radial-gradient(ellipse 80% 75% at 50% 48%, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.9) 60%, transparent 100%)",
        }}
      />

      {/* ── Main content — text + photos ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto px-6 lg:px-10 pt-24 sm:pt-28 lg:pt-32 pb-10 sm:pb-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center mb-8 sm:mb-14">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">

            {/* Role CTAs — first thing under the nav on mobile, after the copy on desktop (feedback R1 §1.7, §2) */}
            <div className="fade-in-up-1 order-first lg:order-last grid w-full max-w-xl grid-cols-1 sm:grid-cols-2 gap-3 mb-8 lg:mb-0">
              {[
                { href: "/register?role=teacher", icon: GraduationCap, label: t.hero.ctaTeacher, sub: t.hero.ctaTeacherSub, bg: "var(--brand-primary)" },
                { href: "/register?role=school", icon: School, label: t.hero.ctaSchool, sub: t.hero.ctaSchoolSub, bg: "linear-gradient(135deg, #0091b5 0%, #006f8e 100%)" },
              ].map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="group flex items-center gap-4 rounded-2xl px-5 py-4 text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--brand-accent)/40"
                  style={{ background: c.bg }}
                >
                  <span className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                    <c.icon size={22} strokeWidth={2.2} />
                  </span>
                  <span className="flex-1 text-start min-w-0">
                    <span className="block font-bold text-lg leading-tight">{c.label}</span>
                    <span className="block text-sm text-white/85 mt-0.5">{c.sub}</span>
                  </span>
                  <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" style={flip} />
                </Link>
              ))}
            </div>

            {/* Live badge */}
            <div className="fade-in-up-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-6"
              style={{ borderColor: "rgba(13,37,66,0.25)", color: "var(--brand-primary)", backgroundColor: "rgba(13,37,66,0.06)" }}>
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              {t.hero.badge}
            </div>

            {/* Headline */}
            <h1
              className="fade-in-up-2 font-extrabold text-gray-950 leading-[1.08] mb-6"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.4rem)",
                letterSpacing: isRTL ? "0" : "-0.03em",
              }}
            >
              {t.hero.headlinePre}{" "}
              <span style={{ color: "var(--brand-accent)" }}>{t.hero.headlineAccent}</span>{" "}
              {t.hero.headlineMid}{" "}
              <span className="relative inline-block">
                {t.hero.headlineUnderline}
                <svg
                  className="absolute left-0 right-0 w-full"
                  style={{ bottom: "-0.2em", height: "0.35em" }}
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
                    opacity="0.7"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtext */}
            <p
              className="fade-in-up-3 text-gray-600 text-base sm:text-lg leading-relaxed lg:mb-8"
              style={{ maxWidth: "52ch" }}
            >
              {t.hero.sub}
            </p>
          </div>

          {/* Photos — children first (feedback R1 §1.5) */}
          <div className="fade-in-up-3 grid grid-cols-2 gap-3 w-full max-w-xl mx-auto lg:max-w-none">
            <div className="relative col-span-2 aspect-3/2 rounded-3xl overflow-hidden shadow-xl">
              <Image src={PHOTOS.classroom.src} alt={alt("classroom")} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="relative hidden sm:block aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
              <Image src={PHOTOS.femaleTeacher.src} alt={alt("femaleTeacher")} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
            </div>
            <div className="relative hidden sm:block aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
              <Image src={PHOTOS.maleTeacher.src} alt={alt("maleTeacher")} fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover object-top" />
            </div>
          </div>
        </div>

        {/* Value props */}
        {(() => {
          const props = isRTL ? [
            { icon: <Zap size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "توظيف في أيام",      sub: "لا أشهر من الانتظار" },
            { icon: <BadgeCheck size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "مدارس موثّقة فقط", sub: "كل مدرسة تمر بمراجعتنا" },
            { icon: <SlidersHorizontal size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "توافق دقيق", sub: "حسب مادتك ومدينتك" },
          ] : [
            { icon: <Zap size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "Hired in days",      sub: "Not months of waiting" },
            { icon: <BadgeCheck size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "Verified schools", sub: "Every school is reviewed" },
            { icon: <SlidersHorizontal size={18} strokeWidth={2.5} style={{ color: "var(--brand-accent)" }} />, title: "Precise matching", sub: "By subject, grade & city" },
          ];
          return (
            <div className="fade-in-up-5 w-full max-w-2xl mx-auto rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
              {/* Mobile: vertical list */}
              <div className="flex flex-col sm:hidden divide-y divide-gray-100">
                {props.map((p, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gray-50">
                      {p.icon}
                    </div>
                    <div className="text-start min-w-0">
                      <p className="text-sm font-bold text-gray-800">{p.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: horizontal columns */}
              <div className="hidden sm:flex items-stretch divide-x divide-gray-100">
                {props.map((p, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center px-7 py-5 flex-1">
                    <div className="mb-2">{p.icon}</div>
                    <span className="text-sm font-bold text-gray-800 whitespace-nowrap">{p.title}</span>
                    <span className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{p.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
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
