"use client";

import Link from "next/link";
import { CheckCircle2, CreditCard, Star } from "lucide-react";
import { type PricingPlan } from "@/lib/api/pricing-page";
import { type MySubscription } from "@/lib/api/billing";
import { resolveCheckoutTarget } from "@/lib/auth/checkout-target";
import { useAuth } from "@/lib/auth/useAuth";

// Shared plan card used on /billing/plans (teacher) and /school/billing/plans.
// Two-column layout: price + CTA on the left, feature bullets grid on the right.
// billingHref controls where "Manage subscription" links point.

function halalaToSAR(h: number): string {
  return (h / 100).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}
function halalaToSARDecimal(h: number): string {
  return (h / 100).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface PlanCardProps {
  plan: PricingPlan;
  locale: "en" | "ar";
  hasActive: boolean;
  sub: MySubscription | null;
  billingHref: string;
}

export function PlanCard({ plan, locale, hasActive, sub, billingHref }: PlanCardProps) {
  const { user } = useAuth();

  const target = resolveCheckoutTarget({
    planCode: plan.code,
    audience: plan.audience,
    user: user ?? null,
    hasActiveSubscription: hasActive,
    inAppContext: true,
  });

  const samePlanAlready =
    sub?.planCode === plan.code &&
    (sub.status === "active" || sub.status === "trialing");

  const isTeacher = plan.audience === "teacher_premium";

  return (
    <div
      className={`bg-white rounded-3xl border shadow-sm overflow-hidden ${
        plan.isHighlighted
          ? "border-[var(--brand-primary)] ring-2 ring-[var(--brand-primary)]/20"
          : "border-gray-100"
      }`}
    >
      {plan.isHighlighted && (
        <div
          className="flex justify-center py-2"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-white">
            <Star size={11} fill="currentColor" />
            {locale === "ar" ? "الأكثر شعبية" : "Most Popular"}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr]">
        {/* ── Left — price + CTA ── */}
        <div className="p-8 lg:p-10 flex flex-col lg:border-e border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            {plan.name}
          </p>

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
                💰{" "}
                {locale === "ar"
                  ? `وفّر ${halalaToSAR(plan.savings.vsMonthlyHalala)} ر.س مقارنةً بالشهري`
                  : `Save ${halalaToSAR(plan.savings.vsMonthlyHalala)} SAR vs monthly`}
              </p>
            </div>
          )}

          {plan.description && (
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              {plan.description}
            </p>
          )}

          <div className="mt-auto pt-8 space-y-3">
            {samePlanAlready ? (
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-semibold text-blue-700">
                  {locale === "ar"
                    ? "أنت مشترك في هذه الباقة حالياً"
                    : "You're already on this plan"}
                </p>
                <Link
                  href={billingHref}
                  className="text-xs text-blue-600 underline mt-1 inline-block"
                >
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
                {sub?.status === "trialing"
                  ? locale === "ar" ? "ترقية الآن" : "Upgrade now"
                  : isTeacher
                  ? locale === "ar" ? "اشترك في المميزة" : "Subscribe to Premium"
                  : locale === "ar" ? "اشترك" : "Continue to checkout"}
              </Link>
            ) : null}

            {target.warning && !samePlanAlready && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
                {locale === "ar" && target.warning.startsWith("You already have")
                  ? "لديك اشتراك فعّال بالفعل. أدِر اشتراكك أو غيّر الباقة من صفحة الفوترة."
                  : target.warning}
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

        {/* ── Right — feature bullets grid ── */}
        <div className="p-8 lg:p-10 bg-gray-50/50">
          <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-5">
            {locale === "ar" ? "كل ما هو مشمول" : "Everything included"}
          </p>
          {plan.bullets.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
              {plan.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "var(--brand-primary-light, #e6f9fd)" }}
                  >
                    <CheckCircle2
                      size={12}
                      style={{ color: "var(--brand-primary, #00ACD3)" }}
                    />
                  </div>
                  <span className="text-sm text-gray-700 leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              {locale === "ar" ? "لا توجد تفاصيل متاحة حالياً" : "Feature details coming soon"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
