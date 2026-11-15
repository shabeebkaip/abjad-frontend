"use client";

import { useState } from "react";
import { Award, Loader2 } from "lucide-react";
import { respondToOffer, type Offer } from "@/lib/api/teacher";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { formatDate, formatNumber } from "@/lib/i18n/format";
import { SARSymbol } from "@/components/ui/sar-symbol";

type Mode = "idle" | "decline" | "negotiate";

/**
 * SRD 2.7: the teacher reviews an offer and accepts, declines or negotiates.
 * The backend endpoint (PATCH /api/offers/:id/respond) existed but no screen called it,
 * so a hire could never be completed from the teacher side.
 */
export function OfferResponse({ offer, onResponded }: { offer: Offer; onResponded: (o: Offer) => void }) {
  const { t, lang } = useTranslation();
  const tt = t.teacher.applications;
  const [mode, setMode] = useState<Mode>("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [counter, setCounter] = useState("");
  const [message, setMessage] = useState("");

  const open = offer.status === "sent" || offer.status === "viewed";
  const expired = new Date(offer.deadline) < new Date();

  async function send(action: "accepted" | "declined" | "negotiate") {
    setBusy(true);
    setError(null);
    try {
      const updated = await respondToOffer(offer._id, action, {
        reason: action === "declined" ? reason || undefined : undefined,
        counterSalary: action === "negotiate" && counter ? Number(counter) : undefined,
        message: action === "negotiate" ? message : undefined,
      });
      onResponded({ ...offer, ...updated, jobId: offer.jobId, schoolId: offer.schoolId });
      setMode("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : tt.offerError);
    } finally {
      setBusy(false);
    }
  }

  const statusNote =
    offer.status === "accepted" ? tt.offerAcceptedNote
    : offer.status === "declined" ? tt.offerDeclinedNote
    : offer.status === "negotiating" ? tt.offerNegotiatingNote
    : expired ? tt.offerExpiredNote
    : null;

  return (
    <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50/60 p-4 text-sm">
      <div className="flex items-center gap-2 font-semibold text-teal-800 mb-3">
        <Award className="w-4 h-4 shrink-0" /> {tt.offerTitle}
      </div>
      <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
        <div><dt className="text-xs text-slate-500">{tt.offerPosition}</dt><dd className="font-medium text-slate-800">{offer.position}</dd></div>
        <div><dt className="text-xs text-slate-500">{tt.offerSalary}</dt><dd className="font-medium text-slate-800"><SARSymbol />{formatNumber(offer.salary, lang)}</dd></div>
        {offer.startDate && <div><dt className="text-xs text-slate-500">{tt.offerStart}</dt><dd className="font-medium text-slate-800">{formatDate(offer.startDate, lang)}</dd></div>}
        <div><dt className="text-xs text-slate-500">{tt.offerDeadline}</dt><dd className="font-medium text-slate-800">{formatDate(offer.deadline, lang)}</dd></div>
      </dl>
      {offer.benefits && <p className="text-slate-600 mb-3"><span className="text-xs text-slate-500">{tt.offerBenefits}: </span>{offer.benefits}</p>}

      {statusNote && <p className="font-medium text-slate-700">{statusNote}</p>}

      {open && !expired && mode === "idle" && (
        <div className="flex flex-wrap gap-2">
          <button disabled={busy} onClick={() => send("accepted")} className="px-4 py-2 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 disabled:opacity-50 inline-flex items-center gap-1.5">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}{tt.offerAccept}
          </button>
          <button disabled={busy} onClick={() => setMode("negotiate")} className="px-4 py-2 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50">{tt.offerNegotiate}</button>
          <button disabled={busy} onClick={() => setMode("decline")} className="px-4 py-2 rounded-lg font-medium text-red-700 hover:bg-red-50">{tt.offerDecline}</button>
        </div>
      )}

      {mode === "decline" && (
        <div className="grid gap-2">
          <label className="text-xs text-slate-600" htmlFor={`decline-${offer._id}`}>{tt.offerDeclineReason}</label>
          <input id={`decline-${offer._id}`} value={reason} onChange={(e) => setReason(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-white" />
          <div className="flex gap-2">
            <button disabled={busy} onClick={() => send("declined")} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50">{tt.offerDeclineConfirm}</button>
            <button onClick={() => setMode("idle")} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100">{tt.offerBack}</button>
          </div>
        </div>
      )}

      {mode === "negotiate" && (
        <div className="grid gap-2">
          <label className="text-xs text-slate-600" htmlFor={`counter-${offer._id}`}>{tt.offerCounterSalary}</label>
          <input id={`counter-${offer._id}`} type="number" min={0} value={counter} onChange={(e) => setCounter(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-white" />
          <label className="text-xs text-slate-600" htmlFor={`msg-${offer._id}`}>{tt.offerMessage}</label>
          <input id={`msg-${offer._id}`} value={message} onChange={(e) => setMessage(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-white" />
          <div className="flex gap-2">
            <button disabled={busy || !message.trim()} onClick={() => send("negotiate")} className="px-4 py-2 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 disabled:opacity-50">{tt.offerSendCounter}</button>
            <button onClick={() => setMode("idle")} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100">{tt.offerBack}</button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-red-600" role="alert">{error}</p>}
    </div>
  );
}
