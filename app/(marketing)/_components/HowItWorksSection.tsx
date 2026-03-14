"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserCircle2,
  Search,
  Handshake,
  BriefcaseBusiness,
  SlidersHorizontal,
  BadgeCheck,
  Clock3,
  Star,
  MapPin,
  Bell,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

/* ── Bilingual step data ─────────────────────────────── */
const teacherStepsEn = [
  {
    icon: UserCircle2, step: "01",
    title: "Build your profile",
    desc: "Add your qualifications, subjects, teaching experience, and certifications. Your profile is your CV — no uploads or formatting needed.",
    pills: ["Subjects & grades", "Location preferences", "Salary range"],
  },
  {
    icon: Search, step: "02",
    title: "Discover matched roles",
    desc: "Browse roles curated for your profile. Filter by city, school type, curriculum, and contract type. Save searches and get instant alerts.",
    pills: ["Smart filters", "Saved searches", "Job alerts"],
  },
  {
    icon: Bell, step: "03",
    title: "Apply in one click",
    desc: "Your profile is always ready. Hit apply and your details go straight to the school — no cover letters, no forms to fill ever again.",
    pills: ["Instant apply", "Track applications", "Interview scheduling"],
  },
  {
    icon: Handshake, step: "04",
    title: "Get hired & start",
    desc: "Chat with the school, accept an offer, and onboard — all inside Abjad. Most teachers hear back within 72 hours of applying.",
    pills: ["In-app messaging", "Offer management", "Avg. 72h response"],
  },
];

const teacherStepsAr = [
  {
    icon: UserCircle2, step: "٠١",
    title: "أنشئ ملفك الشخصي",
    desc: "أضف مؤهلاتك ومواد تخصصك وخبرتك التدريسية وشهاداتك. ملفك الشخصي هو سيرتك الذاتية — لا حاجة لرفع ملفات أو تنسيق.",
    pills: ["المواد والمراحل الدراسية", "تفضيلات الموقع", "الراتب المتوقع"],
  },
  {
    icon: Search, step: "٠٢",
    title: "اكتشف الوظائف المناسبة",
    desc: "تصفّح الوظائف المُختارة لك بناءً على ملفك. صفّها حسب المدينة ونوع المدرسة والمنهج ونوع العقد. احفظ بحثك واحصل على تنبيهات فورية.",
    pills: ["فلاتر ذكية", "بحوث محفوظة", "تنبيهات وظيفية"],
  },
  {
    icon: Bell, step: "٠٣",
    title: "قدّم بنقرة واحدة",
    desc: "ملفك جاهز دائماً. اضغط تقدّم وستصل بياناتك إلى المدرسة مباشرةً — بدون خطابات تغطية أو نماذج لتعبئتها.",
    pills: ["تقديم فوري", "متابعة الطلبات", "جدولة المقابلات"],
  },
  {
    icon: Handshake, step: "٠٤",
    title: "احصل على وظيفة وابدأ",
    desc: "تواصل مع المدرسة واقبل العرض وابدأ الإلحاق — كل ذلك داخل أبجد. معظم المعلمين يتلقون رداً خلال 72 ساعة من التقديم.",
    pills: ["مراسلة داخل المنصة", "إدارة العروض", "متوسط الرد 72 ساعة"],
  },
];

const schoolStepsEn = [
  {
    icon: BriefcaseBusiness, step: "01",
    title: "Post your vacancy",
    desc: "Create a detailed job listing in under 5 minutes. Set the curriculum, grade level, location, and contract terms — and go live instantly.",
    pills: ["5-min setup", "Multiple vacancies", "Draft & schedule"],
  },
  {
    icon: SlidersHorizontal, step: "02",
    title: "Get AI-ranked candidates",
    desc: "Our matching engine surfaces the most relevant teacher profiles for your role — ranked by subject fit, location, and years of experience.",
    pills: ["AI matching", "Relevance ranking", "Shortlist tools"],
  },
  {
    icon: Users, step: "03",
    title: "Review & interview",
    desc: "Browse candidate profiles, review qualifications, and schedule interviews directly in the platform. No back-and-forth emails required.",
    pills: ["Profile deep-dives", "Integrated scheduling", "Panel notes"],
  },
  {
    icon: BadgeCheck, step: "04",
    title: "Hire with confidence",
    desc: "Extend offers, finalise contracts, and onboard your new hire — all from one dashboard. Every candidate on Abjad is verified.",
    pills: ["Verified candidates", "Offer letters", "Onboarding checklist"],
  },
];

