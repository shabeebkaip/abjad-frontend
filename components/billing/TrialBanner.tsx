"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, AlertCircle } from "lucide-react";
import { useMySubscription } from "@/lib/billing/useMySubscription";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

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
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
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
            {audience === "school"
              ? (locale === "ar" ? "ابدأ تجربة مجانية لمدة 5 أيام" : "Start your 5-day free trial")
              : (locale === "ar" ? "ارتقِ إلى المعلم المميز" : "Upgrade to Premium Teacher")}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {audience === "school"
              ? (locale === "ar" ? "انشر وظيفة واطلع على المرشحين بدون بطاقة ائتمان." : "Post a job and view candidates with no card required.")
              : (locale === "ar" ? "ظهور أولوي للمدارس + شارة معلم مميز." : "Priority placement in school searches + Premium badge.")}
          </p>
        </div>
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {audience === "school"
            ? (locale === "ar" ? "ابدأ الآن" : "See plans")
            : (locale === "ar" ? "ارتقِ الآن" : "Upgrade now")}
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  // Trialing
  if (isTrialing) {
    const left = daysUntil(subscription.trialEndsAt);
    const urgent = (left ?? 99) <= 2;
    return (
      <div className={`rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
        urgent ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"
      }`}>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${urgent ? "bg-rose-100" : "bg-amber-100"}`}>
          {urgent ? <AlertCircle className="text-rose-600" size={18} /> : <Sparkles className="text-amber-700" size={18} />}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">
            {locale === "ar"
              ? (left === 0 ? "تنتهي تجربتك اليوم" : `${left} ${left === 1 ? "يوم" : "أيام"} متبقية في تجربتك`)
              : (left === 0 ? "Your trial ends today" : `${left} ${left === 1 ? "day" : "days"} left in your trial`)}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {locale === "ar"
              ? "اختر باقة مدفوعة الآن لتستمر بنفس البيانات والإعدادات."
              : "Pick a paid plan now to keep your data and continue without limits."}
          </p>
        </div>
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {locale === "ar" ? "اختر باقة" : "Choose plan"}
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
            {locale === "ar" ? "اشتراكك منتهٍ" : "Your subscription has ended"}
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            {locale === "ar" ? "أعد الاشتراك للاستفادة من جميع الميزات." : "Re-subscribe to access all features again."}
          </p>
        </div>
        <Link
          href={plansHref}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all shrink-0"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {locale === "ar" ? "أعد الاشتراك" : "Re-subscribe"}
          <ArrowRight size={12} />
        </Link>
      </div>
    );
  }

  return null;
}
