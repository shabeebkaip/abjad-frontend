"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { useMySubscription } from "@/lib/billing/useMySubscription";
import { useTranslation } from "@/lib/i18n/useTranslation";

// Trial banner — shown on top of /school/dashboard while the user is on
// trial, or when they have no subscription. Drives them to /school/billing/
// plans. Hidden silently when subscription is paid or grandfathered.

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

interface Props {
  audience: "school" | "teacher_premium";
  plansHref: string;
}

export function TrialBanner({ audience, plansHref }: Props) {
  const { t } = useTranslation();
  const tt = t.billingShared.trialBanner;
  const { subscription, isTrialing, isPaid, isLegacy, loading } = useMySubscription();

  if (loading) return null;
  if (isPaid || isLegacy) return null;

  // No subscription at all
  if (!subscription) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Sparkles className="text-amber-700" size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {audience === "school" ? tt.schoolTitle : tt.teacherTitle}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {audience === "school" ? tt.schoolBody : tt.teacherBody}
          </p>
        </div>
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {audience === "school" ? tt.schoolCta : tt.teacherCta}
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  // Trialing
  if (isTrialing) {
    const left = daysUntil(subscription.trialEndsAt);
    const urgent = (left ?? 99) <= 2;
    const dayWord = left === 1 ? tt.daySingular : tt.dayPlural;
    return (
      <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
        urgent ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"
      }`}>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${urgent ? "bg-rose-100" : "bg-amber-100"}`}>
          {urgent ? <AlertCircle className="text-rose-600" size={18} /> : <Sparkles className="text-amber-700" size={18} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {left === 0 ? tt.trialEndsToday : tt.daysLeftInTrial.replace("{count}", String(left)).replace("{dayWord}", dayWord)}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {tt.pickPlanBody}
          </p>
        </div>
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {tt.choosePlan}
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  // Cancelled / Expired / Past Due
  if (subscription.status === "expired" || subscription.status === "cancelled") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <AlertCircle className="text-slate-600" size={18} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {tt.endedTitle}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {tt.endedBody}
          </p>
        </div>
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {tt.resubscribe}
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return null;
}
