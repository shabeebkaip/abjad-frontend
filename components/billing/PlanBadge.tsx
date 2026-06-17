"use client";

import Link from "next/link";
import { Sparkles, CheckCircle2, Clock, AlertCircle, XCircle } from "lucide-react";
import { useMySubscription } from "@/lib/billing/useMySubscription";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { MySubscription } from "@/lib/api/billing";

// Compact subscription pill — used in school/teacher header rows. Click
// routes to the billing overview. Returns null in three states:
//   - while loading (avoid layout flash)
//   - legacy access (the page already shows that elsewhere; no point on header)
//   - paid + not about to expire (no need to draw attention)

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

interface Props {
  billingHref: string;
}

function pillFor(sub: MySubscription | null, isTrialing: boolean, isPaid: boolean, locale: "en" | "ar"): {
  tone: string;
  Icon: React.ElementType;
  label: string;
  detail?: string;
} | null {
  if (!sub) {
    return {
      tone: "bg-amber-50 text-amber-700 border-amber-200",
      Icon: Sparkles,
      label: locale === "ar" ? "تجربة مجانية" : "Start trial",
    };
  }
  if (isTrialing) {
    const left = daysUntil(sub.trialEndsAt);
    const urgent = (left ?? 99) <= 2;
    return {
      tone: urgent
        ? "bg-rose-50 text-rose-700 border-rose-200"
        : "bg-amber-50 text-amber-700 border-amber-200",
      Icon: Clock,
      label: locale === "ar" ? "تجربة" : "Trial",
      detail: left === 0
        ? (locale === "ar" ? "اليوم الأخير" : "Last day")
        : `${left}${locale === "ar" ? "ي" : "d"}`,
    };
  }
  if (isPaid) {
    if (sub.status === "past_due") {
      return {
        tone: "bg-rose-50 text-rose-700 border-rose-200",
        Icon: AlertCircle,
        label: locale === "ar" ? "متأخّر السداد" : "Past due",
      };
    }
    // Only surface "renews soon" when actually soon
    const left = daysUntil(sub.currentPeriodEnd);
    if (left != null && left <= 14) {
      return {
        tone: "bg-amber-50 text-amber-700 border-amber-200",
        Icon: Clock,
        label: locale === "ar" ? "يجدّد قريباً" : "Renews soon",
        detail: `${left}${locale === "ar" ? "ي" : "d"}`,
      };
    }
    return null;   // happy path — no pill
  }
  // cancelled / expired
  return {
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    Icon: XCircle,
    label: sub.status === "cancelled"
      ? (locale === "ar" ? "ملغى" : "Cancelled")
      : (locale === "ar" ? "منتهٍ" : "Expired"),
  };
}

export function PlanBadge({ billingHref }: Props) {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  const { subscription, isTrialing, isPaid, isLegacy, loading } = useMySubscription();

  if (loading || isLegacy) return null;

  const pill = pillFor(subscription, isTrialing, isPaid, locale);
  if (!pill) return null;

  const Icon = pill.Icon;
  return (
    <Link
      href={billingHref}
      className={`hidden md:inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all hover:shadow-sm ${pill.tone}`}
    >
      <Icon size={11} />
      <span>{pill.label}</span>
      {pill.detail && <span className="opacity-75 tabular-nums">· {pill.detail}</span>}
    </Link>
  );
}
