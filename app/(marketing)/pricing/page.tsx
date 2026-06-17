"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles, Clock, ShieldCheck, CheckCircle2, ChevronDown, Star,
  GraduationCap, Building2, Loader2, AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getPricingPagePayload, type PricingPagePayload, type PricingPlan } from "@/lib/api/pricing-page";

// Public /pricing page. Single round-trip to /api/pricing/page?locale=...
// then renders top-to-bottom. Architecture matches the strategy doc:
//
//   Hero → Trust → Why Abjad → Pricing (duration toggle) → Comparison
//   → Testimonials → FAQ → Final CTA → Footer legal
//
// Designed for KSA market: SAR-only pricing, VAT visibility, Mada-first
// payment marks, Arabic-first RTL with the existing LanguageProvider.

// ── helpers ──────────────────────────────────────────────────────────────

function halalaToSAR(halala: number): string {
  return (halala / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function halalaToSARDecimal(halala: number): string {
  return (halala / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  Clock, ShieldCheck, Sparkles, GraduationCap, Building2, CheckCircle2, Star,
};

// ── Page ─────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const { lang, isRTL } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  const [payload, setPayload] = useState<PricingPagePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPricingPagePayload(locale);
      setPayload(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load pricing");
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => { load(); }, [load]);

  if (loading && !payload) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  if (error || !payload) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <AlertCircle className="mx-auto text-red-500 mb-3" size={32} />
          <p className="text-sm text-gray-700 mb-3">{error ?? "Failed to load pricing page"}</p>
          <button onClick={load} className="text-sm text-[var(--brand-primary)] underline">
            {locale === "ar" ? "حاول مرة أخرى" : "Try again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={isRTL ? "rtl" : "ltr"} dir={isRTL ? "rtl" : "ltr"}>
      <FaqSchema items={payload.faq} />
      <Hero hero={payload.hero} reassurance={payload.hero.reassurance} />
      <TrustStrip strip={payload.trustStrip} locale={locale} />
      <WhyAbjad reasons={payload.whyAbjad} />
      <PricingSection payload={payload} locale={locale} />
      <ComparisonSection comparison={payload.comparison} locale={locale} />
      {payload.testimonials.length > 0 && (
        <TestimonialsSection items={payload.testimonials} />
      )}
      <FaqSection items={payload.faq} locale={locale} />
      <FinalCta hero={payload.hero} locale={locale} />
      <FooterLegal legal={payload.footerLegal} locale={locale} />
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────

function Hero({ hero, reassurance }: { hero: PricingPagePayload["hero"]; reassurance: string }) {
  return (
    <section className="relative bg-gradient-to-br from-white via-white to-[#f6fafe] border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16 text-center">
        {hero.eyebrow && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[var(--brand-primary-dark)] bg-[var(--brand-primary-light)] rounded-full px-3 py-1.5 mb-5">
            {hero.eyebrow}
          </span>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight max-w-3xl mx-auto">
          {hero.headline}
        </h1>
        {hero.subheadline && (
          <p className="text-base sm:text-lg text-gray-600 mt-5 max-w-2xl mx-auto leading-relaxed">
            {hero.subheadline}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={hero.primaryCtaHref}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
            style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
          >
            {hero.primaryCtaText}
          </Link>
          <Link
            href={hero.secondaryCtaHref}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            {hero.secondaryCtaText}
          </Link>
        </div>
        {reassurance && (
          <p className="text-xs text-gray-400 mt-4">{reassurance}</p>
        )}
      </div>
    </section>
  );
}

// ── Trust Strip ──────────────────────────────────────────────────────────

function TrustStrip({ strip, locale }: { strip: PricingPagePayload["trustStrip"]; locale: "en" | "ar" }) {
  const schoolsLabel  = locale === "ar" ? "مدارس مشتركة" : "schools onboarded";
  const teachersLabel = locale === "ar" ? "معلم مسجّل" : "verified teachers";
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-center">
        <Stat value={strip.schoolCount}  label={schoolsLabel} />
        <span className="hidden sm:block h-8 w-px bg-gray-200" />
        <Stat value={strip.teacherCount} label={teachersLabel} />
        {strip.logos.length > 0 && (
          <>
            <span className="hidden sm:block h-8 w-px bg-gray-200" />
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 opacity-70">
              {strip.logos.map((logo) => (
                logo.logoUrl ? (
                  <Image
                    key={logo.name}
                    src={logo.logoUrl}
                    alt={logo.name}
                    width={80}
                    height={32}
                    className="h-8 w-auto grayscale"
                  />
                ) : (
                  <span key={logo.name} className="text-xs font-semibold text-gray-500">{logo.name}</span>
                )
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-left rtl:text-right">
      <p className="text-2xl font-bold tabular-nums text-gray-900">{value.toLocaleString()}+</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

// ── Why Abjad ────────────────────────────────────────────────────────────

function WhyAbjad({ reasons }: { reasons: PricingPagePayload["whyAbjad"] }) {
  if (reasons.length === 0) return null;
  return (
    <section className="bg-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reasons.map((r, i) => {
            const Icon = ICONS[r.icon] ?? Sparkles;
            return (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                <div className="h-11 w-11 rounded-xl bg-[var(--brand-primary-light)] flex items-center justify-center mb-4">
                  <Icon className="text-[var(--brand-primary-dark)]" size={20} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 leading-snug mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{r.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Pricing Section ──────────────────────────────────────────────────────

function PricingSection({ payload, locale }: { payload: PricingPagePayload; locale: "en" | "ar" }) {
  const schoolPlans = useMemo(
    () => [...payload.plans.school].sort((a, b) => a.durationMonths - b.durationMonths),
    [payload.plans.school],
  );
  const teacherPlans = useMemo(
    () => [...payload.plans.teacher].sort((a, b) => a.durationMonths - b.durationMonths),
    [payload.plans.teacher],
  );

  const defaultIdx = schoolPlans.findIndex((p) => p.isHighlighted);
  const initialIdx = defaultIdx >= 0 ? defaultIdx : Math.max(0, schoolPlans.length - 1);

  const [audience, setAudience] = useState<"school" | "teacher_premium">("school");
  const [activePlanIdx, setActivePlanIdx] = useState(initialIdx);

  const activeList = audience === "school" ? schoolPlans : teacherPlans;
  const activePlan: PricingPlan | undefined = activeList[activePlanIdx] ?? activeList[0];

  const monthlyLabel = locale === "ar" ? "/شهر" : "/month";

  return (
    <section className="bg-[#fbfcfe] border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Audience switcher */}
        {teacherPlans.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
              <button
                type="button"
                onClick={() => { setAudience("school"); setActivePlanIdx(initialIdx); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  audience === "school" ? "bg-gray-900 text-white" : "text-gray-500"
                }`}
              >
                <Building2 size={13} />
                {locale === "ar" ? "للمدارس" : "For Schools"}
              </button>
              <button
                type="button"
                onClick={() => { setAudience("teacher_premium"); setActivePlanIdx(teacherPlans.findIndex((p) => p.isHighlighted) > -1 ? teacherPlans.findIndex((p) => p.isHighlighted) : teacherPlans.length - 1); }}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  audience === "teacher_premium" ? "bg-gray-900 text-white" : "text-gray-500"
                }`}
              >
                <GraduationCap size={13} />
                {locale === "ar" ? "للمعلمين" : "For Teachers"}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {locale === "ar" ? "اختر مدة الفوترة" : "Choose your billing cycle"}
          </h2>
          <p className="text-sm text-gray-500">
            {locale === "ar"
              ? "نفس الميزات في كل الباقات — تختار المدة فقط."
              : "Same features in every plan — you choose the commitment length."}
          </p>
        </div>

        {/* Duration toggle */}
        {activeList.length > 0 && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
              {activeList.map((p, i) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setActivePlanIdx(i)}
                  className={`flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                    i === activePlanIdx ? "bg-[var(--brand-primary)] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {p.durationLabel}
                  {p.savings && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      i === activePlanIdx ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      −{p.savings.percent}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* The card */}
        {activePlan && (
          <div className="max-w-2xl mx-auto">
            <div className={`bg-white rounded-3xl border shadow-sm p-8 sm:p-10 ${
              activePlan.isHighlighted ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20" : "border-gray-100"
            }`}>
              {activePlan.isHighlighted && (
                <div className="flex justify-center -mt-12 mb-6">
                  <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wide uppercase text-white px-3 py-1.5 rounded-full shadow-sm" style={{ background: "var(--brand-gradient, var(--brand-primary))" }}>
                    <Star size={11} fill="currentColor" />
                    {locale === "ar" ? "الأكثر شعبية" : "Most Popular"}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <p className="text-sm font-semibold text-gray-500 mb-1 capitalize">{activePlan.name}</p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="text-5xl font-bold text-gray-900 tabular-nums">
                    {halalaToSAR(activePlan.effectiveMonthlyHalala)}
                  </span>
                  <span className="text-base font-medium text-gray-500">SAR{monthlyLabel}</span>
                </div>
                <p className="text-xs text-gray-400">
                  {locale === "ar"
                    ? `يُفوتر ${activePlan.durationLabel} كـ ${halalaToSARDecimal(activePlan.priceHalala)} ر.س · لا تشمل 15% ضريبة قيمة مضافة`
                    : `Billed ${activePlan.durationLabel.toLowerCase()} as ${halalaToSARDecimal(activePlan.priceHalala)} SAR · excl. 15% VAT`}
                </p>
              </div>

              {activePlan.savings && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6 text-center">
                  <p className="text-sm font-semibold text-emerald-700">
                    💰 {locale === "ar"
                      ? `توفّر ${halalaToSAR(activePlan.savings.vsMonthlyHalala)} ر.س مقارنةً بالدفع شهرياً`
                      : `Save ${halalaToSAR(activePlan.savings.vsMonthlyHalala)} SAR vs paying monthly`}
                  </p>
                </div>
              )}

              <Link
                href={`/signup?role=${activePlan.audience === "school" ? "school" : "teacher"}&plan=${activePlan.code}`}
                className="block w-full text-center px-6 py-3.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all mb-6"
                style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
              >
                {activePlan.ctaText ?? (locale === "ar" ? "ابدأ التجربة المجانية" : "Start free trial")}
              </Link>

              {activePlan.description && (
                <p className="text-sm text-gray-600 text-center mb-5">{activePlan.description}</p>
              )}

              {activePlan.bullets.length > 0 && (
                <>
                  <div className="border-t border-gray-100 my-4" />
                  <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase text-center mb-3">
                    {locale === "ar" ? "كل ما هو مشمول" : "Everything included"}
                  </p>
                  <ul className="space-y-2.5">
                    {activePlan.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <PaymentMarks methods={payload.paymentMethods} locale={locale} />
            </div>
          </div>
        )}

        {/* Enterprise escape */}
        <p className="text-center text-sm text-gray-500 mt-8">
          {locale === "ar" ? "تحتاج إلى توظيف لأكثر من 100 معلم أو لفروع متعددة؟ " : "Need to hire 100+ teachers or across multiple campuses? "}
          <Link href="/contact?intent=enterprise" className="text-[var(--brand-primary-dark)] font-semibold hover:underline">
            {locale === "ar" ? "تحدّث مع فريق المبيعات →" : "Talk to enterprise sales →"}
          </Link>
        </p>
      </div>
    </section>
  );
}

// ── Payment Marks ────────────────────────────────────────────────────────

const PAYMENT_LABELS_EN: Record<string, string> = {
  mada: "Mada",
  apple_pay: "Apple Pay",
  stcpay: "STC Pay",
  moyasar_card: "Visa / Mastercard",
  bank_transfer: "Bank Transfer",
};
const PAYMENT_LABELS_AR: Record<string, string> = {
  mada: "مدى",
  apple_pay: "آبل باي",
  stcpay: "STC Pay",
  moyasar_card: "فيزا / ماستركارد",
  bank_transfer: "تحويل بنكي",
};

function PaymentMarks({ methods, locale }: { methods: PricingPagePayload["paymentMethods"]; locale: "en" | "ar" }) {
  if (methods.length === 0) return null;
  const labels = locale === "ar" ? PAYMENT_LABELS_AR : PAYMENT_LABELS_EN;
  return (
    <div className="mt-6 pt-5 border-t border-gray-100">
      <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase text-center mb-3">
        {locale === "ar" ? "طرق الدفع المقبولة" : "Accepted payments"}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {methods.map((m) => (
          <span key={m} className="text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1">
            {labels[m] ?? m}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Comparison Section ──────────────────────────────────────────────────

function ComparisonSection({ comparison, locale }: {
  comparison: PricingPagePayload["comparison"];
  locale: "en" | "ar";
}) {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {locale === "ar" ? "ماذا تحصل عليه في الباقة المدفوعة" : "What you get on the paid plan"}
          </h2>
          <p className="text-sm text-gray-500">
            {locale === "ar"
              ? "مقارنة سريعة بين تجربة 5 أيام والباقة المدفوعة."
              : "Quick comparison: 5-day trial vs paid plan."}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 sm:gap-8 px-5 sm:px-6 py-3 bg-gray-50 border-b border-gray-100 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            <span>{locale === "ar" ? "الميزة" : "Feature"}</span>
            <span className="text-center w-20 sm:w-32">{comparison.columns[0]}</span>
            <span className="text-center w-20 sm:w-32">{comparison.columns[1]}</span>
          </div>
          {comparison.groups.map((group) => (
            <ComparisonGroup key={group.label} group={group} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonGroup({ group }: { group: PricingPagePayload["comparison"]["groups"][number] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full grid grid-cols-[1fr_auto] gap-4 sm:gap-8 px-5 sm:px-6 py-3 bg-gray-50/30 hover:bg-gray-50 text-left"
      >
        <span className="text-sm font-semibold text-gray-800">▾ {group.label}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && (
        <div>
          {group.rows.map((row) => (
            <div key={row.key} className="grid grid-cols-[1fr_auto_auto] gap-4 sm:gap-8 px-5 sm:px-6 py-3 border-t border-gray-50 first:border-t-0 text-sm">
              <div>
                <p className="font-medium text-gray-800">{row.label}</p>
                {row.description && <p className="text-[11px] text-gray-400 mt-0.5">{row.description}</p>}
              </div>
              <span className="text-center w-20 sm:w-32 text-gray-500 self-center">{row.values[0]}</span>
              <span className="text-center w-20 sm:w-32 font-semibold text-gray-800 self-center">{row.values[1]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────

function TestimonialsSection({ items }: { items: PricingPagePayload["testimonials"] }) {
  const anchor = items.find((i) => i.kind === "anchor");
  const shorts = items.filter((i) => i.kind === "short");

  return (
    <section className="bg-[#fbfcfe] border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-16">
        {anchor && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-10 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {anchor.photoUrl && (
                <Image
                  src={anchor.photoUrl}
                  alt={anchor.name}
                  width={96}
                  height={96}
                  className="rounded-2xl w-24 h-24 object-cover shrink-0"
                />
              )}
              <div className="flex-1">
                {anchor.outcome && (
                  <p className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3">
                    &ldquo;{anchor.outcome}&rdquo;
                  </p>
                )}
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{anchor.quote}</p>
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">{anchor.name}</span>
                  <span className="text-gray-500"> · {anchor.role}, {anchor.school}{anchor.city ? ` · ${anchor.city}` : ""}</span>
                </p>
              </div>
            </div>
          </div>
        )}
        {shorts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shorts.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs">
                  <span className="font-semibold text-gray-900">{t.name}</span>
                  <span className="text-gray-500"> · {t.role}, {t.school}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── FAQ Section ──────────────────────────────────────────────────────────

function FaqSection({ items, locale }: { items: PricingPagePayload["faq"]; locale: "en" | "ar" }) {
  return (
    <section className="bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
          {locale === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}
        </h2>
        <div className="space-y-2">
          {items.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 hover:bg-gray-50"
      >
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <ChevronDown size={16} className={`text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
          {a}
        </div>
      )}
    </div>
  );
}

function FaqSchema({ items }: { items: PricingPagePayload["faq"] }) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ── Final CTA ────────────────────────────────────────────────────────────

function FinalCta({ hero, locale }: { hero: PricingPagePayload["hero"]; locale: "en" | "ar" }) {
  return (
    <section className="bg-[#fbfcfe] border-y border-gray-100">
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
          {locale === "ar" ? "جاهز لتوظيف معلميك القادمين؟" : "Ready to hire your next teachers?"}
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          {locale === "ar" ? "ابدأ تجربة مجانية لمدة 5 أيام أو احجز عرضاً توضيحياً مع فريق المبيعات." : "Start your 5-day free trial — or book a quick demo with our team."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={hero.primaryCtaHref}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
            style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
          >
            {hero.primaryCtaText}
          </Link>
          <Link
            href={hero.secondaryCtaHref}
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all"
          >
            {hero.secondaryCtaText}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer Legal ─────────────────────────────────────────────────────────

function FooterLegal({ legal, locale }: { legal: PricingPagePayload["footerLegal"]; locale: "en" | "ar" }) {
  const parts: string[] = [];
  if (legal.vatNumber) parts.push(`${locale === "ar" ? "الرقم الضريبي" : "VAT"}: ${legal.vatNumber}`);
  if (legal.crNumber)  parts.push(`${locale === "ar" ? "السجل التجاري" : "CR"}: ${legal.crNumber}`);
  if (legal.address)   parts.push(legal.address);
  if (parts.length === 0) return null;
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto px-6 py-8 text-center">
        <p className="text-[11px] text-gray-400">{parts.join(" · ")}</p>
      </div>
    </section>
  );
}
