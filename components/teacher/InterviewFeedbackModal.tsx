"use client";

// SRD 2.6.4 — Teacher post-interview feedback. Required 1-5 star rating with
// an optional 500-char comment. Submitted via POST /api/interviews/:id/feedback.
// Separate from the school's hire/maybe/reject evaluation.

import { useEffect, useState } from "react";
import { X, Loader2, Star, MessageSquare } from "lucide-react";
import type { Interview } from "@/lib/api/teacher";

const COMMENT_MAX = 500;

export interface InterviewFeedbackModalProps {
  interview: Interview;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (rating: number, comment?: string) => void | Promise<void>;
}

export function InterviewFeedbackModal({
  interview, isOpen, isSubmitting, onClose, onConfirm,
}: InterviewFeedbackModalProps) {
  // Pre-fill from existing teacherFeedback so re-submission edits the previous one
  const [rating, setRating]   = useState<number>(interview.teacherFeedback?.rating ?? 0);
  const [hover, setHover]     = useState<number>(0);
  const [comment, setComment] = useState<string>(interview.teacherFeedback?.comment ?? "");

  useEffect(() => {
    if (isOpen) {
      setRating(interview.teacherFeedback?.rating ?? 0);
      setComment(interview.teacherFeedback?.comment ?? "");
      setHover(0);
    }
  }, [isOpen, interview._id, interview.teacherFeedback?.rating, interview.teacherFeedback?.comment]);

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

  const overLimit = comment.length > COMMENT_MAX;
  const canSubmit = rating >= 1 && rating <= 5 && !overLimit && !isSubmitting;

  const handleConfirm = async () => {
    if (!canSubmit) return;
    await onConfirm(rating, comment.trim() || undefined);
  };

  const ratingHints: Record<number, string> = {
    1: "Poor",
    2: "Below expectations",
    3: "OK",
    4: "Good",
    5: "Excellent",
  };
  const activeRating = hover || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-slate-900/50 backdrop-blur-sm"
      onMouseDown={(e) => { if (e.target === e.currentTarget && !isSubmitting) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="interview-feedback-title"
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl max-h-full overflow-y-auto">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <MessageSquare size={16} className="text-amber-500" />
            </div>
            <div className="min-w-0">
              <h2 id="interview-feedback-title" className="text-base font-semibold text-slate-900 leading-snug">
                {interview.teacherFeedback ? "Edit your feedback" : "Share your feedback"}
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

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              How was the interview experience? <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center gap-1.5"
              onMouseLeave={() => setHover(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = activeRating >= n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHover(n)}
                    disabled={isSubmitting}
                    className="p-1 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50"
                  >
                    <Star
                      size={32}
                      className={filled ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                    />
                  </button>
                );
              })}
              {activeRating > 0 && (
                <span className="ml-2 text-sm font-medium text-slate-600">
                  {ratingHints[activeRating]}
                </span>
              )}
            </div>
          </div>

          {/* Optional comment */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="feedback-comment" className="text-xs font-semibold text-slate-700">
                Comment <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <span className={`text-[11px] tabular-nums ${overLimit ? "text-red-500 font-semibold" : "text-slate-400"}`}>
                {comment.length} / {COMMENT_MAX}
              </span>
            </div>
            <textarea
              id="feedback-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, COMMENT_MAX))}
              disabled={isSubmitting}
              rows={5}
              maxLength={COMMENT_MAX}
              placeholder="What worked? Anything the school should know? (Visible to the school)"
              className="w-full px-3 py-2.5 text-sm leading-relaxed border border-slate-200 rounded-lg outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-y min-h-[120px] disabled:bg-slate-50"
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
            style={{ background: "var(--brand-gradient)" }}
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
            {interview.teacherFeedback ? "Update feedback" : "Submit feedback"}
          </button>
        </div>
      </div>
    </div>
  );
}
