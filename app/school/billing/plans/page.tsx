"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getPricingPagePayload, type PricingPlan } from "@/lib/api/pricing-page";
import { getMySubscription, startTrial, type MySubscription } from "@/lib/api/billing";
import { PlanCard } from "@/components/billing/PlanCard";

export default function SchoolPlansPage() {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("selected") ?? undefined;

  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [sub, setSub]     = useState<MySubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [trialBusy, setTrialBusy] = useState(false);
  const [trialError, setTrialError] = useState<string | null>(null);

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
        setPlans([...pl.plans.school].sort((a, b) => a.durationMonths - b.durationMonths));
        setSub(me.subscription);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [locale]);

  // Default-selected duration: preselected query param > highlighted plan > last (annual)
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
  const hasActive = !!sub && (sub.status === "active" || sub.status === "trialing" || sub.status === "past_due");
  const canTrial = !sub; // trial only for schools with no subscription at all

  async function handleStartTrial() {
    setTrialBusy(true);
    setTrialError(null);
    try {
      await startTrial();
      router.push("/school/billing");
    } catch (e) {
      setTrialError(e instanceof Error ? e.message : "Failed to start trial");
    } finally {
      setTrialBusy(false);
    }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/school/billing" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          <ArrowLeft size={12} /> Back to billing
        </Link>
      </div>

      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {locale === "ar" ? "اختر مدة الفوترة" : "Choose your billing cycle"}
        </h1>
        <p className="text-sm text-gray-500">
          {locale === "ar"
            ? "نفس الميزات في كل الباقات — تختار المدة فقط."
            : "Same features in every plan — you choose the commitment length."}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" /> {error}
        </div>
      )}

      {!loading && canTrial && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {locale === "ar" ? "ابدأ تجربتك المجانية 5 أيام" : "Start your 5-day free trial"}
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {locale === "ar"
                  ? "جرّب جميع ميزات المنصة بدون أي رسوم. لا حاجة لبطاقة."
                  : "Try all platform features for free. No card required."}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
            <button
              type="button"
              onClick={handleStartTrial}
              disabled={trialBusy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 transition-colors"
            >
              {trialBusy && <Loader2 size={14} className="animate-spin" />}
              {locale === "ar" ? "ابدأ التجربة المجانية" : "Start free trial"}
            </button>
            {trialError && <p className="text-xs text-red-600">{trialError}</p>}
          </div>
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

          <PlanCard plan={activePlan} locale={locale} hasActive={hasActive} sub={sub} billingHref="/school/billing" />
        </>
      ) : null}
    </div>
  );
}

