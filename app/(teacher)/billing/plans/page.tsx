"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft, GraduationCap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getPricingPagePayload, type PricingPlan } from "@/lib/api/pricing-page";
import { getMySubscription, type MySubscription } from "@/lib/api/billing";
import { PlanCard } from "@/components/billing/PlanCard";

// /billing/plans — in-app teacher premium picker.

export default function TeacherPlansPage() {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
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

          <PlanCard plan={activePlan} locale={locale} hasActive={hasActive} sub={sub} billingHref="/billing" />
        </>
      ) : null}
    </div>
  );
}

