"use client";

import Link from "next/link";
import { Lock, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

// Paywall — shown when a gated action is attempted by a trialing / free user.
// Generic; callers pass copy + the audience-specific plans path.
//
// Lives as a portal-ish overlay; render conditionally from the page that owns
// the gated action (e.g. /school/jobs renders this when "Post a Job" is
// clicked and the entitlement check fails).

interface Props {
  open: boolean;
  onClose: () => void;
  audience: "school" | "teacher_premium";
  plansHref: string;
  // What the user just tried to do (1 line) + why it's gated (1-2 lines).
  // Keep both short — they're rendered above the CTA.
  title?: string;
  message?: string;
  // Concrete benefits of upgrading. Defaults to a sensible KSA-flavoured set.
  bullets?: string[];
  // Source attribution — appended to the plans URL so analytics can attribute
  // conversions back to the gate that triggered them.
  fromKey?: string;
}

const DEFAULT_BULLETS_EN = [
  "Unlimited job posts (vs 1 on trial)",
  "Unlimited candidate CV views",
  "Bulk candidate export (PDF)",
  "Priority support · cancel anytime",
];
const DEFAULT_BULLETS_AR = [
  "إعلانات وظائف غير محدودة (مقابل 1 في التجربة)",
  "عدد غير محدود من مشاهدات السير الذاتية",
  "تصدير مجمّع للمرشحين (PDF)",
  "دعم بأولوية · ألغ في أي وقت",
];

export function PaywallModal({ open, onClose, audience, plansHref, title, message, bullets, fromKey }: Props) {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  if (!open) return null;

  const heading = title ?? (audience === "school"
    ? (locale === "ar" ? "ترقّى للاستمرار" : "Upgrade to continue")
    : (locale === "ar" ? "ميزة المعلم المميز" : "Premium Teacher feature"));

  const body = message ?? (audience === "school"
    ? (locale === "ar" ? "هذه الميزة متاحة في الباقات المدفوعة. اختر باقة الآن لإكمال ما بدأته." : "This feature is part of paid plans. Pick one now to keep going.")
    : (locale === "ar" ? "هذه الميزة جزء من باقة المعلم المميز." : "This feature is part of the Premium Teacher plan."));

  const list = bullets ?? (locale === "ar" ? DEFAULT_BULLETS_AR : DEFAULT_BULLETS_EN);

  const ctaHref = fromKey ? `${plansHref}?from=${encodeURIComponent(fromKey)}` : plansHref;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-7 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 end-4 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mx-auto h-14 w-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: "var(--brand-primary-light, #eef9ff)" }}>
          <Lock size={24} style={{ color: "var(--brand-primary-dark, #00ACD3)" }} />
        </div>

        <h2 className="text-lg font-bold text-gray-900 text-center mb-1">{heading}</h2>
        <p className="text-sm text-gray-600 text-center mb-5">{body}</p>

        <ul className="space-y-2 mb-6">
          {list.map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <Link
          href={ctaHref}
          className="flex items-center justify-center gap-1.5 w-full px-4 py-3 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {locale === "ar" ? "تصفّح الباقات" : "See plans"}
          <ArrowRight size={14} />
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="block w-full mt-2 text-xs text-gray-500 hover:text-gray-700 py-1"
        >
          {locale === "ar" ? "ليس الآن" : "Maybe later"}
        </button>
      </div>
    </div>
  );
}
