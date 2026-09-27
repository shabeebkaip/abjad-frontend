"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, ReceiptText, Clock, CheckCircle2,
  XCircle, AlertCircle, Loader2, Download, RefreshCw,
} from "lucide-react";
import { getMySubscription, listMyInvoices, startTrial, cancelMySubscription, type MySubscription, type MyInvoice } from "@/lib/api/billing";
import { useAuth } from "@/lib/auth/useAuth";
import { getAccessToken, doRefresh } from "@/lib/api/client";
import { SARSymbol } from "@/components/ui/sar-symbol";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate } from "@/lib/i18n/format";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

async function downloadReceipt(invoiceId: string, filename: string) {
  let token = getAccessToken();
  if (!token) token = await doRefresh();
  const res = await fetch(`${API_URL}/api/invoices/${invoiceId}/receipt`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// /school/billing — the school's billing home. Shows current subscription
// state with the right CTA for that state (start trial / upgrade / manage /
// view past invoices) plus the 5 most recent invoices.

type TT = ReturnType<typeof useTranslation>["t"]["school"]["billing"];

const STATUS_ICON: Record<MySubscription["status"], { tone: string; Icon: React.ElementType }> = {
  trialing:  { tone: "bg-amber-50 text-amber-700 border-amber-200",       Icon: Clock },
  active:    { tone: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  past_due:  { tone: "bg-rose-50 text-rose-700 border-rose-200",          Icon: AlertCircle },
  cancelled: { tone: "bg-slate-100 text-slate-700 border-slate-200",      Icon: XCircle },
  expired:   { tone: "bg-slate-100 text-slate-500 border-slate-200",      Icon: XCircle },
};

// Money is always Western digits (Decision 3a) regardless of UI locale.
function halalaToSAR(h: number): string {
  return (h / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function SchoolBillingPage() {
  const { t, lang } = useTranslation();
  const tt = t.school.billing;
  const { user } = useAuth();
  const [sub, setSub]           = useState<MySubscription | null>(null);
  const [isLegacy, setIsLegacy] = useState(false);
  const [invoices, setInvoices] = useState<MyInvoice[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [busy, setBusy]         = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [meRes, invRes] = await Promise.all([
        getMySubscription(),
        listMyInvoices(1, 5).catch(() => ({ invoices: [], total: 0, page: 1, totalPages: 1 })),
      ]);
      setSub(meRes.subscription);
      setIsLegacy(meRes.isLegacy);
      setInvoices(invRes.invoices);
    } catch (e) {
      setError(e instanceof Error ? e.message : tt.loadFailedFallback);
    } finally {
      setLoading(false);
    }
  }, [tt.loadFailedFallback]);

  useEffect(() => { load(); }, [load]);

  async function handleStartTrial() {
    setBusy(true);
    try { await startTrial(); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : tt.startTrialFailedFallback); }
    finally { setBusy(false); }
  }

  async function handleCancel() {
    setBusy(true);
    try { await cancelMySubscription("User requested via billing page"); await load(); setCancelOpen(false); }
    catch (e) { setError(e instanceof Error ? e.message : tt.cancelFailedFallback); }
    finally { setBusy(false); }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{tt.title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tt.subtitle}</p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {tt.refresh}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ms-auto text-xs underline">{tt.dismiss}</button>
        </div>
      )}

      {loading && !sub && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      )}

      {!loading && (
        <>
          {/* Current state card */}
          {isLegacy ? (
            <LegacyCard tt={tt} />
          ) : sub ? (
            <CurrentSubCard
              sub={sub}
              onChangePlanHref="/school/billing/plans"
              onCancel={() => setCancelOpen(true)}
              busy={busy}
              tt={tt}
            />
          ) : (
            <NoSubscriptionCard onStartTrial={handleStartTrial} busy={busy} tt={tt} />
          )}

          {/* Invoices */}
          <section className="bg-white rounded-2xl border border-gray-100">
            <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <ReceiptText size={16} className="text-slate-500" />
                {tt.recentInvoices}
              </h2>
            </div>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">{tt.noInvoices}</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {invoices.map((inv) => <InvoiceRow key={inv._id} inv={inv} tt={tt} lang={lang} />)}
              </ul>
            )}
          </section>

          {/* Cancel confirmation */}
          {cancelOpen && sub && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setCancelOpen(false)}>
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{tt.cancelModalTitle}</h3>
                <p className="text-sm text-gray-600 mb-5">
                  {tt.cancelModalBodyPrefix}{" "}
                  <strong>{sub.currentPeriodEnd ? formatDate(sub.currentPeriodEnd, lang) : tt.endOfPeriod}</strong>.{" "}
                  {tt.cancelModalBodySuffix}
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => setCancelOpen(false)} className="px-3 py-1.5 text-xs text-gray-600 rounded-lg hover:bg-gray-100">
                    {tt.keepSubscription}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60"
                  >
                    {busy ? <Loader2 size={12} className="animate-spin" /> : null}
                    {tt.cancelAtPeriodEnd}
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-gray-400 text-center">
            {tt.signedInAs} <span className="font-mono" dir="ltr">{user?.email}</span> · {tt.schoolAccount}
          </p>
        </>
      )}
    </div>
  );
}

