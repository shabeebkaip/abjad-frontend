"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { PHOTOS, usePhotoAlt } from "../../_components/PhotoStrip";
import RoleCtas from "./RoleCtas";

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

/* Deterministic positions so SSR matches the client. Kept to the page edges so tags frame the content. */
const TAG_POSITIONS: React.CSSProperties[] = [
  { top: "9%", insetInlineStart: "3%" }, { top: "15%", insetInlineStart: "40%" }, { top: "6%", insetInlineStart: "62%" },
  { top: "20%", insetInlineEnd: "2%" }, { top: "33%", insetInlineStart: "1%" }, { top: "88%", insetInlineStart: "46%" },
  { top: "47%", insetInlineEnd: "1%" }, { top: "55%", insetInlineStart: "2%" }, { top: "92%", insetInlineEnd: "24%" },
  { top: "72%", insetInlineStart: "4%" }, { top: "76%", insetInlineEnd: "2%" }, { top: "84%", insetInlineStart: "22%" },
  { top: "94%", insetInlineStart: "6%" }, { top: "4%", insetInlineStart: "22%" }, { top: "34%", insetInlineEnd: "3%" },
  { top: "62%", insetInlineEnd: "3%" }, { top: "44%", insetInlineStart: "3%" }, { top: "4%", insetInlineEnd: "14%" },
  { top: "90%", insetInlineEnd: "4%" }, { top: "82%", insetInlineEnd: "40%" }, { top: "64%", insetInlineStart: "1%" },
  { top: "12%", insetInlineEnd: "30%" }, { top: "24%", insetInlineStart: "2%" }, { top: "96%", insetInlineStart: "34%" },
  { top: "70%", insetInlineEnd: "1%" },
];

export default function HeroSection() {
  const { t, isRTL } = useTranslation();
  const tags = isRTL ? TAGS_AR : TAGS_EN;
  const alt = usePhotoAlt();

  /* Subtle parallax on the keyword layer. Off for reduced motion and touch. */
  const bgRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (!bgRef.current) return;
      const dx = (e.clientX / window.innerWidth - 0.5) * 16;
      const dy = (e.clientY / window.innerHeight - 0.5) * 10;
      bgRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section className="relative lg:min-h-[100dvh] flex flex-col overflow-hidden bg-[#f7f9fb]">
      {/* Keyword layer */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out opacity-30 sm:opacity-60"
        aria-hidden="true"
      >
        {tags.map((label, i) => (
          <span
            key={i}
            className="absolute px-3.5 py-1.5 rounded-full text-sm font-medium border select-none whitespace-nowrap text-(--brand-primary)/70 border-(--brand-accent)/25 bg-white/60"
            style={TAG_POSITIONS[i]}
          >
            {label}
          </span>
        ))}
      </div>
      {/* Soft wash so tags never compete with the copy */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, #f7f9fb 0%, rgba(247,249,251,0.92) 55%, rgba(247,249,251,0) 100%)" }}
      />

      <div className="relative flex-1 flex items-center w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-24 lg:pt-24 pb-14 lg:pb-16">
        <div className="grid w-full lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-6 flex flex-col items-center text-center lg:items-start lg:text-start">
            {/* Role CTAs: first thing under the nav on mobile, after the copy on desktop (feedback R1 §1.7, §2) */}
            <RoleCtas className="fade-in-up-1 order-first lg:order-last max-w-xl mb-9 lg:mb-0" />

            <p className="fade-in-up-1 text-sm font-semibold text-(--brand-accent-dark) mb-4">
              {t.hero.badge}
            </p>

            <h1
              className="font-extrabold text-(--brand-primary) leading-[1.1] mb-6 text-balance"
              style={{ fontSize: "clamp(2.1rem, 3.6vw, 3.25rem)", letterSpacing: isRTL ? "0" : "-0.025em" }}
            >
              {t.hero.headlinePre} {t.hero.headlineAccent} {t.hero.headlineMid}{" "}
              <span className="relative inline-block">
                {t.hero.headlineUnderline}
                <svg
                  className="absolute inset-x-0 w-full"
                  style={{ bottom: "-0.18em", height: "0.32em" }}
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 8 Q75 2 150 7 Q225 12 298 5" stroke="var(--brand-accent)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="fade-in-up-3 text-gray-600 text-base sm:text-lg leading-relaxed max-w-[46ch] lg:mb-9">
              {t.hero.sub}
            </p>
          </div>

          {/* Photos: children first (feedback R1 §1.5) */}
          <div className="fade-in-up-3 lg:col-span-6 grid grid-cols-5 gap-3 w-full max-w-xl mx-auto lg:max-w-none">
            <div className="relative col-span-5 aspect-3/2 rounded-3xl overflow-hidden shadow-[0_24px_60px_-28px_rgba(13,37,66,0.55)]">
              <Image src={PHOTOS.classroom.src} alt={alt("classroom")} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="relative hidden sm:block col-span-3 aspect-16/10 rounded-2xl overflow-hidden">
              <Image src={PHOTOS.femaleTeacher.src} alt={alt("femaleTeacher")} fill sizes="(min-width: 1024px) 27vw, 60vw" className="object-cover" />
            </div>
            <div className="relative hidden sm:block col-span-2 rounded-2xl overflow-hidden">
              <Image src={PHOTOS.maleTeacher.src} alt={alt("maleTeacher")} fill sizes="(min-width: 1024px) 18vw, 40vw" className="object-cover object-top" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
