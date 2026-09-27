"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Send, Loader2, AlertCircle, X, CheckCircle2,
  XCircle, Clock, DollarSign, Calendar, Briefcase,
  ArrowRightLeft, PartyPopper, MessageSquare,
  ChevronDown, ChevronUp,
} from "lucide-react";
import {
  listSchoolOffers,
  revokeOffer,
  negotiateOffer,
  confirmHire,
} from "@/lib/api/school";
import type { SchoolOffer } from "@/lib/api/school";
import { SARSymbol } from "@/components/ui/sar-symbol";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatNumber, formatDate as formatDateI18n } from "@/lib/i18n/format";
import type { SchoolOffersTranslations, SchoolDashboardTranslations, SchoolCommonTranslations } from "@/lib/i18n/types";

type Lang = "en" | "ar";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function teacherName(teacherId: SchoolOffer["teacherId"], fallback: string): string {
  if (typeof teacherId === "object" && teacherId.name) return teacherId.name;
  return fallback;
}

function teacherEmail(teacherId: SchoolOffer["teacherId"]): string | null {
  if (typeof teacherId === "object" && teacherId.email) return teacherId.email;
  return null;
}

function jobTitleStr(jobId: SchoolOffer["jobId"], fallback: string): string {
  if (typeof jobId === "object") return jobId.title;
  return fallback;
}

function deadlineDaysLeft(isoStr: string): number {
  return Math.ceil((new Date(isoStr).getTime() - Date.now()) / 86_400_000);
}

function timeAgo(isoStr: string, td: SchoolDashboardTranslations): string {
  const secs = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  if (secs < 60)    return td.justNow;
  if (secs < 3600)  return td.minAgo.replace("{n}", String(Math.floor(secs / 60)));
  if (secs < 86400) return td.hoursAgo.replace("{n}", String(Math.floor(secs / 3600)));
  return td.daysAgo.replace("{n}", String(Math.floor(secs / 86400)));
}

/** Splits a "{prefix}{amount}{suffix}" template around the {amount} token so
 * the numeral can be rendered with the <SARSymbol/> component + formatNumber
 * instead of being baked into the translated string. */
function splitAroundAmount(template: string): [string, string] {
  const [prefix, suffix = ""] = template.split("{amount}");
  return [prefix, suffix];
}

// ─── Stats Row ────────────────────────────────────────────────────────────────