const schoolStepsAr = [
  {
    icon: BriefcaseBusiness, step: "٠١",
    title: "انشر وظيفتك الشاغرة",
    desc: "أنشئ إعلان وظيفة مفصّلاً في أقل من 5 دقائق. حدّد المنهج والمرحلة الدراسية والموقع وشروط العقد — وانشر فوراً.",
    pills: ["إعداد في 5 دقائق", "وظائف متعددة", "حفظ ونشر لاحق"],
  },
  {
    icon: SlidersHorizontal, step: "٠٢",
    title: "احصل على مرشّحين مصنّفين بالذكاء الاصطناعي",
    desc: "يُحضر محرك المطابقة لدينا أكثر ملفات المعلمين ملاءمةً لوظيفتك — مرتّبة حسب التخصص والموقع وسنوات الخبرة.",
    pills: ["مطابقة ذكية", "ترتيب حسب الملاءمة", "أدوات القائمة المختصرة"],
  },
  {
    icon: Users, step: "٠٣",
    title: "راجع وأجرِ المقابلات",
    desc: "تصفّح الملفات الشخصية وراجع المؤهلات وجدوِل المقابلات مباشرةً داخل المنصة. لا مراسلات بريد إلكتروني ذهاباً وإياباً.",
    pills: ["استعراض الملفات", "جدولة مدمجة", "ملاحظات اللجنة"],
  },
  {
    icon: BadgeCheck, step: "٠٤",
    title: "وظّف بثقة",
    desc: "أرسل العروض وأتمّ العقود وأدخل موظفك الجديد إلى العمل — كل ذلك من لوحة تحكم واحدة. كل مرشح على أبجد موثّق.",
    pills: ["مرشحون موثّقون", "خطابات العروض", "قائمة الإلحاق"],
  },
];

const teacherHighlightsEn = [
  { icon: Clock3,  label: "Avg. 3 days to first interview" },
  { icon: Star,    label: "4.9 / 5 teacher satisfaction" },
  { icon: MapPin,  label: "Roles across all Saudi cities" },
];
const teacherHighlightsAr = [
  { icon: Clock3,  label: "متوسط 3 أيام للمقابلة الأولى" },
  { icon: Star,    label: "4.9 / 5 رضا المعلمين" },
  { icon: MapPin,  label: "وظائف في جميع مدن المملكة" },
];

const schoolHighlightsEn = [
  { icon: Clock3,     label: "Fill a role in under 2 weeks" },
  { icon: Sparkles,   label: "AI-ranked candidate lists" },
  { icon: BadgeCheck, label: "100% verified teacher profiles" },
];
const schoolHighlightsAr = [
  { icon: Clock3,     label: "شغل وظيفة في أقل من أسبوعين" },
  { icon: Sparkles,   label: "قوائم مرشحين مصنّفة بالذكاء الاصطناعي" },
  { icon: BadgeCheck, label: "100% ملفات معلمين موثّقة" },
];

type Tab = "teachers" | "schools";

