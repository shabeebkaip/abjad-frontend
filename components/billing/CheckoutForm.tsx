"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Loader2, AlertCircle, ArrowLeft, Building2, GraduationCap,
  ShieldCheck, CheckCircle2, Landmark, Lock, Sparkles,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getPricingPagePayload, type PricingPlan } from "@/lib/api/pricing-page";
import {
  initiatePayment, demoCompletePayment, type CheckoutMethod, type InitiatePaymentResponse,
} from "@/lib/api/billing";

// Reusable checkout form — same UX for school + teacher. The only thing that
// changes per audience is the "back" link target and the small audience pill.

// ── Payment brand logos (inline SVG — no external deps) ──────────────────
function MadaLogo() {
  // Official Mada mark: two colour blocks (blue + green) beside Arabic + Latin text
  return (
    <svg viewBox="0 0 96 40" fill="none" className="w-full h-full">
      {/* blue block */}
      <rect x="2" y="2"  width="18" height="16" rx="1" fill="#3B9FE4"/>
      {/* green block */}
      <rect x="2" y="22" width="18" height="16" rx="1" fill="#7FBB2A"/>
      {/* Arabic مدى */}
      <text x="26" y="16"
        fill="#222222"
        fontFamily="'Noto Kufi Arabic','Tahoma','Arial',sans-serif"
        fontWeight="700" fontSize="14">مدى</text>
      {/* Latin mada */}
      <text x="26" y="35"
        fill="#222222"
        fontFamily="'Arial','Helvetica',sans-serif"
        fontWeight="400" fontSize="14">mada</text>
    </svg>
  );
}

function ApplePayLogo() {
  return (
    <svg viewBox="0 0 60 28" fill="none" className="w-full h-full">
      {/* Apple glyph */}
      <path d="M15.5 8.6c.9-1.1.8-2.6.8-2.6s-1.4.1-2.4 1.1C13 8 12.9 9.5 12.9 9.5s1.5 0 2.6-0.9z" fill="#000"/>
      <path d="M17.7 9.8c-1.3 0-2.4.8-3 .8-.7 0-1.7-.7-2.8-.7C9.7 9.9 8 11.6 8 14.4c0 1.8.7 3.7 1.5 4.9.7 1 1.4 1.9 2.4 1.9s1.3-.6 2.5-.6c1.2 0 1.5.6 2.6.6s1.8-1 2.5-2.1c.5-.8.9-1.7 1.1-2.6-1.3-.5-2.2-1.8-2.2-3.2 0-1.3.7-2.4 1.8-3.1-.7-.9-1.7-1.4-2.5-1.4z" fill="#000"/>
      {/* "Pay" text */}
      <text x="34" y="19" textAnchor="middle" fill="#000" fontFamily="-apple-system,'SF Pro Display','Helvetica Neue',sans-serif" fontWeight="500" fontSize="13">Pay</text>
    </svg>
  );
}

function StcPayLogo() {
  return (
    <svg viewBox="0 0 64 28" fill="none" className="w-full h-full">
      <rect width="64" height="28" rx="5" fill="#6B3FA0"/>
      <text x="32" y="19" textAnchor="middle" fill="white" fontFamily="'Arial Rounded MT Bold','Arial',sans-serif" fontWeight="700" fontSize="12" letterSpacing="0.3">STC Pay</text>
    </svg>
  );
}

function VisaMastercardLogo() {
  return (
    <svg viewBox="0 0 70 24" fill="none" className="w-full h-full">
      {/* Visa */}
      <text x="2" y="18" fill="#1A1F71" fontFamily="'Arial Black','Arial',sans-serif" fontWeight="900" fontSize="16" fontStyle="italic">VISA</text>
      {/* Divider */}
      <line x1="38" y1="3" x2="38" y2="21" stroke="#E5E7EB" strokeWidth="1"/>
      {/* Mastercard circles */}
      <circle cx="50" cy="12" r="9" fill="#EB001B"/>
      <circle cx="60" cy="12" r="9" fill="#F79E1B" opacity="0.9"/>
    </svg>
  );
}

// Order matches our KSA-first strategy: mada → apple_pay → stcpay → card →
// bank_transfer.
type PaymentMethod = {
  value: CheckoutMethod;
  labelEn: string;
  labelAr: string;
  hint?: string;
} & ({ Logo: React.ComponentType; Icon?: never } | { Icon: React.ElementType; Logo?: never });

