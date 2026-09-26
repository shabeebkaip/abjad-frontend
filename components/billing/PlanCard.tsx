"use client";

import Link from "next/link";
import { CheckCircle2, CreditCard, Star } from "lucide-react";
import { type PricingPlan } from "@/lib/api/pricing-page";
import { type MySubscription } from "@/lib/api/billing";
import { resolveCheckoutTarget } from "@/lib/auth/checkout-target";
import { useAuth } from "@/lib/auth/useAuth";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatCurrency } from "@/lib/i18n/format";

// Shared plan card used on /billing/plans (teacher) and /school/billing/plans.
// Two-column layout: price + CTA on the left, feature bullets grid on the right.
// billingHref controls where "Manage subscription" links point.

interface PlanCardProps {
  plan: PricingPlan;
  locale: "en" | "ar";
  hasActive: boolean;
  sub: MySubscription | null;
  billingHref: string;
}

export function PlanCard({ plan, locale, hasActive, sub, billingHref }: PlanCardProps) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const tt = t.billingShared.planCard;

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
            {tt.mostPopular}
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
                {formatCurrency(plan.effectiveMonthlyHalala / 100, locale).replace(/^SAR\s*/, "")}
              </span>
              <span className="text-base font-medium text-gray-500">
                SAR/{tt.perMonthUnit}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {tt.billedAs
                .replace("{duration}", locale === "ar" ? plan.durationLabel : plan.durationLabel.toLowerCase())
                .replace("{amount}", formatCurrency(plan.priceHalala / 100, locale))}
            </p>
          </div>

          {plan.savings && !samePlanAlready && (
            <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 text-center">
              <p className="text-sm font-semibold text-emerald-700">
                💰{" "}
                {tt.save.replace("{amount}", formatCurrency(plan.savings.vsMonthlyHalala / 100, locale))}
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
                  {tt.alreadyOnPlan}
                </p>
                <Link
                  href={billingHref}
                  className="text-xs text-blue-600 underline mt-1 inline-block"
                >
                  {tt.manageSubscription}
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
                  ? tt.upgradeNow
                  : isTeacher
                  ? tt.subscribeToPremium
                  : tt.continueToCheckout}
              </Link>
            ) : null}

            {target.warning && !samePlanAlready && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-center">
                {locale === "ar" && target.warning.startsWith("You already have")
                  ? tt.alreadyHaveWarning
                  : target.warning}
              </p>
            )}

            <ul className="space-y-1.5 text-xs text-gray-500 pt-1">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {tt.moneyBackGuarantee}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {tt.cancelAnytime}
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                {tt.zatcaInvoice}
              </li>
            </ul>
          </div>
        </div>

        {/* ── Right — feature bullets grid ── */}
        <div className="p-8 lg:p-10 bg-gray-50/50">
          <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-5">
            {tt.everythingIncluded}
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
              {tt.noFeatureDetails}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
