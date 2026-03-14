"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Globe2,
  Star,
  BellRing,
  LineChart,
  Users2,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

/* ── Bilingual hero feature ── */
const heroFeatureEn = {
  icon: ShieldCheck,
  title: "Every profile is verified",
  desc: "Before any teacher or school appears on Abjad, they go through a thorough identity and credential check. No fake listings. No unqualified candidates. Just real opportunities with real people.",
  stat: "100%",
  statLabel: "verified accounts",
  cta: "Get started free",
};
const heroFeatureAr = {
  icon: ShieldCheck,
  title: "كل ملف شخصي موثّق",
  desc: "قبل أن يظهر أي معلم أو مدرسة على أبجد، يمرّون بفحص شامل للهوية والمؤهلات. لا إعلانات مزيّفة، لا مرشحون غير مؤهلين. فقط فرص حقيقية مع أشخاص حقيقيين.",
  stat: "100%",
  statLabel: "حسابات موثّقة",
  cta: "ابدأ مجاناً",
};

/* ── Bilingual feature grid ── */
const featuresEn = [
  { icon: Zap,       title: "Smart matching",        desc: "Algorithm pairs you by subject, grade, location, and contract type.",    color: "#f59e0b", bg: "#fef3c7" },
  { icon: Globe2,    title: "Region-wide reach",      desc: "Saudi Arabia, UAE, Kuwait and across the GCC.",                          color: "#6366f1", bg: "#eef2ff" },
  { icon: BellRing,  title: "Instant notifications",  desc: "Real-time alerts for new jobs and profile views.",                       color: "#ec4899", bg: "#fdf2f8" },
  { icon: LineChart, title: "Analytics dashboard",    desc: "Track listing performance and application statuses live.",               color: "#0e7a81", bg: "#f0fdfe" },
  { icon: Users2,    title: "Collaboration tools",    desc: "Messaging, scheduling, and document sharing — built in.",                color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: Star,      title: "Ratings & reviews",      desc: "Transparent feedback so the best naturally stand out.",                  color: "#f97316", bg: "#fff7ed" },
  { icon: Lock,      title: "Privacy first",          desc: "Full GDPR compliance and granular data controls.",                       color: "#10b981", bg: "#ecfdf5" },
];
const featuresAr = [
  { icon: Zap,       title: "مطابقة ذكية",             desc: "خوارزمية تجمع بينك وبين الفرص حسب التخصص والمرحلة والموقع ونوع العقد.",  color: "#f59e0b", bg: "#fef3c7" },
  { icon: Globe2,    title: "تغطية إقليمية واسعة",     desc: "المملكة العربية السعودية والإمارات والكويت وسائر دول الخليج.",             color: "#6366f1", bg: "#eef2ff" },
  { icon: BellRing,  title: "إشعارات فورية",           desc: "تنبيهات لحظية للوظائف الجديدة ومشاهدات ملفك الشخصي.",                   color: "#ec4899", bg: "#fdf2f8" },
  { icon: LineChart, title: "لوحة تحليلات",            desc: "تابع أداء إعلاناتك وحالة الطلبات مباشرةً.",                             color: "#0e7a81", bg: "#f0fdfe" },
  { icon: Users2,    title: "أدوات التعاون",           desc: "مراسلة وجدولة ومشاركة وثائق — كلها مدمجة.",                            color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: Star,      title: "التقييمات والمراجعات",    desc: "نظام تغذية راجعة شفّاف يبرز الأفضل بشكل طبيعي.",                       color: "#f97316", bg: "#fff7ed" },
  { icon: Lock,      title: "الخصوصية أولاً",         desc: "امتثال كامل لـ GDPR وضوابط خصوصية دقيقة.",                             color: "#10b981", bg: "#ecfdf5" },
];

export default function FeaturesSection() {
  const { isRTL } = useTranslation();

  const heroFeature = isRTL ? heroFeatureAr : heroFeatureEn;
  const features    = isRTL ? featuresAr    : featuresEn;

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* ── Section label + headline ── */}
        <div className="mb-16 max-w-2xl">
          <span
            className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: "rgba(10,191,188,0.1)", color: "#0ABFBC" }}
          >
            {isRTL ? "لماذا أبجد" : "Why Abjad"}
          </span>
          <h2
            className="font-extrabold text-gray-950 tracking-tight mb-4"
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", letterSpacing: isRTL ? "0" : "-0.03em", lineHeight: 1.1 }}
          >
            {isRTL ? (
              <>{"كل ما تحتاجه."}{" "}<span className="text-gray-400 font-extrabold">{"لا شيء زائد."}</span></>
            ) : (
              <>{"Everything you need."}{" "}<span className="text-gray-400 font-extrabold">{"Nothing you don\u2019t."}</span></>
            )}
          </h2>
          <p className="text-gray-500 text-lg leading-relaxed">
            {isRTL
              ? "مبنيٌّ خصيصاً للقطاع التعليمي — لا لوحة وظائف عامة مُعاد تدويرها."
              : "Built specifically for the education sector — not a generic job board bolted on."}
          </p>
        </div>

        {/* ── Asymmetric layout ── */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left — hero feature panel */}
          <div
            className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #f0fdfe 0%, #e6fafb 100%)", border: "1px solid rgba(10,191,188,0.15)" }}
          >
            {/* Large faint icon watermark */}
            <heroFeature.icon
              size={160}
              className="absolute -bottom-6 -right-6 opacity-[0.05] pointer-events-none"
              style={{ color: "#0ABFBC" }}
            />

            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: "rgba(10,191,188,0.15)" }}
            >
              <heroFeature.icon size={26} style={{ color: "#0ABFBC" }} strokeWidth={1.8} />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
              {heroFeature.title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              {heroFeature.desc}
            </p>

            {/* Stat callout */}
            <div className="flex items-end gap-3 mb-8">
              <span
                className="text-5xl font-black leading-none"
                style={{ color: "#0ABFBC" }}
              >
                {heroFeature.stat}
              </span>
              <span className="text-sm font-semibold text-gray-500 pb-1.5 leading-tight">
                {heroFeature.statLabel}
              </span>
            </div>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:gap-3"
              style={{ color: "#0ABFBC" }}
            >
              {heroFeature.cta} <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right — compact feature grid */}
          <div className="lg:col-span-3 grid sm:grid-cols-2 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`group bg-white hover:bg-gray-50 transition-colors duration-150 p-6 flex items-start gap-4 ${
                  i === features.length - 1 ? "sm:col-span-2" : ""
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: f.bg }}
                >
                  <f.icon size={16} style={{ color: f.color }} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