const METHODS: PaymentMethod[] = [
  { value: "mada",          labelEn: "Mada",              labelAr: "مدى",              Logo: MadaLogo,            hint: "Saudi debit card" },
  { value: "apple_pay",     labelEn: "Apple Pay",         labelAr: "آبل باي",           Logo: ApplePayLogo,        hint: "Touch / Face ID" },
  { value: "stcpay",        labelEn: "STC Pay",           labelAr: "STC Pay",           Logo: StcPayLogo,          hint: "Mobile wallet" },
  { value: "moyasar_card",  labelEn: "Visa / Mastercard", labelAr: "فيزا / ماستركارد", Logo: VisaMastercardLogo },
  { value: "bank_transfer", labelEn: "Bank Transfer",     labelAr: "تحويل بنكي",        Icon: Landmark,            hint: "Manual, verified within 1–2 business days" },
];

const MOYASAR_JS  = "https://cdn.moyasar.com/mpf/1.7.3/moyasar.js";
const MOYASAR_CSS = "https://cdn.moyasar.com/mpf/1.7.3/moyasar.css";

// Maps our internal method names to the values Moyasar.init() expects
const MOYASAR_METHOD_MAP: Partial<Record<CheckoutMethod, string>> = {
  moyasar_card: "creditcard",
  mada:         "creditcard",
  apple_pay:    "applepay",
  stcpay:       "stcpay",
};

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
  backHref: string;
  successPath: string;
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
  const [initResp, setInitResp]     = useState<InitiatePaymentResponse | null>(null);

  // Becomes true when the Moyasar CDN script fires onReady.
  // next/script's onReady fires on every component mount even when the
  // browser has already cached the script — so this is reliable.
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Guards against calling Moyasar.init() more than once per checkout flow.
  const moyasarInitDone = useRef(false);

  // Load plan from the shared pricing payload (same source as /pricing page).
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

  // Passed to <Script onReady> — called on every mount, even when the script
  // is already cached. This is the recommended pattern per Next.js docs.
  const handleScriptReady = useCallback(() => {
    setScriptLoaded(true);
  }, []);

  // Initialize the Moyasar payment form once BOTH conditions are met:
  //   1. The initiate-payment API response has arrived (initResp is set)
  //   2. The Moyasar CDN script has loaded (scriptLoaded is true)
  // useEffect runs after React commits to the DOM, so .mysr-form is present
  // when window.Moyasar.init() looks for it.
  useEffect(() => {
    if (!initResp || !scriptLoaded) return;
    if (method === "bank_transfer" || initResp.demoMode) return;
    if (moyasarInitDone.current) return;
    if (!window.Moyasar) return;

    const moyasarMethod = MOYASAR_METHOD_MAP[method];
    if (!moyasarMethod) return;

    moyasarInitDone.current = true;
    try {
      window.Moyasar.init({
        element: ".mysr-form",
        amount: initResp.amountHalala,
        currency: "SAR",
        description: `Abjad — Invoice ${initResp.invoice.number}`,
        publishable_api_key: initResp.publishableKey,
        callback_url: `${window.location.origin}${successPath}?invoiceId=${encodeURIComponent(initResp.invoice._id)}`,
        methods: [moyasarMethod],
        supported_networks: ["visa", "mastercard", "mada", "unionpay"],
        metadata: { invoiceId: initResp.invoice._id },
      });
    } catch (e) {
      setError(e instanceof Error ? `Payment form error: ${e.message}` : "Failed to initialize payment form");
    }
  }, [initResp, scriptLoaded, method, successPath]);

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
        window.location.href = `${pendingPath}/${resp.invoice._id}`;
        return;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setSubmitting(false);
    }
  }, [plan, method, pendingPath, successPath]);

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

  const showMoyasarForm = !!initResp && method !== "bank_transfer" && !initResp.demoMode;

  return (
    <div className="space-y-5">
      {/*
        Load Moyasar CSS + JS unconditionally — don't wait for initResp.
        Loading eagerly means the script is ready (or near-ready) by the time
        the user clicks "Continue to payment", so the form appears instantly.

        next/script strategy="afterInteractive" defers until after hydration.
        onReady fires on every component mount (including when script is cached)
        which is why we use it instead of onLoad.
      */}
      <link rel="stylesheet" href={MOYASAR_CSS} />
      <Script
        src={MOYASAR_JS}
        strategy="afterInteractive"
        onReady={handleScriptReady}
      />

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
            <div className="mx-6 mt-5 flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>
                {error.startsWith("You already have") ? (
                  <>
                    {error.replace(/from \/\S+ first\.?/, "")}{" "}
                    <Link href={backHref.replace(/\/plans$/, "")} className="underline font-semibold">
                      {locale === "ar" ? "إدارة الاشتراك" : "Manage subscription"}
                    </Link>
                  </>
                ) : error}
              </span>
            </div>
          )}

          {/* Step 1 — method picker (shown before the user clicks Continue) */}
          {!initResp && (
            <div className="p-6 space-y-2">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">
                {locale === "ar" ? "طريقة الدفع" : "Payment method"}
              </p>
              {METHODS.map(({ value, labelEn, labelAr, hint, ...rest }) => {
                const selected = method === value;
                const Logo = "Logo" in rest ? rest.Logo : undefined;
                const Icon = "Icon" in rest ? rest.Icon : undefined;
                return (
                  <label
                    key={value}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                      selected
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary-light)]/40"
                        : "border-gray-200 hover:border-gray-300"
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
                    {Logo ? (
                      /* Brand logo — white pill, fixed width so all logos align */
                      <div className="h-9 w-16 rounded-lg flex items-center justify-center shrink-0 bg-white border border-gray-200 overflow-hidden p-1">
                        <Logo />
                      </div>
                    ) : Icon ? (
                      /* Fallback icon (Bank Transfer) */
                      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${selected ? "bg-[var(--brand-primary)] text-white" : "bg-gray-100 text-gray-500"}`}>
                        <Icon size={16} />
                      </div>
                    ) : null}
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

          {/* Step 2a — demo simulator (no Moyasar credentials configured) */}
          {initResp && method !== "bank_transfer" && initResp.demoMode && (
            <DemoSimulator
              providerPaymentId={initResp.providerPaymentId}
              successPath={successPath}
              invoiceId={initResp.invoice._id}
              locale={locale}
              router={router}
            />
          )}

          {/* Step 2b — Moyasar inline card form */}
          {showMoyasarForm && (
            <div className="p-6">
              <p className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-4">
                {locale === "ar" ? "أكمل البيانات" : "Enter your details"}
              </p>

              {/*
                Moyasar.js targets this div by class name ".mysr-form".
                It must be in the DOM before window.Moyasar.init() is called —
                our useEffect guarantees this because effects run after commit.
                Do NOT change this to an id selector; the Moyasar MPF API
                requires the class "mysr-form" as the mount point.
              */}
              <div className="mysr-form" />

              {/* Spinner shown only while the CDN script is still loading.
                  Once scriptLoaded is true, Moyasar.init() fires immediately
                  and the form appears. This spinner renders as a sibling of
                  .mysr-form so removing it doesn't touch Moyasar's DOM. */}
              {!scriptLoaded && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-400">
                  <Loader2 size={18} className="animate-spin me-2" />
                  {locale === "ar" ? "جارٍ تحميل نموذج الدفع…" : "Loading payment form…"}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right column — order summary */}
        <aside className="bg-white rounded-2xl border border-gray-100 h-fit lg:sticky lg:top-6">
          <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
            {audience === "school"
              ? <Building2 size={14} className="text-gray-400" />
              : <GraduationCap size={14} className="text-gray-400" />}
            <h2 className="text-sm font-semibold text-gray-900">{locale === "ar" ? "ملخّص الطلب" : "Order summary"}</h2>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div>
              <p className="text-xs text-gray-400">
                {audience === "school"
                  ? (locale === "ar" ? "باقة المدرسة" : "School plan")
                  : (locale === "ar" ? "باقة المعلم المميز" : "Premium Teacher")}
              </p>
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
  const vatHalala   = Math.round(plan.priceHalala * 0.15);
  const totalHalala = plan.priceHalala + vatHalala;

  return (
    <div className="space-y-2 text-sm">
      <Row label={locale === "ar" ? "السعر" : "Subtotal"}                   value={`${halalaToSAR(plan.priceHalala)} SAR`} />
      <Row label={locale === "ar" ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"} value={`${halalaToSAR(vatHalala)} SAR`} />
      <div className="border-t border-gray-100 mt-2 pt-3 flex items-baseline justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {locale === "ar" ? "الإجمالي" : "Total"}
        </span>
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

// ── Demo simulator ─────────────────────────────────────────────────────────
// Rendered instead of the Moyasar form when the backend is running without
// live Moyasar credentials. Calls the demo-complete endpoint which simulates
// the Moyasar webhook server-side, then redirects to /success.
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
