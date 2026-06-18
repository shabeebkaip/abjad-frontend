"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  Loader2, AlertCircle, ArrowLeft, Building2, GraduationCap,
  ShieldCheck, CheckCircle2, CreditCard, Landmark, Lock, Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getPricingPagePayload, type PricingPlan } from "@/lib/api/pricing-page";
import {
  initiatePayment, demoCompletePayment, type CheckoutMethod, type InitiatePaymentResponse,
} from "@/lib/api/billing";

// Reusable checkout form — same UX for school + teacher. The only thing that
// changes per audience is the "back" link target and the small audience pill.

// Order matches our KSA-first strategy: mada → apple_pay → stcpay → card →
// bank_transfer.
const METHODS: { value: CheckoutMethod; labelEn: string; labelAr: string; Icon: React.ElementType; hint?: string }[] = [
  { value: "mada",          labelEn: "Mada",            labelAr: "مدى",        Icon: CreditCard, hint: "Saudi debit card" },
  { value: "apple_pay",     labelEn: "Apple Pay",       labelAr: "آبل باي",     Icon: CreditCard, hint: "Touch / Face ID" },
  { value: "stcpay",        labelEn: "STC Pay",         labelAr: "STC Pay",     Icon: CreditCard, hint: "Mobile wallet" },
  { value: "moyasar_card",  labelEn: "Visa / Mastercard", labelAr: "فيزا / ماستركارد", Icon: CreditCard },
  { value: "bank_transfer", labelEn: "Bank Transfer",   labelAr: "تحويل بنكي",   Icon: Landmark, hint: "Manual, verified within 1–2 business days" },
];