function StatsRow({ offers, tt }: { offers: SchoolOffer[]; tt: SchoolOffersTranslations }) {
  const stats = [
    { label: tt.statTotalSent, count: offers.length,                                         color: "text-gray-900" },
    { label: tt.statActive,    count: offers.filter((o) => o.status === "sent" || o.status === "viewed" || o.status === "negotiating").length, color: "text-blue-700" },
    { label: tt.statAccepted, count: offers.filter((o) => o.status === "accepted").length,  color: "text-green-700" },
    { label: tt.statHired,    count: offers.filter((o) => o.status === "accepted").length,  color: "text-emerald-700" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map(({ label, count, color }) => (
        <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <div className={`text-2xl font-bold ${color} mb-0.5`}>{count}</div>
          <div className="text-xs text-gray-400">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status, td }: { status: SchoolOffer["status"]; td: SchoolDashboardTranslations }) {
  const clsMap: Record<string, string> = {
    sent:        "bg-blue-100 text-blue-700 border-blue-200",
    viewed:      "bg-indigo-100 text-indigo-700 border-indigo-200",
    accepted:    "bg-green-100 text-green-700 border-green-200",
    declined:    "bg-red-100 text-red-600 border-red-200",
    negotiating: "bg-amber-100 text-amber-700 border-amber-200",
    expired:     "bg-gray-100 text-gray-500 border-gray-200",
  };
  const label = td.offerStatusLabels[status] ?? status;
  const cls = clsMap[status] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${cls}`}>{label}</span>
  );
}

// ─── Counter Offer Modal ──────────────────────────────────────────────────────

interface CounterModalProps {
  offer: SchoolOffer;
  fallback: string;
  onClose: () => void;
  onCountered: (updated: SchoolOffer) => void;
  tt: SchoolOffersTranslations;
  tc: SchoolCommonTranslations;
  lang: Lang;
}

function CounterModal({ offer, fallback, onClose, onCountered, tt, tc, lang }: CounterModalProps) {
  const [counterSalary, setCounterSalary] = useState(String(offer.salary));
  const [message, setMessage]             = useState("");
  const [saving, setSaving]               = useState(false);
  const [error, setError]                 = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!counterSalary || isNaN(Number(counterSalary))) {
      setError(tt.counterSalaryInvalidError);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const updated = await negotiateOffer(offer._id, {
        action:        "counter",
        message:       message.trim(),
        counterSalary: Number(counterSalary),
      });
      onCountered(updated);
      onClose();
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.counterFailedFallback);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "var(--brand-gradient)" }}
            >
              <ArrowRightLeft size={17} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{tt.counterModalTitle}</h3>
              <p className="text-xs text-gray-500">{teacherName(offer.teacherId, fallback)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded-xl mb-4">
            <AlertCircle size={14} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600">
            {tt.currentOfferLabel}{" "}
            <span className="font-semibold text-gray-900">
              <SARSymbol />{formatNumber(offer.salary, lang)}{tt.perMonthLabel}
            </span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              {tt.counterSalaryLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={counterSalary}
              onChange={(e) => setCounterSalary(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">{tt.messageLabel}</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={tt.messagePlaceholder}
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition resize-none"
              style={{ ["--tw-ring-color" as string]: "var(--brand-primary)" }}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {tc.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || !counterSalary}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white rounded-xl transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : (
              <><ArrowRightLeft size={14} /> {tt.sendCounterConfirmButton}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hire Celebration State ───────────────────────────────────────────────────

function HireCelebration({ name, tt, onDismiss }: { name: string; tt: SchoolOffersTranslations; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onDismiss} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200 text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
          style={{ background: "var(--brand-gradient)" }}
        >
          <PartyPopper size={36} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{tt.hireConfirmedTitle}</h3>
        <p className="text-sm text-gray-500 mb-6">
          {tt.hireConfirmedBodyTemplate.split("{name}").map((part, i) => (
            <span key={i}>
              {i === 1 ? <span className="font-semibold text-gray-800">{name}</span> : null}
              {part}
            </span>
          ))}
        </p>
        <button
          onClick={onDismiss}
          className="w-full py-2.5 text-sm font-semibold text-white rounded-xl hover:shadow-md transition-all"
          style={{ background: "var(--brand-gradient)" }}
        >
          {tt.doneButton}
        </button>
      </div>
    </div>
  );
}

// ─── Offer Card ───────────────────────────────────────────────────────────────

interface OfferCardProps {
  offer: SchoolOffer;
  actionLoading: string | null;
  onRevoke: (id: string) => Promise<void>;
  onAcceptCounter: (offer: SchoolOffer) => Promise<void>;
  onSendCounter: (offer: SchoolOffer) => void;
  onConfirmHire: (offer: SchoolOffer) => Promise<void>;
  tt: SchoolOffersTranslations;
  tc: SchoolCommonTranslations;
  td: SchoolDashboardTranslations;
  lang: Lang;
}

function OfferCard({
  offer: o,
  actionLoading,
  onRevoke,
  onAcceptCounter,
  onSendCounter,
  onConfirmHire,
  tt,
  tc,
  td,
  lang,
}: OfferCardProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const isLoading  = actionLoading === o._id;
  const tName      = teacherName(o.teacherId, tc.candidateFallback);
  const tEmail     = teacherEmail(o.teacherId);
  const jTitle     = jobTitleStr(o.jobId, tc.positionFallback);
  const daysLeft   = deadlineDaysLeft(o.deadline);
  const isExpired  = daysLeft < 0;
  const isUrgent   = !isExpired && daysLeft <= 3;
  const hasHistory = (o.negotiationHistory?.length ?? 0) > 0;
  const historyCount = o.negotiationHistory?.length ?? 0;
  const [counterPrefix, counterSuffix] = splitAroundAmount(tt.counterPrefixTemplate);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-gray-200 transition-all relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 rounded-2xl flex items-center justify-center z-10">
          <Loader2 size={22} className="animate-spin text-gray-400" />
        </div>
      )}

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-sm font-bold text-gray-900">{o.position}</h3>
            <StatusBadge status={o.status} td={td} />
          </div>
          <p className="text-xs text-gray-500">{tName}{tEmail ? ` · ${tEmail}` : ""}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Briefcase size={10} className="shrink-0" /> {jTitle}
          </p>
        </div>
      </div>

      {/* Meta chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          <DollarSign size={11} />
          <SARSymbol />{formatNumber(o.salary, lang)}{tt.perMonthLabel}
        </span>
        {o.contractDuration && (
          <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            <Clock size={11} className="text-gray-400" />
            {o.contractDuration}
          </span>
        )}
        {o.startDate && (
          <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
            <Calendar size={11} className="text-gray-400" />
            {tt.startsPrefixTemplate.replace("{date}", formatDateI18n(o.startDate, lang, { month: "short", day: "numeric", year: "numeric" }))}
          </span>
        )}
        {/* Deadline chip */}
        <span
          className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
            isExpired
              ? "bg-gray-100 text-gray-500 border-gray-200"
              : isUrgent
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-gray-50 text-gray-500 border-gray-100"
          }`}
        >
          <Clock size={11} />
          {isExpired
            ? tt.deadlineExpired
            : daysLeft === 0
            ? tt.deadlineToday
            : tt.deadlineDaysLeftTemplate.replace("{n}", String(daysLeft))}
        </span>
      </div>

      {/* Negotiation history */}
      {hasHistory && (
        <div className="mb-3">
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            <MessageSquare size={12} />
            {(historyCount === 1 ? tt.negotiationMessagesSuffixSingular : tt.negotiationMessagesSuffixPlural).replace("{n}", String(historyCount))}
            {historyOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {historyOpen && (
            <div className="mt-2 space-y-2">
              {o.negotiationHistory!.map((entry, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-600">
                  <div className="flex items-center justify-between mb-1">
                    {entry.counterSalary && (
                      <span className="font-semibold text-gray-800">
                        {counterPrefix}<SARSymbol />{formatNumber(entry.counterSalary, lang)}{counterSuffix}
                      </span>
                    )}
                    <span className="text-gray-400">{timeAgo(entry.createdAt, td)}</span>
                  </div>
                  {entry.message && <p className="text-gray-500 italic">{entry.message}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Sent / Viewed → Revoke */}
        {(o.status === "sent" || o.status === "viewed") && (
          <button
            onClick={() => onRevoke(o._id)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            <XCircle size={12} /> {tt.revokeOfferButton}
          </button>
        )}

        {/* Negotiating → Accept Counter / Send Counter / Revoke */}
        {o.status === "negotiating" && (
          <>
            <button
              onClick={() => onAcceptCounter(o)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg hover:shadow-sm transition-all disabled:opacity-60"
              style={{ background: "var(--brand-gradient)" }}
            >
              <CheckCircle2 size={12} /> {tt.acceptCounterButton}
            </button>
            <button
              onClick={() => onSendCounter(o)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-60"
            >
              <ArrowRightLeft size={12} /> {tt.sendCounterButton}
            </button>
            <button
              onClick={() => onRevoke(o._id)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
            >
              <XCircle size={12} /> {tt.revokeButton}
            </button>
          </>
        )}

        {/* Accepted → Confirm Hire */}
        {o.status === "accepted" && (
          <button
            onClick={() => onConfirmHire(o)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white rounded-lg hover:shadow-md transition-all disabled:opacity-60"
            style={{ background: "var(--brand-gradient)" }}
          >
            <PartyPopper size={12} /> {tt.confirmHireButton}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type TabFilter = "all" | "sent" | "viewed" | "accepted" | "negotiating" | "declined" | "expired";

const TAB_VALUES: TabFilter[] = ["all", "sent", "viewed", "accepted", "negotiating", "declined", "expired"];

export default function OffersPage() {
  const { t, lang } = useTranslation();
  const tt = t.school.offers;
  const tc = t.school.common;
  const td = t.school.dashboard;

  const [offers, setOffers]             = useState<SchoolOffer[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [tab, setTab]                   = useState<TabFilter>("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [counterTarget, setCounterTarget] = useState<SchoolOffer | null>(null);
  const [hiredName, setHiredName]         = useState<string | null>(null);

  const loadOffers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listSchoolOffers({ limit: 50 });
      setOffers(res.offers ?? []);
    } catch (e: unknown) {
      setError((e as Error)?.message ?? tt.loadFailedFallback);
    } finally {
      setLoading(false);
    }
  }, [tt.loadFailedFallback]);

  useEffect(() => { loadOffers(); }, [loadOffers]);

  const filtered = offers.filter((o) =>
    tab === "all" ? true : o.status === tab
  );

  const countTab = (t: TabFilter) =>
    t === "all" ? offers.length : offers.filter((o) => o.status === t).length;

  const handleRevoke = async (id: string) => {
    if (!confirm(tt.revokeConfirm)) return;
    setActionLoading(id);
    try {
      const updated = await revokeOffer(id);
      setOffers((prev) => prev.map((o) => (o._id === id ? updated : o)));
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleAcceptCounter = async (offer: SchoolOffer) => {
    setActionLoading(offer._id);
    try {
      const updated = await negotiateOffer(offer._id, { action: "accept", message: "" });
      setOffers((prev) => prev.map((o) => (o._id === offer._id ? updated : o)));
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  const handleCountered = (updated: SchoolOffer) => {
    setOffers((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
  };

  const handleConfirmHire = async (offer: SchoolOffer) => {
    setActionLoading(offer._id);
    try {
      const updated = await confirmHire(offer._id);
      setOffers((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
      setHiredName(teacherName(offer.teacherId, tc.candidateFallback));
    } catch {
      // silently fail
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Send size={20} style={{ color: "var(--brand-primary)" }} />
          {tt.pageTitle}
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">{tt.pageSubtitle}</p>
      </div>

      {/* Stats */}
      {!loading && !error && <StatsRow offers={offers} tt={tt} />}

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit flex-wrap">
        {TAB_VALUES.map((value) => {
          const active = tab === value;
          const count  = countTab(value);
          return (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all ${
                active ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
              style={active ? { color: "var(--brand-primary)" } : {}}
            >
              {tt.tabLabels[value]}
              {count > 0 && (
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-5 text-center ${
                    active ? "text-white" : "bg-gray-200 text-gray-600"
                  }`}
                  style={active ? { background: "var(--brand-gradient)" } : {}}
                >
                  {formatNumber(count, lang)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={28} className="animate-spin text-gray-300" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <AlertCircle size={30} className="text-red-400" />
          <p className="text-sm text-gray-500">{error}</p>
          <button
            onClick={loadOffers}
            className="px-4 py-2 text-sm font-medium text-white rounded-xl"
            style={{ background: "var(--brand-gradient)" }}
          >
            {tc.retry}
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Send size={28} className="text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">{tt.emptyTitle}</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            {tab === "all"
              ? tt.emptyBodyAll
              : tt.emptyBodyFilteredTemplate.replace("{status}", tt.tabLabels[tab])}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((o) => (
            <OfferCard
              key={o._id}
              offer={o}
              actionLoading={actionLoading}
              onRevoke={handleRevoke}
              onAcceptCounter={handleAcceptCounter}
              onSendCounter={setCounterTarget}
              onConfirmHire={handleConfirmHire}
              tt={tt}
              tc={tc}
              td={td}
              lang={lang}
            />
          ))}
        </div>
      )}

      {/* Counter modal */}
      {counterTarget && (
        <CounterModal
          offer={counterTarget}
          fallback={tc.candidateFallback}
          onClose={() => setCounterTarget(null)}
          onCountered={handleCountered}
          tt={tt}
          tc={tc}
          lang={lang}
        />
      )}

      {/* Hire celebration */}
      {hiredName && (
        <HireCelebration
          name={hiredName}
          tt={tt}
          onDismiss={() => setHiredName(null)}
        />
      )}
    </div>
  );
}
