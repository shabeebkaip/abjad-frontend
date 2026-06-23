"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getMySubscription, reconcilePayment, type MySubscription } from "@/lib/api/billing";

interface Props {
  audience: "school" | "teacher_premium";
  // Where the "Go to dashboard" button points
  dashboardHref: string;
  // Where the "Manage subscription" button points
  billingHref: string;
}

// Polls /api/subscriptions/me after the user lands here from Moyasar's
// callback. The webhook activates the subscription; this just waits for it.
// Falls back to "we're processing" copy if 15s passes without activation.

function BillingSuccessInner({ audience, dashboardHref, billingHref }: Props) {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";
  const sp = useSearchParams();
  const paymentId = sp.get("paymentId") ?? sp.get("id");
  const invoiceId = sp.get("invoiceId");
  // Moyasar passes status=failed + message when the payment is declined.
  const moyasarStatus = sp.get("status");
  const moyasarMessage = sp.get("message");
  const isDeclined = moyasarStatus === "failed";

  const [sub, setSub] = useState<MySubscription | null>(null);
  const [pending, setPending] = useState(!isDeclined);
  const [tooLong, setTooLong] = useState(false);
  const [error, setError]     = useState<string | null>(isDeclined ? (moyasarMessage ?? "Payment was declined") : null);

  // Poll every 1.5s for up to ~20s while waiting for the webhook to fire.
  // After the first tick, also call POST /payments/:id/reconcile so the
  // backend pulls the latest status from Moyasar directly — required on
  // localhost (webhook can't reach our backend) and a useful safety net in
  // production for missed/delayed webhooks.
  // Skip polling entirely when Moyasar already told us the payment failed.
  useEffect(() => {
    if (isDeclined) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const start = Date.now();
    let tickCount = 0;

    const tick = async () => {
      tickCount++;
      try {
        // From the 2nd poll onward, also reconcile against Moyasar. We skip
        // the first tick to give the webhook a fast-path chance (saves one
        // round trip when the webhook is reachable).
        if (tickCount >= 2 && paymentId) {
          try {
            await reconcilePayment(paymentId, invoiceId);
          } catch {
            // Reconcile may 404 / 403 for unrelated reasons (admin-issued
            // payment, etc.) — fall through to the regular subscription
            // poll so we still surface state.
          }
        }

        const me = await getMySubscription();
        if (cancelled) return;
        if (me.subscription && (me.subscription.status === "active" || me.subscription.status === "trialing")) {
          setSub(me.subscription);
          setPending(false);
          return;
        }
        if (Date.now() - start > 20_000) {
          if (!cancelled) { setTooLong(true); setPending(false); setSub(me.subscription); }
          return;
        }
        timer = setTimeout(tick, 1500);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not check status");
          setPending(false);
        }
      }
    };
    void tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [paymentId]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        {pending && !tooLong && !error && (
          <>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Loader2 className="text-amber-600 animate-spin" size={28} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {locale === "ar" ? "جارٍ التحقّق من الدفع…" : "Verifying your payment…"}
            </h1>
            <p className="text-sm text-gray-500">
              {locale === "ar"
                ? "نتأكّد من اكتمال المعاملة مع البنك. لا تغلق هذه الصفحة."
                : "We're confirming the transaction with the bank. Please don't close this page."}
            </p>
          </>
        )}

        {!pending && sub && !error && (
          <>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="text-emerald-600" size={32} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {locale === "ar" ? "تم تفعيل اشتراكك!" : "Subscription activated!"}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              {audience === "school"
                ? (locale === "ar"
                    ? "يمكنك الآن نشر الوظائف ومشاهدة جميع المرشحين بدون قيود."
                    : "You can now post jobs and view candidates without limits.")
                : (locale === "ar"
                    ? "ظهور أولوي وشارة معلم مميز فعّالة الآن."
                    : "Premium ranking and verified badge are now active.")}
            </p>
            <p className="text-[11px] text-gray-400 mb-6">
              {locale === "ar" ? "الباقة" : "Plan"}: <span className="font-mono">{sub.planCode}</span>
              {invoiceId && <> · {locale === "ar" ? "الفاتورة" : "Invoice"}: <span className="font-mono text-[10px]">{invoiceId.slice(-8)}</span></>}
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href={dashboardHref}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
              >
                {locale === "ar" ? "إلى لوحة التحكم" : "Go to dashboard"}
                <ArrowRight size={14} />
              </Link>
              <Link href={billingHref} className="text-xs text-gray-500 hover:text-gray-700 underline">
                {locale === "ar" ? "إدارة الاشتراك" : "Manage subscription"}
              </Link>
            </div>
          </>
        )}

        {tooLong && !sub && (
          <>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
              <Sparkles className="text-amber-600" size={28} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {locale === "ar" ? "الدفع قيد المعالجة" : "Payment is processing"}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              {locale === "ar"
                ? "البنك يستغرق وقتاً أطول من المعتاد. ستظهر باقتك تلقائياً بعد التأكيد — يمكنك التحقّق من صفحة الفوترة لاحقاً."
                : "The bank is taking a bit longer than usual. Your plan will activate automatically once confirmed — check your billing page later."}
            </p>
            <Link
              href={billingHref}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              {locale === "ar" ? "إلى صفحة الفوترة" : "Go to billing"}
            </Link>
          </>
        )}

        {error && (
          <>
            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="text-red-600" size={28} />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">
              {isDeclined
                ? (locale === "ar" ? "رُفضت عملية الدفع" : "Payment declined")
                : (locale === "ar" ? "تعذّر التحقّق" : "Couldn't verify")}
            </h1>
            <p className="text-sm text-gray-500 mb-5">
              {isDeclined
                ? (locale === "ar"
                    ? "لم تتم معالجة الدفعة. يُرجى التحقّق من بيانات البطاقة والمحاولة مرة أخرى."
                    : "Your payment was not processed. Please check your card details and try again.")
                : error}
            </p>
            <div className="flex flex-col gap-2">
              {isDeclined ? (
                <Link
                  href={`${billingHref}/plans`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
                  style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
                >
                  {locale === "ar" ? "حاول مرة أخرى" : "Try again"}
                  <ArrowRight size={14} />
                </Link>
              ) : null}
              <Link href={billingHref} className="text-sm text-gray-500 hover:text-gray-700 underline">
                {locale === "ar" ? "إلى صفحة الفوترة" : "Go to billing"}
              </Link>
            </div>
          </>
        )}

        {paymentId && (
          <p className="text-[10px] text-gray-300 mt-6 font-mono">
            {locale === "ar" ? "معرّف المرجع" : "Reference"}: {paymentId.slice(-12)}
          </p>
        )}
      </div>
    </div>
  );
}

export function BillingSuccess(props: Props) {
  return (
    <Suspense fallback={null}>
      <BillingSuccessInner {...props} />
    </Suspense>
  );
}
