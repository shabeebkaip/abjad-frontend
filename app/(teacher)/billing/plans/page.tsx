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
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/billing" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          <ArrowLeft size={12} /> Back to billing
        </Link>
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide rounded-full px-3 py-1 bg-amber-100 text-amber-800 mb-3">
          <GraduationCap size={12} /> {locale === "ar" ? "باقة المعلمين المميزة" : "Premium Teacher"}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {locale === "ar" ? "كن من أوائل الذين يرونهم المدارس" : "Be the first teacher schools see"}
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {locale === "ar" ? "ظهور أولوي في عمليات بحث المدارس + شارة معلم مميز على ملفك الشخصي." : "Priority placement in school searches and a Premium Teacher badge on your profile."}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      ) : plans.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No plans available right now.</p>
      ) : activePlan ? (
        <>
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
    <div className="max-w-2xl mx-auto">
      <div className={`bg-white rounded-3xl border shadow-sm p-8 sm:p-10 ${
        plan.isHighlighted ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20" : "border-gray-100"
      }`}>
        {plan.isHighlighted && (
          <div className="flex justify-center -mt-12 mb-6">
            <span className="inline-flex items-center gap-1 text-xs font-bold tracking-wide uppercase text-white px-3 py-1.5 rounded-full shadow-sm" style={{ background: "var(--brand-gradient, var(--brand-primary))" }}>
              <Star size={11} fill="currentColor" />
              {locale === "ar" ? "الأكثر شعبية" : "Most Popular"}
            </span>
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-sm font-semibold text-gray-500 mb-1 capitalize">{plan.name}</p>
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-5xl font-bold text-gray-900 tabular-nums">{halalaToSAR(plan.effectiveMonthlyHalala)}</span>
            <span className="text-base font-medium text-gray-500">SAR/{locale === "ar" ? "شهر" : "month"}</span>
          </div>
          <p className="text-xs text-gray-400">
            {locale === "ar"
              ? `يُفوتر ${plan.durationLabel} كـ ${halalaToSARDecimal(plan.priceHalala)} ر.س · لا تشمل 15% ضريبة قيمة مضافة`
              : `Billed ${plan.durationLabel.toLowerCase()} as ${halalaToSARDecimal(plan.priceHalala)} SAR · excl. 15% VAT`}
          </p>
        </div>

        {plan.savings && !samePlanAlready && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-6 text-center">
            <p className="text-sm font-semibold text-emerald-700">
              💰 {locale === "ar"
                ? `توفّر ${halalaToSAR(plan.savings.vsMonthlyHalala)} ر.س مقارنةً بالدفع شهرياً`
                : `Save ${halalaToSAR(plan.savings.vsMonthlyHalala)} SAR vs paying monthly`}
            </p>
          </div>
        )}

        {samePlanAlready && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-center">
            <p className="text-sm font-semibold text-blue-700">
              {locale === "ar" ? "أنت مشترك في هذه الباقة حالياً" : "You're already on this plan"}
            </p>
            <Link href="/billing" className="text-xs text-blue-600 underline mt-1 inline-block">
              {locale === "ar" ? "إدارة الاشتراك" : "Manage subscription"}
            </Link>
          </div>
        )}

        {!samePlanAlready && target.kind === "checkout" && (
          <Link
            href={target.href}
            className="flex items-center justify-center gap-2 w-full text-center px-6 py-3.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all mb-6"
            style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
          >
            <CreditCard size={16} />
            {locale === "ar" ? "اشترك في المميزة" : "Subscribe to Premium"}
          </Link>
        )}

        {target.warning && !samePlanAlready && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800 text-center">
            {target.warning}
          </div>
        )}

        {plan.description && (
          <p className="text-sm text-gray-600 text-center mb-5">{plan.description}</p>
        )}

        {plan.bullets.length > 0 && (
          <>
            <div className="border-t border-gray-100 my-4" />
            <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase text-center mb-3">
              {locale === "ar" ? "كل ما هو مشمول" : "Everything included"}
            </p>
            <ul className="space-y-2.5">
              {plan.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
