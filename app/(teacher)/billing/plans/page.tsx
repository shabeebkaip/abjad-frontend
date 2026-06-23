"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2, Loader2, AlertCircle, Star, ArrowLeft, CreditCard, GraduationCap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/useAuth";
import { getPricingPagePayload, type PricingPlan } from "@/lib/api/pricing-page";
import { getMySubscription, type MySubscription } from "@/lib/api/billing";
import { resolveCheckoutTarget } from "@/lib/auth/checkout-target";

// /billing/plans — in-app teacher premium picker.

function halalaToSAR(h: number): string {
  return (h / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function halalaToSARDecimal(h: number): string {
  return (h / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function TeacherPlansPage() {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("selected") ?? undefined;

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [sub, setSub]     = useState<MySubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [pl, me] = await Promise.all([
          getPricingPagePayload(locale),
          getMySubscription(),
        ]);
        if (!alive) return;
        setPlans([...pl.plans.teacher].sort((a, b) => a.durationMonths - b.durationMonths));
        setSub(me.subscription);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [locale]);

  const defaultIdx = useMemo(() => {
    if (preselected) {
      const i = plans.findIndex((p) => p.code === preselected);
      if (i >= 0) return i;
    }
    const h = plans.findIndex((p) => p.isHighlighted);
    if (h >= 0) return h;
    return Math.max(0, plans.length - 1);
  }, [plans, preselected]);

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => { setActiveIdx(defaultIdx); }, [defaultIdx]);

  const activePlan = plans[activeIdx];
  const hasActive = !!sub && (sub.status === "active" || sub.status === "past_due");

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl mx-auto">
      <Link href="/billing" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
        <ArrowLeft size={12} /> {locale === "ar" ? "العودة إلى الفوترة" : "Back to billing"}
      </Link>

      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide rounded-full px-3 py-1 bg-amber-100 text-amber-800 mb-3">
          <GraduationCap size={12} /> {locale === "ar" ? "باقة المعلمين المميزة" : "Premium Teacher"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {locale === "ar" ? "كن من أوائل الذين يرونهم المدارس" : "Be the first teacher schools see"}
        </h1>
        <p className="text-sm text-gray-500 max-w-lg mx-auto">
          {locale === "ar"
            ? "ظهور أولوي في عمليات بحث المدارس + شارة معلم مميز على ملفك الشخصي."
            : "Priority placement in school searches and a Premium Teacher badge on your profile."}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No plans available right now.</p>
      ) : activePlan ? (
        <>
          {/* Duration toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-white border border-gray-200 rounded-full p-1 shadow-sm">
              {plans.map((p, i) => (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-1.5 px-5 py-2 text-sm font-semibold rounded-full transition-all ${
                    i === activeIdx ? "bg-[var(--brand-primary)] text-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {p.durationLabel}
                  {p.savings && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      i === activeIdx ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      −{p.savings.percent}%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <PlanCard plan={activePlan} locale={locale} user={user} hasActive={hasActive} sub={sub} />
        </>
      ) : null}
    </div>
  );
}

function PlanCard({ plan, locale, user, hasActive, sub }: {
  plan: PricingPlan;
  locale: "en" | "ar";
  user: ReturnType<typeof useAuth>["user"];
  hasActive: boolean;
  sub: MySubscription | null;
}) {
  const target = resolveCheckoutTarget({
    planCode: plan.code,
    audience: plan.audience,
    user: user ?? null,
    hasActiveSubscription: hasActive,
    inAppContext: true,
  });

  const samePlanAlready = sub?.planCode === plan.code && sub.status === "active";

  return (
    <div className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${
      plan.isHighlighted ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20" : "border-gray-100"
    }`}>
      {plan.isHighlighted && (
        <div className="flex justify-center py-2" style={{ background: "var(--brand-gradient, var(--brand-primary))" }}>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-white">
            <Star size={11} fill="currentColor" />
            {locale === "ar" ? "الأكثر شعبية" : "Most Popular"}
          </span>
        </div>
      )}

      {/* Two-column layout: pricing left, features right */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">

        {/* ── Left — price + CTA ── */}
        <div className="p-8 lg:p-10 flex flex-col lg:border-e border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">{plan.name}</p>

          <div className="mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold text-gray-900 tabular-nums leading-none">
                {halalaToSAR(plan.effectiveMonthlyHalala)}
              </span>
              <span className="text-base font-medium text-gray-500">
                SAR/{locale === "ar" ? "شهر" : "month"}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {locale === "ar"
                ? `يُفوتر ${plan.durationLabel} كـ ${halalaToSARDecimal(plan.priceHalala)} ر.س · لا تشمل ضريبة 15%`
                : `Billed ${plan.durationLabel.toLowerCase()} as ${halalaToSARDecimal(plan.priceHalala)} SAR · excl. 15% VAT`}
            </p>
          </div>

          {plan.savings && !samePlanAlready && (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-center">
              <p className="text-sm font-semibold text-emerald-700">
                💰 {locale === "ar"
                  ? `وفّر ${halalaToSAR(plan.savings.vsMonthlyHalala)} ر.س مقارنةً بالشهري`
                  : `Save ${halalaToSAR(plan.savings.vsMonthlyHalala)} SAR vs monthly`}
              </p>
            </div>
          )}

          {plan.description && (
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{plan.description}</p>
          )}

          <div className="mt-auto pt-8 space-y-3">
            {samePlanAlready ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-semibold text-blue-700">
                  {locale === "ar" ? "أنت مشترك في هذه الباقة حالياً" : "You're already on this plan"}
                </p>
                <Link href="/billing" className="text-xs text-blue-600 underline mt-1 inline-block">
                  {locale === "ar" ? "إدارة الاشتراك" : "Manage subscription"}
                </Link>
              </div>
            ) : target.kind === "checkout" ? (
              <Link
                href={target.href}
                className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
              >
                <CreditCard size={16} />
                {locale === "ar" ? "اشترك في المميزة" : "Subscribe to Premium"}
              </Link>
            ) : null}

            {target.warning && !samePlanAlready && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
                {target.warning}
              </p>
            )}

            <ul className="space-y-1.5 text-xs text-gray-500 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {locale === "ar" ? "ضمان استرداد المال 7 أيام" : "7-day money-back guarantee"}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {locale === "ar" ? "إلغاء في أي وقت" : "Cancel anytime"}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {locale === "ar" ? "فاتورة متوافقة مع هيئة الزكاة" : "ZATCA-compliant invoice"}
              </li>
            </ul>
          </div>
        </div>

        {/* ── Right — feature bullets in 2-column grid ── */}
        <div className="p-8 lg:p-10 bg-gray-50/50">
          <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-5">
            {locale === "ar" ? "كل ما هو مشمول" : "Everything included"}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
            {plan.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: "var(--brand-primary-light, #e6f9fd)" }}>
                  <CheckCircle2 size={12} style={{ color: "var(--brand-primary, #00ACD3)" }} />
                </div>
                <span className="text-sm text-gray-700 leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
