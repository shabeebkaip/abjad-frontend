"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Landmark, Copy, CheckCircle2, AlertCircle, Loader2, ArrowRight, Download } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { listMyInvoices, type MyInvoice } from "@/lib/api/billing";
import { getAccessToken, doRefresh } from "@/lib/api/client";

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

// Bank-transfer landing — shown after the user picks "Bank Transfer" on the
// checkout. The invoice is created in `pending` status; admin marks it paid
// once the transfer clears their bank, and the webhook activates the
// subscription server-side.

interface Props {
  invoiceId: string;
  audience: "school" | "teacher_premium";
  billingHref: string;
}

function halalaToSAR(h: number): string {
  return (h / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Production: pull these from a config endpoint. For v1 they're inline so
// we don't need a new backend route for the bank credentials.
// Real IBANs MUST come from operations before launch — these are placeholders.
const BANK_DETAILS_PLACEHOLDER = {
  bankNameEn: "Al Rajhi Bank",
  bankNameAr: "مصرف الراجحي",
  accountNameEn: "Abjad Platform LLC",
  accountNameAr: "شركة منصة أبجد",
  iban: "SA00 0000 0000 0000 0000 0000",
  swift: "RJHISARI",
};

export function BillingPending({ invoiceId, audience, billingHref }: Props) {
  const { lang } = useLanguage();
  const locale = lang === "ar" ? "ar" : "en";

  const [invoice, setInvoice] = useState<MyInvoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [copied, setCopied]   = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const r = await listMyInvoices(1, 50);
        if (!alive) return;
        const found = r.invoices.find((i) => i._id === invoiceId);
        if (!found) throw new Error(locale === "ar" ? "لم يتم العثور على الفاتورة" : "Invoice not found");
        setInvoice(found);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load invoice");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [invoiceId, locale]);

  const copy = useCallback(async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch { /* noop */ }
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-red-100 p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-3" size={28} />
        <p className="text-sm text-red-600 mb-4">{error}</p>
        <Link href={billingHref} className="text-sm text-gray-700 underline">
          {locale === "ar" ? "إلى صفحة الفوترة" : "Go to billing"}
        </Link>
      </div>
    );
  }

  const dueLabel = invoice.dueAt ? new Date(invoice.dueAt).toLocaleDateString() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Status banner */}
      <div className="bg-white rounded-2xl border border-amber-100 p-5 flex items-start gap-4">
        <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Landmark className="text-amber-600" size={20} />
        </div>
        <div>
          <h1 className="text-base font-semibold text-gray-900">
            {locale === "ar" ? "بانتظار تحويلك البنكي" : "Awaiting your bank transfer"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {locale === "ar"
              ? `حوّل المبلغ إلى الحساب أدناه، واذكر رقم الفاتورة كمرجع. سنفعّل اشتراكك تلقائياً خلال ١-٢ يوم عمل من تأكيد التحويل.`
              : "Transfer the amount to the account below and quote the invoice number as the reference. We'll activate your subscription within 1–2 business days of confirming the transfer."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Bank details */}
        <section className="bg-white rounded-2xl border border-gray-100">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">
              {locale === "ar" ? "تفاصيل التحويل" : "Transfer details"}
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <CopyRow
              label={locale === "ar" ? "البنك" : "Bank"}
              value={locale === "ar" ? BANK_DETAILS_PLACEHOLDER.bankNameAr : BANK_DETAILS_PLACEHOLDER.bankNameEn}
              onCopy={copy}
              copied={copied}
            />
            <CopyRow
              label={locale === "ar" ? "اسم الحساب" : "Account name"}
              value={locale === "ar" ? BANK_DETAILS_PLACEHOLDER.accountNameAr : BANK_DETAILS_PLACEHOLDER.accountNameEn}
              onCopy={copy}
              copied={copied}
            />
            <CopyRow
              label="IBAN"
              value={BANK_DETAILS_PLACEHOLDER.iban}
              onCopy={copy}
              copied={copied}
              mono
            />
            <CopyRow
              label="SWIFT / BIC"
              value={BANK_DETAILS_PLACEHOLDER.swift}
              onCopy={copy}
              copied={copied}
              mono
            />
            <CopyRow
              label={locale === "ar" ? "رقم المرجع (مهم!)" : "Reference (important!)"}
              value={invoice.number}
              onCopy={copy}
              copied={copied}
              highlight
              mono
            />
            <CopyRow
              label={locale === "ar" ? "المبلغ" : "Amount"}
              value={`${halalaToSAR(invoice.totalHalala)} SAR`}
              onCopy={copy}
              copied={copied}
              highlight
              mono
            />
            {dueLabel && (
              <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
                ⏰ {locale === "ar" ? "الموعد النهائي للتحويل" : "Transfer deadline"}: <strong>{dueLabel}</strong>
              </p>
            )}
          </div>
        </section>

        {/* Summary */}
        <aside className="bg-white rounded-2xl border border-gray-100 h-fit">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">{locale === "ar" ? "الفاتورة" : "Invoice"}</h2>
          </div>
          <div className="px-5 py-4 space-y-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{locale === "ar" ? "رقم الفاتورة" : "Invoice number"}</p>
              <p className="font-mono font-semibold mt-0.5">{invoice.number}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">{locale === "ar" ? "تاريخ الإصدار" : "Issued"}</p>
              <p className="mt-0.5">{new Date(invoice.issuedAt).toLocaleDateString()}</p>
              <p className="text-[11px] text-gray-400">{invoice.issuedAtHijri}</p>
            </div>
            <div className="pt-2 border-t border-gray-100 flex items-baseline justify-between">
              <span className="text-xs text-gray-500">{locale === "ar" ? "الإجمالي" : "Total"}</span>
              <span className="text-xl font-bold text-gray-900 tabular-nums">{halalaToSAR(invoice.totalHalala)} SAR</span>
            </div>
            <button
              type="button"
              onClick={() => downloadReceipt(invoice._id, `${invoice.invoiceNumber}.pdf`)}
              className="flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Download size={13} />
              {locale === "ar" ? "تحميل PDF" : "Download PDF"}
            </button>
          </div>
        </aside>
      </div>

      <div className="text-center pt-4">
        <Link
          href={billingHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-gray-900"
        >
          {locale === "ar" ? "إلى صفحة الفوترة" : "Go to billing"}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function CopyRow({ label, value, onCopy, copied, mono, highlight }: {
  label: string;
  value: string;
  onCopy: (label: string, value: string) => void;
  copied: string | null;
  mono?: boolean;
  highlight?: boolean;
}) {
  const isCopied = copied === label;
  return (
    <div className={`flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 ${highlight ? "bg-amber-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-gray-500">{label}</p>
        <p className={`mt-0.5 truncate ${mono ? "font-mono" : ""} ${highlight ? "text-amber-900 font-semibold" : "text-gray-900"}`}>
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(label, value)}
        className="shrink-0 inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md hover:bg-white transition-colors"
      >
        {isCopied ? <><CheckCircle2 size={12} className="text-emerald-500" /> Copied</> : <><Copy size={12} /> Copy</>}
      </button>
    </div>
  );
}