function halalaToSAR(h: number): string {
  return (h / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

declare global {
  interface Window {
    Moyasar?: {
      init: (opts: Record<string, unknown>) => void;
    };
  }
}

interface Props {
  planCode: string;
  audience: "school" | "teacher_premium";
  // Where the "back to plans" link should point
  backHref: string;
  // Where /billing/success lives for this audience
  successPath: string;
  // Where the pending bank-transfer flow lives
  pendingPath: string;
}

export function CheckoutForm({ planCode, audience, backHref, successPath, pendingPath }: Props) {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  const router = useRouter();

  const [plan, setPlan]       = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const [method, setMethod]   = useState<CheckoutMethod>("mada");
  const [submitting, setSubmitting] = useState(false);
  const [initResp, setInitResp] = useState<InitiatePaymentResponse | null>(null);

  // Load the plan from the public pricing payload (which is cached + locale-
  // aware). Same source the /pricing page uses, so name + price + bullets are
  // consistent.
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const pl = await getPricingPagePayload(locale);
        const list = audience === "school" ? pl.plans.school : pl.plans.teacher;
        const found = list.find((p) => p.code === planCode);
        if (!found) throw new Error(`Plan not found: ${planCode}`);
        if (alive) setPlan(found);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load plan");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [planCode, audience, locale]);

  const handleSubmit = useCallback(async () => {
    if (!plan) return;
    setSubmitting(true);
    setError(null);
    try {
      const callbackUrl = typeof window !== "undefined"
        ? `${window.location.origin}${successPath}`
        : undefined;
      const resp = await initiatePayment({ planCode: plan.code, method, callbackUrl });
      setInitResp(resp);

      if (method === "bank_transfer") {
        // Bank transfer skips the provider — route to the pending page where
        // the IBAN + reference are displayed.
        window.location.href = `${pendingPath}/${resp.invoice._id}`;
        return;
      }

      // For Moyasar methods, the Moyasar.js script (loaded below) renders the
      // inline form into #moyasar-form. We pass the providerPaymentId so the
      // submit completes the existing pending payment server-side.
      // The init happens in the useEffect below once Moyasar global is ready
      // AND we have the response.
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }, [plan, method, pendingPath, successPath]);

  // Initialise Moyasar.js once we have a response AND the script has loaded.
  const [moyasarReady, setMoyasarReady] = useState(false);
  useEffect(() => {
    if (!initResp || !moyasarReady || method === "bank_transfer") return;
    if (typeof window === "undefined" || !window.Moyasar) return;

    const allowed: Record<CheckoutMethod, "creditcard" | "applepay" | "stcpay" | null> = {
      moyasar_card: "creditcard",
      mada:         "creditcard",
      apple_pay:    "applepay",
      stcpay:       "stcpay",
      bank_transfer: null,
    };

    const methodForMoyasar = allowed[method];
    if (!methodForMoyasar) return;

    try {
      window.Moyasar.init({
        element: "#moyasar-form",
        amount: initResp.amountHalala,
        currency: "SAR",
        description: `Abjad — Invoice ${initResp.invoice.number}`,
        publishable_api_key: initResp.publishableKey,
        callback_url: `${window.location.origin}${successPath}?paymentId=${encodeURIComponent(initResp.providerPaymentId)}&invoiceId=${encodeURIComponent(initResp.invoice._id)}`,
        methods: [methodForMoyasar],
      });
    } catch (e) {
      setError(e instanceof Error ? `Moyasar init failed: ${e.message}` : "Moyasar init failed");
    }
  }, [initResp, moyasarReady, method, successPath]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-12 flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  if (error && !plan) {
    return (
      <div className="bg-white rounded-2xl border border-red-100 p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={28} />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link href={backHref} className="text-sm text-gray-600 underline">Back to plans</Link>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="space-y-5">
      <div>
        <Link href={backHref} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
          <ArrowLeft size={12} /> {locale === "ar" ? "العودة إلى الباقات" : "Back to plans"}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        {/* Left column — method picker / Moyasar form */}
        <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50">
            <h1 className="text-base font-semibold text-gray-900">
              {locale === "ar" ? "إكمال الدفع" : "Complete your payment"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {locale === "ar"
                ? "اختر طريقة الدفع المفضّلة. جميع المدفوعات مشفّرة وآمنة."
                : "Choose your preferred payment method. All payments are encrypted and secure."}
            </p>
          </div>

          {error && (
            <div className="mx-6 mt-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </div>
          )}

          {/* Step 1 — method picker (only before initiation) */}
          {!initResp && (
            <div className="p-6 space-y-2">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">
                {locale === "ar" ? "طريقة الدفع" : "Payment method"}
              </p>
              {METHODS.map(({ value, labelEn, labelAr, Icon, hint }) => {
                const selected = method === value;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                      selected ? "border-[var(--brand-primary)] bg-[var(--brand-primary-light)]/40" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value={value}
                      checked={selected}
                      onChange={() => setMethod(value)}
                      className="sr-only"
                    />
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-[var(--brand-primary)] text-white" : "bg-gray-100 text-gray-500"}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900">{locale === "ar" ? labelAr : labelEn}</p>
                      {hint && <p className="text-[11px] text-gray-400 mt-0.5">{hint}</p>}
                    </div>
                    {selected && <CheckCircle2 size={16} className="text-[var(--brand-primary)] shrink-0" />}
                  </label>
                );
              })}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-4 flex items-center justify-center gap-2 w-full px-6 py-3.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
                style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
              >
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Lock size={14} />}
                {locale === "ar" ? "متابعة الدفع" : "Continue to payment"}
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-3">
                <ShieldCheck size={11} className="inline -mt-0.5 me-1" />
                {locale === "ar"
                  ? "البيانات مشفّرة باستخدام TLS 1.3. لا نخزّن بيانات بطاقتك."
                  : "Encrypted with TLS 1.3. We never store your card details."}
              </p>
            </div>
          )}

          {/* Step 2 — Moyasar inline form OR demo simulator (after initiate) */}
          {initResp && method !== "bank_transfer" && initResp.demoMode && (
            <DemoSimulator
              providerPaymentId={initResp.providerPaymentId}
              successPath={successPath}
              invoiceId={initResp.invoice._id}
              locale={locale}
              router={router}
            />
          )}
          {initResp && method !== "bank_transfer" && !initResp.demoMode && (
            <div className="p-6">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">
                {locale === "ar" ? "أكمل البيانات" : "Enter your details"}
              </p>
              <Script
                src="https://cdn.moyasar.com/mpf/1.7.3/moyasar.js"
                onLoad={() => setMoyasarReady(true)}
                strategy="afterInteractive"
              />
              <link rel="stylesheet" href="https://cdn.moyasar.com/mpf/1.7.3/moyasar.css" />
              <div id="moyasar-form" />
              {!moyasarReady && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                  <Loader2 size={18} className="animate-spin me-2" />
                  {locale === "ar" ? "جارٍ تحميل نموذج الدفع…" : "Loading payment form…"}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right column — plan summary */}
        <aside className="bg-white rounded-2xl border border-gray-100 h-fit lg:sticky lg:top-6">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            {audience === "school" ? <Building2 size={14} className="text-gray-400" /> : <GraduationCap size={14} className="text-gray-400" />}
            <h2 className="text-sm font-semibold text-gray-900">{locale === "ar" ? "ملخّص الطلب" : "Order summary"}</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-xs text-gray-400">{audience === "school" ? (locale === "ar" ? "باقة المدرسة" : "School plan") : (locale === "ar" ? "باقة المعلم المميز" : "Premium Teacher")}</p>
              <p className="text-base font-semibold text-gray-900 capitalize mt-0.5">{plan.name}</p>
              <p className="text-[11px] text-gray-400">
                {plan.durationLabel} · {locale === "ar" ? "اشتراك" : "Subscription"}
              </p>
            </div>

            <Summary plan={plan} locale={locale} />

            <div className="pt-3 border-t border-gray-100 space-y-1.5 text-[11px] text-gray-500">
              <p>
                <ShieldCheck size={11} className="inline -mt-0.5 me-1 text-emerald-500" />
                {locale === "ar" ? "ضمان استرداد المال خلال 7 أيام" : "7-day money-back guarantee"}
              </p>
              <p>
                <CheckCircle2 size={11} className="inline -mt-0.5 me-1 text-emerald-500" />
                {locale === "ar" ? "ألغ في أي وقت" : "Cancel anytime"}
              </p>
              <p>
                <CheckCircle2 size={11} className="inline -mt-0.5 me-1 text-emerald-500" />
                {locale === "ar" ? "فاتورة متوافقة مع هيئة الزكاة والضريبة" : "ZATCA-compliant invoice"}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Summary({ plan, locale }: { plan: PricingPlan; locale: "en" | "ar" }) {
  const vatHalala = Math.round(plan.priceHalala * 0.15);
  const totalHalala = plan.priceHalala + vatHalala;

  return (
    <div className="space-y-2 text-sm">
      <Row label={locale === "ar" ? "السعر" : "Subtotal"} value={`${halalaToSAR(plan.priceHalala)} SAR`} />
      <Row label={locale === "ar" ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"} value={`${halalaToSAR(vatHalala)} SAR`} />
      <div className="border-t border-gray-100 mt-2 pt-3 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{locale === "ar" ? "الإجمالي" : "Total"}</span>
        <span className="text-2xl font-bold text-gray-900 tabular-nums">{halalaToSAR(totalHalala)} SAR</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900 tabular-nums">{value}</span>
    </div>
  );
}

// ── Demo simulator ───────────────────────────────────────────────────────
// Renders in place of the Moyasar inline form when the backend is running
// without Moyasar credentials. Posts to the demo-complete endpoint which
// simulates the Moyasar webhook server-side, then redirects to /success.
function DemoSimulator({ providerPaymentId, successPath, invoiceId, locale, router }: {
  providerPaymentId: string;
  successPath: string;
  invoiceId: string;
  locale: "en" | "ar";
  router: ReturnType<typeof useRouter>;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState<string | null>(null);

  const handleComplete = async () => {
    setBusy(true);
    setErr(null);
    try {
      await demoCompletePayment(providerPaymentId);
      const qs = new URLSearchParams({ paymentId: providerPaymentId, invoiceId });
      router.push(`${successPath}?${qs.toString()}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to complete demo");
      setBusy(false);
    }
  };

  return (
    <div className="p-6">
      <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/40 p-6 text-center">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-3">
          <Sparkles className="text-amber-600" size={22} />
        </div>
        <p className="text-sm font-semibold text-amber-900 mb-1">
          {locale === "ar" ? "وضع العرض التجريبي" : "Demo Mode"}
        </p>
        <p className="text-xs text-amber-700 mb-5 max-w-sm mx-auto leading-relaxed">
          {locale === "ar"
            ? "لم يتم تكوين Moyasar بعد. اضغط أدناه لمحاكاة دفعة ناجحة وتفعيل الاشتراك."
            : "Moyasar isn't configured yet. Click below to simulate a successful payment and activate the subscription."}
        </p>
        <button
          type="button"
          onClick={handleComplete}
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
        >
          {busy
            ? <><Loader2 size={16} className="animate-spin" /> {locale === "ar" ? "جارٍ المحاكاة…" : "Simulating…"}</>
            : <>{locale === "ar" ? "🧪 محاكاة الدفع الناجح" : "🧪 Simulate Successful Payment"}</>}
        </button>
        {err && <p className="mt-3 text-xs text-red-600">{err}</p>}
        <p className="mt-4 text-[10px] text-amber-700 font-mono">
          paymentId: {providerPaymentId.slice(0, 20)}…
        </p>
      </div>
    </div>
  );
}
