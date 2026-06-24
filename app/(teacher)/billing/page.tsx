"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, ReceiptText, Clock, CheckCircle2,
  XCircle, AlertCircle, Loader2, Download, RefreshCw, GraduationCap,
} from "lucide-react";
import { getMySubscription, listMyInvoices, cancelMySubscription, type MySubscription, type MyInvoice } from "@/lib/api/billing";
import { useAuth } from "@/lib/auth/useAuth";
import { getAccessToken, doRefresh } from "@/lib/api/client";
import { SARSymbol } from "@/components/ui/sar-symbol";

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

// /billing — teacher premium subscription home.
// Simpler than school because there's no trial mechanic — teachers either
// pay for Premium or use the free tier. Premium is a ranking boost, not a
// gate on platform use.

const STATUS_META: Record<MySubscription["status"], { label: string; tone: string; Icon: React.ElementType }> = {
  trialing:  { label: "On Trial",   tone: "bg-amber-50 text-amber-700 border-amber-200",       Icon: Clock },
  active:    { label: "Premium",    tone: "bg-emerald-50 text-emerald-700 border-emerald-200", Icon: CheckCircle2 },
  past_due:  { label: "Past Due",   tone: "bg-rose-50 text-rose-700 border-rose-200",          Icon: AlertCircle },
  cancelled: { label: "Cancelled",  tone: "bg-slate-100 text-slate-700 border-slate-200",      Icon: XCircle },
  expired:   { label: "Expired",    tone: "bg-slate-100 text-slate-500 border-slate-200",      Icon: XCircle },
};

function halalaToSAR(h: number): string {
  return (h / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function halalaToSARNoDecimals(h: number): string {
  return (h / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function daysUntil(iso?: string): number | null {
  if (!iso) return null;
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
}

export default function TeacherBillingPage() {
  const { user } = useAuth();
  const [sub, setSub]           = useState<MySubscription | null>(null);
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
      setInvoices(invRes.invoices);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load billing");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleCancel() {
    setBusy(true);
    try { await cancelMySubscription("Cancelled via teacher billing page"); await load(); setCancelOpen(false); }
    catch (e) { setError(e instanceof Error ? e.message : "Failed to cancel"); }
    finally { setBusy(false); }
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Premium &amp; Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your premium plan and view invoices.</p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {loading && !sub && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={24} />
        </div>
      )}

      {!loading && (
        <>
          {sub ? <ActivePremiumCard sub={sub} onCancel={() => setCancelOpen(true)} busy={busy} /> : <UpgradePromptCard />}

          <section className="bg-white rounded-2xl border border-gray-100">
            <div className="px-5 pt-5 pb-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <ReceiptText size={16} className="text-slate-500" />
                Recent invoices
              </h2>
            </div>
            {invoices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-10">No invoices yet.</p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {invoices.map((inv) => <InvoiceRow key={inv._id} inv={inv} />)}
              </ul>
            )}
          </section>

          {cancelOpen && sub && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setCancelOpen(false)}>
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-base font-semibold text-gray-900 mb-2">Cancel Premium?</h3>
                <p className="text-sm text-gray-600 mb-5">
                  Your Premium ranking and badge stay active until{" "}
                  <strong>{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : "the end of the period"}</strong>.
                  After that you&apos;ll still be able to use Abjad — just without the Premium boost.
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => setCancelOpen(false)} className="px-3 py-1.5 text-xs text-gray-600 rounded-lg hover:bg-gray-100">Keep Premium</button>
                  <button
                    onClick={handleCancel}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white rounded-lg bg-red-500 hover:bg-red-600 disabled:opacity-60"
                  >
                    {busy && <Loader2 size={12} className="animate-spin" />}
                    Cancel at period end
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-gray-400 text-center">
            Signed in as <span className="font-mono">{user?.email}</span> · Teacher account
          </p>
        </>
      )}
    </div>
  );
}

function ActivePremiumCard({ sub, onCancel, busy }: { sub: MySubscription; onCancel: () => void; busy: boolean }) {
  const meta = STATUS_META[sub.status];
  const periodDays = sub.status === "active" ? daysUntil(sub.currentPeriodEnd) : null;
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
        <div>
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider rounded-full border px-2 py-1 ${meta.tone}`}>
            <meta.Icon size={11} />
            {meta.label}
            {sub.cancelAtPeriodEnd && " · cancels at period end"}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 mt-3 capitalize">
            {sub.planCode.replace(/_/g, " ")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            <SARSymbol />{halalaToSARNoDecimals(sub.pricePerPeriodHalala)} / {sub.durationMonths} {sub.durationMonths === 1 ? "month" : "months"} · excl. 15% VAT
          </p>
        </div>
        {periodDays != null && (
          <div className="text-right rtl:text-left">
            <p className="text-xs text-gray-400">Renews in</p>
            <p className="text-2xl font-bold text-gray-800 tabular-nums">{periodDays}d</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/billing/plans"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          Change plan
          <ArrowRight size={14} />
        </Link>
        {(sub.status === "active") && !sub.cancelAtPeriodEnd && (
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="text-xs text-gray-500 hover:text-red-500 transition-colors px-2 py-1"
          >
            Cancel Premium
          </button>
        )}
      </div>
    </section>
  );
}

function UpgradePromptCard() {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-6">
      <div className="flex items-start gap-4 mb-5">
        <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center">
          <Sparkles size={20} className="text-amber-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Upgrade to Premium Teacher</h2>
          <p className="text-sm text-gray-600 mt-1 max-w-lg">
            Premium teachers appear at the top of school searches and carry a verified badge on their profile —
            so principals see you first.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/billing/plans"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-sm hover:shadow-md transition-all"
          style={{ background: "var(--brand-gradient, var(--brand-primary))" }}
        >
          <GraduationCap size={14} />
          See Premium plans
        </Link>
      </div>
    </section>
  );
}

const INVOICE_STATUS_TONE: Record<string, string> = {
  paid:      "bg-emerald-50 text-emerald-700",
  pending:   "bg-amber-50 text-amber-700",
  failed:    "bg-red-50 text-red-600",
  cancelled: "bg-slate-100 text-slate-500",
  draft:     "bg-slate-100 text-slate-500",
};

function InvoiceRow({ inv }: { inv: MyInvoice }) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="min-w-0">
        <p className="text-sm font-mono text-gray-700">{inv.number}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(inv.issuedAt).toLocaleDateString()} · {inv.paymentMethod?.replace(/_/g, " ") ?? "—"}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <p className="text-sm font-semibold text-gray-900 tabular-nums"><SARSymbol />{halalaToSAR(inv.totalHalala)}</p>
        <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-1 ${INVOICE_STATUS_TONE[inv.status] ?? "bg-slate-100 text-slate-500"}`}>
          {inv.status}
        </span>
        <button type="button" onClick={() => downloadReceipt(inv._id, `${inv.number}.pdf`)} className="text-gray-400 hover:text-gray-700">
          <Download size={14} />
        </button>
      </div>
    </li>
  );
}
