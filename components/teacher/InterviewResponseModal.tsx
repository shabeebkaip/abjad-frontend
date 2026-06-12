"use client";

// SRD 2.6.2 — Reschedule and Decline both require a reason from the teacher.
// Reschedule additionally requires a proposed alternative datetime. This modal
// captures both before firing respondToInterview.

import { useEffect, useState } from "react";
import { X, Loader2, RefreshCw, XCircle, Calendar } from "lucide-react";
import type { Interview } from "@/lib/api/teacher";

const REASON_MAX = 500;

export type InterviewResponseMode = "decline" | "reschedule";

export interface InterviewResponseModalProps {
  interview: Interview;
  mode: InterviewResponseMode;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (reason: string, proposedTime?: string) => void | Promise<void>;
}

function isoLocalNow(): string {
  // Returns "yyyy-MM-ddTHH:mm" for the min attribute on datetime-local inputs.
  // datetime-local doesn't accept a timezone suffix, so we strip it.
  const d = new Date();
  const tzOffsetMs = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

export function InterviewResponseModal({
  interview, mode, isOpen, isSubmitting, onClose, onConfirm,
}: InterviewResponseModalProps) {
  const [reason, setReason] = useState("");
  const [proposedTime, setProposedTime] = useState("");

  // Reset when reopened for a different interview / mode
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setProposedTime("");
    }
  }, [isOpen, interview._id, mode]);

  // Esc to close + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !isSubmitting) onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const trimmed = reason.trim();
  const overLimit = reason.length > REASON_MAX;
  const reasonMissing = trimmed.length === 0;
  const timeMissing = mode === "reschedule" && proposedTime.length === 0;
  const canSubmit = !overLimit && !reasonMissing && !timeMissing && !isSubmitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    await onConfirm(trimmed, mode === "reschedule" ? proposedTime : undefined);
  };

  const title = mode === "decline" ? "Decline interview" : "Request reschedule";
  const Icon = mode === "decline" ? XCircle : RefreshCw;
  const accent = mode === "decline" ? "rgb(239 68 68)" : "rgb(217 119 6)";
  const accentBg = mode === "decline" ? "rgb(254 242 242)" : "rgb(254 243 199)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-slate-900/50 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="interview-response-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-full overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: accentBg }}
            >
              <Icon size={16} style={{ color: accent }} />
            </div>
            <div className="min-w-0">
              <h2 id="interview-response-title" className="text-base font-semibold text-slate-900 leading-snug">
                {title}
              </h2>
              <p className="text-xs text-slate-500 truncate">
                {interview.jobId?.title ?? "Interview"}
                {interview.schoolId?.name ? ` · ${interview.schoolId.name}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-40 transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Existing schedule context */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/40 flex items-center gap-2 text-xs text-slate-500">
          <Calendar size={12} className="text-slate-400" />
          Currently scheduled: <span className="font-semibold text-slate-700">
            {new Date(interview.scheduledAt).toLocaleString("en-SA", {
              dateStyle: "medium", timeStyle: "short",
            })}
          </span>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {mode === "reschedule" && (
            <div>
              <label htmlFor="proposed-time" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Proposed new time <span className="text-red-500">*</span>
              </label>
              <input
                id="proposed-time"
                type="datetime-local"
                value={proposedTime}
                min={isoLocalNow()}
                onChange={(e) => setProposedTime(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all disabled:bg-slate-50"
              />
            </div>
          )}

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="response-reason" className="text-xs font-semibold text-slate-700">
                Reason <span className="text-red-500">*</span>
              </label>
              <span className={`text-[11px] tabular-nums ${overLimit ? "text-red-500 font-semibold" : "text-slate-400"}`}>
                {reason.length} / {REASON_MAX}
              </span>
            </div>
            <textarea
              id="response-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, REASON_MAX))}
              disabled={isSubmitting}
              rows={5}
              maxLength={REASON_MAX}
              placeholder={
                mode === "decline"
                  ? "Let the school know why you're declining (max 500 characters)…"
                  : "Briefly explain why you'd like to reschedule (max 500 characters)…"
              }
              className="w-full px-3 py-2.5 text-sm leading-relaxed border border-slate-200 rounded-lg outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all resize-y min-h-[120px] disabled:bg-slate-50"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canSubmit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-lg text-white shadow-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
            style={{ backgroundColor: accent }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Icon size={14} />}
            {mode === "decline" ? "Decline interview" : "Send request"}
          </button>
        </div>
      </div>
    </div>
  );
}