export default function HowItWorksSection() {
  const { isRTL } = useTranslation();
  const [tab, setTab]       = useState<Tab>("teachers");
  const [active, setActive] = useState(0);

  const teacherSteps = isRTL ? teacherStepsAr : teacherStepsEn;
  const schoolSteps  = isRTL ? schoolStepsAr  : schoolStepsEn;
  const teacherHighlights = isRTL ? teacherHighlightsAr : teacherHighlightsEn;
  const schoolHighlights  = isRTL ? schoolHighlightsAr  : schoolHighlightsEn;

  const steps      = tab === "teachers" ? teacherSteps      : schoolSteps;
  const highlights = tab === "teachers" ? teacherHighlights : schoolHighlights;
  const ctaHref    = tab === "teachers" ? "/register?role=teacher" : "/register?role=school";
  const ctaLabel   = tab === "teachers"
    ? (isRTL ? "ابحث عن وظيفة تدريس" : "Find teaching jobs")
    : (isRTL ? "انشر وظيفة شاغرة" : "Post a vacancy");

  const current = steps[active];

  function switchTab(t: Tab) {
    setTab(t);
    setActive(0);
  }

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#f8fafc] py-24">

      {/* Subtle blobs */}
      <div className="absolute -top-40 -left-40 w-125 h-125 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(10,191,188,0.06) 0%, transparent 70%)" }} />
      <div className="absolute -bottom-32 -right-32 w-100 h-100 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(10,191,188,0.05) 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "rgba(10,191,188,0.1)", color: "#0ABFBC" }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: "#0ABFBC" }} />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: "#0ABFBC" }} />
              </span>
              {isRTL ? "كيف يعمل" : "How it works"}
            </span>
            <h2
              className="font-extrabold text-gray-950 tracking-tight"
              style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: isRTL ? "0" : "-0.03em", lineHeight: 1.1 }}
            >
              {isRTL ? "جاهز للعمل" : "Up and running"}{" "}
              <span style={{ color: "#0ABFBC" }}>{isRTL ? "في أربع خطوات" : "in four steps"}</span>
            </h2>
          </div>

          {/* Tab switcher — top-right on desktop */}
          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-white border border-gray-200 shadow-sm self-start lg:self-auto shrink-0">
            {(["teachers", "schools"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                style={
                  tab === t
                    ? { backgroundColor: "#0ABFBC", color: "#fff", boxShadow: "0 4px 14px rgba(10,191,188,0.35)" }
                    : { color: "#6b7280" }
                }
              >
                {t === "teachers"
                  ? (isRTL ? "للمعلمين" : "For Teachers")
                  : (isRTL ? "للمدارس" : "For Schools")}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main panel ── */}
        <div className="grid lg:grid-cols-5 gap-4 lg:gap-6 items-stretch">

          {/* Left — step selector list */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.step}
                  onClick={() => setActive(i)}
                  className="group w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200"
                  style={
                    isActive
                      ? { backgroundColor: "#0ABFBC", boxShadow: "0 6px 20px rgba(10,191,188,0.3)" }
                      : { backgroundColor: "white", border: "1px solid #f0f0f0" }
                  }
                >
                  {/* Step number pill */}
                  <span
                    className="text-xs font-black tabular-nums shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                    style={
                      isActive
                        ? { backgroundColor: "rgba(255,255,255,0.2)", color: "white" }
                        : { backgroundColor: "rgba(10,191,188,0.08)", color: "#0ABFBC" }
                    }
                  >
                    {s.step}
                  </span>

                  {/* Title */}
                  <span
                    className="font-bold text-sm leading-snug flex-1"
                    style={{ color: isActive ? "white" : "#111827" }}
                  >
                    {s.title}
                  </span>

                  {/* Arrow */}
                  <ArrowRight
                    size={15}
                    className="shrink-0 transition-all duration-200"
                    style={{
                      color: isActive ? "rgba(255,255,255,0.7)" : "rgba(10,191,188,0)",
                      transform: isActive ? "translateX(0)" : "translateX(-4px)",
                    }}
                  />
                </button>
              );
            })}

            {/* Highlights */}
            <div className="mt-2 pt-5 border-t border-gray-200 flex flex-col gap-3">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-center gap-2.5">
                  <h.icon size={14} style={{ color: "#0ABFBC" }} strokeWidth={2} />
                  <span className="text-xs font-semibold text-gray-500">{h.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — active step detail */}
          <div
            className="lg:col-span-3 rounded-3xl p-8 lg:p-10 relative overflow-hidden flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, white 0%, #f8fffe 100%)",
              border: "1px solid rgba(10,191,188,0.12)",
              minHeight: "360px",
            }}
          >
            {/* Large faint step number watermark */}
            <span
              className="absolute -bottom-4 -right-2 font-black select-none pointer-events-none leading-none"
              style={{ fontSize: "clamp(7rem,18vw,14rem)", color: "rgba(10,191,188,0.05)", lineHeight: 1 }}
            >
              {current.step}
            </span>

            <div className="relative z-10">
              {/* Icon + step label row */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(10,191,188,0.1)" }}
                >
                  <current.icon size={22} style={{ color: "#0ABFBC" }} strokeWidth={1.8} />
                </div>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#0ABFBC" }}>
                  {isRTL ? `الخطوة ${current.step} من ${steps.length}` : `Step ${current.step} of ${steps.length}`}
                </span>
              </div>

              {/* Title */}
              <h3
                className="font-extrabold text-gray-950 mb-3 tracking-tight"
                style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.75rem)", letterSpacing: "-0.02em" }}
              >
                {current.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 leading-relaxed mb-6" style={{ fontSize: "0.9375rem" }}>
                {current.desc}
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {current.pills.map((pill) => (
                  <span
                    key={pill}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ color: "#089E9B", backgroundColor: "rgba(10,191,188,0.08)" }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom row — progress dots + CTA */}
            <div className="relative z-10 flex items-center justify-between">
              {/* Step dots */}
              <div className="flex items-center gap-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width:  i === active ? "24px" : "8px",
                      height: "8px",
                      backgroundColor: i === active ? "#0ABFBC" : "rgba(10,191,188,0.2)",
                    }}
                  />
                ))}
              </div>

              <Link
                href={ctaHref}
                className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: "#0ABFBC", boxShadow: "0 4px 14px rgba(10,191,188,0.3)" }}
              >
                {ctaLabel} <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Wave */}
      <div className="relative z-10 -mb-px mt-8">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" className="w-full block" style={{ height: "60px" }}>
          <path d="M0 60V35C240 5 480 55 720 35C960 15 1200 50 1440 30V60H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}