// ── Current sub card ─────────────────────────────────────────────────────

function CurrentSubCard({ sub, onChangePlanHref, onCancel, busy, tt }: {
  sub: MySubscription;
  onChangePlanHref: string;
  onCancel: () => void;
  busy: boolean;
  tt: TT;
}) {
  const meta = STATUS_ICON[sub.status];
  const trialDays = sub.status === "trialing" ? daysUntil(sub.trialEndsAt) : null;
  const periodDays = sub.status === "active" ? daysUntil(sub.currentPeriodEnd) : null;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border px-2 py-1 ${meta.tone}`}>
              <meta.Icon size={11} />
              {tt.statusLabels[sub.status] ?? sub.status}
              {sub.cancelAtPeriodEnd && tt.cancelsAtPeriodEnd}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-3 capitalize">
              {sub.planCode.replace(/_/g, " ")}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              <SARSymbol />{halalaToSAR(sub.pricePerPeriodHalala)} / {sub.durationMonths} {sub.durationMonths === 1 ? tt.monthSingular : tt.monthsPlural} · {tt.exclVat}
            </p>
          </div>
          <div className="text-end">
            {trialDays != null && trialDays >= 0 && (
              <>
                <p className="text-xs text-gray-400">{tt.trialEndsIn}</p>
                <p className="text-2xl font-bold text-amber-600 tabular-nums">{trialDays}d</p>
              </>
            )}
            {periodDays != null && (
              <>
                <p className="text-xs text-gray-400">{tt.renewsIn}</p>
                <p className="text-2xl font-bold text-gray-800 tabular-nums">{periodDays}d</p>
              </>
            )}
          </div>
        </div>

        {sub.status === "trialing" && (
          <div className="rounded-xl bg-amber-50 border border-amber-100 px-4 py-3 mb-4 text-sm text-amber-800">
            {tt.trialBannerBody}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {(sub.status === "trialing" || sub.status === "active" || sub.status === "past_due") && (
            <Link
              href={onChangePlanHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
              style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
            >
              {sub.status === "trialing" ? tt.choosePlan : tt.changePlan}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          )}
          {(sub.status === "trialing" || sub.status === "active") && !sub.cancelAtPeriodEnd && (
            <button
              type="button"
              onClick={onCancel}
              disabled={busy}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
            >
              {tt.cancelSubscription}
            </button>
          )}
          {(sub.status === "cancelled" || sub.status === "expired") && (
            <Link
              href={onChangePlanHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
              style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
            >
              {tt.resubscribe}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

// ── No subscription ──────────────────────────────────────────────────────

function NoSubscriptionCard({ onStartTrial, busy, tt }: { onStartTrial: () => void; busy: boolean; tt: TT }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center">
          <Sparkles size={20} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{tt.noSubTitle}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {tt.noSubBody}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onStartTrial}
          disabled={busy}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          {tt.startFreeTrial}
        </button>
        <Link href="/school/billing/plans" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
          {tt.browsePlans} <ArrowRight size={13} className="rtl:rotate-180" />
        </Link>
      </div>
    </section>
  );
}

// ── Legacy (grandfathered) ───────────────────────────────────────────────

function LegacyCard({ tt }: { tt: TT }) {
  return (
    <section className="bg-white rounded-2xl border border-emerald-100 p-6">
      <div className="flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 size={20} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{tt.legacyTitle}</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-xl">
            {tt.legacyBody}
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Invoice row ──────────────────────────────────────────────────────────

const INVOICE_STATUS_TONE: Record<string, string> = {
  paid:      "bg-emerald-50 text-emerald-700",
  pending:   "bg-amber-50 text-amber-700",
  failed:    "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-500",
  draft:     "bg-slate-100 text-slate-500",
};

function InvoiceRow({ inv, tt, lang }: { inv: MyInvoice; tt: TT; lang: "en" | "ar" }) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="min-w-0">
        <p className="text-sm font-mono text-gray-700" dir="ltr">{inv.number}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDate(inv.issuedAt, lang)} · {inv.paymentMethod?.replace(/_/g, " ") ?? "—"}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-sm font-semibold text-gray-900 tabular-nums">
          <SARSymbol />{halalaToSAR(inv.totalHalala)}
        </p>
        <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-1 ${INVOICE_STATUS_TONE[inv.status] ?? "bg-slate-100 text-slate-500"}`}>
          {tt.invoiceStatusLabels[inv.status] ?? inv.status}
        </span>
        <button
          type="button"
          onClick={() => downloadReceipt(inv._id, `${inv.number}.pdf`)}
          className="text-gray-400 hover:text-gray-700 transition-colors"
          aria-label={tt.downloadReceiptAria}
        >
          <Download size={14} />
        </button>
      </div>
    </li>
  );
}
